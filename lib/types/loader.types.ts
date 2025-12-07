export interface ExperienceLoaderProps {
  isLoading: boolean;
  error: Error | null;
  progress: number;
}

export interface UseModelLoaderResult {
  model: import("./scene.types").LoadedModel | null;
  isLoading: boolean;
  error: Error | null;
  progress: number;
}
