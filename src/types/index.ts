export type Status = 'green' | 'amber' | 'red';

export interface Risk {
  t: string;
  p: 1 | 2 | 3;
  i: 1 | 2 | 3;
  mitig: string;
  owner: string;
}

export interface Scores {
  schedule: number;
  budget: number;
  physical: number;
  kpi: number;
  risk: number;
  report: number;
}

export interface HistoryEntry {
  d: string;
  t: string;
}

export interface Project {
  id: string;
  name: string;
  dir: string;
  owner: string;
  budget: number;
  deadline: string;
  progress: number;
  budgetUse: number;
  desc: string;
  scores: Scores;
  risks: Risk[];
  history: HistoryEntry[];
}
