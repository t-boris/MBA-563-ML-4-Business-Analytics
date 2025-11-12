import React, { useState } from 'react';
import { ANALOGIES } from '../constants';
import { AnalogyOption } from '../types';

const AlgorithmModelQuiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, AnalogyOption | null>>({});
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

  const currentAnalogy = ANALOGIES[currentIndex];
  const [item1, item2] = currentAnalogy.pair;

  const handleSelection = (item: string, choice: AnalogyOption) => {
    if (feedback) return; // Don't allow changes after checking
    setSelections(prev => ({ ...prev, [item]: choice }));
  };

  const checkAnswer = () => {
    if (selections[item1] && selections[item2]) {
      const isCorrect = selections[item1] === currentAnalogy.correctMapping[item1] &&
                        selections[item2] === currentAnalogy.correctMapping[item2];
      setFeedback({
        message: isCorrect ? 'Correct!' : 'Not quite, here is the explanation:',
        isCorrect: isCorrect,
      });
    }
  };

  const nextAnalogy = () => {
    setFeedback(null);
    setSelections({});
    setCurrentIndex((prevIndex) => (prevIndex + 1) % ANALOGIES.length);
  };

  const isCheckButtonDisabled = !selections[item1] || !selections[item2];

  return (
    <div className="bg-brand-gray-darker p-6 sm:p-8 rounded-xl shadow-2xl">
      <h3 className="text-xl font-bold text-center mb-4">Analogy {currentIndex + 1} of {ANALOGIES.length}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
        {currentAnalogy.pair.map(item => (
          <div key={item} className="bg-brand-gray-dark p-6 rounded-lg">
            <p className="text-2xl font-bold text-white mb-4">{item}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleSelection(item, 'Algorithm')}
                disabled={!!feedback}
                className={`w-full font-bold py-2 px-4 rounded-lg transition-all duration-200 ${
                  selections[item] === 'Algorithm'
                    ? 'bg-brand-blue text-white ring-2 ring-brand-blue-light'
                    : 'bg-brand-gray-darker hover:bg-brand-gray-darkest'
                } ${!!feedback ? 'cursor-not-allowed' : ''}`}
              >
                Algorithm
              </button>
              <button
                onClick={() => handleSelection(item, 'Model')}
                disabled={!!feedback}
                className={`w-full font-bold py-2 px-4 rounded-lg transition-all duration-200 ${
                  selections[item] === 'Model'
                    ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                    : 'bg-brand-gray-darker hover:bg-brand-gray-darkest'
                } ${!!feedback ? 'cursor-not-allowed' : ''}`}
              >
                Model
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        {!feedback ? (
          <button
            onClick={checkAnswer}
            disabled={isCheckButtonDisabled}
            className="bg-green-600 hover:bg-green-700 disabled:bg-brand-gray-dark disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Check Answer
          </button>
        ) : (
          <div className="animate-fade-in">
            <div className={`p-4 rounded-lg ${feedback.isCorrect ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
              <p className={`text-xl font-bold ${feedback.isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                {feedback.message}
              </p>
              <p className="text-brand-gray-light mt-2">{currentAnalogy.explanation}</p>
            </div>
            <button
              onClick={nextAnalogy}
              className="mt-4 bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Next Analogy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmModelQuiz;
