import { https } from "./config";

export const appService = {
  postDataUser: () => {
    return https.post("/Products");
  },
  resetPassword: (email) => {
    return https.post("/user-service/v1/account/forgot-password", {
      email,
    });
  },
  conformOtp: (formData) => {
    return https.post("/user-service/v1/account/confirm-otp", formData);
  },
  resendOtp: (data) => {
    return https.post("/user-service/v1/account/resend-otp", data);
  },
  getProfile: () => {
    return https.get("/profile");
  },
  updateProfile: (data) => {
    return https.put("/user-service/v1/users", data);
  },
  resetPass: (data) => {
    return https.post("/user-service/v1/account/reset-password", data);
  },
  postAddress: (data) => {
    return https.post("/user-service/v1/users/address/create", data);
  },
  updateAddress: (data) => {
    return https.put("/user-service/v1/users/address/update", data);
  },
  deleteAddress: (id) => {
    return https.delete(`/user-service/v1/users/address/delete/${id}`);
  },
  changePw: (data) => {
    return https.put("/user-service/v1/account/change-password", data);
  },

  // product
  getAllCate: () => {
    return https.get("/product-service/v1/categories");
  },


  getSubCate: (id) => {
    return https.get(`/product-service/v1/categories/${id}/sub-categories`);
  },

  postProduct: (data) => {
    return https.post("/product-service/v1/products/upsert", data);
  },

  postImgPoduct: (id, data) => {
    return https.post(
      `/product-service/v1/products/${id}/upload_images`,
      data
    );
  },

  getAllUser: () => https.get("/user"),
  // Lấy user theo id (dành cho admin hoặc khi cần chi tiết theo id)
  getUserById: (id) => {
    return https.get(`/user-service/v1/users/${id}`);
  },

  // Cập nhật user theo id (sử dụng user-service)
  updateUser: (id, data) => https.put(`/user-service/v1/users/${id}`, data),
  deleteUser: (id) => https.delete(`/user/${id}`),
  getAllReviews: () => https.get("/review"),
  getAllBrands: () => https.get("/brand"),
  getAllCategories: () => https.get("/category"),
  updateProduct: (id, data) => {
    return https.put(`/product/${id}`, data);
  },
  getDetailProduct: (id) => {
    return https.get(`/product/${id}`);
  },
  getAllProduct: () => {
    return https.get(`/product`);
  },
  createProduct: (data) => {
    return https.post(`/product`, data);
  },
  deleteProduct: (id) => {
    return https.delete(`/product/${id}`);
  },

  createBrand: (data) => https.post(`/brand`, data),
  updateBrand: (id, data) => https.put(`/brand/${id}`, data),
  deleteBrand: (id) => https.delete(`/brand/${id}`),
  createCategory: (data) => https.post(`/category`, data),
  updateCategory: (id, data) => https.put(`/category/${id}`, data),
  deleteCategory: (id) => https.delete(`/category/${id}`),
  getAutions: () => https.get(`/auctions`),
  getAutionDetail: (id) => https.get(`/auctions/${id}`),
  postAutionBid: (id, bidAmount) => https.post(`/auctions/${id}/bid`,{ bid_amount: bidAmount }),

  getWalletBalance: () => https.get('/wallet/balance'),
  depositToWallet: (amount) => https.post('/wallet/deposit', { amount }),
  withdrawFromWallet: (amount) => https.post('/wallet/withdraw', { amount }),
  bidAuction: (auctionId, amount) => https.post(`/auctions/${auctionId}/bid`, { amount }),

  getTransactionHistory: () => https.get('/wallet/transactions'),

  searchProducts: (criteria) => {
    return https.get("/product-service/v1/products", {
      params: criteria,
    });
  },

  getAllProductShopId: (shopId, page = 0, pageSize = 10) => {
    return https.get(
      `/product-service/v1/products?currentPage=${page}&pageSize=${pageSize}&shopId=${shopId}`
    );
  },

  getOwnerProduct: (page, pageSize) => {
    return https.get(
      `/product-service/v1/products/owner?currentPage=${page}&pageSize=${pageSize}`
    );
  },

  getAllProductAdmin: (page, pageSize) => {
    return https.get(
      `/product-service/v1/products/admin?currentPage=${page}&pageSize=${pageSize}`
    );
  },

  updateProductStatus: (id, data) => {
    return https.put(
      `/product-service/v1/products/admin/approve/${id}`,
      data
    );
  },

  updateProductActive: (id, isActive) => {
    console.log(id, isActive);
    return https.put(
      `/product-service/v1/products/${id}/update_status?isActive=${isActive}`
    );
  },

  // store
  getAllStore: (currentPage, pageSize) => {
    return https.get("/store-service/v1/stores", {
      params: { currentPage, pageSize },
      headers: {
        API_SECRET_HEADER: "admin",
      },
    });
  },

  getDetailStore: (id) => {
    return https.get(`/store-service/v1/stores/detail/${id}`);
  },

  getDetailStoreCus: (id) => {
    console.log(id);
    return https.get(`/store-service/v1/stores/detail/${id}/customer`);
  },

  getDetailStoreUser: () => {
    return https.get(`/store-service/v1/stores/detail`);
  },

  updateStoreStatus: (id, data) => {
    return https.put(`/store-service/v1/stores/verify-status/${id}`, data, {
      headers: {
        API_KEY: "EXE",
      },
    });
  },
  // admin order
  getAllOrderAD: () => {
    return https.get(`/order-service/v1/dashboard/admin/order-stats`);
  },

  getAllSellerAD: () => {
    return https.get(`/store-service/v1/dashboard/admin/stats`);
  },

  getAllUserAD: (currentPage = 1, pageSize = 10) => {
    return https.get(`/user-service/v1/dashboard/admin/stats`, {
      params: { currentPage, pageSize },
    });
  },

  getStats: (filter) => {
    return https.get(`/stats`, {
      params: filter ? { filter } : {},
    });
  },

  // payment momo
  CreatePayment: (orderId) => {
    console.log({ orderId });
    return https.post(`/order-service/v1/momo`, { orderId });
  },



  createReview: (data)  => {
    console.log(data)
    return https.post("/review", data)
  },

  updateReview: (id, data) => https.put(`/reviews/${id}`, data), // API sửa
  deleteReview: (id) => https.delete(`/reviews/${id}`),
};
