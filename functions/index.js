const {onSchedule} = require("firebase-functions/v2/scheduler");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

admin.initializeApp();
setGlobalOptions({region: "asia-northeast3", maxInstances: 10});
const db = admin.firestore();

exports.updateFoodRankings = onSchedule("0 * * * *", async (event) => {
  logger.info("3일간의 음식 랭킹 업데이트를 시작합니다.");

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const reviewsRef = db.collection("reviews");
  const recentReviewsQuery = reviewsRef.where("createdAt", ">=", threeDaysAgo);
  const reviewsSnapshot = await recentReviewsQuery.get();

  const foodCounts = new Map();
  reviewsSnapshot.forEach((doc) => {
    const review = doc.data();
    if (review.foods && Array.isArray(review.foods)) {
      review.foods.forEach((food) => {
        if (food.id && !food.isCustom) {
          foodCounts.set(food.id, (foodCounts.get(food.id) || 0) + 1);
        }
      });
    }
  });

  logger.info(`최근 3일간 리뷰된 음식 종류: ${foodCounts.size}개`);

  const batch = db.batch();
  const foodsRef = db.collection("foods");
  const allFoodsSnapshot = await foodsRef.get();

  allFoodsSnapshot.forEach((doc) => {
    const foodId = doc.id;
    const threeDayReviewCount = foodCounts.get(foodId) || 0;
    batch.update(doc.ref, {threeDayReviewCount});
  });

  await batch.commit();
  logger.info("3일간의 음식 랭킹 업데이트가 성공적으로 완료되었습니다.");
  return null;
});
