// src/constants/data/categoryData.js

export const categoryGroups = [
  {
    id: "cuisine",
    items: ["한식", "중식", "일식", "양식", "분식", "동남아"],
  },
  {
    id: "type",
    items: ["육류", "치킨", "패스트푸드", "빵", "국물", "치즈", "해산물", "죽"],
  },
  {
    id: "flavor",
    items: [
      "마라맛",
      "매운맛",
      "새콤달콤한",
      "담백한",
      "칼칼한",
      "고소한",
      "짭짤한",
      "달달한",
      "느끼한",
      "시원한",
      "쫄깃쫄깃",
      "바삭바삭한",
      "채소 많은",
      "든든한",
      "밥도둑",
    ],
  },
];

export const allCategories = categoryGroups.flatMap((group) => group.items);
