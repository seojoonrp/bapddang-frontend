import { useState, useEffect, useCallback } from "react";
import useFoodStore from "../stores/foodStore";
import { fetchMainFeedFoods } from "../services/food";

export const useMainFeedFood = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExtraLoading, setIsExtraLoading] = useState(false);

  const {
    mainFeedFoods,
    setMainFeedFoods,
    appendMainFeedFoods,
    loadPersistedData,
  } = useFoodStore();

  const initFoods = useCallback(async () => {
    setIsLoading(true);
    try {
      const hasPersistedData = await loadPersistedData();

      if (!hasPersistedData || mainFeedFoods.length === 0) {
        // if (true) {
        const data = await fetchMainFeedFoods({ speed: "fast", count: 3 });
        if (data) await setMainFeedFoods(data);
      }
    } catch (e) {
      console.error("Failed to initialize food feed:", e);
    } finally {
      setIsLoading(false);
    }
  }, [loadPersistedData, setMainFeedFoods, mainFeedFoods.length]);

  const loadMore = useCallback(async () => {
    if (isExtraLoading) return;
    setIsExtraLoading(true);
    try {
      const data = await fetchMainFeedFoods({ speed: "fast", count: 3 });
      if (data) await appendMainFeedFoods(data);
    } catch (e) {
      console.error("Failed to load more foods:", e);
    } finally {
      setIsExtraLoading(false);
    }
  }, [isExtraLoading, appendMainFeedFoods]);

  useEffect(() => {
    initFoods();
  }, []);

  return {
    foods: mainFeedFoods,
    isLoading,
    isExtraLoading,
    loadMore,
  };
};
