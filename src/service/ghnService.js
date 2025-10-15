import axios from "axios";

// ====== GHN Configuration ======
const GHN_TOKEN = "a4f7e6b7-24ee-11ec-b268-d64e67bb39ee"; // 🔐 GHN Token của bạn
const SHOP_ID = 2100075; // 🏪 Mã cửa hàng GHN
const FROM_DISTRICT_ID = 1482; // 🏙️ Mã quận gửi hàng (ví dụ: Quận Bình Thạnh)

const headers = {
  "Content-Type": "application/json",
  Token: GHN_TOKEN,
  ShopId: SHOP_ID,
};

// ====== Tính phí vận chuyển ======
export const calculateShippingFee = async ({
  to_district_id,
  to_ward_code,
  weight,
  height,
  length,
  width,
  service_type_id = 2,
}) => {
  try {
    const response = await axios.post(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        from_district_id: FROM_DISTRICT_ID,
        service_type_id,
        to_district_id,
        to_ward_code,
        height,
        length,
        weight,
        width,
        insurance_value: 0,
        coupon: null,
      },
      { headers }
    );
    return response.data.data.total;
  } catch (error) {
    console.error("GHN Fee Error:", error.response?.data || error.message);
    throw error;
  }
};

// ====== Lấy thời gian giao hàng dự kiến ======
export const getEstimatedDeliveryTime = async ({
  to_district_id,
  to_ward_code,
}) => {
  try {
    const services = await getAvailableServices(to_district_id);
    if (!services || services.length === 0) {
      console.warn("Không tìm thấy dịch vụ khả dụng");
      return null;
    }

    const service_id = services[0].service_id;

    const response = await axios.post(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime",
      {
        from_district_id: FROM_DISTRICT_ID,
        to_district_id,
        to_ward_code,
        service_id,
      },
      { headers }
    );

    if (response.data.data.leadtime === 0) {
      console.warn("GHN không trả về thời gian giao hàng");
      return null;
    }

    return response.data.data.leadtime;
  } catch (error) {
    console.error("Lỗi gọi leadtime:", error.response?.data || error.message);
    return null;
  }
};


// ====== Lấy danh sách tỉnh/thành ======
export const getProvinces = async () => {
  const res = await axios.get(
    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
    { headers }
  );
  return res.data.data;
};

// ====== Lấy danh sách quận/huyện theo tỉnh ======
export const getDistricts = async (provinceId) => {
  const res = await axios.post(
    "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
    { province_id: provinceId },
    { headers }
  );
  return res.data.data;
};

// ====== Lấy danh sách phường/xã theo quận ======
export const getWards = async (districtId) => {
  const res = await axios.post(
    "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
    { district_id: districtId },
    { headers }
  );
  return res.data.data;
};

// ====== Lấy danh sách dịch vụ khả dụng (service_id) ======
export const getAvailableServices = async (toDistrictId) => {
  try {
    const response = await axios.post(
      "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
      {
        shop_id: SHOP_ID,
        from_district: FROM_DISTRICT_ID,
        to_district: toDistrictId,
      },
      { headers }
    );
    return response.data.data;
  } catch (error) {
    console.error("GHN Services Error:", error.response?.data || error.message);
    return [];
  }
};

// ====== Tìm ProvinceID từ tên ======
export const getProvinceIdByName = async (provinceName) => {
  const provinces = await getProvinces();
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/tỉnh|thành phố/gi, "")
      .trim();
  const inputName = normalize(provinceName);
  const match = provinces.find((p) => normalize(p.ProvinceName) === inputName);

  if (!match) {
    console.warn("❌ Không tìm thấy tỉnh:", provinceName);
    console.table(provinces.map((p) => p.ProvinceName));
  }

  return match ? match.ProvinceID : null;
};

// ====== Tìm DistrictID từ tên và ProvinceID ======
export const getDistrictIdByName = async (districtName, provinceId) => {
  const districts = await getDistricts(provinceId);
  const match = districts.find(
    (d) => d.DistrictName.toLowerCase() === districtName.toLowerCase()
  );
  return match ? match.DistrictID : null;
};

// ====== Tìm WardCode từ tên và DistrictID ======
export const getWardCodeByName = async (wardName, districtId) => {
  const wards = await getWards(districtId);
  const match = wards.find(
    (w) => w.WardName.toLowerCase() === wardName.toLowerCase()
  );
  return match ? match.WardCode : null;
};

// ====== Tự động gán ID cho địa chỉ ======
export const enrichAddressWithGHNIds = async (address) => {
  try {
    const provinceId = await getProvinceIdByName(address.province);
    if (!provinceId) throw new Error("Không tìm thấy province_id");

    const districtId = await getDistrictIdByName(address.district, provinceId);
    if (!districtId) throw new Error("Không tìm thấy district_id");

    const wardCode = await getWardCodeByName(address.ward, districtId);
    if (!wardCode) throw new Error("Không tìm thấy ward_code");

    return {
      ...address,
      province_id: provinceId,
      district_id: districtId,
      ward_code: wardCode,
    };
  } catch (error) {
    console.error("Lỗi enrichAddressWithGHNIds:", error.message);
    return null;
  }
};
