// Implemented in relation to the firebase extension: Firebase Resize Images
// https://github.com/firebase/extensions/tree/master/storage-resize-images

import { onCustomEventPublished } from "firebase-functions/v2/eventarc";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage, ref, getDownloadURL } from "firebase-admin/storage";

initializeApp();
const db = getFirestore();

// Personalized controllers after the extension configuration
// Update the user's image when the resized image is available.
export const resizeImageHandler = onCustomEventPublished(
  "firebase.extensions.storage-resize-images.v1.onSuccess",
  async (e) => {

    // This images are uploaded to the /thumbnails/ folder, thats why 
    // we need to update the user document with the new avatar reference
    const filePath = e.data.name; // File path in the bucket.
    const fileName = filePath.split("/").pop();

    // I can put the filename as the user document id because they are the same and unique
    const userRef = db.collection("users").doc(fileName);

    // Update the user document with the new avatar reference
    // Get the download URL for the file
    const storage = getStorage();
    const fileRef = ref(storage, filePath);
    try {
      const downloadURL = await getDownloadURL(fileRef);
      // Update the user document with the new avatar download URL
      await userRef.update({
        avatar: downloadURL
      });
      logger.info("User avatar updated successfully.");
    } catch (error) {
      logger.error("Error updating user avatar: ", error);
    }
  }
);
