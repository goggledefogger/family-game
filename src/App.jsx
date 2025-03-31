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
import { randomConfigComments, randomAlertComments, randomConsentComments, randomQuestionComments } from './data/randomComments';

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
  const [currentStepLabel, setCurrentStepLabel] = useState("Step 1 of 3");

  useEffect(() => {
    if (gameState === 'loading') {
      setStepMessage(gameSteps[currentStep].message);
      
      // Select a loading screen type based on step or random choice
      if (loadingProgress === 0) {
        // Randomly select a progress bar type
        setProgressBarType(Math.floor(Math.random() * 4));
        
        // Create a more varied and distributed selection of loading screen types
        const stepIndex = currentStep % 8; // Create a repeating pattern every 8 steps
        
        if (stepIndex === 0) {
          setLoadingScreenType('default');
        } else if (stepIndex === 1) {
          setLoadingScreenType('binary');
        } else if (stepIndex === 2) {
          setLoadingScreenType('default');
        } else if (stepIndex === 3) {
          setLoadingScreenType('crash');
        } else if (stepIndex === 4) {
          setLoadingScreenType('default');
        } else if (stepIndex === 5) {
          setLoadingScreenType('corrupted');
        } else {
          // For the remaining steps, select randomly but weight toward default
          const screenTypes = ['default', 'default', 'binary', 'crash', 'corrupted'];
          setLoadingScreenType(screenTypes[Math.floor(Math.random() * screenTypes.length)]);
        }
        
        // Set melting effect occasionally for visual variety
        if (currentStep === 7 || currentStep === 14 || Math.random() > 0.85) {
          setIsMelting(true);
        } else {
          setIsMelting(false);
        }
      }
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          // Reduce weird behavior frequency by:
          // 1. Making fewer steps eligible for reverse progression
          // 2. Making the random threshold higher (less chance)
          const isSpecialStep = currentStep === 7 || currentStep === 15;
          const isReversePoint = 
            (prev >= 40 && prev <= 42 && Math.random() > 0.8) || 
            (prev >= 70 && prev <= 72 && Math.random() > 0.85 && isSpecialStep);
          
          if (isReversePoint && !isReversingProgress && Math.random() > 0.97) {
            setIsReversingProgress(true);
            
            // Make the reverse period shorter
            setTimeout(() => {
              setIsReversingProgress(false);
            }, 800);
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
            
            // Set the appropriate game state based on the next step type
            const nextGameState = gameSteps[nextStep].type;
            setGameState(nextGameState);
            
            // Only advance step counter when moving to non-loading screens
            // This ensures we follow the desired step counter progression
            if (nextGameState !== 'loading') {
              advanceStepCount();
            }
          }, 1000);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [gameState, loadingProgress, currentStep, isReversingProgress, completedSteps]);

  useEffect(() => {
    // Make Joel appear at exactly the 5th screen (currentStep 4 since arrays are zero-indexed)
    if (!joelInserted && gameState === 'loading' && currentStep === 4 && loadingProgress >= 65) {
      setGameState('joel-detection');
      setJoelInserted(true);
    }
  }, [joelInserted, gameState, currentStep, loadingProgress]);

  const handleStartGame = () => {
    setGameState('registration');
    // Set step count and label to Step 1
    setStepCount({ main: 1, sub: null, subsub: null, type: 'numeric' });
    setCurrentStepLabel("Step 1 of 3");
  };

  const handleSubmitRegistration = () => {
    if (playerName.trim() === '') return;
    setCurrentStep(0);
    setGameState('loading');
    setLoadingProgress(0);
    // Do NOT advance step counter here - it should stay as Step 1 until after first loading screen
  };

  const handleAnswer = (answerIndex) => {
    // Random chance to show confirmation, increasing as the game progresses
    const randomChance = 0.3 + (Math.min(questionIndex, 5) * 0.1); // 30-80% chance
    
    if (Math.random() < randomChance) {
      // Instead of immediately proceeding, show confirmation dialog
      setSelectedAnswerIndex(answerIndex);
      setShowConfirmation(true);
    } else {
      // Skip confirmation and proceed directly
      const newAnswers = [...playerAnswers, answerIndex];
      setPlayerAnswers(newAnswers);
      
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
    }
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
    // Either because there are comments OR by random chance
    // The chance increases as you advance through the game
    const randomChance = 0.3 + (Math.min(currentStep, 20) * 0.02); // 30% at start, increasing by 2% per step
    
    if (configComments[currentStep] || Math.random() < randomChance) {
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
    
    // Set the appropriate game state based on the next step type
    if (gameSteps[nextStep].type === 'loading') {
      setGameState('loading');
    } else if (gameSteps[nextStep].type === 'configuration') {
      setGameState('configuration');
      advanceStepCount(); // Only advance step count for non-loading screens
    } else if (gameSteps[nextStep].type === 'consent') {
      setGameState('consent');
      advanceStepCount(); // Only advance step count for non-loading screens
    } else if (gameSteps[nextStep].type === 'alert') {
      setGameState('alert');
      advanceStepCount(); // Only advance step count for non-loading screens
    } else if (gameSteps[nextStep].type === 'question') {
      setGameState('question');
      advanceStepCount(); // Only advance step count for non-loading screens
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
    // Random chance to show confirmation, increasing as the game progresses
    const randomChance = 0.5 + (Math.min(currentStep, 10) * 0.03); // 50-80% chance
    
    if (Math.random() < randomChance) {
      // Show confirmation dialog instead of proceeding immediately
      setShowConsentConfirmation(true);
    } else {
      // Skip confirmation and proceed directly
      // Mark current step as completed
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      
      // Proceed to next step
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setLoadingProgress(0);
      
      // Handle state transition
      if (gameSteps[nextStep].type === 'loading') {
        setGameState('loading');
      } else {
        setGameState(gameSteps[nextStep].type);
        advanceStepCount(); // Only advance step count for non-loading screens
      }
    }
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
    
    // Handle state transition
    if (gameSteps[nextStep].type === 'loading') {
      setGameState('loading');
    } else {
      setGameState(gameSteps[nextStep].type);
      advanceStepCount(); // Only advance step count for non-loading screens
    }
  };
  
  const changeConsent = () => {
    // Just close the confirmation dialog
    setShowConsentConfirmation(false);
  };

  const handleAlert = () => {
    // Check if we should show a confirmation for this alert step
    // Either because there are comments OR by random chance
    // The chance increases as you advance through the game
    const randomChance = 0.4 + (Math.min(currentStep, 15) * 0.03); // 40% at start, increasing by 3% per step
    
    if (alertComments[currentStep] || Math.random() < randomChance) {
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
    
    // Handle state transition
    if (gameSteps[nextStep].type === 'loading') {
      setGameState('loading');
    } else {
      setGameState(gameSteps[nextStep].type);
      advanceStepCount(); // Only advance step count for non-loading screens
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

  const getStepLabel = (countObj) => {
    // Use the provided count object or fall back to the state
    const currentCount = countObj || stepCount;
    
    // Basic formats
    const stepFormats = [
      // Regular numeric
      () => `Step ${currentCount.main}${currentCount.sub ? `.${currentCount.sub}` : ''}${currentCount.subsub ? `.${currentCount.subsub}` : ''} of 3`,
      
      // Letters
      () => `Step ${String.fromCharCode(64 + currentCount.main)}${currentCount.sub ? `.${currentCount.sub}` : ''}${currentCount.subsub ? `.${currentCount.subsub}` : ''} of 3`,
      
      // Roman numerals (simplified for I, II, III, IV, V)
      () => {
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        return `Step ${romanNumerals[currentCount.main - 1] || currentCount.main}${currentCount.sub ? `.${currentCount.sub}` : ''}${currentCount.subsub ? `.${currentCount.subsub}` : ''} of III`;
      },
      
      // Binary
      () => `Step ${currentCount.main.toString(2)}${currentCount.sub ? `.${currentCount.sub}` : ''}${currentCount.subsub ? `.${currentCount.subsub}` : ''} of 11`,
      
      // Hexadecimal
      () => `Step 0x${currentCount.main.toString(16).toUpperCase()}${currentCount.sub ? `.${currentCount.sub}` : ''}${currentCount.subsub ? `.${currentCount.subsub}` : ''} of 0x3`,
    ];
    
    // Special formats that appear randomly
    const specialFormats = [
      () => `Step ${currentCount.main} of ???`,
      () => `Step ${currentCount.main} of many, many steps`,
      () => `Step ${currentCount.main}... (we've lost count)`,
      () => `Step ${currentCount.main} of 3 (hopefully)`,
      () => `Step ${currentCount.main}ish of approximately 3`,
      () => `Step ${currentCount.main} of 3*  (*terms and conditions apply)`,
      () => `Progress: ${Math.min(33 * currentCount.main, 99)}%`,
      () => `Loading Step ${currentCount.main}...`,
      () => `${'I'.repeat(currentCount.main)} of III`,
      () => `Step ${currentCount.main} of 3 (just kidding)`,
      () => `Step n+${currentCount.main-1} of n+2, where n=1`,
      () => `Step ${currentCount.main} of 3 (results may vary)`,
      () => `Step ${currentCount.main}: We're getting there...`,
      () => `${currentCount.main}/3 steps completed*`,
      () => `Step #${currentCount.main} (estimated remaining steps: ∞)`,
      () => `Almost at Step 3! (${Math.floor(Math.random() * 10 + 70)}% there)`,
      () => `Step 2.${Math.floor(Math.random() * 9000 + 1000)} of 3`,
      () => `Step 10${currentCount.main.toString()} in base 11`,
      () => `Step √${currentCount.main * currentCount.main} of √9`,
      () => `Step ${currentCount.main} of 3 (approximately)`,
      () => `Please wait... Step ${currentCount.main} in progress`,
      () => `[${currentCount.main}/3] Loading, please wait...`,
      () => `Error: Step 3 not found, showing Step ${currentCount.main} instead`,
      () => `You are now in Step 2 dimension ${Math.floor(Math.random() * 100)}`,
      () => `Step ${currentCount.main} of 3 | Elapsed time: ${Math.floor(Math.random() * 600) + 300}s`,
    ];
    
    // Decide which format to use based on the step count and some randomness
    if (currentCount.main === 1) {
      return "Step 1 of 3";
    } else if (currentCount.main === 2 && !currentCount.sub) {
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
    // Get the current progression stage
    let nextStage = 0;
    
    // Determine which stage we're advancing to
    if (stepCount.main === 1 && !stepCount.sub) {
      // If currently showing Step 1, advance to Step 2
      nextStage = 1;
    } else if (stepCount.main === 2 && !stepCount.sub) {
      // If currently showing Step 2, advance to Step 2.1
      nextStage = 2;
    } else if (stepCount.main === 2 && stepCount.sub === 1) {
      // If currently showing Step 2.1, advance to Step 2.2
      nextStage = 3;
    } else {
      // Beyond Step 2.2, get creative
      nextStage = 4;
    }
    
    // Set the step count according to the determined stage
    const newStepCount = { ...stepCount };
    
    if (nextStage === 1) {
      // Stage 1: Step 2
      newStepCount.main = 2;
      newStepCount.sub = null;
      newStepCount.subsub = null;
      newStepCount.type = 'numeric';
    } else if (nextStage === 2) {
      // Stage 2: Step 2.1
      newStepCount.main = 2;
      newStepCount.sub = 1;
      newStepCount.subsub = null;
      newStepCount.type = 'numeric';
    } else if (nextStage === 3) {
      // Stage 3: Step 2.2
      newStepCount.main = 2;
      newStepCount.sub = 2;
      newStepCount.subsub = null;
      newStepCount.type = 'numeric';
    } else {
      // Stage 4+: Get weird
      if (Math.random() < 0.8) {
        // 80% chance: increment existing step in strange ways
        newStepCount.main = 2;
        
        // Add or advance sub-steps in unpredictable ways
        if (!newStepCount.sub || Math.random() < 0.5) {
          newStepCount.sub = newStepCount.sub ? newStepCount.sub + 1 : 3; // Skip to 2.3 after 2.2
        } else {
          if (!newStepCount.subsub) {
            newStepCount.subsub = 1;
          } else {
            newStepCount.subsub++;
          }
        }
        
        // Sometimes switch numbering systems
        if (Math.random() < 0.4) {
          const systems = ['numeric', 0, 1, 2, 3, 4];
          newStepCount.type = systems[Math.floor(Math.random() * systems.length)];
        }
      } else {
        // 20% chance: completely weird format
        newStepCount.main = 2;
        newStepCount.sub = Math.floor(Math.random() * 9) + 3; // 2.3 through 2.11
        newStepCount.subsub = Math.random() < 0.5 ? Math.floor(Math.random() * 5) + 1 : null;
        
        // Use a random numbering system
        const systems = ['numeric', 0, 1, 2, 3, 4];
        newStepCount.type = systems[Math.floor(Math.random() * systems.length)];
      }
    }
    
    setStepCount(newStepCount);
    
    // Calculate and set the new step label
    let newLabel;
    
    if (nextStage === 1) {
      newLabel = "Step 2 of 3";
    } else if (nextStage === 2) {
      newLabel = "Step 2.1 of 3";
    } else if (nextStage === 3) {
      newLabel = "Step 2.2 of 3";
    } else {
      newLabel = getStepLabel(newStepCount);
    }
    
    setCurrentStepLabel(newLabel);
  };

  // Initialize the step label when the component first loads
  useEffect(() => {
    // Set initial step label
    setCurrentStepLabel("Step 1 of 3");
  }, []);

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
            stepLabel={currentStepLabel}
          />
        )}
        
        {gameState === 'joel-detection' && (
          <JoelDetectionScreen 
            onReport={handleReportJoel}
            onIgnore={handleIgnoreJoel}
            stepLabel={currentStepLabel}
          />
        )}
        
        {gameState === 'joel-response' && (
          <JoelResponseScreen 
            reportReason={reportReason}
            onContinue={handleJoelResponseComplete}
            stepLabel={currentStepLabel}
          />
        )}
        
        {gameState === 'loading' && loadingScreenType === 'default' && (
          <LoadingScreen 
            playerName={playerName}
            stepMessage={stepMessage} 
            loadingProgress={loadingProgress} 
            progressBarType={progressBarType} 
            isMelting={isMelting} 
            isReversingProgress={isReversingProgress} 
            currentStep={currentStep}
            stepLabel={currentStepLabel}
          />
        )}
        
        {gameState === 'loading' && loadingScreenType === 'binary' && (
          <BinaryLoadingScreen
            playerName={playerName}
            stepMessage={stepMessage}
            loadingProgress={loadingProgress}
            onComplete={() => {}}
            stepLabel={currentStepLabel}
          />
        )}
        
        {gameState === 'loading' && loadingScreenType === 'crash' && (
          <CrashingScreen
            playerName={playerName}
            stepMessage={stepMessage}
            loadingProgress={loadingProgress}
            onComplete={() => {}}
            stepLabel={currentStepLabel}
          />
        )}
        
        {gameState === 'loading' && loadingScreenType === 'corrupted' && (
          <CorruptedDataScreen
            playerName={playerName}
            stepMessage={stepMessage}
            loadingProgress={loadingProgress}
            onComplete={() => {}}
            stepLabel={currentStepLabel}
          />
        )}
        
        {gameState === 'question' && (
          <QuestionScreen 
            playerName={playerName}
            questionIndex={questionIndex} 
            onAnswer={handleAnswer} 
            showConfirmation={showConfirmation} 
            selectedAnswerIndex={selectedAnswerIndex} 
            onConfirmAnswer={confirmAnswer} 
            onChangeAnswer={handleChangeAnswer}
            stepLabel={currentStepLabel}
          />
        )}
        
        {gameState === 'configuration' && (
          <ConfigurationScreen 
            playerName={playerName}
            currentStep={currentStep} 
            onConfigOption={handleConfigOption} 
            handleButtonHover={handleButtonHover} 
            movingButtonIndex={movingButtonIndex}
            showConfigConfirmation={showConfigConfirmation}
            selectedConfigIndex={selectedConfigIndex}
            onConfirmConfig={confirmConfig}
            onChangeConfig={changeConfig}
            stepLabel={currentStepLabel}
          />
        )}
        
        {gameState === 'consent' && (
          <ConsentScreen 
            playerName={playerName}
            onConsent={handleConsent}
            showConsentConfirmation={showConsentConfirmation}
            onConfirmConsent={confirmConsent}
            onChangeConsent={changeConsent}
            stepLabel={currentStepLabel}
          />
        )}
        
        {gameState === 'alert' && (
          <AlertScreen 
            playerName={playerName}
            currentStep={currentStep} 
            onAlert={handleAlert}
            showAlertConfirmation={showAlertConfirmation}
            onConfirmAlert={confirmAlert}
            onChangeAlert={changeAlert}
            stepLabel={currentStepLabel}
          />
        )}
        
        {gameState === 'error' && (
          <ErrorScreen 
            playerName={playerName}
            errorType={errorType} 
            updateCount={updateCount} 
            onErrorAction={handleErrorAction} 
            handleButtonHover={handleButtonHover} 
            movingButtonIndex={movingButtonIndex}
            stepLabel={currentStepLabel}
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