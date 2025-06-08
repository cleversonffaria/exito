export namespace NStudentDetailsPage {
  export interface Props {}

  export interface StudentDetails {
    id: string;
    name: string;
    email: string;
    phone: string;
    age: string;
    gender: "Masculino" | "Feminino" | "Outros";
    goal: string;
    startDate: string;
    avatar: string;
    trainings: Training[];
    role: "student" | "teacher";
  }

  export interface Exercise {
    exercise_id: number;
    sets: number;
    repetitions: number;
    load: string;
    rest: string;
    notes: string;
  }

  export interface Training {
    id: string;
    student_id: number;
    training_id: number;
    name: string;
    exercises: Exercise[];
    week_days: number[];
  }

  export interface TrainingWithDays extends Training {
    days: string;
  }

  export interface StudentDetailsWithFormattedTrainings
    extends Omit<StudentDetails, "trainings" | "role"> {
    trainings: TrainingWithDays[];
    role: string;
  }
}
