// GPT를 통해 음식 이름 기반 reason/situation 태그 추천
export async function getTagsFromFoodName(foodName) {
  const prompt = `
"${foodName}"이라는 음식을 먹는 사람의 입장에서,
1) 왜 이 음식을 좋아할지 (reason),
2) 어떤 상황에서 자주 먹을지 (situation)를
각각 2~4개 정도의 짧은 태그 형태로 추천해줘.

형식은 다음과 같이 JSON으로 줘:
{
  "reason": [...],
  "situation": [...]
}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer YOUR_API_KEY`, // TODO: 키 노출 주의!
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  return JSON.parse(content);
}
