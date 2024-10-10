export interface Task {
    id: string;
    title: string;
    priority: number;
    estimatedTime: number;
    deadline?: Date;
    completed: boolean;
  }
  
  export interface UserPreferences {
    workHoursStart: number;
    workHoursEnd: number;
    breakDuration: number;
  }