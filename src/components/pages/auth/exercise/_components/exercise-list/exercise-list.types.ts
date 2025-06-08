import { NExerciseTrainingPage } from "../../exercise.types";

export namespace NExerciseList {
  export interface Props {
    loading: boolean;
    exercises: NExerciseTrainingPage.Option[];
    searchQuery: string;
    onExercisePress: (exercise: NExerciseTrainingPage.Option) => void;
  }
}
