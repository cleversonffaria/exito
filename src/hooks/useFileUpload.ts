import * as DocumentPicker from "expo-document-picker";
import { useCallback, useState } from "react";

export interface FileUploadResult {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = useCallback(async (): Promise<FileUploadResult | null> => {
    try {
      setIsUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || "image/jpeg",
          size: asset.size,
        };
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const pickVideo = useCallback(async (): Promise<FileUploadResult | null> => {
    try {
      setIsUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ["video/*"],
        copyToCacheDirectory: false,
        multiple: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || "video/mp4",
          size: asset.size,
        };
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    isUploading,
    pickImage,
    pickVideo,
  };
};
