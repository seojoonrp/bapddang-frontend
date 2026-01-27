import api from "../api/api";
export const fetchMarshmallows = async () => {
    try {
        const res = await api.get("/marshmallows"); 
        
        // api.js의 interceptor에서 이미 response.data.data를 반환하므로
        // res는 명세서의 "data": [...] 부분인 배열입니다.
        const arr = Array.isArray(res) ? res : [];
        
        console.log(`Fetched ${arr.length} marshmallows from server.`);

        return arr
            .slice()
            .sort((a, b) => a.week - b.week)
            .map((m) => ({
                 id: m.id,
                week: m.week,
                status: m.status,       // 0: 잠김, 1: 녹음 전, 2: 녹음 완료 등 상태값
                isComplete: m.isComplete, // 명세서 반영: 완료 여부 (true/false)
                reviewCount: m.reviewCount, // 명세서 반영: 리뷰 수
                totalRating: m.totalRating, // 명세서 반영: 평점
                userID: m.userID,       // 명세서 반영: 유저 ID
            }));
    } catch (error) {
        console.error("Marshmallows fetch error:", error);
        return [];
    }
};