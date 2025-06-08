export namespace NStudentTrainingPage {
  export interface Props {}

  export interface Exercise {
    id: string;
    name: string;
    series: string;
    isSelected: boolean;
  }

  export interface WeekDay {
    id: number;
    name: string;
    isSelected: boolean;
  }

  export interface TrainingForm {
    name: string;
    selectedDays: number[];
    selectedExercises: string[];
  }
}
