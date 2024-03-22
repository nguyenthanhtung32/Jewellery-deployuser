import React, { memo } from "react";
import { listHistory } from "@/constants/purchase-history";
import numeral from "numeral";
import { BackTop } from "antd";

function PurchaseHistory() {
  const handleBuyNow = () => {
    console.log("buy now");
  };

  return (
    <div className="py-14  md:px-6 xl:px-20 xl:container ">
      <div className="flex justify-start item-start flex-col ">
        <h1 className="text-xl leading-[28px] font-bold text-center font-roboto text-primry">
          PURCHASE HISTORY
        </h1>
      </div>
      <div className="flex flex-col mt-[20px]">
        {listHistory.map((order, index) => (
          <div
            key={order.id}
            className="flex shadow-xl mb-[100px] border-b border-primry"
          >
            <div className="max-w-[250px]">
              <img src={order.src} alt={index} className="object-contain" />
            </div>
            <div className="flex items-center gap-[80px]">
              <div className="w-full flex flex-col justify-center items-center md:items-start gap-[16px] ">
                <h3 className="text-lg font-bold leading-6 font-roboto ">
                  {order.name}
                </h3>
                <div className="flex justify-start items-start flex-col gap-[8px] max-w-[500px]">
                  <p className="text-sm">
                    <span className="font-roboto">Mã : </span> {order.ma}
                  </p>
                  <p className="text-sm  ">
                    <span className="font-roboto">Size : </span> {order.size}
                  </p>
                  <p className="text-sm  ">
                    <span className="font-roboto">Quality :</span>{" "}
                    {order.quality}
                  </p>
                  <p className="text-sm  ">
                    <span className="font-roboto">Price :</span>{" "}
                    {numeral(order.price).format("0,0")}đ
                  </p>
                </div>
              </div>
              <div className="flex xl:gap-[180px] lg:gap-[100px]">
                <p className="text-lg leading-6 font-roboto font-medium">
                  {order.status}
                </p>
                <p className="text-lg leading-6 font-roboto ">{order.date}</p>
                <button
                  className="bg-primry text-white font-bold w-[100px] h-[40px] rounded-full hover:bg-white hover:text-primry hover:border-primry hover:border"
                  onClick={handleBuyNow}
                >
                  Buy Again
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BackTop />
    </div>
  );
}

export default memo(PurchaseHistory);
