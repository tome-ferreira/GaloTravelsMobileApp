export interface Travel {
    id: string; 
    userId: string;
    createdAt: Date;
    name: string;
    description: string;
    startDate: Date;
    endDate?: Date | null; 
    startLocation: string;
    endLocation: string;
    peopleN: number;
    totalBudget: number; 
    isFav: boolean;
  }