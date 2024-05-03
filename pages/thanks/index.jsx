import { CheckCircle } from "lucide-react";
import useOrderStore from "@/store/OrderStore";
import moment from "moment";
import numeral from "numeral";
import Link from "next/link";
import { memo } from "react";

function Thanks() {
  const orderDetails = useOrderStore((state) => state.orderDetails);

  return (
    <div>
      {orderDetails.length > 0 && (
        <div className="border border-transparent my-20 mx-60 rounded-2xl shadow-2xl">
          <div>
            <div className="flex justify-center items-center mt-10">
              <CheckCircle size={70} strokeWidth={1.3} />
            </div>
            <p className="flex justify-center items-center font-bold text-xl font-elle">
              Đặt hàng thành công
            </p>
            <p className="flex justify-center items-center font-bold font-elle">
              Cảm ơn bạn đã tin tưởng và sử dụng sản phẩm của chúng tôi
            </p>
          </div>
          <div>
            <p className="ml-36 mt-5 font-bold text-sm">Nội dung đơn hàng:</p>
            <table className="flex justify-center items-center mt-5">
              <div className="w-full mx-40">
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
                  {orderDetails.map((item, index) => (
                    <tr
                      key={index}
                      className="border border-solid border-gray-500"
                    >
                      <td className="flex items-center justify-center py-3">
                        <p className="font-elle font-light">
                          {item.productName}
                        </p>
                      </td>
                      <td className="border border-solid border-gray-500">
                        <div className="flex items-center justify-center py-3">
                          {moment(item.createdDate).format("DD/MM/YYYY")}
                        </div>
                      </td>
                      <td className="border border-solid border-gray-500">
                        <div className="flex justify-center items-center py-3">
                          {numeral(item.price).format("0,0")}đ
                        </div>
                      </td>
                      <td className="border border-solid border-gray-500">
                        <div className="flex justify-center items-center py-3">
                          {item.quantity}
                        </div>
                      </td>
                      <td className="border border-solid border-gray-500">
                        <div className="flex items-center justify-center py-3">
                          {numeral(item.price * item.quantity).format("0,0")}đ
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </div>
            </table>
            <p className="ml-36 text-xs mt-1 text-stone-500">
              Lưu ý: Bạn có thể xem chi tiết đơn hàng trong lịch sử mua hàng
            </p>
          </div>
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
      )}
    </div>
  );
}

export default memo(Thanks);
