export interface CreateTravel {
    name: string;
    description: string;
    startDate: Date;
    endDate?: Date; 
    startLocation: string;
    endLocation: string;
    peopleN: number;
    totalBudget: number;
    isFav: boolean;
  }
  