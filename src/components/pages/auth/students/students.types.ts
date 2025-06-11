export namespace NStudentsPage {
  export interface Student {
    id: string;
    name: string;
    gender: "Masculino" | "Feminino" | "Outros";
    avatar: string;
    isDeleted?: boolean;
  }
}
