import { create } from 'zustand';

export interface GeneratedImage {
  url: string;
  style: string;
  timestamp: number;
}

interface ImageStore {
  images: GeneratedImage[];
  addImage: (url: string, style: string) => void;
  clearImages: () => void;
}

export const useGeneratedImages = create<ImageStore>((set) => ({
  images: [],
  addImage: (url: string, style: string) =>
    set((state: ImageStore) => ({
      images: [
        {
          url,
          style,
          timestamp: Date.now(),
        },
        ...state.images,
      ],
    })),
  clearImages: () => set({ images: [] }),
}));
