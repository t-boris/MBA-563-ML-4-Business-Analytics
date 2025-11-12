
import { Concept, DataRow, Analogy } from './types';

export const KEY_CONCEPTS: Concept[] = [
  {
    term: 'Algorithm vs. Model',
    definition: 'An algorithm is the procedure, while a model is the output of running the algorithm on data. It contains the learned patterns.',
    analogy: 'Algorithm = Recipe. Model = The finished cake.',
    icon: 'algorithm'
  },
  {
    term: 'Machine Learning vs. Statistics',
    definition: 'ML often prioritizes predictive accuracy, while statistics often focuses on inference and understanding relationships.',
    analogy: 'ML = "Can we predict it?". Statistics = "Why does it happen?".',
    icon: 'ml'
  },
  {
    term: 'Supervised vs. Unsupervised Learning',
    definition: 'Supervised learning uses labeled data (with a known target) to make predictions. Unsupervised learning finds patterns in unlabeled data.',
    analogy: 'Supervised = Learning with an answer key. Unsupervised = Finding groups without labels.',
    icon: 'supervised'
  },
  {
    term: 'Train/Test Split',
    definition: 'The practice of splitting data into a training set to build the model and a test set to evaluate its performance on unseen data.',
    analogy: 'Like studying for an exam (training) and then taking the exam (testing).',
    icon: 'split'
  },
];

export const MOCK_DATA: DataRow[] = [
  { id: 1, location: 'New York', parent_name: 'Electronics', cost: 120.50, units_sold: 10, gross_profit: 79.50, margin_above_median: 1 },
  { id: 2, location: 'Chicago', parent_name: 'Groceries', cost: 35.10, units_sold: 50, gross_profit: 15.40, margin_above_median: 0 },
  { id: 3, location: 'San Francisco', parent_name: 'Apparel', cost: 75.00, units_sold: 15, gross_profit: 45.00, margin_above_median: 1 },
  { id: 4, location: 'New York', parent_name: 'Home Goods', cost: 210.00, units_sold: 5, gross_profit: 90.00, margin_above_median: 1 },
  { id: 5, location: 'Chicago', parent_name: 'Electronics', cost: 85.75, units_sold: 20, gross_profit: 44.25, margin_above_median: 1 },
  { id: 6, location: 'Miami', parent_name: 'Groceries', cost: 42.80, units_sold: 40, gross_profit: 18.20, margin_above_median: 0 },
  { id: 7, location: 'Boston', parent_name: 'Books', cost: 15.99, units_sold: 30, gross_profit: 9.01, margin_above_median: 0 },
  { id: 8, location: 'San Francisco', parent_name: 'Electronics', cost: 150.25, units_sold: 8, gross_profit: 69.75, margin_above_median: 1 },
  { id: 9, location: 'New York', parent_name: 'Apparel', cost: 55.50, units_sold: 25, gross_profit: 34.50, margin_above_median: 1 },
  { id: 10, location: 'Miami', parent_name: 'Toys', cost: 25.00, units_sold: 60, gross_profit: 15.00, margin_above_median: 0 },
  { id: 11, location: 'Boston', parent_name: 'Tools', cost: 65.00, units_sold: 12, gross_profit: 25.00, margin_above_median: 0 },
  { id: 12, location: 'Chicago', parent_name: 'Home Goods', cost: 180.00, units_sold: 7, gross_profit: 80.00, margin_above_median: 1 },
];

export const WORKFLOW_STEPS = [
    { title: 'Choose Business Problem', description: 'Define what you want to predict or discover.' },
    { title: 'Preprocess Data', description: 'Clean, transform, and prepare data for the algorithm.' },
    { title: 'Train Model', description: 'Fit the algorithm to the prepared training data.' },
    { title: 'Evaluate Model', description: 'Assess the model\'s performance on unseen test data.' },
    { title: 'Make Predictions', description: 'Use the trained model on new data to get insights.' },
];

// FIX: Add ANALOGIES constant for the quiz component.
export const ANALOGIES: Analogy[] = [
  {
    pair: ['Recipe', 'Cake'],
    correctMapping: { 'Recipe': 'Algorithm', 'Cake': 'Model' },
    explanation: 'A recipe (algorithm) provides the step-by-step instructions, while the finished cake (model) is the result of following those instructions with specific ingredients (data).'
  },
  {
    pair: ['Blueprint', 'House'],
    correctMapping: { 'Blueprint': 'Algorithm', 'House': 'Model' },
    explanation: 'The blueprint (algorithm) is the design and plan, whereas the actual house (model) is the structure built from that plan using materials (data).'
  },
  {
    pair: ['Training Regimen', "Athlete's Skill"],
    correctMapping: { 'Training Regimen': 'Algorithm', "Athlete's Skill": 'Model' },
    explanation: 'A training regimen (algorithm) is the process of exercises and drills. The athlete\'s learned skill (model) is the outcome of that training.'
  }
];
