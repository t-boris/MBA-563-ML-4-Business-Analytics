import React, { useState, useMemo } from 'react';
import { KEY_CONCEPTS, MOCK_DATA, WORKFLOW_STEPS } from './constants';
import { TaskType, PreprocessingSteps, DataRow } from './types';
import ConceptCard from './components/ConceptCard';
import DataTable from './components/DataTable';
import { CheckCircleIcon } from './components/Icons';

const App: React.FC = () => {
  const [task, setTask] = useState<TaskType | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [preprocessing, setPreprocessing] = useState<PreprocessingSteps>({
    reduceCardinality: false,
    oneHotEncode: false,
    standardize: false,
    trainTestSplit: 70,
  });
  const [modelTrained, setModelTrained] = useState(false);

  const resetWorkflow = () => {
    setTask(null);
    setCurrentStep(0);
    setModelTrained(false);
    setPreprocessing({
        reduceCardinality: false,
        oneHotEncode: false,
        standardize: false,
        trainTestSplit: 70,
    });
  };

  const startWorkflow = (selectedTask: TaskType) => {
      setTask(selectedTask);
      setCurrentStep(1);
  };

  const processedData = useMemo(() => {
    let data: (DataRow | Record<string, any>)[] = JSON.parse(JSON.stringify(MOCK_DATA));

    if (preprocessing.reduceCardinality) {
        const categoryCounts = data.reduce((acc, row) => {
            acc[row.parent_name] = (acc[row.parent_name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const rareCategories = Object.keys(categoryCounts).filter(cat => categoryCounts[cat] < 2);
        data = data.map(row => rareCategories.includes(row.parent_name) ? { ...row, parent_name: 'Other' } : row);
    }
    
    if (preprocessing.oneHotEncode) {
      const locations = [...new Set(data.map(r => r.location))];
      data = data.map(row => {
        const newRow: Record<string, any> = { ...row };
        delete newRow.location;
        locations.forEach(loc => {
            newRow[`location_${loc.replace(' ', '_')}`] = row.location === loc ? 1 : 0;
        });
        return newRow;
      });
    }

    if (preprocessing.standardize) {
      const numericCols = ['cost', 'units_sold'];
      numericCols.forEach(col => {
          const values = data.map(r => r[col]);
          const mean = values.reduce((a, b) => a + b, 0) / values.length;
          const std = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / values.length);
          data = data.map(row => ({ ...row, [col]: (row[col] - mean) / std }));
      });
    }

    return data;
  }, [preprocessing]);
  
  const dataTableHeaders = useMemo(() => {
      if (processedData.length === 0) return [];
      const headers = Object.keys(processedData[0]);
      if (task === TaskType.CLASSIFICATION) return headers.filter(h => h !== 'gross_profit');
      if (task === TaskType.REGRESSION) return headers.filter(h => h !== 'margin_above_median');
      if (task === TaskType.CLUSTERING) return headers.filter(h => !['gross_profit', 'margin_above_median', 'parent_name'].includes(h));
      return headers;
  }, [processedData, task]);

  const dataTableRows = useMemo(() => {
    return processedData.map(row => dataTableHeaders.map(header => row[header]));
  }, [processedData, dataTableHeaders]);


  const renderEvaluation = () => {
      switch (task) {
          case TaskType.CLASSIFICATION:
              return (
                  <div>
                      <h4 className="font-bold text-lg mb-2">Classification Metrics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-brand-gray-dark p-4 rounded-lg">
                              <div className="text-3xl font-bold text-green-400">83.3%</div>
                              <div className="text-sm text-brand-gray">Accuracy</div>
                          </div>
                          <div className="bg-brand-gray-dark p-4 rounded-lg">
                              <h5 className="font-bold mb-2">Confusion Matrix</h5>
                              <div className="grid grid-cols-2 gap-1 text-center text-xs">
                                  <div className="p-2 bg-green-800/50 rounded">TN: 1</div>
                                  <div className="p-2 bg-red-800/50 rounded">FP: 0</div>
                                  <div className="p-2 bg-red-800/50 rounded">FN: 1</div>
                                  <div className="p-2 bg-green-800/50 rounded">TP: 4</div>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case TaskType.REGRESSION:
               return (
                  <div>
                      <h4 className="font-bold text-lg mb-2">Regression Metrics</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-brand-gray-dark p-4 rounded-lg">
                              <div className="text-3xl font-bold text-green-400">12.34</div>
                              <div className="text-sm text-brand-gray">RMSE (Root Mean Squared Error)</div>
                          </div>
                           <div className="bg-brand-gray-dark p-4 rounded-lg">
                              <div className="text-3xl font-bold text-green-400">0.88</div>
                              <div className="text-sm text-brand-gray">R-squared (R²)</div>
                          </div>
                      </div>
                  </div>
              );
          case TaskType.CLUSTERING:
              return (
                 <div>
                    <h4 className="font-bold text-lg mb-2">Clustering Results (k=3)</h4>
                    <p className="text-sm text-brand-gray mb-4">Locations have been grouped into 3 clusters based on their features.</p>
                     <div className="flex space-x-4">
                        <div className="p-4 rounded-lg bg-red-900/50 flex-1">Cluster 1: New York, Boston</div>
                        <div className="p-4 rounded-lg bg-blue-900/50 flex-1">Cluster 2: Chicago</div>
                        <div className="p-4 rounded-lg bg-yellow-900/50 flex-1">Cluster 3: San Francisco, Miami</div>
                    </div>
                </div>
              );
          default: return null;
      }
  };

  const renderPrediction = () => {
    switch (task) {
      case TaskType.CLASSIFICATION:
        return (
          <div className="bg-brand-gray-dark p-4 rounded-lg">
            <p>Predict if a new transaction will have a margin above median:</p>
            <div className="mt-4 p-4 bg-brand-gray-darker rounded-lg">
              <span className="font-mono text-sm">cost: 80, location: 'New York', ...</span>
              <span className="text-2xl font-bold text-green-400 block mt-2">→ Prediction: 1 (Above Median)</span>
            </div>
          </div>
        );
      case TaskType.REGRESSION:
        return (
          <div className="bg-brand-gray-dark p-4 rounded-lg">
            <p>Predict the gross profit for a new transaction:</p>
            <div className="mt-4 p-4 bg-brand-gray-darker rounded-lg">
              <span className="font-mono text-sm">cost: 150, location: 'Chicago', ...</span>
              <span className="text-2xl font-bold text-green-400 block mt-2">→ Predicted Gross Profit: $68.50</span>
            </div>
          </div>
        );
      case TaskType.CLUSTERING:
        return (
          <div className="bg-brand-gray-dark p-4 rounded-lg">
            <p>Assign a new location to a cluster:</p>
             <div className="mt-4 p-4 bg-brand-gray-darker rounded-lg">
              <span className="font-mono text-sm">cost: 95, units_sold: 18, ...</span>
              <span className="text-2xl font-bold text-blue-400 block mt-2">→ Belongs to Cluster 2</span>
            </div>
          </div>
        );
      default: return null;
    }
  };
  
  const ProgressBar = ({ currentStep }: { currentStep: number }) => (
    <div className="w-full px-4 sm:px-0">
        <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-brand-gray-dark" aria-hidden="true"></div>
            <div 
                className="absolute top-1/2 left-0 h-0.5 bg-brand-blue transition-all duration-500" 
                style={{ width: `${(currentStep / (WORKFLOW_STEPS.length -1)) * 100}%` }}
            ></div>
            <ul className="relative flex justify-between w-full">
                {WORKFLOW_STEPS.map((step, index) => (
                    <li key={step.title} className="text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-colors duration-500 ${currentStep >= index ? 'bg-brand-blue' : 'bg-brand-gray-dark'}`}>
                           {currentStep > index ? <CheckCircleIcon className="w-5 h-5 text-white"/> : <span className="text-xs font-bold">{index + 1}</span>}
                        </div>
                        <span className={`text-xs mt-2 block ${currentStep >= index ? 'text-white' : 'text-brand-gray'}`}>{step.title}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

  return (
    <div className="min-h-screen bg-brand-gray-darkest">
      <header className="bg-brand-gray-darker/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-white">Machine Learning for Business Analytics</h1>
          <p className="text-brand-blue-light">Module 1: Introduction to the ML Workflow</p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section id="concepts" className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-6">Key Concepts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KEY_CONCEPTS.map(concept => <ConceptCard key={concept.term} concept={concept} />)}
          </div>
        </section>

        <section id="workflow-demo">
          <h2 className="text-2xl font-semibold text-white mb-2">Interactive ML Workflow Simulator</h2>
          <p className="text-brand-gray mb-8">Experience the step-by-step process of building a machine learning model.</p>
          
          <div className="bg-brand-gray-darker p-6 sm:p-8 rounded-xl shadow-2xl">
              {!task && (
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Step 1: Choose a Business Problem</h3>
                  <p className="text-brand-gray mb-6">What do you want to achieve with your data?</p>
                  <div className="flex flex-col md:flex-row justify-center gap-4">
                      <button onClick={() => startWorkflow(TaskType.CLASSIFICATION)} className="bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">Predict High-Margin Sales (Classification)</button>
                      <button onClick={() => startWorkflow(TaskType.REGRESSION)} className="bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">Forecast Gross Profit (Regression)</button>
                      <button onClick={() => startWorkflow(TaskType.CLUSTERING)} className="bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">Group Similar Locations (Clustering)</button>
                  </div>
                </div>
              )}

              {task && (
                <div>
                  <div className="mb-8">
                    <ProgressBar currentStep={currentStep}/>
                  </div>
                  
                  {/* Step 2: Preprocessing */}
                  {currentStep === 1 && (
                    <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-2">Step 2: Preprocess Data for <span className="text-brand-blue-light">{task}</span></h3>
                      <p className="text-brand-gray mb-6">Transform raw data into a format suitable for machine learning. Try toggling the options below and see how the data table changes.</p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                        <div className="bg-brand-gray-dark p-4 rounded-lg">
                           <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={preprocessing.reduceCardinality} onChange={e => setPreprocessing(p => ({...p, reduceCardinality: e.target.checked}))} className="form-checkbox h-5 w-5 text-brand-blue bg-gray-800 border-gray-600 rounded focus:ring-brand-blue"/>
                                <span>Reduce Cardinality</span>
                           </label>
                           <p className="text-xs text-brand-gray mt-2">Group rare product categories into "Other" to reduce noise.</p>
                        </div>
                        <div className="bg-brand-gray-dark p-4 rounded-lg">
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={preprocessing.oneHotEncode} onChange={e => setPreprocessing(p => ({...p, oneHotEncode: e.target.checked}))} className="form-checkbox h-5 w-5 text-brand-blue bg-gray-800 border-gray-600 rounded focus:ring-brand-blue"/>
                                <span>One-Hot Encode</span>
                           </label>
                            <p className="text-xs text-brand-gray mt-2">Convert the 'location' column into numerical format.</p>
                        </div>
                         <div className="bg-brand-gray-dark p-4 rounded-lg">
                             <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" checked={preprocessing.standardize} onChange={e => setPreprocessing(p => ({...p, standardize: e.target.checked}))} className="form-checkbox h-5 w-5 text-brand-blue bg-gray-800 border-gray-600 rounded focus:ring-brand-blue"/>
                                <span>Standardize Numerics</span>
                           </label>
                            <p className="text-xs text-brand-gray mt-2">Scale numerical features to have a mean of 0 and a standard deviation of 1.</p>
                        </div>
                         <div className="bg-brand-gray-dark p-4 rounded-lg">
                             <label htmlFor="splitRange" className="block mb-2 text-sm font-medium">Train/Test Split: {preprocessing.trainTestSplit}%</label>
                            <input id="splitRange" type="range" min="10" max="90" value={preprocessing.trainTestSplit} onChange={e => setPreprocessing(p => ({...p, trainTestSplit: parseInt(e.target.value)}))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"/>
                             <p className="text-xs text-brand-gray mt-2">Blue rows are for training, green for testing.</p>
                        </div>
                      </div>
                      
                      <DataTable headers={dataTableHeaders} rows={dataTableRows} trainTestSplitRatio={preprocessing.trainTestSplit} />
                      <button onClick={() => setCurrentStep(2)} className="mt-6 bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-2 px-4 rounded-lg transition-colors">Next: Train Model</button>
                    </div>
                  )}

                  {/* Step 3: Train */}
                  {currentStep === 2 && (
                    <div className="text-center animate-fade-in">
                      <h3 className="text-xl font-bold mb-2">Step 3: Train Model</h3>
                      <p className="text-brand-gray mb-6">The algorithm is now learning patterns from the preprocessed training data.</p>
                      <div className="w-full bg-brand-gray-dark rounded-full h-2.5 mb-4">
                        <div className="bg-brand-blue h-2.5 rounded-full animate-pulse" style={{width: '100%'}}></div>
                      </div>
                      {!modelTrained && <p>Training in progress...</p>}
                      {setTimeout(() => setModelTrained(true), 1500) && modelTrained && (
                        <div>
                            <p className="text-green-400 font-bold mb-6">Model training complete!</p>
                             <button onClick={() => setCurrentStep(3)} className="bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-2 px-4 rounded-lg transition-colors">Next: Evaluate Model</button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 4: Evaluate */}
                  {currentStep === 3 && (
                    <div className="animate-fade-in">
                      <h3 className="text-xl font-bold mb-2">Step 4: Evaluate Model</h3>
                      <p className="text-brand-gray mb-6">We test the model on the unseen test data (the green rows) to see how well it performs.</p>
                      {renderEvaluation()}
                       <button onClick={() => setCurrentStep(4)} className="mt-6 bg-brand-blue hover:bg-brand-blue/80 text-white font-bold py-2 px-4 rounded-lg transition-colors">Next: Make Predictions</button>
                    </div>
                  )}

                  {/* Step 5: Predict */}
                  {currentStep === 4 && (
                      <div className="animate-fade-in">
                          <h3 className="text-xl font-bold mb-2">Step 5: Make Predictions</h3>
                           <p className="text-brand-gray mb-6">Now we can use our trained model to make predictions on new, unseen data points.</p>
                          {renderPrediction()}
                          <button onClick={resetWorkflow} className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Start Over</button>
                      </div>
                  )}

                </div>
              )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;