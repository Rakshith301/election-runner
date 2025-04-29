
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  endDate: Date;
  options: Option[];
  status: 'active' | 'ended';
}

export interface Option {
  id: string;
  text: string;
  votes: number;
}

export interface Vote {
  userId: string;
  electionId: string;
  optionId: string;
  timestamp: Date;
}
