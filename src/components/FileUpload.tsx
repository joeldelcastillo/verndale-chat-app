import { SetStateAction, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Storage } from '@/providers/config';
import { useAlert } from '@/hooks/useAlert';

type FileUploadProps = {
  setDownloadURL: React.Dispatch<SetStateAction<string | null>>;
  onFileUploaded?: (url: string) => void;
};

export default function FileUpload({ setDownloadURL, onFileUploaded }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const alert = useAlert();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const storageRef = ref(Storage, `uploads/${file.name}`);

    try {
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);
      // Get the download URL
      const url = await getDownloadURL(storageRef);
      setDownloadURL(url);
      if (onFileUploaded) {
        onFileUploaded(url);
      }
      alert.showAlert('Success', 'File uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert.showAlert('Error', 'File upload failed!');
      setDownloadURL(null);
    }

    setUploading(false);

  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        // className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  w-100 cursor-pointer"  
        className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${uploading || !file
          ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}