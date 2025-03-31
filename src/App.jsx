import React, { useState, useEffect } from 'react';
import './styles/index.css';
import './styles/animations.css';
import TitleScreen from './components/TitleScreen';
import Registration from './components/Registration';
import LoadingScreen from './components/LoadingScreen';
import BinaryLoadingScreen from './components/BinaryLoadingScreen';
import CrashingScreen from './components/CrashingScreen';
import CorruptedDataScreen from './components/CorruptedDataScreen';
import QuestionScreen from './components/QuestionScreen';
import ConfigurationScreen from './components/ConfigurationScreen';
import ConsentScreen from './components/ConsentScreen';
import AlertScreen from './components/AlertScreen';
import ErrorScreen from './components/ErrorScreen';
import GrandFinaleScreen from './components/GrandFinaleScreen';
import RevealScreen from './components/RevealScreen';
import JoelDetectionScreen from './components/JoelDetectionScreen';
import JoelResponseScreen from './components/JoelResponseScreen';
import { gameSteps } from './data/gameSteps';
import { funnyQuestions } from './data/questions';
import { configComments } from './data/configComments';
import { alertComments } from './data/alertComments';

const App = () => {
  const [gameState, setGameState] = useState('title');
  const [playerName, setPlayerName] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepMessage, setStepMessage] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [playerAnswers, setPlayerAnswers] = useState([]);
  const [errorType, setErrorType] = useState(null);
  const [configOption, setConfigOption] = useState(null);
  const [movingButtonIndex, setMovingButtonIndex] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [revealJoke, setRevealJoke] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showConfigConfirmation, setShowConfigConfirmation] = useState(false);
  const [selectedConfigIndex, setSelectedConfigIndex] = useState(null);
  const [showConsentConfirmation, setShowConsentConfirmation] = useState(false);
  const [showAlertConfirmation, setShowAlertConfirmation] = useState(false);
  const [progressBarType, setProgressBarType] = useState(0); // 0-3 for different progress bar styles
  const [isMelting, setIsMelting] = useState(false);
  const [isReversingProgress, setIsReversingProgress] = useState(false);
  const [loadingScreenType, setLoadingScreenType] = useState('default');
  const [finaleComplete, setFinaleComplete] = useState(false);
  const [reportReason, setReportReason] = useState(null);
  const [joelInserted, setJoelInserted] = useState(false);
  const [stepCount, setStepCount] = useState({ main: 1, sub: null, subsub: null, type: 'numeric' });
  const [completedSteps, setCompletedSteps] = useState(new Set()); // Track completed steps to avoid repetition

  useEffect(() => {
    if (gameState === 'loading') {
      setStepMessage(gameSteps[currentStep].message);
      
      // Select a loading screen type based on step or random choice
      if (loadingProgress === 0) {
        // Randomly select a progress bar type
        setProgressBarType(Math.floor(Math.random() * 4));
        
        // Select specific loading screen types for certain steps
        if (currentStep === 4 || currentStep === 16) {
          setLoadingScreenType('binary');
        } else if (currentStep === 10 || currentStep === 22) {
          setLoadingScreenType('crash');
        } else if (currentStep === 7 || currentStep === 19) {
          setLoadingScreenType('corrupted');
        } else {
          // Default most of the time, occasional special screens
          const screenTypes = ['default', 'default', 'default', 'default', 'binary', 'crash', 'corrupted'];
          setLoadingScreenType(screenTypes[Math.floor(Math.random() * screenTypes.length)]);
        }
        
        // Set melting effect for a specific step
        if (currentStep === 14) {
          setIsMelting(true);
        } else {
          setIsMelting(false);
        }
      }
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          // Reduce weird behavior frequency by:
          // 1. Only specific steps will have the reversing chance (first, middle, and near the end)
          // 2. Making the random check stricter (0.9 instead of 0.7)
          // 3. Adding specific points where it can happen (not just 40-42 and 70-72)
          const isSpecialStep = currentStep === 1 || currentStep === 7 || currentStep === 15 || currentStep === 22;
          const isReversePoint = 
            (prev >= 40 && prev <= 42) || 
            (prev >= 70 && prev <= 72) || 
            (prev >= 55 && prev <= 57 && isSpecialStep);
          
          if (isReversePoint && !isReversingProgress && Math.random() > 0.9) {
            setIsReversingProgress(true);
            
            // Make the reverse period shorter
            setTimeout(() => {
              setIsReversingProgress(false);
            }, 1000);
          }
          
          // If we're reversing, go backwards
          if (isReversingProgress) {
            return Math.max(prev - 1, 35);
          }
          
          // Otherwise normal progress, slowing down at certain points
          if (prev >= 75 && prev < 95) {
            return prev + 0.5;
          } else {
            return prev + 2;
          }
        });
        
        // Complete this loading step
        if (loadingProgress >= 97) {
          clearInterval(interval);
          
          // Move to next step after a short delay
          setTimeout(() => {
            // Proceed to next step
            const nextStep = currentStep + 1;
            
            // Mark current step as completed
            setCompletedSteps(prev => new Set(prev).add(currentStep));
            
            // If we've gone through enough steps, show the error
            if (nextStep >= gameSteps.length - 3) {
              setErrorType(Math.floor(Math.random() * 5));
              setGameState('error');
              // Advance step count when showing error
              advanceStepCount();
              return;
            }
            
            // Otherwise proceed to the next step
            setCurrentStep(nextStep);
            setLoadingProgress(0);
            
            // Remove the random step count advancement during loading transitions
            // The step count should only change when screens change, not randomly
            
            // Set the appropriate game state based on the next step type
            if (gameSteps[nextStep].type === 'loading') {
              setGameState('loading');
            } else if (gameSteps[nextStep].type === 'configuration') {
              setGameState('configuration');
              // Advance step count when moving to a non-loading screen
              advanceStepCount();
            } else if (gameSteps[nextStep].type === 'consent') {
              setGameState('consent');
              // Advance step count when moving to a non-loading screen
              advanceStepCount();
            } else if (gameSteps[nextStep].type === 'alert') {
              setGameState('alert');
              // Advance step count when moving to a non-loading screen
              advanceStepCount();
            } else if (gameSteps[nextStep].type === 'question') {
              setGameState('question');
              // Advance step count when moving to a non-loading screen
              advanceStepCount();
            }
          }, 1000);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [gameState, loadingProgress, currentStep, isReversingProgress, completedSteps]);

  useEffect(() => {
    if (!joelInserted && gameState === 'loading' && currentStep === 0 && loadingProgress >= 70) {
      setGameState('joel-detection');
      setJoelInserted(true);
    }
  }, [joelInserted, gameState, currentStep, loadingProgress]);

  const handleStartGame = () => {
    setGameState('registration');
    // Reset step count when starting game
    setStepCount({ main: 1, sub: null, subsub: null, type: 'numeric' });
  };

  const handleSubmitRegistration = () => {
    if (playerName.trim() === '') return;
    setCurrentStep(0);
    setGameState('loading');
    setLoadingProgress(0);
    // Advance step count after registration
    advanceStepCount();
  };

  const handleAnswer = (answerIndex) => {
    // Instead of immediately proceeding, show confirmation dialog
    setSelectedAnswerIndex(answerIndex);
    setShowConfirmation(true);
  };
  
  const confirmAnswer = () => {
    const newAnswers = [...playerAnswers, selectedAnswerIndex];
    setPlayerAnswers(newAnswers);
    setShowConfirmation(false);
    setSelectedAnswerIndex(null);
    
    // Move to next question or to loading if all questions answered
    if (questionIndex < funnyQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      // Mark current step as completed
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(currentStep + 1);
      setGameState('loading');
      setLoadingProgress(0);
    }
  };

  const handleConfigOption = (optionIndex) => {
    // Check if we should show a confirmation for this configuration step
    if (configComments[currentStep]) {
      setSelectedConfigIndex(optionIndex);
      setShowConfigConfirmation(true);
      return;
    }
    
    // If no confirmation needed, proceed directly
    proceedWithConfig(optionIndex);
  };
  
  const proceedWithConfig = (optionIndex) => {
    setConfigOption(optionIndex);
    
    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    
    // Move to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setLoadingProgress(0);
    
    // Advance step count here
    advanceStepCount();
    
    // Set the appropriate game state based on the next step type
    if (gameSteps[nextStep].type === 'loading') {
      setGameState('loading');
    } else if (gameSteps[nextStep].type === 'configuration') {
      setGameState('configuration');
    } else if (gameSteps[nextStep].type === 'consent') {
      setGameState('consent');
    } else if (gameSteps[nextStep].type === 'alert') {
      setGameState('alert');
    } else if (gameSteps[nextStep].type === 'question') {
      setGameState('question');
    }
  };
  
  const confirmConfig = () => {
    // Clear the confirmation dialog
    setShowConfigConfirmation(false);
    
    // Proceed with the selected config option
    proceedWithConfig(selectedConfigIndex);
    
    // Reset the selected index
    setSelectedConfigIndex(null);
  };
  
  const changeConfig = () => {
    // Just close the confirmation dialog without proceeding
    setShowConfigConfirmation(false);
    setSelectedConfigIndex(null);
  };

  const handleConsent = () => {
    // Show confirmation dialog instead of proceeding immediately
    setShowConsentConfirmation(true);
  };
  
  const confirmConsent = () => {
    // Clear the confirmation dialog
    setShowConsentConfirmation(false);
    
    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    
    // Proceed to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setLoadingProgress(0);
    
    // Advance step count here
    advanceStepCount();
    
    if (gameSteps[nextStep].type === 'loading') {
      setGameState('loading');
    } else if (gameSteps[nextStep].type === 'configuration') {
      setGameState('configuration');
    } else if (gameSteps[nextStep].type === 'consent') {
      setGameState('consent');
    } else if (gameSteps[nextStep].type === 'alert') {
      setGameState('alert');
    } else if (gameSteps[nextStep].type === 'question') {
      setGameState('question');
    }
  };
  
  const changeConsent = () => {
    // Just close the confirmation dialog
    setShowConsentConfirmation(false);
  };

  const handleAlert = () => {
    // Check if we should show a confirmation for this alert step
    if (alertComments[currentStep]) {
      setShowAlertConfirmation(true);
      return;
    }
    
    // If no confirmation needed, proceed directly
    proceedWithAlert();
  };
  
  const proceedWithAlert = () => {
    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    
    // Move to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setLoadingProgress(0);
    
    // Advance step count here
    advanceStepCount();
    
    if (gameSteps[nextStep].type === 'loading') {
      setGameState('loading');
    } else if (gameSteps[nextStep].type === 'configuration') {
      setGameState('configuration');
    } else if (gameSteps[nextStep].type === 'consent') {
      setGameState('consent');
    } else if (gameSteps[nextStep].type === 'alert') {
      setGameState('alert');
    } else if (gameSteps[nextStep].type === 'question') {
      setGameState('question');
    }
  };
  
  const confirmAlert = () => {
    // Clear the confirmation dialog
    setShowAlertConfirmation(false);
    
    // Proceed to next step
    proceedWithAlert();
  };
  
  const changeAlert = () => {
    // Just close the confirmation dialog
    setShowAlertConfirmation(false);
  };

  const handleErrorAction = () => {
    // After 3 errors, show grand finale before the joke reveal
    if (updateCount >= 2) {
      setGameState('finale');
      return;
    }
    
    setUpdateCount(updateCount + 1);
    
    // Reset to a random place in the sequence, avoiding previously completed steps
    let availableSteps = [];
    for(let i = 4; i < gameSteps.length - 8; i++) {
      if(!completedSteps.has(i)) {
        availableSteps.push(i);
      }
    }
    
    // If all steps have been shown or not enough available, just use a random step
    if(availableSteps.length < 3) {
      availableSteps = Array.from({length: gameSteps.length - 12}, (_, i) => i + 4);
    }
    
    const randomStep = availableSteps[Math.floor(Math.random() * availableSteps.length)];
    setCurrentStep(randomStep);
    setGameState('loading');
    setLoadingProgress(0);
  };
  
  const handleButtonHover = (index) => {
    // Set moving button index on hover, without applying the actual transformation
    // (the components will handle their own transformation logic now)
    setMovingButtonIndex(index);
    
    // Reset after a short delay
    setTimeout(() => {
      setMovingButtonIndex(null);
    }, 200); // Short time to allow quick movement
  };

  const handleFinaleComplete = () => {
    setFinaleComplete(true);
    setRevealJoke(true);
    setGameState('reveal');
  };

  const handleStartOver = () => {
    setGameState('title');
    setPlayerName('');
    setLoadingProgress(0);
    setQuestionIndex(0);
    setPlayerAnswers([]);
    setErrorType(null);
    setUpdateCount(0);
    setRevealJoke(false);
    setCurrentStep(0);
    setSelectedAnswerIndex(null);
    setShowConfirmation(false);
    setShowConfigConfirmation(false);
    setSelectedConfigIndex(null);
    setShowConsentConfirmation(false);
    setShowAlertConfirmation(false);
    setFinaleComplete(false);
    setJoelInserted(false);
    setCompletedSteps(new Set()); // Reset completed steps
  };

  const handleChangeAnswer = () => {
    setShowConfirmation(false);
    setSelectedAnswerIndex(null);
  };

  const handleReportJoel = (reason) => {
    setReportReason(reason);
    setGameState('joel-response');
    advanceStepCount();
  };

  const handleIgnoreJoel = () => {
    setCurrentStep(0);
    setLoadingProgress(0);
    setGameState('loading');
    advanceStepCount();
  };

  const handleJoelResponseComplete = () => {
    setCurrentStep(0);
    setLoadingProgress(0);
    setGameState('loading');
    advanceStepCount();
  };

  const getStepLabel = () => {
    // Basic formats
    const stepFormats = [
      // Regular numeric
      () => `Step ${stepCount.main}${stepCount.sub ? `.${stepCount.sub}` : ''}${stepCount.subsub ? `.${stepCount.subsub}` : ''} of 3`,
      
      // Letters
      () => `Step ${String.fromCharCode(64 + stepCount.main)}${stepCount.sub ? `.${stepCount.sub}` : ''}${stepCount.subsub ? `.${stepCount.subsub}` : ''} of 3`,
      
      // Roman numerals (simplified for I, II, III, IV, V)
      () => {
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        return `Step ${romanNumerals[stepCount.main - 1] || stepCount.main}${stepCount.sub ? `.${stepCount.sub}` : ''}${stepCount.subsub ? `.${stepCount.subsub}` : ''} of III`;
      },
      
      // Binary
      () => `Step ${stepCount.main.toString(2)}${stepCount.sub ? `.${stepCount.sub}` : ''}${stepCount.subsub ? `.${stepCount.subsub}` : ''} of 11`,
      
      // Hexadecimal
      () => `Step 0x${stepCount.main.toString(16).toUpperCase()}${stepCount.sub ? `.${stepCount.sub}` : ''}${stepCount.subsub ? `.${stepCount.subsub}` : ''} of 0x3`,
    ];
    
    // Special formats that appear randomly
    const specialFormats = [
      () => `Step ${stepCount.main} of ???`,
      () => `Step ${stepCount.main} of many, many steps`,
      () => `Step ${stepCount.main}... (we've lost count)`,
      () => `Step ${stepCount.main} of 3 (hopefully)`,
      () => `Step ${stepCount.main}ish of approximately 3`,
      () => `Step ${stepCount.main} of 3*  (*terms and conditions apply)`,
      () => `Progress: ${Math.min(33 * stepCount.main, 99)}%`,
      () => `Loading Step ${stepCount.main}...`,
      () => `${'I'.repeat(stepCount.main)} of III`,
      () => `Step ${stepCount.main} of 3 (just kidding)`,
      () => `Step n+${stepCount.main-1} of n+2, where n=1`,
      () => `Step ${stepCount.main} of 3 (results may vary)`,
      () => `Step ${stepCount.main}: We're getting there...`,
      () => `${stepCount.main}/3 steps completed*`,
      () => `Step #${stepCount.main} (estimated remaining steps: ∞)`,
      () => `Almost at Step 3! (${Math.floor(Math.random() * 10 + 70)}% there)`,
      () => `Step 2.${Math.floor(Math.random() * 9000 + 1000)} of 3`,
      () => `Step 10${stepCount.main.toString()} in base 11`,
      () => `Step √${stepCount.main * stepCount.main} of √9`,
      () => `Step ${stepCount.main} of 3 (approximately)`,
      () => `Please wait... Step ${stepCount.main} in progress`,
      () => `[${stepCount.main}/3] Loading, please wait...`,
      () => `Error: Step 3 not found, showing Step ${stepCount.main} instead`,
      () => `You are now in Step 2 dimension ${Math.floor(Math.random() * 100)}`,
      () => `Step ${stepCount.main} of 3 | Elapsed time: ${Math.floor(Math.random() * 600) + 300}s`,
    ];
    
    // Decide which format to use based on the step count and some randomness
    if (stepCount.main === 1) {
      return "Step 1 of 3";
    } else if (stepCount.main === 2 && !stepCount.sub) {
      // 50% chance of showing special format even at step 2
      if (Math.random() < 0.5) {
        return specialFormats[Math.floor(Math.random() * specialFormats.length)]();
      }
      return "Step 2 of 3";
    } else if (Math.random() < 0.8) { // 80% chance for special formats
      return specialFormats[Math.floor(Math.random() * specialFormats.length)]();
    } else {
      // Pick a random format from the basic formats
      return stepFormats[Math.floor(Math.random() * stepFormats.length)]();
    }
  };

  const advanceStepCount = () => {
    // Clone current step count
    const newStepCount = { ...stepCount };
    
    // Logic to advance steps but never quite reach 3
    if (newStepCount.main === 1) {
      // First transition: go from 1 to 2
      newStepCount.main = 2;
    } else if (newStepCount.main === 2 && !newStepCount.sub) {
      // Second transition: add a sub-step 20% of the time, or switch counting system
      if (Math.random() < 0.2) {
        newStepCount.sub = 1;
      } else {
        // Sometimes change the counting system
        const systems = ['numeric', 0, 1, 2, 3, 4];
        newStepCount.type = systems[Math.floor(Math.random() * systems.length)];
      }
    } else if (newStepCount.main === 2 && newStepCount.sub) {
      // After 2.x: either increment sub-step or add sub-sub-step
      if (Math.random() < 0.4 && !newStepCount.subsub) {
        newStepCount.subsub = 1;
      } else if (newStepCount.subsub) {
        newStepCount.subsub++;
      } else {
        newStepCount.sub++;
      }
      
      // Occasionally reset but with a twist
      if (Math.random() < 0.2) {
        newStepCount.main = 2;
        newStepCount.sub = 1;
        newStepCount.subsub = null;
        
        // Change counting system
        const systems = ['numeric', 0, 1, 2, 3, 4];
        newStepCount.type = systems[Math.floor(Math.random() * systems.length)];
      }
    }
    
    setStepCount(newStepCount);
  };

  const stepLabel = getStepLabel();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex-grow flex items-center justify-center py-8">
        {gameState === 'title' && (
          <TitleScreen onStartGame={handleStartGame} />
        )}
        
        {gameState === 'registration' && (
          <Registration 
            playerName={playerName} 
            setPlayerName={setPlayerName} 
            onSubmit={handleSubmitRegistration} 
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'joel-detection' && (
          <JoelDetectionScreen 
            onReport={handleReportJoel}
            onIgnore={handleIgnoreJoel}
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'joel-response' && (
          <JoelResponseScreen 
            reportReason={reportReason}
            onContinue={handleJoelResponseComplete}
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'loading' && loadingScreenType === 'default' && (
          <LoadingScreen 
            stepMessage={stepMessage} 
            loadingProgress={loadingProgress} 
            progressBarType={progressBarType} 
            isMelting={isMelting} 
            isReversingProgress={isReversingProgress} 
            currentStep={currentStep}
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'loading' && loadingScreenType === 'binary' && (
          <BinaryLoadingScreen
            stepMessage={stepMessage}
            loadingProgress={loadingProgress}
            onComplete={() => {}}
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'loading' && loadingScreenType === 'crash' && (
          <CrashingScreen
            stepMessage={stepMessage}
            loadingProgress={loadingProgress}
            onComplete={() => {}}
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'loading' && loadingScreenType === 'corrupted' && (
          <CorruptedDataScreen
            stepMessage={stepMessage}
            loadingProgress={loadingProgress}
            onComplete={() => {}}
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'question' && (
          <QuestionScreen 
            questionIndex={questionIndex} 
            onAnswer={handleAnswer} 
            showConfirmation={showConfirmation} 
            selectedAnswerIndex={selectedAnswerIndex} 
            onConfirmAnswer={confirmAnswer} 
            onChangeAnswer={handleChangeAnswer}
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'configuration' && (
          <ConfigurationScreen 
            currentStep={currentStep} 
            onConfigOption={handleConfigOption} 
            handleButtonHover={handleButtonHover} 
            movingButtonIndex={movingButtonIndex}
            showConfigConfirmation={showConfigConfirmation}
            selectedConfigIndex={selectedConfigIndex}
            onConfirmConfig={confirmConfig}
            onChangeConfig={changeConfig}
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'consent' && (
          <ConsentScreen 
            onConsent={handleConsent}
            showConsentConfirmation={showConsentConfirmation}
            onConfirmConsent={confirmConsent}
            onChangeConsent={changeConsent}
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'alert' && (
          <AlertScreen 
            currentStep={currentStep} 
            onAlert={handleAlert}
            showAlertConfirmation={showAlertConfirmation}
            onConfirmAlert={confirmAlert}
            onChangeAlert={changeAlert}
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'error' && (
          <ErrorScreen 
            errorType={errorType} 
            updateCount={updateCount} 
            onErrorAction={handleErrorAction} 
            handleButtonHover={handleButtonHover} 
            movingButtonIndex={movingButtonIndex}
            stepLabel={stepLabel}
          />
        )}
        
        {gameState === 'finale' && (
          <GrandFinaleScreen 
            playerName={playerName}
            onComplete={handleFinaleComplete}
            stepLabel="Final Step!"
          />
        )}
        
        {gameState === 'reveal' && (
          <RevealScreen 
            playerName={playerName} 
            onStartOver={handleStartOver}
            stepLabel="April Fools!"
          />
        )}
      </div>
    </div>
  );
};

export default App; 