// src/hooks/useFoodFeed.js

import { useState, useEffect, useCallback } from "react";
import { useFoodStore } from "../stores/foodStore";
import { useModeStore } from "../stores/modeStore";
import { fetchMainFoods, fetchCategoryFoods } from "../services/food";

export const useFoodFeed = (type, options = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isExtraLoading, setIsExtraLoading] = useState(false);

  const setFoods = useFoodStore((state) => state.setFoods);
  const appendFoods = useFoodStore((state) => state.appendFoods);
  const foodIDs = useFoodStore((state) => state[`${type}FoodIDs`] || []);

  const mode = useModeStore((state) => state.mode);

  const categoriesKey = JSON.stringify(options.categories || []);

  const fetchData = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) setIsExtraLoading(true);
      else setIsLoading(true);

      try {
        let data;
        if (type === "main") {
          data = await fetchMainFoods({ speed: mode, count: 7 });
        } else if (type === "category") {
          data = await fetchCategoryFoods({
            categories: options.categories || [],
            speed: mode,
            count: 10,
          });
        }

        if (data) {
          if (isLoadMore) appendFoods(type, data);
          else setFoods(type, data);
        } else {
          setFoods(type, []);
        }
      } catch (error) {
        console.error(`Error fetching ${type} food data:`, error);
      } finally {
        if (isLoadMore) setIsExtraLoading(false);
        else setIsLoading(false);
      }
    },
    [type, mode, categoriesKey, setFoods, appendFoods],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    foodIDs,
    isLoading,
    isExtraLoading,
    loadMore: () => fetchData(true),
  };
};
