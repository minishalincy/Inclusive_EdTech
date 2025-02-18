// imageConversion.js
import * as FileSystem from "expo-file-system";

export const convertToBase64 = async (uri) => {
  try {
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch (error) {
    throw new Error("Failed to convert image to Base64");
  }
};

export const convertBase64ToImage = async (base64String) => {
  const response = await fetch(`data:image/jpeg;base64,${base64String}`);
  const blob = await response.blob();
  const uri = URL.createObjectURL(blob);
  return uri;
};
