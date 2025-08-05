
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CircularProgress } from './circular-progress';
import { TMJ_EXERCISES, SESSION_SUMMARY, Exercise } from '@/lib/exercises';
import { audioManager } from '@/lib/audio';
import { Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type SessionState = 'ready' | 'intro' | 'exercising' | 'completed';
type ExerciseState = 'intro' | 'preparation' | 'executing' | 'holding' | 'resting' | 'completed';

export function ExerciseSession() {
  const [sessionState, setSessionState] = useState<SessionState>('ready');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseState, setExerciseState] = useState<ExerciseState>('intro');
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSide, setCurrentSide] = useState<'left' | 'right'>('left');
  const [countdown, setCountdown] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(0);

  const currentExercise = TMJ_EXERCISES[currentExerciseIndex];
  const sessionProgress = ((currentExerciseIndex + (exerciseState === 'completed' ? 1 : 0)) / TMJ_EXERCISES.length) * 100;

  // Initialize audio
  useEffect(() => {
    const initAudio = async () => {
      try {
        const initialized = await audioManager.initialize();
        setIsAudioInitialized(initialized);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        setIsAudioInitialized(false);
      }
    };
    initAudio();
  }, []);

  // Load sessions count from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('tmj-sessions');
    const data = stored ? JSON.parse(stored) : {};
    setSessionsToday(data[today] || 0);
  }, []);

  // Save session count
  const incrementSessionCount = useCallback(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('tmj-sessions');
    const data = stored ? JSON.parse(stored) : {};
    const newCount = (data[today] || 0) + 1;
    data[today] = newCount;
    localStorage.setItem('tmj-sessions', JSON.stringify(data));
    setSessionsToday(newCount);
  }, []);

  // Audio helper
  const speak = useCallback(async (text: string) => {
    if (!isAudioEnabled || !isAudioInitialized) return;
    try {
      await audioManager.speak(text);
    } catch (error) {
      console.error('Speech error:', error);
    }
  }, [isAudioEnabled, isAudioInitialized]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        if (countdown <= 3 && countdown > 0) {
          speak(countdown.toString());
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, speak]);

  // Exercise state machine
  const advanceExercise = useCallback(async () => {
    const exercise = currentExercise;
    
    switch (exerciseState) {
      case 'intro':
        await speak(exercise.audioInstructions.introduction);
        setExerciseState('preparation');
        break;
        
      case 'preparation':
        await speak(exercise.audioInstructions.preparation);
        setExerciseState('executing');
        setCurrentRep(1);
        setCurrentSide('left');
        break;
        
      case 'executing':
        if (exercise.timing.isBreathing) {
          await speak(`${exercise.audioInstructions.execution} ${currentRep}`);
          await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second breath
          
          if (currentRep < exercise.timing.repetitions) {
            setCurrentRep(currentRep + 1);
          } else {
            setExerciseState('completed');
          }
        } else if (exercise.timing.holdDuration) {
          await speak(`${exercise.audioInstructions.execution} ${currentRep}`);
          setCountdown(exercise.timing.holdDuration);
          setExerciseState('holding');
        } else {
          await speak(`${exercise.audioInstructions.execution} ${currentRep}`);
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second movement
          
          if (currentRep < exercise.timing.repetitions) {
            setCurrentRep(currentRep + 1);
            setExerciseState('resting');
          } else {
            setExerciseState('completed');
          }
        }
        break;
        
      case 'holding':
        if (countdown === 0) {
          if (exercise.timing.hasSides && currentSide === 'left' && currentRep === 1) {
            await speak("Now switching to the right side.");
            setCurrentSide('right');
            setCurrentRep(1);
            setExerciseState('executing');
          } else if (currentRep < exercise.timing.repetitions) {
            setCurrentRep(currentRep + 1);
            setExerciseState('resting');
          } else if (exercise.timing.hasSides && currentSide === 'left') {
            setCurrentSide('right');
            setCurrentRep(1);
            setExerciseState('executing');
          } else {
            setExerciseState('completed');
          }
        }
        break;
        
      case 'resting':
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second rest
        setExerciseState('executing');
        break;
        
      case 'completed':
        await speak(exercise.audioInstructions.completion);
        
        if (currentExerciseIndex < TMJ_EXERCISES.length - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setExerciseState('intro');
          setCurrentRep(1);
          setCurrentSide('left');
        } else {
          // Session completed
          setSessionState('completed');
          incrementSessionCount();
          await speak("Congratulations! You have completed your full TMJ exercise session. Remember to do this 6 times daily for at least 3 weeks.");
        }
        break;
    }
  }, [currentExercise, exerciseState, currentRep, currentSide, currentExerciseIndex, countdown, speak, incrementSessionCount]);

  // Auto-advance for certain states
  useEffect(() => {
    if (sessionState === 'exercising') {
      const timer = setTimeout(() => {
        advanceExercise();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sessionState, exerciseState, currentRep, currentSide, countdown, advanceExercise]);

  const startSession = async () => {
    setSessionState('intro');
    await speak("Welcome to your TMJ exercise session. Remember: avoid jaw clicking during all exercises. Let's begin.");
    setSessionState('exercising');
  };

  const resetSession = () => {
    audioManager.stop();
    setSessionState('ready');
    setCurrentExerciseIndex(0);
    setExerciseState('intro');
    setCurrentRep(1);
    setCurrentSide('left');
    setCountdown(0);
  };

  const toggleAudio = () => {
    if (isAudioEnabled) {
      audioManager.stop();
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  const getExerciseProgress = () => {
    if (!currentExercise) return 0;
    
    const totalReps = currentExercise.timing.hasSides 
      ? currentExercise.timing.repetitions * 2 
      : currentExercise.timing.repetitions;
    
    let completedReps = currentRep - 1;
    if (currentExercise.timing.hasSides && currentSide === 'right') {
      completedReps += currentExercise.timing.repetitions;
    }
    
    return (completedReps / totalReps) * 100;
  };

  const getCountdownProgress = () => {
    if (!currentExercise?.timing.holdDuration || countdown === 0) return 100;
    return ((currentExercise.timing.holdDuration - countdown) / currentExercise.timing.holdDuration) * 100;
  };

  if (sessionState === 'ready') {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-600">
              TMJ Exercise Guide
            </CardTitle>
            <p className="text-muted-foreground">
              Interactive exercise session with audio guidance
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Session Overview</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {SESSION_SUMMARY.totalExercises} exercises</li>
                <li>• {SESSION_SUMMARY.estimatedDuration} duration</li>
                <li>• {SESSION_SUMMARY.dailyFrequency} times daily recommended</li>
                <li>• Continue for {SESSION_SUMMARY.minimumWeeks}+ weeks</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-semibold text-amber-800 mb-2">Safety Reminder</h3>
              <p className="text-sm text-amber-700">
                {SESSION_SUMMARY.generalSafetyNote}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Sessions today: {sessionsToday}/6
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAudio}
                className="flex items-center gap-2"
              >
                {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {isAudioEnabled ? 'Audio On' : 'Audio Off'}
              </Button>
            </div>

            <Button 
              onClick={startSession} 
              className="w-full h-12 text-lg"
              disabled={!isAudioInitialized && isAudioEnabled}
            >
              <Play className="mr-2 h-5 w-5" />
              Start Exercise Session
            </Button>
            
            {!isAudioInitialized && isAudioEnabled && (
              <p className="text-xs text-muted-foreground text-center">
                Loading audio features...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (sessionState === 'completed') {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-green-600">
              Session Complete!
            </CardTitle>
            <p className="text-muted-foreground">
              Great work completing all {TMJ_EXERCISES.length} exercises
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-green-800 font-semibold">
                Sessions today: {sessionsToday}/6
              </p>
              <p className="text-sm text-green-700 mt-1">
                {sessionsToday >= 6 
                  ? "You've completed your daily goal!" 
                  : `${6 - sessionsToday} more sessions recommended today`
                }
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={resetSession} className="w-full">
                Start Another Session
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Active exercise session
  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Header with progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAudio}
              >
                {isAudioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetSession}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {currentExerciseIndex + 1}/{TMJ_EXERCISES.length}
            </span>
          </div>
          <Progress value={sessionProgress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Current Exercise */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentExercise?.shortName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {currentExercise?.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timer/Counter Display */}
          <div className="flex justify-center">
            {exerciseState === 'holding' && countdown > 0 ? (
              <CircularProgress 
                progress={getCountdownProgress()}
                size={140}
                className="text-blue-500"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold">{countdown}</div>
                  <div className="text-sm text-muted-foreground">seconds</div>
                </div>
              </CircularProgress>
            ) : (
              <CircularProgress 
                progress={getExerciseProgress()}
                size={140}
                className="text-blue-500"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {currentRep}/{currentExercise?.timing.repetitions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentExercise?.timing.hasSides && (
                      <div>{currentSide} side</div>
                    )}
                    reps
                  </div>
                </div>
              </CircularProgress>
            )}
          </div>

          {/* Exercise Instructions */}
          <div className="space-y-3">
            <h4 className="font-semibold">Instructions:</h4>
            <ol className="space-y-1 text-sm">
              {currentExercise?.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  {instruction}
                </li>
              ))}
            </ol>
          </div>

          {/* Safety Notes */}
          {currentExercise?.safetyNotes.length > 0 && (
            <div className="bg-amber-50 p-3 rounded-lg">
              <h4 className="font-semibold text-amber-800 text-sm mb-1">Safety Notes:</h4>
              <ul className="text-xs text-amber-700 space-y-1">
                {currentExercise.safetyNotes.map((note, index) => (
                  <li key={index}>• {note}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Current State Display */}
          <div className="text-center">
            <span className={cn(
              "inline-block px-3 py-1 rounded-full text-sm font-medium",
              exerciseState === 'holding' ? "bg-orange-100 text-orange-800" :
              exerciseState === 'executing' ? "bg-blue-100 text-blue-800" :
              exerciseState === 'resting' ? "bg-gray-100 text-gray-800" :
              "bg-green-100 text-green-800"
            )}>
              {exerciseState === 'intro' && 'Getting ready...'}
              {exerciseState === 'preparation' && 'Preparing...'}
              {exerciseState === 'executing' && 'Performing exercise...'}
              {exerciseState === 'holding' && 'Hold position'}
              {exerciseState === 'resting' && 'Rest'}
              {exerciseState === 'completed' && 'Complete!'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
