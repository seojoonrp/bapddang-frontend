// src/components/MainScreen/Ranking.js

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import { fetchRankedFoods } from "../../services/food";

import Colors from "../../styles/colors";

const Ranking = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadRankings = async () => {
      try {
        setLoading(true);
        const fetchedRankings = await fetchRankedFoods();

        setRankings(fetchedRankings);
      } catch (error) {
        console.error("Failed to fetch rankings:", error);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    if (rankings.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % rankings.length);
      }, 2000);

      return () => clearInterval(timer);
    }
  }, [rankings]);

  if (loading) {
    // 로딩 표시
  }

  if (rankings.length === 0) {
    return (
      <View>
        <Text>표시할 랭킹 정보가 없습니다.</Text>
      </View>
    );
  }

  const currentRankingItem = rankings[currentIndex];

  return (
    <View style={styles.container}>
      {currentRankingItem && (
        <View style={styles.itemContainer}>
          <Text style={styles.rankText}>
            {currentIndex + 1} {currentRankingItem.name}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background_white,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#A87C66",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rankText: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundB",
    color: Colors.burn,
    textAlign: "center",
  },
});

export default Ranking;
