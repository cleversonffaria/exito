export namespace NRegisterTrainingPage {
  export type FormData = {
    exercise: {
      name: string;
      category: string;
    };
    series: string;
    repetitions: string;
    load: string;
    restTime: string;
    observations: string;
  };
}
