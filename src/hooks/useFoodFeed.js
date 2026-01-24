// src/hooks/useFoodFeed.js

import { useState, useEffect, useCallback } from "react";
import { useFoodStore } from "../stores/foodStore";
import { useModeStore } from "../stores/modeStore";
import { fetchMainFoods, fetchCategoryFoods } from "../services/food";

export const useFoodFeed = (type, options = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExtraLoading, setIsExtraLoading] = useState(false);

  const foodIDs = useFoodStore((state) => state[`${type}FoodIDs`] || []);
  const { setFoods, appendFoods } = useFoodStore();

  const { mode } = useModeStore();

  const fetchData = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) setIsExtraLoading(true);
      else setIsLoading(true);

      try {
        let data;
        if (type === "main") {
          data = await fetchMainFoods({ speed: mode, count: 3 });
        } else if (type === "category") {
          data = await fetchCategoryFoods({
            categories: options.categories || [],
            speed: mode,
            count: 7,
          });
        }

        if (data) {
          if (isLoadMore) appendFoods(type, data);
          else setFoods(type, data);
        }
      } catch (error) {
        console.error(`Error fetching ${type} food data:`, error);
      } finally {
        if (isLoadMore) setIsExtraLoading(false);
        else setIsLoading(false);
      }
    },
    [type, mode, options.categories],
  );

  useEffect(() => {
    fetchData();
  }, [type, mode, options.categories]);

  return {
    foodIDs,
    isLoading,
    isExtraLoading,
    loadMore: () => fetchData(true),
  };
};
