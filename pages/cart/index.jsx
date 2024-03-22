import React, { memo, useState, useEffect } from "react";
import {
  Minus,
  Plus,
  AlertCircle,
  CircleDollarSign,
  Trash2,
  Undo,
} from "lucide-react";
import { BackTop, Button, message, Popconfirm } from "antd";
import Link from "next/link";
import axiosClient from "@/libraries/axiosClient";
import numeral from "numeral";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import { API_URL } from "@/constants";


function Carts() {
  const router = useRouter();
  const [carts, setCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;

      if (carts && Array.isArray(carts)) {
        carts.forEach((item) => {
          if (item.cartDetails && Array.isArray(item.cartDetails)) {
            item.cartDetails.forEach((product) => {
              if (
                product.product &&
                product.product.price &&
                product.quantity
              ) {
                total +=
                  ((product.product.price * (100 - product.product.discount)) /
                    100) *
                  product.quantity;
              }
            });
          }
        });
      }
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [carts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const customerId = decoded._id;

        const response = await axiosClient.get(
          `http://localhost:9000/carts/${customerId}`
        );
        const data = response.data;
        setCarts(data.payload.results);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [router]);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const customerId = decoded._id;

      await axiosClient.patch(
        `http://localhost:9000/carts/${customerId}/${productId}`,
        {
          quantity: newQuantity,
        }
      );

      const updatedCarts = carts.map((item) => {
        if (item.cartDetails) {
          item.cartDetails.forEach((product) => {
            if (product.productId === productId) {
              if (newQuantity > product.product.stock || newQuantity < 0) {
                message.warning("Số lượng trong giỏ hàng không hợp lệ");
                return;
              }
              product.quantity = newQuantity;
            }
          });
        }
        return item;
      });

      setCarts(updatedCarts.filter((item) => item));
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleQuantityMinus = async (productId, product) => {
    try {
      const updatedQuantity = product.quantity - 1;
      await handleQuantityChange(productId, updatedQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleQuantityPlus = async (productId, product) => {
    try {
      const updatedQuantity = product.quantity + 1;
      if (updatedQuantity <= product.product.stock) {
        await handleQuantityChange(productId, updatedQuantity);
      } else {
        message.warning("Số lượng sản phẩm vượt quá số lượng tồn kho");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const customerId = decoded._id;

      await axiosClient.delete(
        `http://localhost:9000/carts/${customerId}/${productId}`
      );

      const updatedCarts = carts.map((item) => {
        if (item.cartDetails) {
          item.cartDetails = item.cartDetails.filter(
            (product) => product.productId !== productId
          );
        }
        return item;
      });

      setCarts(updatedCarts.filter((item) => item));
    } catch (err) {
      console.error("Error removing product from cart:", err);
      message.error("Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng!");
    }
  };

  const text = "Bạn có muốn xóa sản phẩm ?";

  return (
    <div>
      <img src="https://file.hstatic.net/1000381168/file/baner-thanh-toan_78c520df795d4667b36605c554655bb1_master.png" />
      <div className="container mt-10">
        {carts &&
        carts.length > 0 &&
        carts.some(
          (item) => item.cartDetails && item.cartDetails.length > 0
        ) ? (
          <>
            <table className="w-full mb-10">
              <thead className="bg-black text-white font-roboto space-x-4">
                <tr>
                  <th className="border w-1/2 py-3">SẢN PHẨM</th>
                  <th className="border w-1/12 py-3">SỐ LƯỢNG</th>
                  <th className="border w-1/6 py-3">ĐƠN GIÁ</th>
                  <th className="border w-1/6 py-3">THÀNH TIỀN</th>
                  <th className="border w-1/12 py-3">
                    <div className="flex justify-center items-center">
                      <AlertCircle />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="border-b border-slate-400">
                {carts.map((item) =>
                  item.cartDetails.map((product) => (
                    <tr key={product._id}>
                      <td className="flex items-center  justify-start">
                        <div className="mr-4 my-5">
                          <img
                            className="w-[150px] bg-pink"
                            src={`${API_URL}/${product.product?.imageUrl}`}
                            alt="Product Image"
                          />
                        </div>
                        <div>
                          <p className="font-elle font-light">
                            {product.product?.productName}
                          </p>
                          {product.size && (
                            <p>
                              <strong>Size:</strong>
                              <span className="ml-3">{product.size}</span>
                            </p>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center items-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityMinus(product.productId, product)
                            }
                            disabled={product.quantity === 1}
                          >
                            <Minus size={15} strokeWidth={1.5} />
                          </button>
                          <div className="w-10 flex justify-center items-center">
                            {product.quantity}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityPlus(product.productId, product)
                            }
                          >
                            <Plus size={15} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>

                      <td>
                        <div className="flex justify-center items-center">
                          {numeral(
                            (product.product.price *
                              (100 - product.product.discount)) /
                              100
                          ).format("0,0")}
                          đ
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center items-center font-bold">
                          {numeral(
                            ((product.product.price *
                              (100 - product.product.discount)) /
                              100) *
                              product.quantity
                          ).format("0,0")}
                          đ
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-center items-center">
                          <Popconfirm
                            placement="top"
                            title={text}
                            onConfirm={() => {
                              handleRemoveCart(product.productId);
                              message.success("Delete successfully!");
                            }}
                            okText="Có"
                            cancelText="Không"
                            okButtonProps={{
                              style: { color: "white", background: "black" },
                            }}
                            cancelButtonProps={{
                              style: { color: "black", background: "white " },
                            }}
                          >
                            <button>
                              <Trash2 size={24} strokeWidth={1} />
                            </button>
                          </Popconfirm>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="my-10 flex justify-end">
              <div className="my-3">
                <div className="flex justify-end">
                  <div className="flex">
                    <CircleDollarSign size={24} strokeWidth={1} />
                    <p className="ml-2 font-roboto font-bold text-xl">
                      TỔNG TIỀN (tạm tính)
                    </p>
                  </div>
                  <div className="ml-10">
                    <span className="font-roboto font-bold text-lg">
                      {numeral(totalPrice).format("0,0")}đ
                    </span>
                  </div>
                </div>
                <div className="my-3 flex justify-end">
                  <span className="font-roboto w-3/4">
                    Thời gian nhận hàng từ 7 - 15 ngày (trường hợp sớm hơn chúng
                    tôi sẽ thông báo trước cho Quý khách!)
                  </span>
                </div>
                <div className="my-3 flex justify-end">
                  <div className="mr-3">
                    <Link href="/products">
                      <button className="flex border py-3 px-6 bg-gray hover:bg-white text-white hover:text-black font-elle">
                        <Undo className="mr-3" size={24} strokeWidth={1} /> CHỌN
                        THÊM SẢN PHẨM KHÁC
                      </button>
                    </Link>
                  </div>
                  <div className="ml-3">
                    <button className="flex border py-3 px-20 bg-black hover:bg-white text-white hover:text-black font-elle">
                      THANH TOÁN
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <p className="font-roboto font-black text-xl flex justify-center">
              Không có sản phẩm nào trong giỏ hàng của bạn.
            </p>
            <div className="flex justify-center items-center my-10">
              <Button
                type="submit"
                key="console"
                className="bg-black text-white flex items-center"
              >
                <Link href="/products" className="flex items-center">
                  <Undo className="mr-3" size={24} strokeWidth={1} />
                  Tiếp tục mua hàng.
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      <BackTop/>
    </div>
  );
}

export default memo(Carts);