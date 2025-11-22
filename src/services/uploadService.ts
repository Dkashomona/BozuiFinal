import * as FileSystem from "expo-file-system";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Platform } from "react-native";
import { storage } from "./firebase";

export async function uploadImageAsync(uri: string, path: string) {
  let blob: Blob;

  if (Platform.OS === "web") {
    const response = await fetch(uri);
    blob = await response.blob();
  } else {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    blob = new Blob([new Uint8Array(byteArrays)], { type: "image/jpeg" });
  }

  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, blob);

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      null,
      (err) => reject(err),
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadUrl);
      }
    );
  });
}
