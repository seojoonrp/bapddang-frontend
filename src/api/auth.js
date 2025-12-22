import api from "./api";

export const loginWithGoogleApi = async (idToken) => {
  const response = await api.post("/auth/google", {
    idToken: idToken,
  });

  return response.data;
};
