export const getRelativeTime = (dateString) => {
  if (!dateString) return null;

  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffMin < 1) return "방금";
  if (diffHour < 1) return `${diffMin}분 전`;
  if (diffDay < 1) return `${diffHour}시간 전`;
  if (diffDay === 1) return "어제";
  if (diffDay === 2) return "그저께";
  if (diffDay < 30) return `${diffDay}일 전`;
  if (diffYear < 1) return `${diffMonth}달 전`;
  return `${diffYear}년 전`;
};
