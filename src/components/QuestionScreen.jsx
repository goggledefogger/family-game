import React from 'react';
import { ChevronRight } from 'lucide-react';
import { funnyQuestions } from '../data/questions';
import { snarkyComments } from '../data/snarkyComments';

const QuestionScreen = ({ 
  questionIndex,
  onAnswer,
  showConfirmation,
  selectedAnswerIndex,
  onConfirmAnswer,
  onChangeAnswer
}) => {
  const question = funnyQuestions[questionIndex];
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Question {questionIndex + 1} of {funnyQuestions.length}</h2>
      
      <div className="w-full max-w-md mb-8">
        <p className="text-white text-lg mb-6">{question.question}</p>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              className="w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white flex items-center transition-colors"
              disabled={showConfirmation}
            >
              <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
              <ChevronRight size={16} className="ml-auto" />
            </button>
          ))}
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      {showConfirmation && selectedAnswerIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Are you sure?</h3>
            
            <p className="text-gray-300 mb-8">
              {snarkyComments[questionIndex][selectedAnswerIndex]}
            </p>
            
            <div className="flex justify-between space-x-4">
              <button
                onClick={onChangeAnswer}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded font-medium"
              >
                Change Answer
              </button>
              <button
                onClick={onConfirmAnswer}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded"
              >
                I'm Sure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionScreen; 