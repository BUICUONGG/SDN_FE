import { https } from "./config";

export const orderService = {
  postOrder: (data) => {
    console.log(data);
    return https.post("/orders", data);
  },

  getAllOrder: (criteria) => {
    return https.get("/orders");
  },

  conformOrderRoot: ({ orderCode, paymentType }) => {
    return https.put(`/order-service/v1/orders/${orderCode}/confirm`, null, {
      params: {
        paymentType: paymentType,
      },
    });
  },

  cancelOrder: (orderCode) => {
    return https.put(`/order-service/v1/orders/${orderCode}/cancel`);
  },

  getOrder: (criteria) => {
    return https.get("/order-service/v1/orders/customer", {
      params: criteria,
    });
  },

  getOrderDetail: (orderCode) => {
    return https.get(`/order-service/v1/orders/${orderCode}`);
  },

  conformOrder: (orderCode) => {
    return https.put(`/order-service/v1/orders/${orderCode}/approve-by-shop`);
  },
};
