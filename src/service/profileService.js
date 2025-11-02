import { https } from "./config";

// Service tập trung cho /api/profile của backend Render
export const profileService = {
  // ============ PROFILE APIs ============
  getProfile: () => {
    // GET /api/profile - lấy thông tin user hiện tại theo token
    return https.get("/profile");
  },
  updateProfile: (data) => {
    // PUT /api/profile - cập nhật hồ sơ user hiện tại
    return https.put("/profile", data);
  },

  // ============ USER FAVOURITE APIs ============
  createUserFavourite: (data) => {
    // POST /api/userFavourite - tạo mục yêu thích cho người dùng
    return https.post("/userFavourite", data);
  },
  getUserFavourites: () => {
    // GET /api/userFavourite - lấy danh sách yêu thích của user hiện tại
    return https.get("/userFavourite");
  },
  deleteUserFavourite: (id) => {
    // DELETE /api/userFavourite/{id} - xóa mục yêu thích
    return https.delete(`/userFavourite/${id}`);
  },

  // ============ PASSWORD MANAGEMENT ============
  changePassword: (data) => {
    // PATCH /api/profile/password - đổi mật khẩu
    // data: { old_password, new_password }
    return https.patch("/profile/password", data);
  },

  // ============ ADDRESS MANAGEMENT ============
  getAddresses: () => {
    // GET /api/profile/addresses - lấy danh sách địa chỉ của user
    return https.get("/profile/addresses");
  },
  createAddress: (data) => {
    // POST /api/profile/addresses - tạo địa chỉ mới
    // data: { fullName, phone, province, district, ward, detailAddress, isDefault }
    return https.post("/profile/addresses", data);
  },
  updateAddress: (id, data) => {
    // PUT /api/profile/addresses/{id} - cập nhật địa chỉ
    return https.put(`/profile/addresses/${id}`, data);
  },
  deleteAddress: (id) => {
    // DELETE /api/profile/addresses/{id} - xóa địa chỉ
    return https.delete(`/profile/addresses/${id}`);
  },
  setDefaultAddress: (id) => {
    // PUT /api/profile/addresses/{id}/default - đặt địa chỉ mặc định
    return https.put(`/profile/addresses/${id}/default`);
  },

  // ============ BANK ACCOUNT MANAGEMENT ============
  getBankAccounts: () => {
    // GET /api/profile/bank-accounts - lấy danh sách tài khoản ngân hàng
    return https.get("/profile/bank-accounts");
  },
  createBankAccount: (data) => {
    // POST /api/profile/bank-accounts - thêm tài khoản ngân hàng
    // data: { bankName, accountNumber, accountHolderName, branch, isDefault }
    return https.post("/profile/bank-accounts", data);
  },
  updateBankAccount: (id, data) => {
    // PUT /api/profile/bank-accounts/{id} - cập nhật tài khoản ngân hàng
    return https.put(`/profile/bank-accounts/${id}`, data);
  },
  deleteBankAccount: (id) => {
    // DELETE /api/profile/bank-accounts/{id} - xóa tài khoản ngân hàng
    return https.delete(`/profile/bank-accounts/${id}`);
  },
  setDefaultBankAccount: (id) => {
    // PUT /api/profile/bank-accounts/{id}/default - đặt tài khoản ngân hàng mặc định
    return https.put(`/profile/bank-accounts/${id}/default`);
  },

  // ============ NOTIFICATION SETTINGS ============
  getNotificationSettings: () => {
    // GET /api/profile/notification-settings - lấy cài đặt thông báo
    return https.get("/profile/notification-settings");
  },
  updateNotificationSettings: (data) => {
    // PUT /api/profile/notification-settings - cập nhật cài đặt thông báo
    // data: { email: true/false, sms: true/false, push: true/false, orderUpdates: true/false, promotions: true/false }
    return https.put("/profile/notification-settings", data);
  },

  // ============ ORDERS APIs (Profile-specific) ============
  getProfileOrders: (params) => {
    // GET /api/profile/orders - có thể chấp nhận query params (page, size, status...)
    // status: ALL, PENDING, PROCESSING, SHIPPING, COMPLETED, CANCELLED, RETURNED
    return https.get("/profile/orders", { params });
  },
  getProfileOrderById: (id) => {
    // GET /api/profile/orders/{id} - lấy chi tiết đơn hàng theo id cho user hiện tại
    return https.get(`/profile/orders/${id}`);
  },
  cancelOrder: (id, reason) => {
    // PUT /api/profile/orders/{id}/cancel - hủy đơn hàng
    return https.put(`/profile/orders/${id}/cancel`, { reason });
  },
  returnOrder: (id, data) => {
    // POST /api/profile/orders/{id}/return - yêu cầu trả hàng/hoàn tiền
    // data: { reason, description, images }
    return https.post(`/profile/orders/${id}/return`, data);
  },
  confirmReceived: (id) => {
    // PUT /api/profile/orders/{id}/confirm-received - xác nhận đã nhận hàng
    return https.put(`/profile/orders/${id}/confirm-received`);
  },

  // ============ VOUCHER APIs ============
  getMyVouchers: (params) => {
    // GET /api/profile/vouchers - lấy danh sách voucher của user
    // params: { status: 'available', 'used', 'expired' }
    return https.get("/profile/vouchers", { params });
  },
  claimVoucher: (code) => {
    // POST /api/profile/vouchers/claim - nhận voucher bằng code
    return https.post("/profile/vouchers/claim", { code });
  },
};
