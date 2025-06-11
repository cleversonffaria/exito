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
    id: string;
    exercise: {
      id: string;
      name: string;
      muscle_groups: string[];
      equipment: string;
    };
    sets: number;
    repetitions: number;
    load: number;
    rest: number;
    notes: string;
  }

  export interface Training {
    id: string;
    student_id: string;
    training_id: string;
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
    isDeleted?: boolean;
  }
}
