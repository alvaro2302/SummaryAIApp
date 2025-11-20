import {create} from 'zustand';

interface UploadFileState {
  uploadUrl: string | null;
  setUploadUrl: (url: string) => void;
}

export const useUploadFileStore = create<UploadFileState>(set => ({
  uploadUrl: null,
  setUploadUrl: (url: string) => set({uploadUrl: url}),
}));
