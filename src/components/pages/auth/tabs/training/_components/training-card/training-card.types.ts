import { NTrainingPage } from "../../training.types";

export namespace NTrainingCard {
  export interface Props {
    training: NTrainingPage.Training;
    onExercisePress: (exercise: NTrainingPage.TrainingExercise) => void;
  }
}
