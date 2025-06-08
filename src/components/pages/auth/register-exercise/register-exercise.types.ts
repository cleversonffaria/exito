import { FileUploadResult } from "@/hooks/useFileUpload";

export namespace NRegisterExercisePage {
  export type FormData = {
    name: string;
    thumbnail: FileUploadResult | null;
    muscleGroups: string[];
    equipment: string;
    videoDemo: FileUploadResult | null;
  };
}
