import { FileUploadResult } from "@/hooks/useFileUpload";

export namespace NRegisterStudentPage {
  export type FormData = {
    name: string;
    email: string;
    phone: string;
    age: string;
    gender: string;
    goal: string;
    avatar: FileUploadResult | null;
  };
}
