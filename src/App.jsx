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
import PaymentConfirmationScreen from './components/PaymentConfirmationScreen';
import GameHeader from './components/GameHeader';
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
  const [showDevTools, setShowDevTools] = useState(false); // Always off by default, regardless of environment

  // Create a ref for tracking reversal count that persists between renders
  const reversalCountRef = React.useRef(0);

  // Development shortcuts moved to UI buttons, no keyboard listeners needed

  useEffect(() => {
    if (gameState === 'loading') {
      setStepMessage(gameSteps[currentStep].message);
      
      // Select a loading screen type based on step or random choice
      if (loadingProgress === 0) {
        // Randomly select a progress bar type - more variety later in the game
        if (currentStep < 5) {
          // First third: mostly default progress bar type (0)
          setProgressBarType(Math.floor(Math.random() * 2)); // Only types 0-1
        } else if (currentStep < 12) {
          // Middle third: more variety but still controlled
          setProgressBarType(Math.floor(Math.random() * 3)); // Types 0-2
        } else {
          // Final third: full variety
          setProgressBarType(Math.floor(Math.random() * 4)); // All types 0-3
        }
        
        // Create a progressive distribution of loading screen types
        if (currentStep < 6) {
          // First third: rarely show binary loading screen
          const screenTypes = ['default', 'default', 'default', 'default', 'default'];
          // Only 5% chance for binary in early game
          if (Math.random() < 0.05) {
            screenTypes[Math.floor(Math.random() * screenTypes.length)] = 'binary';
          }
          const randomIndex = Math.floor(Math.random() * screenTypes.length);
          setLoadingScreenType(screenTypes[randomIndex]);
        } else if (currentStep < 12) {
          // Middle third: occasionally show binary and crash screens
          const screenTypes = ['default', 'default', 'default', 'binary', 'crash'];
          const randomIndex = Math.floor(Math.random() * screenTypes.length);
          setLoadingScreenType(screenTypes[randomIndex]);
        } else {
          // Final third: more variety but still control frequency
          const screenTypes = ['default', 'default', 'binary', 'crash', 'corrupted'];
          const randomIndex = Math.floor(Math.random() * screenTypes.length);
          setLoadingScreenType(screenTypes[randomIndex]);
        }
        
        // Set melting effect with increasing frequency as game progresses
        if (
          (currentStep < 6 && Math.random() > 0.95) || // 5% chance early game
          (currentStep >= 6 && currentStep < 12 && Math.random() > 0.85) || // 15% chance mid game
          (currentStep >= 12 && (currentStep === 14 || Math.random() > 0.7)) // 30% chance late game + step 14
        ) {
          setIsMelting(true);
        } else {
          setIsMelting(false);
        }
      }
      
      // Add a maximum loading time to ensure it always finishes
      // This prevents infinite loops in the loading progress
      const maxLoadingTime = 15000; // 15 seconds maximum loading time
      const forceCompleteTimeout = setTimeout(() => {
        if (gameState === 'loading' && loadingProgress < 97) {
          console.log('Forcing loading to complete after timeout');
          setLoadingProgress(98); // Force to completion
        }
      }, maxLoadingTime);
      
      // Maximum of 5 reversals per loading phase
      const maxReversals = 5;
      
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          // Reduce weird behavior in early game, increase in late game
          const progressStage = currentStep < 6 ? 'early' : currentStep < 12 ? 'mid' : 'late';
          
          // Different reverse progress chance based on game stage
          let reverseChance = 0.97; // 3% chance early game (increased from 1%)
          let specialStepCheck = false;
          
          // Prevent reversals near completion or if we've hit the max
          const isNearCompletion = prev >= 85;
          const canReverse = reversalCountRef.current < maxReversals && !isNearCompletion;
          
          if (progressStage === 'early' && canReverse) {
            reverseChance = 0.97; // 3% chance (increased from 1%)
            // Only at specific points with a high threshold
            const isReversePoint = (prev >= 40 && prev <= 43 && Math.random() > 0.85);
            if (isReversePoint && !isReversingProgress && Math.random() > reverseChance) {
              setIsReversingProgress(true);
              reversalCountRef.current += 1;
              console.log(`Reversal #${reversalCountRef.current} of ${maxReversals}`);
              setTimeout(() => {
                setIsReversingProgress(false);
              }, 500);
            }
          } else if (progressStage === 'mid' && canReverse) {
            reverseChance = 0.93; // 7% chance (increased from 5%)
            const isSpecialStep = currentStep === 7 || currentStep === 9;
            const isReversePoint = 
              (prev >= 35 && prev <= 45 && Math.random() > 0.7) || 
              (prev >= 65 && prev <= 75 && isSpecialStep && Math.random() > 0.8);
            
            if (isReversePoint && !isReversingProgress && Math.random() > reverseChance) {
              setIsReversingProgress(true);
              reversalCountRef.current += 1;
              console.log(`Reversal #${reversalCountRef.current} of ${maxReversals}`);
              setTimeout(() => {
                setIsReversingProgress(false);
              }, 1000);
            }
          } else if (progressStage === 'late' && canReverse) { // late game
            reverseChance = 0.85; // 15% chance (increased from 10%)
            const isSpecialStep = currentStep === 15 || currentStep === 17 || currentStep === 19;
            const isReversePoint = 
              (prev >= 35 && prev <= 46 && Math.random() > 0.6) || 
              (prev >= 65 && prev <= 78 && Math.random() > 0.7) ||
              (prev >= 50 && prev <= 60 && isSpecialStep); 
            
            if (isReversePoint && !isReversingProgress && Math.random() > reverseChance) {
              setIsReversingProgress(true);
              reversalCountRef.current += 1;
              console.log(`Reversal #${reversalCountRef.current} of ${maxReversals}`);
              setTimeout(() => {
                setIsReversingProgress(false);
              }, 2000);
            }
          }
          
          // If we're reversing, go backwards with steeper drop
          if (isReversingProgress) {
            // More dramatic drop based on game stage
            const dropRate = progressStage === 'early' ? 1.2 : 
                           progressStage === 'mid' ? 2.0 : 3.0;
            return Math.max(prev - dropRate, progressStage === 'early' ? 38 : 32);
          }
          
          // Otherwise normal progress, slowing down at certain points
          if (prev >= 75 && prev < 95) {
            return prev + 0.5;
          } else {
            let nextProgress = prev + 2;
            
            // Cap at 100% in early game, allow exceeding only in mid and late game
            if (progressStage === 'early') {
              return Math.min(nextProgress, 100);
            } else if (progressStage === 'mid') {
              // Mid game: occasionally allow exceeding 100%, but not by much
              const maxProgress = Math.random() < 0.8 ? 100 : 102;
              return Math.min(nextProgress, maxProgress);
            } else {
              // Late game: more frequently allow exceeding 100%, by more
              const maxProgress = Math.random() < 0.5 ? 100 : 100 + (Math.random() * 5);
              return Math.min(nextProgress, maxProgress);
            }
          }
        });
        
        // Complete this loading step
        if (loadingProgress >= 97) {
          clearInterval(interval);
          
          // Move to next step after a short delay
          setTimeout(() => {
            // Proceed to next step
            let nextStep = currentStep + 1;
            
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
            
            // Check if the next step is a duplicate configuration
            // Skip steps that are already completed to avoid repeats
            while (completedSteps.has(nextStep) && nextStep < gameSteps.length - 3) {
              console.log(`Skipping step ${nextStep} as it's already been completed`);
              nextStep++;
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
      
      return () => {
        clearInterval(interval);
        clearTimeout(forceCompleteTimeout);
      };
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

  // Make confirmation dialogs gradually more frequent based on game progress
  const getConfirmationChance = (baseChance, currentIndex, maxIndex, increment) => {
    // Calculate game progress as a percentage
    const gameProgress = currentStep / 20; // Assuming about 20 steps total
    
    // Reduce chance early, standard in middle, increase late
    let adjustedBaseChance;
    if (gameProgress < 0.3) { // First third
      adjustedBaseChance = baseChance * 0.6; // 60% of normal chance, up from 40%
    } else if (gameProgress < 0.6) { // Middle third
      adjustedBaseChance = baseChance; // 100% of normal chance, up from 80%
    } else { // Final third
      adjustedBaseChance = baseChance * 1.5; // 150% of normal chance, up from 120%
    }
    
    return adjustedBaseChance + (Math.min(currentIndex, maxIndex) * increment);
  };

  const handleAnswer = (answerIndex) => {
    // Force confirmations at specific points for consistency
    const forceConfirmationPoints = [0, 3]; // First and fourth questions always have confirmations
    const shouldForceConfirmation = forceConfirmationPoints.includes(questionIndex);
    
    // Random chance to show confirmation, with progressive increase
    const baseChance = 0.4; // 40% base chance, up from 30%
    const randomChance = getConfirmationChance(baseChance, questionIndex, 5, 0.08);
    
    if (shouldForceConfirmation || Math.random() < randomChance) {
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
    // Force confirmations at key steps
    const forceConfigSteps = [1, 5, 7, 13, 17, 21]; // Steps where we always want configuration confirmations
    const shouldForceConfirmation = forceConfigSteps.includes(currentStep);
    
    // Check if we should show a confirmation for this configuration step
    // With progressive chance increase
    const baseChance = 0.5; // 50% base chance, up from 30%
    const randomChance = getConfirmationChance(baseChance, currentStep, 20, 0.02);
    
    if (shouldForceConfirmation || configComments[currentStep] || Math.random() < randomChance) {
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
    // Always show confirmation for consent steps after the first one
    const shouldForceConfirmation = currentStep > 4;
    
    // Random chance to show confirmation, with progressive increase
    const baseChance = 0.6; // 60% base chance, up from 50%
    const randomChance = getConfirmationChance(baseChance, currentStep, 10, 0.02);
    
    if (shouldForceConfirmation || Math.random() < randomChance) {
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
    // Force confirmations at later steps for alerts
    const forceAlertSteps = [10, 15, 20]; // Steps with important alert confirmations
    const shouldForceConfirmation = forceAlertSteps.includes(currentStep);
    
    // Check if we should show a confirmation for this alert step
    // With progressive chance increase
    const baseChance = 0.5; // 50% base chance, up from 40%
    const randomChance = getConfirmationChance(baseChance, currentStep, 15, 0.03);
    
    if (shouldForceConfirmation || alertComments[currentStep] || Math.random() < randomChance) {
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

  // Development shortcut handlers
  const handleJumpToError = () => {
    console.log('Dev shortcut: Jumping to Error screen');
    
    // Set player name if not already set
    if (!playerName) setPlayerName('DevUser');
    
    // Set error type randomly
    setErrorType(Math.floor(Math.random() * 5));
    setGameState('error');
    advanceStepCount();
  };
  
  const handleJumpToFinale = () => {
    console.log('Dev shortcut: Jumping to Finale screen');
    
    // Set player name if not already set
    if (!playerName) setPlayerName('DevUser');
    
    setGameState('finale');
    advanceStepCount();
  };
  
  const handleJumpToReveal = () => {
    console.log('Dev shortcut: Jumping to Reveal screen');
    
    // Set player name if not already set
    if (!playerName) setPlayerName('DevUser');
    
    setGameState('reveal');
  };

  // Handler for jumping to Joel detection screen
  const handleJumpToJoel = () => {
    // Clear necessary states first
    setShowConfirmation(false);
    setShowConfigConfirmation(false);
    setShowConsentConfirmation(false);
    setShowAlertConfirmation(false);
    
    // Set to Joel detection screen
    setGameState('joel-detection');
  };

  // Handler for jumping to payment confirmation screen
  const handleJumpToPayment = () => {
    // Clear necessary states first
    setShowConfirmation(false);
    setShowConfigConfirmation(false);
    setShowConsentConfirmation(false);
    setShowAlertConfirmation(false);
    
    // Set to payment confirmation screen
    setGameState('payment-confirmation');
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
    // After Joel response, return to normal game flow
    setCurrentStep(currentStep + 1);
    setLoadingProgress(0);
    setGameState('loading');
    advanceStepCount();
  };

  // Handler for the payment confirmation screen
  const handlePaymentConfirmation = () => {
    // Move to the next step in the game
    setCurrentStep(currentStep + 1);
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
      // Stage 4+: Get weird, but gradually based on game progress
      const gameProgress = currentStep / 20; // Assuming about 20 steps total
      
      if (gameProgress < 0.6) {
        // Before final third, keep somewhat reasonable
        newStepCount.main = 2;
        
        // Just add sequential sub-steps
        if (!newStepCount.sub || Math.random() < 0.8) {
          newStepCount.sub = newStepCount.sub ? newStepCount.sub + 1 : 3; // Move to 2.3, 2.4, etc.
        } else {
          if (!newStepCount.subsub) {
            newStepCount.subsub = 1;
          } else {
            newStepCount.subsub++;
          }
        }
        
        // Small chance of weird numbering system
        if (Math.random() < 0.2) {
          const systems = ['numeric', 0, 1];  // Limited options
          newStepCount.type = systems[Math.floor(Math.random() * systems.length)];
        }
      } else {
        // In final third, get fully weird
        if (Math.random() < 0.7) {
          // 70% chance: increment existing step in strange ways
          newStepCount.main = 2;
          
          // Add or advance sub-steps in unpredictable ways
          if (!newStepCount.sub || Math.random() < 0.5) {
            newStepCount.sub = newStepCount.sub ? newStepCount.sub + Math.floor(Math.random() * 3) + 1 : 3; // Skip to 2.3 after 2.2, maybe jump ahead more
          } else {
            if (!newStepCount.subsub) {
              newStepCount.subsub = 1;
            } else {
              newStepCount.subsub += Math.floor(Math.random() * 3) + 1;
            }
          }
          
          // Higher chance of weird numbering systems
          if (Math.random() < 0.4) {
            const systems = ['numeric', 0, 1, 2, 3, 4];
            newStepCount.type = systems[Math.floor(Math.random() * systems.length)];
          }
        } else {
          // 30% chance: completely weird format
          newStepCount.main = 2;
          newStepCount.sub = Math.floor(Math.random() * 9) + 3; // 2.3 through 2.11
          newStepCount.subsub = Math.random() < 0.5 ? Math.floor(Math.random() * 5) + 1 : null;
          
          // Use a random numbering system
          const systems = ['numeric', 0, 1, 2, 3, 4];
          newStepCount.type = systems[Math.floor(Math.random() * systems.length)];
        }
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
      // Only use special formats in the later parts of the game
      const gameProgress = currentStep / 20;
      if (gameProgress < 0.5) {
        // First half: simple step numbering
        if (newStepCount.subsub) {
          newLabel = `Step ${newStepCount.main}.${newStepCount.sub}.${newStepCount.subsub} of 3`;
        } else if (newStepCount.sub) {
          newLabel = `Step ${newStepCount.main}.${newStepCount.sub} of 3`;
        } else {
          newLabel = `Step ${newStepCount.main} of 3`;
        }
      } else {
        // Second half: use the full range of weird formats
        newLabel = getStepLabel(newStepCount);
      }
    }
    
    setCurrentStepLabel(newLabel);
  };

  // Initialize the step label when the component first loads
  useEffect(() => {
    // Set initial step label
    setCurrentStepLabel("Step 1 of 3");
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <div className="container mx-auto px-4 py-4">
        {/* Title screen doesn't need the header */}
        {gameState === 'title' ? (
          <TitleScreen onStartGame={handleStartGame} />
        ) : (
          <>
            <GameHeader />
            <div className="py-2">
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
              
              {gameState === 'payment-confirmation' && (
                <PaymentConfirmationScreen 
                  playerName={playerName}
                  onProceed={handlePaymentConfirmation}
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
          </>
        )}
      </div>
      
      {/* Small floating button when dev tools are hidden - only in development */}
      {!showDevTools && process.env.NODE_ENV === 'development' && (
        <button 
          onClick={() => setShowDevTools(true)}
          className="fixed bottom-4 right-4 bg-gray-800 border border-gray-600 text-sm text-gray-400 hover:text-white p-1 rounded shadow-lg opacity-50 hover:opacity-90 z-20"
          title="Show Dev Tools"
        >
          DEV
        </button>
      )}
      
      {/* Dev shortcuts at the bottom of the page - only in development */}
      {showDevTools && process.env.NODE_ENV === 'development' && (
        <div className="container mx-auto px-4 py-4 mt-4 border-t border-gray-700">
          <div className="bg-gray-800 border border-gray-600 text-sm text-white p-3 rounded shadow-lg w-full">
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-yellow-400">DEV SHORTCUTS</div>
              <button 
                onClick={() => setShowDevTools(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700"
              >
                Hide
              </button>
            </div>
            
            {/* Current game state info */}
            <div className="mb-3 text-xs border-b border-gray-600 pb-2">
              <div><span className="text-gray-400">State:</span> {gameState}</div>
              <div><span className="text-gray-400">Step:</span> {currentStep} of {gameSteps.length-1}</div>
              <div><span className="text-gray-400">Display:</span> {currentStepLabel}</div>
              {gameState === 'loading' && (
                <div><span className="text-gray-400">Loading:</span> {Math.round(loadingProgress)}%</div>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <button 
                onClick={handleJumpToError} 
                className="btn-danger px-3 py-2 font-medium rounded shadow-inner flex items-center justify-center"
              >
                Error Screen
              </button>
              <button 
                onClick={handleJumpToFinale} 
                className="btn-primary px-3 py-2 font-medium rounded shadow-inner flex items-center justify-center"
              >
                Finale Screen
              </button>
              <button 
                onClick={handleJumpToReveal} 
                className="btn-secondary px-3 py-2 font-medium rounded shadow-inner flex items-center justify-center"
              >
                Reveal Screen
              </button>
              <button 
                onClick={handleJumpToJoel} 
                className="bg-gray-900 hover:bg-gray-900 text-white px-3 py-2 font-medium rounded shadow-inner flex items-center justify-center"
              >
                Joel Screen
              </button>
              <button 
                onClick={handleJumpToPayment} 
                className="bg-gray-700 hover:bg-gray-700 text-white px-3 py-2 font-medium rounded shadow-inner flex items-center justify-center"
              >
                Payment Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App; 