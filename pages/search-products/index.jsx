"use client";
import React, { memo } from "react";
import useCartStore from "@/store/CartStore";
import { ShoppingCart } from "lucide-react";
import { API_URL } from "@/constants";
import axiosClient from "@/libraries/axiosClient";
import Link from "next/link";
import numeral from "numeral";
import { BackTop } from "antd";

function SearchProduct({ products }) {
  const { addToCart } = useCartStore();

  const handleAddCart = (productId) => {
    addToCart(productId);
  };

  return (
    <div className="grid grid-cols-5 gap-2 container">
      {products &&
        products.map((item) => {
          return (
            <div
              className="sm:min-w-[15.625rem] sm:min-h-[12.5rem] min-w-[100px] min-h-[100px] shadow-md rounded hover:bg-second-3 flex flex-col justify-center items-center mt-[3.125rem] mb-[3.125rem]"
              style={{
                background: "-webkit-linear-gradient(top,#fff 0%,#f7f7f7 100%)",
              }}
            >
              <div className="group relative inline-flex justify-center overflow-hidden items-center">
                <Link href={`/${item.id}`}>
                  <img
                    src={`${API_URL}/${item.imageUrl}`}
                    alt={`slide-${item.id}`}
                    className="sm:w-full sm:block flex items-center w-[7.5rem] object-contain"
                  />
                </Link>
                <div className="!absolute h-10  text-text-1 flex items-center justify-center -bottom-10 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all ">
                  <button
                    type="button"
                    className="bg-primry text-white py-1.5 min-w-[270px] font-roboto text-sm flex justify-center gap-[4px] items-center"
                    onClick={handleAddCart}
                  >
                    <ShoppingCart />
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <p className="font-roboto text-sm font-normal flex justify-center xxl:truncate">
                  {item.productName}
                </p>
                <span className="font-roboto text-sm font-normal flex justify-center">
                  {item.code}
                </span>
                <div className="flex justify-around">
                  {item.discount ? (
                    <>
                      <span className="font-roboto text-sm flex justify-center text-primry font-semibold">
                        {numeral(
                          item.price - (item.price * item.discount * 1) / 100
                        ).format("0,0")}
                        đ
                      </span>
                      <span className="font-roboto text-sm flex justify-center text-gray line-through">
                        {numeral(item.price).format("0,0")}đ
                      </span>
                    </>
                  ) : (
                    <p className="font-roboto text-sm flex justify-center text-primry font-semibold">
                      {numeral(item.price).format("0,0")}đ
                    </p>
                  )}
                </div>

                {/* <div className="flex justify-between px-[0.5rem]">
                                <div className="font-roboto text-sm opacity-50 font-normal flex gap-[4px]">
                                    <p>{item.rating.rate}</p>
                                    <p>({item.rating.count})</p>
                                </div>
                                <p className="font-roboto text-sm opacity-50 font-normal">{item.sell} <span>đã bán</span></p>
                            </div> */}
              </div>
            </div>
          );
        })}
      <BackTop />
    </div>
  );
}

export default memo(SearchProduct);

export async function getServerSideProps({ query }) {
  const searchQuery = query.q || "";

  const response = await axiosClient.get("/products");

  const product = response.data;

  const filteredProducts = product.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    props: {
      products: filteredProducts,
    },
  };
}
