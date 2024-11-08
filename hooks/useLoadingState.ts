import { useState } from "react";
import { router } from "expo-router";

export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const setLoading = (state: boolean) => {
    setIsLoading(state);

    router.setParams({ isLoading: state.toString() });
  };

  return [isLoading, setLoading] as const;
};
