import React, { memo } from "react";
import { API_URL } from "@/constants";
import numeral from "numeral";
import Link from "next/link";
import { BackTop, Button, Popover } from 'antd';
import { Heart, Minus, Plus, RefreshCcw, Truck } from "lucide-react";

import axiosClient from "@/libraries/axiosClient";
import useCartStore from "@/store/CartStore";

function ProductDetails({ product }) {

  const [quantity, setQuantity] = React.useState(1);

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      if (quantity + 1 <= product.stock) {
        setQuantity(quantity + 1);
      }
    } else if (action === "decrease") {
      if (quantity - 1 >= 1) {
        setQuantity(quantity - 1);
      }
    }
  };
  const [selectedSize, setSelectedSize] = React.useState(null);
  const [stock, setStock] = React.useState(0);

  const handleSizeChange = (item) => {
    setSelectedSize(item);

    const selectedProduct = product.size.sizes.find(size => size._id === item._id);
    if (selectedProduct) {
      setStock(selectedProduct.stock);
    } else {
      setStock(0);
    }
  };

  const { addToCart } = useCartStore();
  const handleAddCart = (productId) => {
    addToCart(productId);
    console.log('aaaa', productId);
  };

  const handleAddCartaaaa = () => {
    console.log("add cart");
  }

  const content = (
    <div className="w-[500px] font-roboto text-md">
      <span > Dùng chỉ hoặc giấy bản nhỏ quấn quanh cổ tay (nếu là lắc tay) và quấn quanh khớp tay (nếu là nhẫn), bạn lưu ý quấn trừ hao
        sao cho kích cỡ thoải mái một chút, đánh dấu vị trí cắt nhau.</span>
      <p>Dùng thước đo chiều dài đoạn dây vừa đo được (đơn vị cm). </p>
      <p className="text-md font-roboto font-semibold">1: Size vòng tay</p>
      <span>Chiều dài đoạn dây bao nhiêu cm tương ứng với size lắc bấy nhiêu cm.</span>
      <p className="text-md font-roboto font-semibold">2: Size nhẫn</p>
      <div>Bảng size phổ biến :</div>
      <div className="flex justify-around">
        <div>
          <p>4.9 : size 8</p>
          <p>5 : size 9</p>
          <p>5.2 : size 10</p>
          <p>5.3 : size 11</p>
          <p>5.4 : size 12</p>
          <p>5.5 : size 13</p>
          <p>5.6 : size 14</p>
        </div>
        <div>
          <p>5.7 : size 15</p>
          <p>5.8 : size 16</p>
          <p>6 : size 17</p>
          <p>6.1 : size 18</p>
          <p>6.3 : size 19</p>
          <p>6.4 : size 20</p>
        </div>
      </div>


    </div>
  );
  return (
    <div className="container flex mt-[50px] md:mb-[200px] mb-[50px] justify-center" >
      {product ? (
        <div key={product._id} className="md:flex items-center lg:gap-[100px] gap-[50px] ">
          <div>
            <img src={`${API_URL}/${product.imageUrl}`} alt={`slide-${product.id}`} className="hover:-translate-y-1 hover:scale-105  duration-300 text-clip  sm:block flex items-center w-[28rem] object-contain" style={{
              background:
                "-webkit-linear-gradient(top,#fff 0%,#f7f7f7 100%)",
            }} />
          </div>
          <div className="flex flex-col justify-center gap-3 md:mr-[100px] max-w-[400px] md:mt-0 mt-[50px]">
            <h4 className="flex gap-4 text-xl font-roboto font-bold">Jewelry | {product.productName}</h4>
            <p className="font-roboto text-md">Mã : {product.code}</p>

            <div className="flex justify-between">
              <p>Giá bán :</p>
              {product.discount ? (
                <>
                  <span className="font-roboto text-md flex justify-center text-primry font-semibold">{numeral(product.price - (product.price * product.discount * 1) / 100).format("0,0")}đ</span>
                  <span className="font-roboto text-md flex justify-center text-gray line-through">
                    {numeral(product.price).format("0,0")}đ
                  </span>
                </>
              ) : (<p className="font-roboto text-md flex justify-center text-primry font-semibold">
                {numeral(product.price).format("0,0")}đ
              </p>)}
            </div>
            {
              product.discount > 0 && (<div className="flex font-roboto text-md justify-between"><p>Giảm giá :</p> <p className="font-bold text-lg">{product.discount}%</p></div>)
            }
            {product.stock > 0 && <div className="flex justify-between font-roboto text-md">
              <p>
                Số lượng còn : </p>
              {product.stock} sản phẩm</div>}

            <div className="flex justify-between">
              <div className="font-roboto text-md text-primry">Chọn kích cỡ :</div>

              <Popover content={content} title="Cách đo size">
                <i className="underline font-roboto text-md text-primry">Cách đo size nhẫn - vòng tay</i>
              </Popover>
            </div>
            <div className="flex gap-4">
              {product.size && product.size.sizes.map((item) => (
                <label
                  key={item._id}
                  htmlFor={`size${item._id}`}
                  className={`${selectedSize === item ? "bg-pink text-text-1 border-primry" : "border-primry"} font-poppins border border-solid border-inherit min-w-[32px] min-h-[32px] rounded flex justify-center items-center cursor-pointer`}
                >
                  <input
                    onChange={() => handleSizeChange(item)}
                    className="hidden"
                    type="radio"
                    id={`size${item._id}`}
                    name="size"
                    value={item}
                    checked={selectedSize === item}
                  />
                  <span className="text-[14px] leading-[14px]">
                    {item.size}
                  </span>
                </label>
              ))}
            </div>
            {stock > 0 ? (
              <div className="flex justify-between font-roboto text-md">
                <p>
                  Số lượng còn : </p>
                {stock} sản phẩm</div>
            ) : (<p className="hidden">hello</p>)}


            {
              product.stock > 0 ? (<div className="flex gap-8">
                <div className="flex">
                  <button
                    type="button"
                    className="border border-solid border-inherit px-[8px] py-[10px] hover:bg-pink hover:text-text-1 rounded-l-md"
                    onClick={() => handleQuantityChange("decrease")}
                  >
                    <Minus size={24} />
                  </button>
                  <input
                    className="border border-solid border-inherit lg:max-w-[75px] max-w-[50px] min-h-[44px] font-roboto text-xl font-medium leading-7 lg:px-[25px] px-[15px]"
                    // type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                  <button
                    type="button"
                    className="border border-solid border-inherit lg:px-[8px] px-0 py-[10px]  hover:bg-pink hover:text-text-1  rounded-r-md"
                    onClick={() => handleQuantityChange("increase")}
                  >
                    <Plus />
                  </button>
                </div>
                <Button onClick={() => handleAddCart(product._id)} className="text-md font-roboto bg-primry text-white min-h-[45px] hover:bg-white hover:text-primry hover:border-primry">Thêm vào giỏ hàng</Button>
              </div>) : (<div className="flex gap-8">
                <div className="flex">
                  <button
                    type="button"
                    className="border border-solid border-inherit px-[8px] py-[10px] hover:bg-pink hover:text-text-1 rounded-l-md"
                    onClick={() => handleQuantityChange("decrease")}
                  >
                    <Minus size={24} />
                  </button>
                  <input
                    className="border border-solid border-inherit lg:max-w-[75px] max-w-[50px] min-h-[44px] font-roboto text-xl font-medium leading-7 lg:px-[25px] px-[15px]"
                    // type="number"
                    min="1"
                    max={product.size.sizes.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                  />
                  <button
                    type="button"
                    className="border border-solid border-inherit lg:px-[8px] px-0 py-[10px]  hover:bg-pink hover:text-text-1  rounded-r-md"
                    onClick={() => handleQuantityChange("increase")}
                  >
                    <Plus />
                  </button>
                </div>
                <Button onClick={handleAddCartaaaa} className="text-md font-roboto bg-primry text-white min-h-[45px] hover:bg-white hover:text-primry hover:border-primry">Thêm vào giỏ hàng</Button>
              </div>)
            }

            <div className="max-w-[400px] h-[140px] border rounded flex flex-col gap-[16px]">
              <div className="ml-[16px] mt-[12px] flex gap-[16px] items-center">
                <Truck size={40} />
                <div className="flex flex-col ">
                  <span className="font-poppins text-base font-medium leading-6">
                    Miễn phí vận chuyển
                  </span>
                </div>
              </div>
              <p className="border-b" />
              <div className="ml-[16px] flex gap-[16px]">
                <RefreshCcw size={40} />
                <div className="flex flex-col gap-[8px]">
                  <span className="font-poppins text-base font-medium leading-6">
                    Trả hàng
                  </span>
                  <span className="font-poppins text-xs font-medium leading-[18px]">
                    Trả hàng miễn phí trong vòng 30 ngày.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>) : (<p>loading...</p>)
      }
      <BackTop />
    </div >
  )
}

export default memo(ProductDetails);

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(req) {
  try {
    const { params } = req;
    const response = await axiosClient.get(`/products/${params.id}`);
    return {
      props: {
        product: response.data.result,
      },
      revalidate: 10,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("err", error);
    return {
      notFound: true,
    };
  }
}
