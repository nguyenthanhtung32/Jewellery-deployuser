import React, { memo, useRef } from "react";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";
import numeral from "numeral";
import { API_URL } from "@/constants";
import { Button, Divider } from "antd";

import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import "swiper/css";

function Diamond({ products }) {
  const router = useRouter();

  const handleLink = () => {
    router.push("/product-diamond");
  };

  const [autoplayConfig, setAutoplayConfig] = React.useState({
    delay: 3000,
    disableOnInteraction: false,
    reverseDirection: true,
  });

  const swiperRef = useRef();

  return (
    <div className="border-b border-primry">
      <div className="mt-[3.125rem] flex justify-center w-full">
        <img
          src="https://cdn.pnj.io/images/promo/197/kim-cuong-t1-2024-1200x450CTA.jpg"
          alt="trang-suc-kim-cuong"
        />
      </div>
      <p className="font-roboto font-medium text-primry text-2xl mt-[50px] flex justify-center">
        TRANG SỨC KIM CƯƠNG
      </p>
      <div className="flex pb-[2.5rem] pt-[1.25rem]">
        <Swiper
          modules={[Autoplay, Navigation]}
          effect={"coverflow"}
          spaceBetween={30}
          navigation
          slidesPerView="auto"
          style={{ background: "white" }}
          ref={swiperRef}
          speed={3000}
          autoplay={autoplayConfig}
          loop={true}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
            360: {
              slidesPerView: 1.5,
              spaceBetween: 30,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            600: {
              slidesPerView: 2.5,
              spaceBetween: 30,
            },
            800: {
              slidesPerView: 3.5,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            1440: {
              slidesPerView: 4,
              centeredSlides: true,
            },
          }}
        >
          {products &&
            products
              .filter((product) =>
                product.productName.toLowerCase().includes("kim cương")
              )
              .map((item) => {
                return (
                  <SwiperSlide key={item.id}>
                    <div
                      className="sm:min-w-[15.625rem] sm:min-h-[12.5rem] min-w-[100px] min-h-[100px] shadow-md rounded hover:bg-second-3 flex flex-col justify-center items-center"
                      style={{
                        background:
                          "-webkit-linear-gradient(top,#fff 0%,#f7f7f7 100%)",
                      }}
                    >
                      <div className="group relative inline-flex justify-center overflow-hidden items-center">
                        <Link href={`/${item.id}`}>
                          <img
                            src={`${API_URL}/${item.imageUrl}`}
                            alt={`slide-${item.id}`}
                            className="hover:-translate-y-1 hover:scale-125  duration-300 sm:w-full sm:block flex items-center w-[7.5rem] object-contain"
                          />
                        </Link>
                      </div>
                      {item.discount > 0 && (
                        <span className="!absolute top-0 right-0 bg-primry font-poppins text-sm font-normal py-[4px] sm:px-[25px] px-[10px] text-white">
                          -{item.discount}%
                        </span>
                      )}
                      <div className="flex flex-col gap-[6px]">
                        <p className="font-roboto text-sm font-normal flex justify-center xxl:truncate text-center">
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
                                  item.price -
                                    (item.price * item.discount * 1) / 100
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
                        <Divider>
                          <Button
                            className="bg-black text-white hover:bg-white font-light"
                            onClick={() => {
                              router.push(`/${item.id}`);
                            }}
                          >
                            Chi tiết
                          </Button>
                        </Divider>
                        {/* <div className="flex justify-between px-[0.5rem]">
                                                <div className="font-roboto text-sm opacity-50 font-normal flex gap-[4px]">
                                                    <p>{item.rating.rate}</p>
                                                    <p>({item.rating.count})</p>
                                                </div>
                                                <p className="font-roboto text-sm opacity-50 font-normal">{item.sell} <span>đã bán</span></p>
                                            </div> */}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
        </Swiper>
      </div>
      <div className="flex justify-center items-center text-center pb-[3.125rem] ">
        <button
          type="button"
          onClick={handleLink}
          className=" block mx-auto py-3 px-10 border border-primry text-black bg-white hover:bg-primry hover:text-white"
        >
          Xem thêm
        </button>
      </div>
    </div>
  );
}

export default memo(Diamond);
