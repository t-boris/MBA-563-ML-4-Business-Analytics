
export interface Concept {
  term: string;
  definition: string;
  analogy: string;
  icon: 'algorithm' | 'model' | 'ml' | 'stats' | 'supervised' | 'unsupervised' | 'split' | 'sklearn';
}

export enum TaskType {
  CLASSIFICATION = 'Classification',
  REGRESSION = 'Regression',
  CLUSTERING = 'Clustering',
}

export interface DataRow {
  id: number;
  location: 'New York' | 'Chicago' | 'San Francisco' | 'Boston' | 'Miami';
  parent_name: 'Electronics' | 'Groceries' | 'Apparel' | 'Home Goods' | 'Toys' | 'Books' | 'Tools' | 'Jewelry';
  cost: number;
  units_sold: number;
  gross_profit: number;
  margin_above_median: 0 | 1;
}

export interface PreprocessingSteps {
  reduceCardinality: boolean;
  oneHotEncode: boolean;
  standardize: boolean;
  trainTestSplit: number;
}

// FIX: Add AnalogyOption and Analogy types for the quiz component.
export type AnalogyOption = 'Algorithm' | 'Model';

export interface Analogy {
  pair: [string, string];
  correctMapping: { [key: string]: AnalogyOption };
  explanation: string;
}
