export const localUserService = {
  get: () => {
    let userInfoString = localStorage.getItem("USER_INFO");
    return userInfoString ? JSON.parse(userInfoString) : null;
  },

  set: (userInfo) => {
    if (userInfo && typeof userInfo === "object") {
      const metadata = { ...userInfo }; // Clone để tránh mutate

      console.log("Dữ liệu gốc:", metadata);

      // === LƯU TOKEN RIÊNG (nếu cần dùng nhanh) ===
      if (metadata.token) {
        // Lưu trực tiếp mà không mã hóa
        localStorage.setItem("ACCESS_TOKEN", metadata.token);
      } else {
        console.warn("Thiếu token");
      }

      // Lưu refresh token nếu có
      if (metadata.refreshToken) {
        localStorage.setItem("REFRESH_TOKEN", metadata.refreshToken);
      }

      // === LƯU TOÀN BỘ USER INFO (trực tiếp, chuyển thành JSON string) ===
      const userInfoString = JSON.stringify(metadata); // Chuyển object thành string
      const userIdString = JSON.stringify(metadata.user_id); // Chuyển object thành string
      localStorage.setItem("USER_INFO", userInfoString);
      localStorage.setItem("USER_ID", String(metadata.user_id));

      console.log(
        "Đã lưu USER_INFO + ACCESS_TOKEN vào localStorage (không mã hóa)"
      );
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