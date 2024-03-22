import { BackTop } from "antd";
import React from "react";
const listProfile = [
  {
    id: "1",
    name: "Tran Dang Tuan",
    email: "trandangtuan28@gmail.com",
    sdt: "0905843460",
  },
];
export { listProfile };
const listProducts = [
  {
    id: "1",
    src: "https://cdn.pnj.io/images/thumbnails/485/485/detailed/141/GNDD00C000985-1.png",
    name: "Nhẫn  Vàng 18K",
    ma: "GNDD00C000985",
    size: "S",
    quality: "3",
    price: "7.167.000đ",
  },
  {
    id: "2",
    src: "https://cdn.pnj.io/images/thumbnails/485/485/detailed/141/GNDD00C000985-1.png",
    name: "Nhẫn  Vàng 18K",
    ma: "GNDD00C000985",
    size: "S",
    quality: "3",
    price: "7.167.000đ",
  },
  {
    id: "2",
    src: "https://cdn.pnj.io/images/thumbnails/485/485/detailed/141/GNDD00C000985-1.png",
    name: "Nhẫn  Vàng 18K",
    ma: "GNDD00C000985",
    size: "S",
    quality: "3",
    price: "7.167.000đ",
  },
];
export { listProducts };

function Checkout() {
  return (
    <div className="container ssm:flex block  ">
      <div className="flex-1 ">
        <p className="pb-5">How would you like to get your order?</p>
        {listProfile.map((order) => (
          <div className="border border-black p-4 rounded-lg ">
            <p>{order.name}</p>
            <p>{order.email}</p>
            <p>{order.sdt}</p>
          </div>
        ))}
        <p className="pt-5 pb-5">Please enter your shipping address</p>
        <div className="space-y-2 border border-black p-4 rounded-lg">
          <p>Shipping address:</p>
          <input
            type="text"
            placeholder="Enter your address"
            className="border  rounded p-2 w-full"
          />
          <p>Email:</p>
          <input
            type="text"
            placeholder="Enter your email"
            className="border  rounded p-2 w-full"
          />
          <p>Phone number</p>
          <input
            type="text"
            placeholder="Enter your phone number"
            className="border  rounded p-2 w-full"
          />
          <p>Your notes about the order to us:</p>
          <input
            type="text"
            placeholder="Enter your description"
            className="border  rounded p-2 w-full"
          />
          <p>Payment type</p>
          <select className="h-full  rounded-md border   py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm">
            <option>CASH</option>
            <option>BANK</option>
          </select>
        </div>
      </div>
      <div className="flex-1 ">
        <div className="flex justify-center  flex-col  w-full ">
          <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full  space-y-6   ">
            <h3 className="text-xl font-semibold leading-5 ">Summary</h3>
            <div className="flex justify-center items-center w-full space-y-4 flex-col  border-b pb-4">
              <div className="flex justify-between  w-full">
                <p className="text-base leading-4 ">Subtotal</p>
                <p className="text-base leading-4 ">7.167.000đ</p>
              </div>
              <div className="flex justify-between items-center w-full">
			  <p className="text-base leading-4 ">Discount</p>
                <p className="text-base leading-4 ">7.167.000đ</p>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-base leading-4 ">Shipping</p>
                <p className="text-base leading-4 ">7.167.000đ</p>
              </div>
            </div>
            <div className="flex justify-between items-center w-full border-b pb-4">
              <p className="text-base font-roboto leading-4 ">Total</p>
              <p className="text-base font-roboto leading-4 ">7.167.000đ</p>
            </div>
          </div>
        </div>
        {listProducts.map((products) => (
          <div className="flex justify-start items-center space-x-10  ">
            <div className="pb-4 md:pb-8  block w-[110px]   md:w-40 drop-shadow-2xl  ">
              <img src={products.src} alt="" />
            </div>
            <div className="flex flex-col justify-start items-start  ">
              <p className="  font-roboto font-bold ">{products.name}</p>

              <p className="text-sm  ">
                <span className="font-roboto">Mã: </span> {products.ma}
              </p>
              <p className="text-sm  ">
                <span className="font-roboto">Size: </span> {products.size}
              </p>
              <p className="text-sm  ">
                <span className="font-roboto">Quality :</span>
                {products.quality}
              </p>
              <p className="text-sm  ">
                <span className="font-roboto">Price :</span>
                {products.price}
              </p>
            </div>
          </div>
        ))}
        <div>
          <button className="bg-primry text-white font-bold py-2 px-4 rounded-full mx-auto flex mb-6">
            Buy Now
          </button>
        </div>
      </div>
      <BackTop/>
    </div>
  );
}
export default Checkout;