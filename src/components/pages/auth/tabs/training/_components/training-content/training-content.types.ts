import { NTrainingPage } from "../../training.types";

export namespace NTrainingContent {
  export interface Props {
    trainings: NTrainingPage.Training[];
    isLoading: boolean;
    onExercisePress: (exercise: NTrainingPage.TrainingExercise) => void;
  }
}
