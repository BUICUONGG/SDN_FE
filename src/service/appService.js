import { https } from "./config";
import { localUserService } from "./localService";

export const appService = {
  postDataUser: () => {
    return https.post("/Products");
  },
  resetPassword: (email) => {
    return https.post("/user-service/api/v1/account/forgot-password", {
      email,
    });
  },
  conformOtp: (formData) => {
    return https.post("/user-service/api/v1/account/confirm-otp", formData);
  },
  resendOtp: (data) => {
    return https.post("/user-service/api/v1/account/resend-otp", data);
  },
  getProfile: () => {
    return https.get("/user-service/api/v1/users/profile");
  },
  updateProfile: (data) => {
    return https.put("/user-service/api/v1/users", data);
  },
  resetPass: (data) => {
    return https.post("/user-service/api/v1/account/reset-password", data);
  },
  postAddress: (data) => {
    return https.post("/user-service/api/v1/users/address/create", data);
  },
  updateAddress: (data) => {
    return https.put("/user-service/api/v1/users/address/update", data);
  },
  deleteAddress: (id) => {
    return https.delete(`/user-service/api/v1/users/address/delete/${id}`);
  },
  changePw: (data) => {
    return https.put("/user-service/api/v1/account/change-password", data);
  },

  // product
  getAllCate: () => {
    return https.get("/product-service/api/v1/categories");
  },

  getAllBrand: () => {
    return https.get("/product-service/api/v1/brands");
  },

  getSubCate: (id) => {
    return https.get(`/product-service/api/v1/categories/${id}/sub-categories`);
  },

  postProduct: (data) => {
    return https.post("/product-service/api/v1/products/upsert", data);
  },

  postImgPoduct: (id, data) => {
    return https.post(
      `/product-service/api/v1/products/${id}/upload_images`,
      data
    );
  },

  getDetailProduct: (id) => {
    return https.get(`/product-service/api/v1/products/${id}`);
  },

  getAllProduct: (page, pageSize) => {
    return https.get(
      `/product-service/api/v1/products?currentPage=${page}&pageSize=${pageSize}`
    );
  },

  searchProducts: (criteria) => {
    return https.get("/product-service/api/v1/products", {
      params: criteria,
    });
  },

  getAllProductShopId: (shopId, page = 0, pageSize = 10) => {
    return https.get(
      `/product-service/api/v1/products?currentPage=${page}&pageSize=${pageSize}&shopId=${shopId}`
    );
  },

  getOwnerProduct: (page, pageSize) => {
    return https.get(
      `/product-service/api/v1/products/owner?currentPage=${page}&pageSize=${pageSize}`
    );
  },

  getAllProductAdmin: (page, pageSize) => {
    return https.get(
      `/product-service/api/v1/products/admin?currentPage=${page}&pageSize=${pageSize}`
    );
  },

  updateProductStatus: (id, data) => {
    return https.put(
      `/product-service/api/v1/products/admin/approve/${id}`,
      data
    );
  },

  updateProductActive: (id, isActive) => {
    console.log(id, isActive);
    return https.put(
      `/product-service/api/v1/products/${id}/update_status?isActive=${isActive}`
    );
  },

  // store
  getAllStore: (currentPage, pageSize) => {
    return https.get("/store-service/api/v1/stores", {
      params: { currentPage, pageSize },
      headers: {
        API_SECRET_HEADER: "admin",
      },
    });
  },

  getDetailStore: (id) => {
    return https.get(`/store-service/api/v1/stores/detail/${id}`);
  },

  getDetailStoreCus: (id) => {
    console.log(id);
    return https.get(`/store-service/api/v1/stores/detail/${id}/customer`);
  },

  getDetailStoreUser: () => {
    return https.get(`/store-service/api/v1/stores/detail`);
  },

  updateStoreStatus: (id, data) => {
    return https.put(`/store-service/api/v1/stores/verify-status/${id}`, data, {
      headers: {
        API_KEY: "EXE",
      },
    });
  },
  // admin order
  getAllOrderAD: () => {
    return https.get(`/order-service/api/v1/dashboard/admin/order-stats`);
  },

  getAllSellerAD: () => {
    return https.get(`/store-service/api/v1/dashboard/admin/stats`);
  },

  getAllUserAD: (currentPage = 1, pageSize = 10) => {
    return https.get(`/user-service/api/v1/dashboard/admin/stats`, {
      params: { currentPage, pageSize },
    });
  },

  // payment momo
  CreatePayment: (orderId) => {
    console.log({ orderId });
    return https.post(`/order-service/api/v1/momo`, { orderId });
  },

};
