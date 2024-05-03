import React, { useState, useEffect, memo } from "react";
import useCartStore from "@/store/CartStore";
import useOrderStore from "@/store/OrderStore";
import { jwtDecode } from "jwt-decode";
import axiosClient from "@/libraries/axiosClient";
import { API_URL } from "@/constants";
import numeral from "numeral";
import { toast } from "react-toastify";
import { Select, BackTop, Form, Radio, Space } from "antd";
import { useRouter } from "next/router";

function Checkout() {
  const [customerId, setCustomerId] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [address, setAddress] = useState("");
  const [emailOrder, setEmailOrder] = useState("");
  const [phoneNumberOrder, setPhoneNumberOrder] = useState("");
  const [payMethod, setPayMethod] = useState([]);
  const [description, setDescription] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const orderStore = useOrderStore();
  const router = useRouter();
  const [form] = Form.useForm();

  const { getCartItems, removeAllCart } = useCartStore();

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = () => {
    fetch("https://vapi.vnappmob.com/api/province/")
      .then((response) => response.json())
      .then((data) => {
        setProvinces(data.results);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const fetchDistricts = (provinceId) => {
    fetch(`https://vapi.vnappmob.com/api/province/district/${provinceId}`)
      .then((response) => response.json())
      .then((data) => {
        setDistricts(data.results);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const fetchWards = (districtId) => {
    fetch(`https://vapi.vnappmob.com/api/province/ward/${districtId}`)
      .then((response) => response.json())
      .then((data) => {
        setWards(data.results);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
    setAddress("");
    fetchDistricts(value);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedWard("");
    setAddress("");
    fetchWards(value);
  };

  const handleWardChange = (value) => {
    setSelectedWard(value);
    setAddress("");
  };

  const handleAddressInputChange = (e) => {
    setAddress(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCustomerId(decoded._id);
    }
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const customerId = decoded._id;

        const response = await axiosClient.get(`/customers/${customerId}`);
        const data = response.data;

        setCustomers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCustomers();
  }, []);

  const cartItems = getCartItems(customerId);

  const handleAddOrder = async () => {
    try {
      const values = await form.validateFields();

      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const customerId = decoded._id;

      const itemsWithSizeId = cartItems.filter((item) => item.size);
      const itemsWithoutSizeId = cartItems.filter((item) => !item.size);

      const orderDetailsWithSizeId = itemsWithSizeId.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        price: item.price - (item.price * item.discount) / 100,
        discount: item.discount,
        size: item.size,
        stock: item.stock,
      }));

      const orderDetailsWithoutSizeId = itemsWithoutSizeId.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        price: item.price - (item.price * item.discount) / 100,
        discount: item.discount,
      }));

      const orderDetails = [
        ...orderDetailsWithSizeId,
        ...orderDetailsWithoutSizeId,
      ];

      const createdDate = new Date();
      const shippedDate = new Date(createdDate);
      shippedDate.setDate(createdDate.getDate() + 15);

      const provinceName = provinces.find(
        (province) => province.province_id === selectedProvince
      )?.province_name;
      const districtName = districts.find(
        (district) => district.district_id === selectedDistrict
      )?.district_name;
      const wardName = wards.find(
        (ward) => ward.ward_id === selectedWard
      )?.ward_name;

      const fullAddress = `${address}, ${wardName}, ${districtName}, ${provinceName}`;

      const order = {
        createdDate: new Date(),
        shippedDate: shippedDate,
        shippingAddress: fullAddress,
        status: "WAITING",
        description: description,
        customerId: customerId,
        employeeId: null,
        orderDetails: orderDetails,
        emailOrder: emailOrder,
        phoneNumberOrder: phoneNumberOrder,
      };

      if (payMethod === "COD") {
        order.paymentType = "CASH";
        await axiosClient.post("/orders", order);
        removeAllCart(customerId);
        orderStore.setOrderDetails(
          cartItems.map((item) => ({
            productName: item.productName,
            createdDate: new Date(),
            price: item.price - (item.price * item.discount) / 100,
            quantity: item.quantity,
          }))
        );
        toast.success("Đặt hàng thành công!", 1.5);
        router.push("/thanks");
      }

      if (payMethod === "vnpay") {
        order.paymentType = "VNPAY";
        const amount = cartItems
          .map(
            (item) =>
              ((item.price * (100 - item.discount)) / 100) * item.quantity
          )
          .reduce((accumulator, subtotal) => accumulator + subtotal, 0);

        const payPost = async () => {
          try {
            const found = await axiosClient.post(
              `/orders/pay/create_vnpay_url`,
              { amount: amount }
            );
            window.location.href = found.data.urlPay;
          } catch (error) {
            toast.error("Đặt hàng thất bại!", 1.5);
          }
        };

        localStorage.setItem("orderInfo", JSON.stringify(order));

        payPost();
      }
    } catch (errorInfo) {
      toast.error("Vui lòng nhập đầy đủ thông tin địa chỉ và liên hệ");
    }
  };

  return (
    <div className="container ssm:flex block my-10">
      <Form form={form}>
        <div className="flex-1 ">
          <p className="pb-5">Bạn muốn nhận đơn hàng bằng cách nào?</p>
          {customers && (
            <div className="border border-black p-4 rounded-lg-lg">
              <p>
                {customers.lastName} {customers.firstName}
              </p>
              <p>{customers.email}</p>
              <p>{customers.phoneNumber}</p>
            </div>
          )}
          <p className="pt-5 pb-5">Vui lòng nhập địa chỉ vận chuyển của bạn</p>
          <div className="space-y-2 border border-black p-4 rounded-lg-lg">
            <div className="space-x-3 flex flex-col lg:flex-row">
              <div>
                <p>Chọn tỉnh/thành phố:</p>
                <Form.Item
                  name="provinceId"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn tỉnh/ Thành phố",
                    },
                  ]}
                >
                  <Select
                    className="mt-2 xl:w-[221px] lg:w-full border rounded-lg"
                    placeholder="Chọn Tỉnh/Thành phố"
                    onChange={handleProvinceChange}
                    size="large"
                    options={
                      provinces.length > 0 &&
                      provinces.map((province) => {
                        return {
                          value: province.province_id,
                          label: province.province_name,
                        };
                      })
                    }
                  />
                </Form.Item>
              </div>
              <div>
                <p>Chọn quận/huyện:</p>
                <Form.Item
                  name="districtId"
                  rules={[
                    { required: true, message: "Vui lòng chọn Quận/Huyện" },
                  ]}
                >
                  <Select
                    className="mt-2 xl:w-[221px] lg:w-full border rounded-lg"
                    placeholder="Chọn Quận/Huyện"
                    onChange={handleDistrictChange}
                    size="large"
                    options={
                      districts.length > 0 &&
                      districts.map((district) => {
                        return {
                          value: district.district_id,
                          label: district.district_name,
                        };
                      })
                    }
                  />
                </Form.Item>
              </div>
              <div>
                <p>Chọn phường/xã:</p>
                <Form.Item
                  name="wardId"
                  rules={[
                    { required: true, message: "Vui lòng chọn Phường/Xã" },
                  ]}
                >
                  <Select
                    className="mt-2 xl:w-[221px] lg:w-full border rounded-lg"
                    placeholder="Chọn Phường/Xã"
                    size="large"
                    onChange={handleWardChange}
                    options={
                      wards.length > 0 &&
                      wards.map((ward) => {
                        return {
                          value: ward.ward_id,
                          label: ward.ward_name,
                        };
                      })
                    }
                  />
                </Form.Item>
              </div>
            </div>
            <p>Địa chỉ chi tiết:</p>
            <Form.Item
              name="address"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ cụ thể" },
              ]}
            >
              <input
                type="text"
                placeholder="Nhập địa chỉ của bạn"
                className="border rounded-lg p-2 w-full"
                value={address}
                onChange={handleAddressInputChange}
              />
            </Form.Item>
            <p>Email:</p>
            <Form.Item
              name="emailOrder"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <input
                type="text"
                placeholder="Nhập email của bạn"
                className="border rounded-lg p-2 w-full"
                value={emailOrder}
                onChange={(e) => setEmailOrder(e.target.value)}
              />
            </Form.Item>
            <p>Số điện thoại:</p>
            <Form.Item
              name="phoneNumberOrder"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^[0-9]+$/,
                  message: "Số điện thoại chỉ được chứa các ký tự số",
                },
                { len: 10, message: "Số điện thoại phải có độ dài 10 số" },
              ]}
            >
              <input
                type="text"
                placeholder="Nhập số điện thoại của bạn"
                className="border rounded-lg p-2 w-full"
                value={phoneNumberOrder}
                onChange={(e) => setPhoneNumberOrder(e.target.value)}
              />
            </Form.Item>

            <p>Ghi chú của bạn về đơn hàng cho chúng tôi:</p>
            <input
              type="text"
              placeholder="Nhập ghi chú của bạn"
              className="border rounded-lg p-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p>Phương thức thanh toán:</p>
            <Form.Item
              name="payMethod"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn phương thức thanh toán",
                },
              ]}
            >
              <Radio.Group defaultValue={payMethod}>
                <Space
                  direction="vertical"
                  onChange={(e) => setPayMethod(e.target.value)}
                >
                  <Radio className="flex" value="COD">
                    <Space>
                      <span>Thanh toán trực tiếp (COD)</span>
                      <span>
                        <img
                          width={25}
                          height={25}
                          src={
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKbZ0bQHF9cNGzFlD8gAddwu0a15l43bcWyg&usqp=CAU"
                          }
                          alt="COD"
                        />
                      </span>
                    </Space>
                  </Radio>
                  <Radio className="flex" value="vnpay">
                    <Space>
                      <span>Vnpay</span>
                      <span>
                        <img
                          width={25}
                          height={25}
                          src={
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQULr3Ust3Yw-IS1KvGuHQFys81W1ava9Ohd8gduuRPXA&sg"
                          }
                          alt="vnpay"
                        />
                      </span>
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </div>
        </div>
      </Form>
      {cartItems.length > 0 && (
        <div className="flex-1">
          <div className="flex justify-center flex-col w-full">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-start items-center space-x-10"
              >
                <div className="pb-4 md:pb-8 block w-[110px] md:w-40 drop-shadow-2xl">
                  <img
                    src={`${API_URL}/${item.imageUrl}`}
                    alt="Product Image"
                  />
                </div>
                <div className="flex flex-col justify-start items-start">
                  <p className="font-roboto font-bold">{item.productName}</p>
                  <p className="text-sm">
                    <span className="font-roboto">Mã: </span> {item.code}
                  </p>
                  {item.size && (
                    <p className="text-sm  ">
                      <span className="font-roboto">Size: </span> {item.size}
                    </p>
                  )}
                  <p className="text-sm">
                    <span className="font-roboto">Số lượng: </span>
                    {item.quantity}
                  </p>
                  <p className="text-sm">
                    <span className="font-roboto">Giá gốc: </span>
                    {numeral(item.price).format("0,0")}đ
                  </p>
                  <p className="text-sm">
                    <span className="font-roboto">Giảm giá: </span>
                    {item.discount}%
                  </p>
                  <p className="text-sm">
                    <span className="font-roboto">Giá đã giảm: </span>
                    {numeral((item.price * (100 - item.discount)) / 100).format(
                      "0,0"
                    )}
                    đ
                  </p>
                </div>
              </div>
            ))}
            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full space-y-6">
              <h3 className="text-xl font-semibold leading-5">Tóm tắt</h3>
              <div className="flex justify-center items-center w-full space-y-4 flex-col border-b pb-4">
                <div className="flex justify-between w-full">
                  <p className="text-base leading-4">Tổng phụ</p>
                  <p className="text-base leading-4">
                    {numeral(
                      cartItems.reduce(
                        (total, item) =>
                          total +
                          ((item.price * (100 - item.discount)) / 100) *
                            item.quantity,
                        0
                      )
                    ).format("0,0")}
                    đ
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base leading-4">Phí giao hàng</p>
                  <p className="text-base leading-4">Miễn phí vận chuyển</p>
                </div>
              </div>
              <div className="flex justify-between items-center w-full border-b pb-4">
                <p className="text-base font-roboto leading-4">Tổng</p>
                <p className="text-base font-roboto leading-4">
                  {numeral(
                    cartItems.reduce(
                      (total, item) =>
                        total +
                        ((item.price * (100 - item.discount)) / 100) *
                          item.quantity,
                      0
                    )
                  ).format("0,0")}
                  đ
                </p>
              </div>
              <div>
                <button
                  onClick={handleAddOrder}
                  className="border rounded-md bg-black text-white hover:bg-white hover:text-black transition duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0 py-2 px-4 mx-auto flex mb-6"
                >
                  Mua hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <BackTop />
    </div>
  );
}
export default memo(Checkout);
