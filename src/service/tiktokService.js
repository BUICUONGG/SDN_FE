// service/tiktokService.js
import axios from "axios";

const BASE_URL = "https://open-api.tiktok.com";

export const tiktokService = {
  refreshToken: async (refreshToken) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/oauth/refresh_token/`,
        {
          params: {
            client_key: "sbaw93o26nzjiwr39m",
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error refreshing TikTok token:", error);
      throw error;
    }
  },

  getUserInfo: async (accessToken, openId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/info/`,
        {
          params: {
            access_token: accessToken,
            open_id: openId,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching TikTok user info:", error);
      throw error;
    }
  },
};
