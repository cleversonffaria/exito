import { useHome } from "./home.useCase";

export namespace NHomePage {
  export interface WeeklyData {
    day: string;
    value: number;
  }

  export interface WeeklyDataWithHeight extends WeeklyData {
    height: number;
  }

  export type UseHomeReturn = ReturnType<typeof useHome>;
}
