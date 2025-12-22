import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { fetchMyInfoApi } from "../api/auth";

const useAuthStore = create((set) => ({
  user: null,
  isLogin: false,

  // 1. 로그인 (정보 저장)
  setLogin: async (userData, token) => {
    await AsyncStorage.setItem("jwt_token", token);
    set({ user: userData, isLogin: true });
  },

  // 2. 로그아웃 (정보 삭제)
  setLogout: async () => {
    await AsyncStorage.removeItem("jwt_token");
    set({ user: null, isLogin: false });
  },

  // 3. 유저 정보만 업데이트
  updateUser: (userData) => {
    set({ user: userData });
  },

  // 4. 랜딩페이지에서 세션 체크
  checkLoginStatus: async () => {
    const userData = await fetchMyInfoApi();

    if (userData) {
      set({ user: userData, isLogin: true });
      return true;
    } else {
      set({ user: null, isLogin: false });
      return false;
    }
  },
}));

export default useAuthStore;
