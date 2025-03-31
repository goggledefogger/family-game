import React, { useState } from 'react';
import { ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { funnyQuestions } from '../data/questions';
import { snarkyComments } from '../data/snarkyComments';
import { randomQuestionComments } from '../data/randomComments';

const QuestionScreen = ({ 
  playerName,
  questionIndex,
  onAnswer,
  showConfirmation,
  selectedAnswerIndex,
  onConfirmAnswer,
  onChangeAnswer,
  stepLabel
}) => {
  const question = funnyQuestions[questionIndex];
  const [randomComment] = useState(randomQuestionComments[Math.floor(Math.random() * randomQuestionComments.length)]);
  
  // Get a default name if none is provided
  const displayName = playerName?.trim() || 'User';
  
  // Function to get the appropriate comment
  const getComment = () => {
    let comment;
    if (snarkyComments[questionIndex] && snarkyComments[questionIndex][selectedAnswerIndex] !== undefined) {
      comment = snarkyComments[questionIndex][selectedAnswerIndex];
    } else {
      comment = randomComment;
    }
    
    // Replace placeholders with player name
    return comment?.replace(/you/g, displayName).replace(/You/g, displayName);
  };
  
  // Personalize question text
  const personalizedQuestion = question?.question?.includes('you')
    ? question.question.replace(/you/g, displayName).replace(/your/g, `${displayName}'s`)
    : question?.question;
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto screen-tilt">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400 float">Question {questionIndex + 1} of {funnyQuestions.length}</h2>
      
      <div className="w-full max-w-md mb-8 container-breathe">
        <p className="text-white text-lg mb-6 occasional-glitch" data-text={personalizedQuestion}>{personalizedQuestion}</p>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              className={`w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white flex items-center transition-colors ${index === 1 ? 'button-wobble' : ''}`}
              disabled={showConfirmation}
            >
              <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
              <span className={index === 2 ? 'text-glitch' : ''}>{option}</span>
              <ChevronRight size={16} className="ml-auto" />
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-6 slant-text">
        {stepLabel}
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirmation && selectedAnswerIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full shadow-xl subtle-rotate">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Are you sure, {displayName}?</h3>
            
            <p className="text-gray-300 mb-8 color-shift">
              {getComment()}
            </p>
            
            <div className="flex justify-between space-x-4">
              <button
                onClick={onChangeAnswer}
                className="btn-cancel py-3 px-6 rounded font-medium w-full"
              >
                Change Answer
              </button>
              <button
                onClick={onConfirmAnswer}
                className="btn-primary py-3 px-6 rounded w-full"
              >
                <span className="slant-text">I'm Sure</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionScreen; 