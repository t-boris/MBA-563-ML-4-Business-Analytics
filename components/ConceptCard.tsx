
import React from 'react';
import { Concept } from '../types';
import { AlgorithmIcon, ModelIcon, MLIcon, StatsIcon, SupervisedIcon, UnsupervisedIcon, SplitIcon, SklearnIcon } from './Icons';

interface ConceptCardProps {
  concept: Concept;
}

const iconMap = {
    algorithm: <AlgorithmIcon />,
    model: <ModelIcon />,
    ml: <MLIcon />,
    stats: <StatsIcon />,
    supervised: <SupervisedIcon />,
    unsupervised: <UnsupervisedIcon />,
    split: <SplitIcon />,
    sklearn: <SklearnIcon />
};


const ConceptCard: React.FC<ConceptCardProps> = ({ concept }) => {
  return (
    <div className="bg-brand-gray-darker p-6 rounded-lg shadow-lg flex flex-col h-full transform hover:scale-105 transition-transform duration-300">
      <div className="flex-shrink-0">
        {iconMap[concept.icon]}
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-white mb-2">{concept.term}</h3>
        <p className="text-brand-gray mb-4 text-sm">{concept.definition}</p>
      </div>
      <div className="mt-auto">
        <p className="text-xs italic text-brand-blue-light bg-brand-gray-dark p-2 rounded">
          <strong>Analogy:</strong> {concept.analogy}
        </p>
      </div>
    </div>
  );
};

export default ConceptCard;
