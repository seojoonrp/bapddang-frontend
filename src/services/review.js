const createReview = async () => {
  if (!foods) return;

  const user = auth.currentUser;
  if (!user) {
    Alert.alert("로그인이 필요합니다!");
    return;
  }

  const uid = user.uid;

  try {
    const docRef = doc(db, "userReviews", uid);

    if (intent === "edit") {
      if (reviewIndex == null) {
        Alert.alert("수정 오류", "수정할 리뷰 인덱스가 없습니다.");
        return;
      }
      // 1) 기존 문서 조회
      const snap = await getDoc(docRef);
      const reviews = snap.exists() ? snap.data().reviews || [] : [];

      if (!reviews[reviewIndex]) {
        Alert.alert("수정 오류", "대상 리뷰를 찾지 못했습니다.");
        return;
      }

      const prev = reviews[reviewIndex];
      const updated = {
        ...prev,
        food: foodName,
        time: selectedTime,
        tags: selectedTags,
        comment,
        rating,
        imageUri,
        edited: true,
      };

      const next = [...reviews];
      next[reviewIndex] = updated;

      await setDoc(docRef, { reviews: next }, { merge: true });
      Alert.alert("수정 완료", "후기를 수정했어요!");
      onClose?.();
      return;
    }
    let createdAt = null;

    if (!createdAt && auth.currentUser?.metadata?.creationTime) {
      createdAt = new Date(auth.currentUser.metadata.creationTime);
    }
    let day = 1;

    const msPerDay = 1000 * 60 * 60 * 24;
    const toLocalStartOfDay = (d) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x;
    };

    if (createdAt instanceof Date && !isNaN(createdAt)) {
      const startCreated = toLocalStartOfDay(createdAt);
      const startToday = toLocalStartOfDay(new Date());
      const diffDays = Math.round((startToday - startCreated) / msPerDay);
      day = Math.max(1, diffDays + 1);
    }

    const reviewData = {
      food: foodName,
      time: selectedTime,
      tags: selectedTags,
      comment,
      rating,
      imageUri,
      createdAt: new Date(),
      day,
    };

    await setDoc(
      docRef,
      {
        reviews: arrayUnion(reviewData),
      },
      { merge: true }
    );

    alert("후기가 등록되었습니다!");
    onClose();
  } catch (error) {
    console.error("리뷰 저장 실패: ", error);
    Alert.alert("저장 실패", "리뷰를 저장하는 데 실패했습니다.");
  }
};
