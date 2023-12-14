import { create } from 'zustand';

interface AppState {
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (bool: boolean) => void;
    isRenameModalOpen: boolean;
    setIsRenameModalOpen: (bool: boolean) => void;
    fileId: string | null;
    setFileId: (fileId: string) => void;
    filename: string;
    setFilename: (filename: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
    fileId: null,
    setFileId(fileId) { set({ fileId: fileId }) },
    isDeleteModalOpen: false,
    setIsDeleteModalOpen(bool) { set({ isDeleteModalOpen: bool }) },
    isRenameModalOpen: false,
    setIsRenameModalOpen(bool) { set({ isRenameModalOpen: bool }) },
    filename: "",
    setFilename(filename) { set({ filename: filename }) },
}));