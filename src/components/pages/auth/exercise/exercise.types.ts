export namespace NExerciseTrainingPage {
  export interface Option {
    id: string;
    name: string;
    category: string;
    image?: string;
  }

  export interface Props {
    onSelectExercise: (exercise: Option) => void;
  }
}
