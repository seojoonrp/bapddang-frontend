import axios from "axios";
import { OPENAI_API_KEY } from "@env";

export const fetchTags = async (foodName) => {
  console.log("Fetching tags for:", foodName);
  const prompt = `
You are a food hashtag recommender.
Your task is to recommend 7 Korean hashtags for a dish, capturing its taste, texture, and vibe.

Use a mix of the following types:
1. Taste – e.g., "#매워요", "#짭짤해요", "#달콤해요", "#고소해요"
2. Mood – e.g., "#든든해요", "#간편해요", "#가벼워요", "#시원해요", "#푸짐해요"
3. Type - e.g., "#한식", "#중식", "#양식", "#디저트", "#간식"
4. Context – e.g., "#도파민", "#초딩입맛", "#혼밥", "#인스타감성", "#고기고기"
5. Unique features – e.g., "#저탄고지", "#저속노화", "#불향", "#고단백", "#호불호없음"

Hashtags from type 1 and 2 should end in "~해요" or "~요".
You can use words from the example, but try to create your own hashtags based on this style and tone.
Avoid reusing food name, or generic terms like "요리", "맛", or "느낌". Keep them short and expressive (under 8 characters if possible).

Food Name: ${foodName}

Return 7 hashtags in Korean, space-separated. No extra text.
`;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const result = response.data.choices[0].message.content.trim();
    console.log("Response from OpenAI:", result);
    const hashtags = result.match(/#\S+/g) || [];
    console.log("Generated tags:", hashtags);
    return hashtags;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};
