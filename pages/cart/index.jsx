import React, { memo, useState, useEffect } from "react";
import {
  Minus,
  Plus,
  AlertCircle,
  CircleDollarSign,
  Trash2,
  Undo,
} from "lucide-react";
import { Button, Popconfirm } from "antd";
import Link from "next/link";
import numeral from "numeral";
import { API_URL } from "@/constants";
import useCartStore from "@/store/CartStore";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

function Carts() {
  const [customerId, setCustomerId] = useState([]);
  const { getCartItems, updateCartItemQuantity, removeFromCart } =
    useCartStore();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCustomerId(decoded._id);
    }
  }, []);

  const cartItems = getCartItems(customerId);

  useEffect(() => {
    calculateTotal();
  }, [customerId]);

  const calculateTotal = () => {
    let totalPrice = 0;
    getCartItems(customerId).forEach((item) => {
      totalPrice +=
        ((item.price * (100 - item.discount)) / 100) * item.quantity;
    });
    setTotal(totalPrice);
  };

  const handleDeleteCart = (productId) => {
    removeFromCart(customerId, productId);
    calculateTotal();
  };

  const handleIncrease = (productId) => {
    const item = getCartItems(customerId).find(
      (item) => item.productId === productId
    );
    if (item && item.quantity < item.stock) {
      updateCartItemQuantity(customerId, productId, item.quantity + 1);
      calculateTotal();
    }
  };

  const handleDecrease = (productId) => {
    const item = getCartItems(customerId).find(
      (item) => item.productId === productId
    );
    if (item && item.quantity > 1) {
      updateCartItemQuantity(customerId, productId, item.quantity - 1);
      calculateTotal();
    }
  };

  const text = "Bạn có muốn xóa sản phẩm ?";

  return (
    <div>
      <img src="https://file.hstatic.net/1000381168/file/baner-thanh-toan_78c520df795d4667b36605c554655bb1_master.png" />
      <div className="container mt-10">
        {getCartItems(customerId).length > 0 &&
        getCartItems(customerId).some((item) => item.quantity > 0) ? (
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
              <tbody>
                {cartItems.length > 0 &&
                  cartItems.map((item) => {
                    return (
                      <tr key={item.productId}>
                        <td className="flex items-center  justify-start">
                          <div className="mr-4 my-5">
                            <img
                              className="w-[150px] bg-pink"
                              src={`${API_URL}/${item.imageUrl}`}
                              alt="Product Image"
                            />
                          </div>
                          <div>
                            <p className="font-elle font-light">
                              {item.productName}
                            </p>
                            {item.size && (
                            <p>
                              <strong>Size:</strong>
                              <span className="ml-3">{item.size}</span>
                            </p>
                          )}
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-center items-center">
                            <button
                              type="button"
                              onClick={() => handleDecrease(item.productId)}
                              disabled={item.quantity === 1}
                            >
                              <Minus size={15} strokeWidth={1.5} />
                            </button>
                            <div className="w-10 flex justify-center items-center">
                              {item.quantity}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleIncrease(item.productId)}
                              disabled={item.quantity === item.stock}
                            >
                              <Plus size={15} strokeWidth={1.5} />
                            </button>
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-center items-center">
                            {numeral(
                              (item.price * (100 - item.discount)) / 100
                            ).format("0,0")}
                            đ
                          </div>
                        </td>
                        <td>
                          <div className="flex justify-center items-center font-bold">
                            {numeral(
                              ((item.price * (100 - item.discount)) / 100) *
                                item.quantity
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
                                handleDeleteCart(item.productId);
                                toast.success("Xóa thành công");
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
                    );
                  })}
              </tbody>
            </table>
            <div className="my-10 flex justify-end container">
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
                      {numeral(total).format("0,0")}đ
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
                  <Link href="/check-out" className="ml-3">
                    <button className="flex border py-3 px-20 bg-black hover:bg-white text-white hover:text-black font-elle">
                      THANH TOÁN
                    </button>
                  </Link>
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
    </div>
  );
}

export default memo(Carts);
