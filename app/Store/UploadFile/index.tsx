import {create} from 'zustand';

interface UploadFileState {
  uploadUrl: string | null;
  isUploading: boolean;
  setUploadUrl: (url: string) => void;
  setIsUploading: (isUploading: boolean) => void;
}

export const useUploadFileStore = create<UploadFileState>(set => ({
  uploadUrl: null,
  isUploading: false,
  setUploadUrl: (url: string) => set({uploadUrl: url}),
  setIsUploading: (isUploading: boolean) => set({isUploading}),
}));
