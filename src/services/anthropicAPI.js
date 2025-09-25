import { ANTHROPIC_API_KEY } from "@env";
import tagPool from "../data/tagPool";

export const fetchTags = async (foodName) => {
  console.log("Fetching tags for:", foodName);

  const tasteTags = tagPool.taste.join(" ");
  const featureTags = tagPool.feature.join(" ");
  const uniqueTags = tagPool.unique.join(" ");

  const systemPrompt = `당신은 한국 음식 문화와 TPO(시간, 장소, 상황)에 대한 깊은 이해를 바탕으로, 음식에 가장 적절한 해시태그를 추천하는 전문가입니다.`;

  const userPrompt = `
    '${foodName}'이라는 음식에 대한 해시태그를 추천해줘. 아래 지시사항을 단계별로 엄격하게 따라야 해.

    아래 카테고리별 목록에서 가장 적절한 해시태그를 총 6개 선택해.
    - '맛' 카테고리 목록: [${tasteTags}] (**이중에서 정확히 2개 선택**)
    - '특성' 카테고리 목록: [${featureTags}] (**이중에서 정확히 2개 선택**)
    - '특이점' 카테고리 목록: [${uniqueTags}] (**이중에서 정확히 2개 선택**)
    
    선택된 6개의 해시태그만 공백으로 구분해서 출력해.
  `;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        max_tokens: 150,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API Error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();

    const result = data.content[0].text.trim();
    const hashtags = result.trim().split(/\s+/);

    console.log("Generated tags:", hashtags);
    return hashtags;
  } catch (error) {
    console.error("Error fetching tags from Anthropic:", error);
    throw error;
  }
};
