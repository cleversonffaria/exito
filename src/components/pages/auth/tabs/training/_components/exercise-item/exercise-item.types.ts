import { NTrainingPage } from "../../training.types";

export namespace NExerciseItem {
  export interface Props {
    exercise: NTrainingPage.TrainingExercise;
    isCompleted: boolean;
    onPress?: () => void;
  }
}
