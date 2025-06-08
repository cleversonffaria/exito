import { FileUploadResult } from "@/hooks/useFileUpload";

export namespace NRegisterExercisePage {
  export type FormData = {
    name: string;
    description?: string;
    thumbnail: FileUploadResult | null;
    muscleGroups: string[];
    equipment: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    videoDemo: FileUploadResult | null;
  };
}
