import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axiosClient from "@/libraries/axiosClient";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import moment from "moment";
import numeral from "numeral";
import useCartStore from "@/store/CartStore";
import { jwtDecode } from "jwt-decode";

function Payment() {
  const router = useRouter();
  const { vnp_TransactionStatus } = router.query;
  const [orderInfo, setOrderInfo] = useState([]);
  const { removeAllCart } = useCartStore();

  useEffect(() => {
    const storedOrderInfo = localStorage.getItem("orderInfo");
    if (storedOrderInfo) {
      setOrderInfo(JSON.parse(storedOrderInfo));
    }
  }, []);

  useEffect(() => {
    const handleAddOrder = async () => {
      if (vnp_TransactionStatus === "00") {
        try {
          const token = localStorage.getItem("token");
          const decoded = jwtDecode(token);
          const customerId = decoded._id;
          await axiosClient.post("/orders", orderInfo);
          removeAllCart(customerId);
        } catch (err) {
          console.log(err);
        }
      } else if (vnp_TransactionStatus) {
        localStorage.removeItem("orderInfo");
      }
    };
    handleAddOrder();
  }, [vnp_TransactionStatus]);

  const isSuccess = vnp_TransactionStatus === "00";

  return (
    <div className="border border-transparent my-20 mx-60 rounded-2xl shadow-2xl">
      <div>
        <div className="flex justify-center items-center mt-10">
          {isSuccess ? (
            <CheckCircle size={70} strokeWidth={1.3} />
          ) : (
            <XCircle size={70} strokeWidth={1.3} />
          )}
        </div>
        <p className="flex justify-center items-center font-bold text-xl font-elle">
          {isSuccess ? "Đặt hàng thành công" : "Giao dịch thất bại"}
        </p>
        <p className="flex justify-center items-center font-bold font-elle">
          {isSuccess
            ? "Cảm ơn bạn đã tin tưởng và sử dụng sản phẩm của chúng tôi"
            : "Giao dịch của bạn không thành công. Vui lòng thử lại sau."}
        </p>
      </div>
      {isSuccess && (
        <div>
          <p className="ml-36 mt-5 font-bold text-sm">Nội dung đơn hàng:</p>
          <div className="justify-center items-center flex">
            <table className="mt-5 w-2/3">
              <thead className="font-roboto space-x-4">
                <tr>
                  <th className="border border-solid border-gray-500 w-1/2 py-3">
                    Tên sản phẩm
                  </th>
                  <th className="border border-solid border-gray-500 w-1/12 py-3">
                    Ngày đặt
                  </th>
                  <th className="border border-solid border-gray-500 w-1/6 py-3">
                    Đơn giá
                  </th>
                  <th className="border border-solid border-gray-500 w-1/6 py-3">
                    Số lượng
                  </th>
                  <th className="border border-solid border-gray-500 w-1/6 py-3">
                    Tổng
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderInfo &&
                  orderInfo.orderDetails &&
                  orderInfo.orderDetails.length > 0 && (
                    <tr className="border border-solid border-gray-500">
                      <td className="flex items-center justify-center py-3">
                        <p className="font-elle font-light">
                          {orderInfo.orderDetails[0].productName}
                        </p>
                      </td>
                      <td className="border border-solid border-gray-500">
                        <div className="flex items-center justify-center py-3">
                          {moment(orderInfo.createdDate).format("DD/MM/YYYY")}
                        </div>
                      </td>
                      <td className="border border-solid border-gray-500">
                        <div className="flex justify-center items-center py-3">
                          {numeral(orderInfo.orderDetails[0].price).format(
                            "0,0"
                          )}
                          đ
                        </div>
                      </td>
                      <td className="border border-solid border-gray-500">
                        <div className="flex justify-center items-center py-3">
                          {orderInfo.orderDetails[0].quantity}
                        </div>
                      </td>
                      <td className="border border-solid border-gray-500">
                        <div className="flex items-center justify-center py-3">
                          {numeral(
                            orderInfo.orderDetails[0].price *
                              orderInfo.orderDetails[0].quantity
                          ).format("0,0")}
                          đ
                        </div>
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
          <p className="ml-36 text-xs mt-1 text-stone-500">
            Lưu ý: Bạn có thể xem chi tiết đơn hàng trong lịch sử mua hàng
          </p>
        </div>
      )}
      <div className="flex justify-around items-center mx-40 my-10">
        <Link href="/products">
          <button className="border rounded-md py-1 px-1 bg-black text-white hover:bg-white hover:text-black transition duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0">
            Tiếp tục mua hàng
          </button>
        </Link>
        <Link href="/">
          <button className="border rounded-md py-1 px-1 bg-black text-white hover:bg-white hover:text-black transition duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0">
            Quay lại trang chủ
          </button>
        </Link>
        <Link href="/purchase-history">
          <button className="border rounded-md py-1 px-1 bg-black text-white hover:bg-white hover:text-black transition duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0">
            Lịch sử mua hàng
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Payment;
