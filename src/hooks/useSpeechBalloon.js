import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FIRST_SIGNUP,
  FIRST_LIKE,
  AFTER_REVIEW_HIGH,
  AFTER_REVIEW_MID,
  AFTER_REVIEW_LOW,
  GENERAL,
} from "../constants/speechTexts";

const ONE_HOUR = 60 * 60 * 1000;

let sessionLiked = false;
export const setSessionLiked = () => {
  sessionLiked = true;
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getReviewTexts = (rating) => {
  if (rating >= 4) return AFTER_REVIEW_HIGH;
  if (rating >= 3) return AFTER_REVIEW_MID;
  return AFTER_REVIEW_LOW;
};

const getTextsForContext = async () => {
  const [firstVisit, recentReview] = await Promise.all([
    AsyncStorage.getItem("speech_first_visit"),
    AsyncStorage.getItem("speech_recent_review"),
  ]);

  if (firstVisit) {
    AsyncStorage.removeItem("speech_first_visit");
    return FIRST_SIGNUP;
  }

  if (sessionLiked) {
    sessionLiked = false;
    return FIRST_LIKE;
  }

  if (recentReview) {
    try {
      const { rating, time } = JSON.parse(recentReview);
      if (Date.now() - time < ONE_HOUR) {
        return getReviewTexts(rating);
      }
    } catch {}
  }

  return GENERAL;
};

export const useSpeechBalloon = () => {
  const [text, setText] = useState("");
  const textsRef = useRef(GENERAL);
  const usedRef = useRef(new Set());

  useEffect(() => {
    getTextsForContext().then((texts) => {
      textsRef.current = texts;
      usedRef.current = new Set();
      const picked = pickRandom(texts);
      usedRef.current.add(picked);
      setText(picked);
    });
  }, []);

  const changeText = useCallback(() => {
    const texts = textsRef.current;

    if (usedRef.current.size >= texts.length) {
      textsRef.current = GENERAL;
      usedRef.current = new Set();
    }

    const available = textsRef.current.filter((t) => !usedRef.current.has(t));
    const picked = pickRandom(available);
    usedRef.current.add(picked);
    setText(picked);
  }, []);

  return { text, changeText };
};
