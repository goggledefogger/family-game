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
            
            // If we've gone through enough steps, show the error
            if (nextStep >= gameSteps.length - 3) {
              setErrorType(Math.floor(Math.random() * 5));
              setGameState('error');
              return;
            }
            
            // Otherwise proceed to the next step
            setCurrentStep(nextStep);
            setLoadingProgress(0);
            
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
          }, 1000);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [gameState, loadingProgress, currentStep, isReversingProgress]);

  const handleStartGame = () => {
    setGameState('registration');
  };

  const handleSubmitRegistration = () => {
    if (playerName.trim() === '') return;
    setCurrentStep(0);
    setGameState('loading');
    setLoadingProgress(0);
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
    
    // Move to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setLoadingProgress(0);
    
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
    
    // Proceed to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setLoadingProgress(0);
    
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
    // Move to next step
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setLoadingProgress(0);
    
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
    // Reset to a random place in the sequence
    const randomStep = Math.floor(Math.random() * (gameSteps.length - 8)) + 4;
    setCurrentStep(randomStep);
    setGameState('loading');
    setLoadingProgress(0);
  };
  
  const handleButtonHover = (index) => {
    // Always move the button on hover (removed random check)
    setMovingButtonIndex(index);
    
    // Reset after a short delay
    setTimeout(() => {
      setMovingButtonIndex(null);
    }, 500); // Shortened time to make it more responsive
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
  };

  const handleChangeAnswer = () => {
    setShowConfirmation(false);
    setSelectedAnswerIndex(null);
  };

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
          />
        )}
        
        {gameState === 'loading' && loadingScreenType === 'binary' && (
          <BinaryLoadingScreen
            stepMessage={stepMessage}
            loadingProgress={loadingProgress}
            onComplete={() => {}} // This is handled by the main useEffect interval
          />
        )}
        
        {gameState === 'loading' && loadingScreenType === 'crash' && (
          <CrashingScreen
            stepMessage={stepMessage}
            loadingProgress={loadingProgress}
            onComplete={() => {}} // This is handled by the main useEffect interval
          />
        )}
        
        {gameState === 'loading' && loadingScreenType === 'corrupted' && (
          <CorruptedDataScreen
            stepMessage={stepMessage}
            loadingProgress={loadingProgress}
            onComplete={() => {}} // This is handled by the main useEffect interval
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
          />
        )}
        
        {gameState === 'consent' && (
          <ConsentScreen 
            onConsent={handleConsent}
            showConsentConfirmation={showConsentConfirmation}
            onConfirmConsent={confirmConsent}
            onChangeConsent={changeConsent}
          />
        )}
        
        {gameState === 'alert' && (
          <AlertScreen 
            currentStep={currentStep} 
            onAlert={handleAlert}
            showAlertConfirmation={showAlertConfirmation}
            onConfirmAlert={confirmAlert}
            onChangeAlert={changeAlert}
          />
        )}
        
        {gameState === 'error' && (
          <ErrorScreen 
            errorType={errorType} 
            updateCount={updateCount} 
            onErrorAction={handleErrorAction} 
            handleButtonHover={handleButtonHover} 
            movingButtonIndex={movingButtonIndex} 
          />
        )}
        
        {gameState === 'finale' && (
          <GrandFinaleScreen 
            playerName={playerName}
            onComplete={handleFinaleComplete}
          />
        )}
        
        {gameState === 'reveal' && (
          <RevealScreen 
            playerName={playerName} 
            onStartOver={handleStartOver} 
          />
        )}
      </div>
    </div>
  );
};

export default App; 