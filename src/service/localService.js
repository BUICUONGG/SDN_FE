export const localUserService = {
  get: () => {
    let userInfoString = localStorage.getItem("USER_INFO");
    return userInfoString ? JSON.parse(userInfoString) : null;
  },

  set: (userInfo) => {
    if (userInfo && typeof userInfo === "object") {
      // Cho phép nhiều dạng cấu trúc response khác nhau
      const raw = { ...userInfo };
      const nestedMeta = raw.metadata || raw.content || {};

      // Token ưu tiên theo thứ tự các tên phổ biến
      const token =
        raw.token ||
        raw.accessToken ||
        raw.access_token ||
        nestedMeta.token ||
        nestedMeta.accessToken ||
        nestedMeta.access_token || null;

      const refreshToken =
        raw.refreshToken || nestedMeta.refreshToken || null;

      // UserId theo các tên phổ biến
      const userId =
        raw.user_id ||
        raw.userId ||
        raw.id ||
        nestedMeta.user_id ||
        nestedMeta.userId ||
        nestedMeta.id || null;

      // Lưu token nếu có
      if (token) {
        localStorage.setItem("ACCESS_TOKEN", String(token));
      } else {
        console.warn("Không tìm thấy access token trong phản hồi đăng nhập");
      }

      if (refreshToken) {
        localStorage.setItem("REFRESH_TOKEN", String(refreshToken));
      }

      if (userId !== null && userId !== undefined) {
        localStorage.setItem("USER_ID", String(userId));
      }

      // Lưu toàn bộ object gốc để tra cứu về sau
      localStorage.setItem("USER_INFO", JSON.stringify(raw));
    } else {
      console.error("Dữ liệu đăng nhập không hợp lệ:", userInfo);
    }
  },

  getAccessToken: () => {
    return localStorage.getItem("ACCESS_TOKEN") || null;
  },

  getRefreshToken: () => {
    return localStorage.getItem("REFRESH_TOKEN") || null;
  },
  getUserId: () => {
    return localStorage.getItem("USER_ID") || null;
  },

  remove: () => {
    console.log("Xóa dữ liệu người dùng");
    localStorage.removeItem("USER_INFO");
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");
    localStorage.removeItem("USER_ID");
  },
};