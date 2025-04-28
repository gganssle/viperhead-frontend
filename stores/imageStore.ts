import { create } from 'zustand';

export interface GeneratedImage {
  url: string;
  timestamp: number;
}

interface ImageStore {
  images: GeneratedImage[];
  addImage: (url: string) => void;
  clearImages: () => void;
}

export const useGeneratedImages = create<ImageStore>((set) => ({
  images: [],
  addImage: (url: string) =>
    set((state: ImageStore) => ({
      images: [
        {
          url,
          timestamp: Date.now(),
        },
        ...state.images,
      ],
    })),
  clearImages: () => set({ images: [] }),
}));
