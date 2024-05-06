import React, { memo, useEffect, useState } from "react";
import numeral from "numeral";
import { BackTop, Modal, Input, Rate, Popconfirm, Form } from "antd";
import axiosClient from "@/libraries/axiosClient";
import { API_URL } from "@/constants";
import Moment from "moment";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const { TextArea } = Input;

function PurchaseHistory() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [reviewedProducts, setReviewedProducts] = useState({});
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState("");
  const [updateId, setUpdateId] = useState(0);
  const [updateForm] = Form.useForm();

  useEffect(() => {
    fetchOrders();
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      axiosClient.get("/reviews").then((response) => {
        const { data } = response;
        setReviews(data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdateFinish = (values) => {
    axiosClient
      .patch("/reviews" + "/" + updateId, values)
      .then((_response) => {
        updateForm.resetFields();
        toast.success("Sửa đánh giá thành công");
        setOpen(false);
        router.reload("/purchase-history");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (orders.length > 0) {
      const updatedReviewedProducts = orders.reduce((acc, order) => {
        order.orderDetails.forEach((detail) => {
          if (reviewedProducts[detail.productId._id]) {
            acc[detail.productId._id] = true;
          }
        });
        return acc;
      }, {});
      setReviewedProducts(updatedReviewedProducts);
    }
  }, [orders]);

  useEffect(() => {
    const reviewedProductsFromStorage = JSON.parse(
      localStorage.getItem("reviewedProducts")
    );
    if (reviewedProductsFromStorage) {
      setReviewedProducts(reviewedProductsFromStorage);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const customerId = decoded._id;

      setCustomers(customerId);

      const response = await axiosClient.get(`/orders/${customerId}`);
      const data = response.data.results;

      if (data && data.length > 0) {
        data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        setOrders(data);
      } else {
        console.log("No data to sort.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isModalOpenReview, setIsModalOpenReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const showModal = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      if (rating === 0) {
        toast.error("Vui lòng chọn số sao để đánh giá sản phẩm.");
        return;
      }

      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const customerId = decoded._id;

      const reviewData = {
        customerId: customerId,
        productId: selectedProductId._id,
        ratingRate: rating,
        comment: comment,
        reviewDate: new Date(),
      };

      const response = await axiosClient.post("/reviews", reviewData);

      toast.success("Bạn đã đánh giá thành công!");

      router.reload("/purchase-history");

      const updatedReviewedProducts = {
        ...reviewedProducts,
        [selectedProductId._id]: true,
      };
      setReviewedProducts(updatedReviewedProducts);
      localStorage.setItem(
        "reviewedProducts",
        JSON.stringify(updatedReviewedProducts)
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenReview(false);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axiosClient.patch(`/orders/${orderId}`, {
        status: "CANCELED",
      });

      if (response.status === 200) {
        await axiosClient.patch(`/orders/return-stock/${orderId}`);
        fetchOrders();
        toast.success("Đơn hàng đã được hủy", 1.5);
      } else {
        console.error("Có lỗi xảy ra khi hủy đơn hàng");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi gửi yêu cầu hủy đơn hàng", error);
    }
  };

  const getOrderAction = (status, productId, order) => {
    const isReviewed = reviewedProducts[productId._id];

    if (status === "COMPLETE") {
      if (!isReviewed) {
        return (
          <button
            className="bg-primry text-white font-bold w-[150px] h-[40px] rounded-full hover:bg-white hover:text-primry hover:border-primry hover:border mr-5"
            onClick={() => showModal(productId)}
          >
            Đánh giá
          </button>
        );
      } else {
        return (
          <button
            className="bg-primry text-white font-bold w-[150px] h-[40px] rounded-full hover:bg-white hover:text-primry hover:border-primry hover:border mr-5"
            onClick={() => HandleMuaLai(productId)}
          >
            Mua lại
          </button>
        );
      }
    }
    return null;
  };

  const HandleMuaLai = (productId) => {
    router.push(`/${productId._id}`);
  };

  const HuyDonAction = (status, orderId) => {
    if (status === "WAITING") {
      return (
        <Popconfirm
          title="Bạn chắc chắn muốn hủy đơn hàng?"
          onConfirm={() => handleCancelOrder(orderId)}
          okText="Có"
          okButtonProps={{ className: "bg-black" }}
          cancelText="Không"
        >
          <button className="mr-5 bg-primry text-white font-bold w-[150px] h-[40px] rounded-full hover:bg-white hover:text-primry hover:border-primry hover:border">
            Hủy đơn hàng
          </button>
        </Popconfirm>
      );
    }
  };

  const getReview = (status, productId) => {
    const isReviewed = reviewedProducts[productId._id];

    if (status === "COMPLETE" && isReviewed) {
      return (
        <button
          className="bg-primry text-white font-bold w-[150px] h-[40px] rounded-full hover:bg-white hover:text-primry hover:border-primry hover:border mr-5"
          onClick={() => handleReview(productId)}
        >
          Xem đánh giá
        </button>
      );
    }
    return null;
  };

  const handleReview = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpenReview(true);
  };

  const getStatusText = (status) => {
    if (status === "COMPLETE") {
      return "Đã mua";
    } else if (status === "WAITING") {
      return "Đang đợi duyệt";
    } else if (status === "APPROVED") {
      return "Đơn đã được duyệt";
    } else {
      return "Đã hủy";
    }
  };

  const getPayment = (paymentType) => {
    if (paymentType === "CASH") {
      return "Thanh toán sau khi nhận hàng";
    } else {
      return "VNPAY";
    }
  };

  const text = "Bạn chắc chắn muốn xóa đánh giá ?";

  return (
    <div className="py-14  md:px-6 xl:px-20 xl:container ">
      <div className="flex justify-start item-start flex-col ">
        <h1 className="text-xl leading-[28px] font-bold text-center font-roboto text-primry">
          LỊCH SỬ MUA HÀNG
        </h1>
      </div>
      <div className="flex flex-col mt-[20px] gap-[30px]">
        {orders &&
          orders
            .filter((order) => order.status !== "CANCELED")
            .map((order) => {
              return (
                <div
                  key={order._id}
                  className="border border-black rounded-xl font-roboto text-md flex flex-col gap-2 "
                >
                  <div className="font-roboto text-md flex flex-col gap-1 ">
                    <div className="flex gap-4 ml-2 mt-2">
                      <p className="w-[180px]">Trạng thái đơn hàng :</p>
                      {getStatusText(order.status)}
                    </div>
                    <div className="flex gap-4 ml-2">
                      <p className="w-[180px]">Địa chỉ giao hàng :</p>
                      <p>{order.shippingAddress}</p>
                    </div>
                    <div className="flex gap-4 ml-2">
                      <p className="w-[180px]">Phương thức thanh toán :</p>
                      {getPayment(order.paymentType)}
                    </div>
                    <div className="flex gap-4 ml-2">
                      <p className="w-[180px]">Ngày đặt đơn :</p>
                      <p className="text-md flex justify-center items-center font-roboto ">
                        {Moment(`${order.createdDate}`).format("DD/MM/YYYY")}
                      </p>
                    </div>
                    {order.orderDetails.map((detail, index) => {
                      const totalAmount = detail.price * detail.quantity;
                      return (
                        <div
                          key={index}
                          className="flex border-t border-gray gap-4 ml-2 mb-2 "
                        >
                          <div className="max-w-[100px] ">
                            <img
                              src={`${API_URL}${detail.imageUrl}`}
                              alt={`Image-${detail._id}`}
                              className="object-contain"
                            />
                          </div>
                          <div className="w-full flex flex-col justify-center items-center md:items-start gap-[16px] ">
                            <h3 className="font-bold font-roboto w-[300px] mt-2">
                              {detail.productName}
                            </h3>
                            <div className="flex justify-start items-start flex-col gap-[4px] max-w-[400px]">
                              <p className="text-sm font-roboto flex items-center">
                                <span>
                                  <X size={16} />
                                </span>
                                {detail.quantity}
                              </p>
                              <p className="text-sm font-roboto">
                                <span>Giá: </span>
                                {numeral(totalAmount).format("0,0")}đ
                              </p>
                              {detail.size && (
                                <div className="flex gap-2 text-sm font-roboto">
                                  <p>Size :</p>
                                  <p>{detail.size}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-[30px] justify-between">
                            {getOrderAction(
                              order.status,
                              detail.productId,
                              order._id
                            )}
                            <Modal
                              title={"Đánh giá sản phẩm"}
                              open={isModalOpen}
                              onOk={handleOk}
                              onCancel={handleCancel}
                              className="font-roboto text-sm"
                            >
                              {selectedProductId &&
                                orders &&
                                orders.map((order) =>
                                  order.orderDetails.map((detail, index) => {
                                    if (
                                      detail.productId === selectedProductId
                                    ) {
                                      return (
                                        <div key={index}>
                                          <div className="flex">
                                            <div className="max-w-[100px]">
                                              <img
                                                src={`${API_URL}${detail.imageUrl}`}
                                                alt={`Image-${detail._id}`}
                                                className="object-contain"
                                              />
                                            </div>
                                            <h3 className="font-roboto flex items-center justify-center">
                                              {detail.productName}
                                            </h3>
                                          </div>
                                          <div className="flex gap-8">
                                            <p className="font-roboto mb-4">
                                              Chất lượng sản phẩm
                                            </p>
                                            <Rate
                                              allowHalf
                                              defaultValue={0}
                                              onChange={handleRatingChange}
                                            />
                                          </div>
                                          <TextArea
                                            placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với người mua khác nhé!"
                                            allowClear
                                            value={comment}
                                            onChange={handleCommentChange}
                                          />
                                        </div>
                                      );
                                    }
                                  })
                                )}
                            </Modal>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mb-2 flex justify-end">
                    {order.orderDetails.map((detail, index) => {
                      return (
                        <div key={index}>
                          {getReview(order.status, detail.productId, order)}
                        </div>
                      );
                    })}
                    <Modal
                      title="Đã đánh giá"
                      open={isModalOpenReview}
                      onCancel={handleCancel}
                      footer={null}
                    >
                      {selectedProductId &&
                        (reviews.some(
                          (item) =>
                            item.customerId === customers &&
                            item.productId === selectedProductId._id
                        ) ? (
                          reviews.map((item) => {
                            if (
                              item.customerId === customers &&
                              item.productId === selectedProductId._id
                            ) {
                              return (
                                <>
                                  <div className="flex">
                                    <div className="max-w-[100px]">
                                      <img
                                        src={`${API_URL}${selectedProductId.imageUrl}`}
                                        alt={`Image-${selectedProductId._id}`}
                                        className="object-contain"
                                      />
                                    </div>
                                    <h3 className="font-roboto flex items-center justify-center">
                                      {selectedProductId.productName}
                                    </h3>
                                  </div>
                                  <div className="mb-4">
                                    Nội dung: {item.comment}
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    <div className="mb-4">Chất lượng:</div>
                                    <Rate
                                      allowHalf
                                      disabled
                                      defaultValue={item.ratingRate}
                                      style={{ fontSize: "18px" }}
                                    />
                                  </div>
                                  <div className="justify-center flex space-x-8 my-4">
                                    <button
                                      className="bg-primry text-white font-bold w-[120px] h-[40px] rounded-full hover:bg-white hover:text-primry hover:border-primry hover:border"
                                      onClick={() => {
                                        setOpen(true);
                                        setUpdateId(item._id);
                                        updateForm.setFieldsValue(item);
                                      }}
                                    >
                                      Sửa
                                    </button>
                                    <Popconfirm
                                      placement="top"
                                      title={text}
                                      onConfirm={() => {
                                        axiosClient
                                          .delete("/reviews" + "/" + item._id)
                                          .then(() => {
                                            toast.success(
                                              "Xóa đánh giá thành công"
                                            );
                                            router.reload();
                                          });
                                      }}
                                      okText="Có"
                                      okButtonProps={{
                                        className: "bg-black text-white",
                                      }}
                                      cancelText="Không"
                                    >
                                      <button className="bg-primry text-white font-bold w-[120px] h-[40px] rounded-full hover:bg-white hover:text-primry hover:border-primry hover:border">
                                        Xóa
                                      </button>
                                    </Popconfirm>
                                    <Modal
                                      open={open}
                                      onCancel={() => setOpen(false)}
                                      cancelText="Hủy"
                                      okText="Cập nhật"
                                      okButtonProps={{
                                        style: {
                                          color: "white",
                                          background: "black",
                                        },
                                      }}
                                      onOk={() => updateForm.submit()}
                                      title="Sửa đánh giá"
                                    >
                                      <Form
                                        form={updateForm}
                                        name="update-form"
                                        onFinish={onUpdateFinish}
                                      >
                                        <Form.Item
                                          label="Chất lượng sản phẩm"
                                          name="ratingRate"
                                        >
                                          <Rate allowHalf />
                                        </Form.Item>
                                        <Form.Item
                                          label="Nội dung"
                                          name="comment"
                                        >
                                          <TextArea />
                                        </Form.Item>
                                      </Form>
                                    </Modal>
                                  </div>
                                </>
                              );
                            }
                          })
                        ) : (
                          <p>Bạn đã xóa đánh giá</p>
                        ))}
                    </Modal>

                    <div>{HuyDonAction(order.status, order._id)}</div>
                  </div>
                </div>
              );
            })}
        {orders &&
          orders
            .filter((order) => order.status === "CANCELED")
            .map((order) => {
              return (
                <div
                  key={order._id}
                  className="border border-black rounded-xl font-roboto text-md flex flex-col gap-2 "
                >
                  <div className="font-roboto text-md flex flex-col gap-1 ">
                    <div className="flex gap-4 ml-2 mt-2">
                      <p className="w-[180px]">Trạng thái đơn hàng :</p>
                      {getStatusText(order.status)}
                    </div>
                    <div className="flex gap-4 ml-2">
                      <p className="w-[180px]">Địa chỉ giao hàng :</p>
                      <p>{order.shippingAddress}</p>
                    </div>
                    <div className="flex gap-4 ml-2">
                      <p className="w-[180px]">Phương thức thanh toán :</p>
                      {getPayment(order.paymentType)}
                    </div>
                    <div className="flex gap-4 ml-2">
                      <p className="w-[180px]">Ngày đặt đơn :</p>
                      <p className="text-md flex justify-center items-center font-roboto ">
                        {Moment(`${order.createdDate}`).format("DD/MM/YYYY")}
                      </p>
                    </div>
                    {order.orderDetails.map((detail, index) => {
                      const totalAmount = detail.price * detail.quantity;
                      return (
                        <div
                          key={index}
                          className="flex border-t border-gray gap-4 ml-2 mb-2 "
                        >
                          <div className="max-w-[100px] ">
                            <img
                              src={`${API_URL}${detail.imageUrl}`}
                              alt={`Image-${detail._id}`}
                              className="object-contain"
                            />
                          </div>
                          <div className="w-full flex flex-col justify-center items-center md:items-start gap-[16px] ">
                            <h3 className="font-bold font-roboto w-[300px] mt-2">
                              {detail.productName}
                            </h3>
                            <div className="flex justify-start items-start flex-col gap-[4px] max-w-[400px]">
                              <p className="text-sm font-roboto flex items-center">
                                <span>
                                  <X size={16} />
                                </span>
                                {detail.quantity}
                              </p>
                              <p className="text-sm font-roboto">
                                <span>Giá: </span>
                                {numeral(totalAmount).format("0,0")}đ
                              </p>
                              {detail.size && (
                                <div className="flex gap-2 text-sm font-roboto">
                                  <p>Size: {detail.size} </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-[30px] justify-between">
                            {getOrderAction(
                              order.status,
                              detail.productId,
                              order._id
                            )}
                            <Modal
                              title={"Đánh giá sản phẩm"}
                              open={isModalOpen}
                              onOk={handleOk}
                              onCancel={handleCancel}
                              className="font-roboto text-sm"
                            >
                              {selectedProductId &&
                                orders &&
                                orders.map((order) =>
                                  order.orderDetails.map((detail, index) => {
                                    if (
                                      detail.productId === selectedProductId
                                    ) {
                                      return (
                                        <div key={index}>
                                          <div className="flex">
                                            <div className="max-w-[100px]">
                                              <img
                                                src={`${API_URL}${detail.imageUrl}`}
                                                alt={`Image-${detail._id}`}
                                                className="object-contain"
                                              />
                                            </div>
                                            <h3 className="font-roboto flex items-center justify-center">
                                              {detail.productName}
                                            </h3>
                                          </div>
                                          <div className="flex gap-8">
                                            <p className="font-roboto mb-4">
                                              Chất lượng sản phẩm
                                            </p>
                                            <Rate
                                              allowHalf
                                              defaultValue={0}
                                              onChange={handleRatingChange}
                                            />
                                          </div>
                                          <TextArea
                                            placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với người mua khác nhé!"
                                            allowClear
                                            value={comment}
                                            onChange={handleCommentChange}
                                          />
                                        </div>
                                      );
                                    }
                                  })
                                )}
                            </Modal>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mb-2 flex justify-end">
                    {HuyDonAction(order.status, order._id)}
                  </div>
                </div>
              );
            })}
      </div>
      <BackTop />
    </div>
  );
}

export default memo(PurchaseHistory);
