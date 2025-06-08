import { NExerciseTrainingPage } from "../../exercise.types";

export namespace NExerciseItem {
  export interface Props {
    exercise: NExerciseTrainingPage.Option;
    onPress: (exercise: NExerciseTrainingPage.Option) => void;
  }
}
