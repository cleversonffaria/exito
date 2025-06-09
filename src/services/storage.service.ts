import { supabase } from "./supabase";

export interface FileUploadResult {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

class StorageService {
  private readonly EXERCISES_BUCKET = "exercises";
  private readonly AVATARS_BUCKET = "avatars";

  async uploadImage(file: FileUploadResult): Promise<UploadResponse> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);

      const { data, error } = await supabase.storage
        .from(this.EXERCISES_BUCKET)
        .upload(filePath, formData, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      const { data: publicData } = supabase.storage
        .from(this.EXERCISES_BUCKET)
        .getPublicUrl(data.path);

      return { success: true, url: publicData.publicUrl };
    } catch (error) {
      return { success: false, error: "Erro ao fazer upload da imagem" };
    }
  }

  async uploadAvatar(file: FileUploadResult): Promise<UploadResponse> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);

      const { data, error } = await supabase.storage
        .from(this.AVATARS_BUCKET)
        .upload(filePath, formData, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      const { data: publicData } = supabase.storage
        .from(this.AVATARS_BUCKET)
        .getPublicUrl(data.path);

      return { success: true, url: publicData.publicUrl };
    } catch (error) {
      return { success: false, error: "Erro ao fazer upload do avatar" };
    }
  }

  async uploadVideo(file: FileUploadResult): Promise<UploadResponse> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);

      const { data, error } = await supabase.storage
        .from(this.EXERCISES_BUCKET)
        .upload(filePath, formData, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      const { data: publicData } = supabase.storage
        .from(this.EXERCISES_BUCKET)
        .getPublicUrl(data.path);

      return { success: true, url: publicData.publicUrl };
    } catch (error) {
      return { success: false, error: "Erro ao fazer upload do vídeo" };
    }
  }

  async deleteFile(
    filePath: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(this.EXERCISES_BUCKET)
        .remove([filePath]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erro ao deletar arquivo" };
    }
  }

  getFilePathFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      const bucketIndex = pathParts.indexOf(this.EXERCISES_BUCKET);

      if (bucketIndex === -1) return null;

      return pathParts.slice(bucketIndex + 1).join("/");
    } catch {
      return null;
    }
  }
}

export const storageService = new StorageService();
