import React, { memo } from "react";
import Link from "next/link";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronsRight } from "lucide-react";
import numeral from "numeral";
import { API_URL } from "@/constants";
import { Button, Divider, Rate } from "antd";
import router from "next/router";

import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import "swiper/css";

function SellingProduct({ products, reviews }) {
  const calculateAverageRating = (productId, reviews) => {
    const productReviews = reviews.filter(
      (review) => review.productId === productId
    );
    const totalReviews = productReviews.length;
    if (totalReviews === 0) return "0";
    const totalRating = productReviews.reduce(
      (sum, review) => sum + review.ratingRate,
      0
    );
    const averageRating = totalRating / totalReviews;
    return averageRating;
  };

  return (
    <div className="pt-[2.5rem]">
      <div className="flex justify-between">
        <span className="font-roboto font-medium text-primry text-2xl test">
          SẢN PHẨM BÁN CHẠY
        </span>
        <Link
          href="/selling"
          className="flex font-roboto text-primry underline"
        >
          Xem thêm <ChevronsRight />
        </Link>
      </div>

      <div className="flex pb-[4.3125rem] border-b border-primry pt-[1.25rem]">
        <Swiper
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          effect={"coverflow"}
          grabCursor={true}
          spaceBetween={70}
          className="swiper_banner "
          style={{ background: "white" }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          modules={[Autoplay, EffectCoverflow, Pagination]}
          speed={3000}
          breakpoints={{
            0: {
              slidesPerView: 1,
              centeredSlides: true,
            },
            320: {
              slidesPerView: 1,
              centeredSlides: true,
            },
            360: {
              slidesPerView: 2,
              centeredSlides: true,
            },
            900: {
              slidesPerView: 2,
              centeredSlides: true,
            },
            1200: {
              slidesPerView: 3,
              centeredSlides: true,
            },
          }}
        >
          {products &&
            products.map((item) => {
              return (
                <SwiperSlide key={item.id}>
                  <div
                    className="sm:min-w-[15.625rem] sm:min-h-[12.5rem] min-w-[50px] min-h-[50px] shadow-md rounded hover:bg-second-3 flex flex-col justify-center items-center border-pink"
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
                          className="hover:-translate-y-1 hover:scale-125  duration-300 text-clip sm:w-full sm:block flex items-center w-[7.5rem] object-contain"
                        />
                      </Link>
                    </div>
                    {item.discount > 0 && (
                      <span className="!absolute top-0 right-0 bg-primry font-poppins text-md font-normal py-[5px] sm:px-[50px] px-[10px] text-white">
                        -{item.discount}%
                      </span>
                    )}
                    <div className="flex flex-col gap-[6px]">
                      <h3 className="font-roboto text-md font-normal flex justify-center xxl:truncate text-center">
                        {item.productName}
                      </h3>
                      <span className="font-roboto text-md font-normal flex justify-center">
                        {item.code}
                      </span>
                      <div className="flex justify-around">
                        {item.discount ? (
                          <>
                            <span className="font-roboto text-md flex justify-center text-primry font-semibold">
                              {numeral(
                                item.price -
                                  (item.price * item.discount * 1) / 100
                              ).format("0,0")}
                              đ
                            </span>
                            <span className="font-roboto text-md flex justify-center text-gray line-through">
                              {numeral(item.price).format("0,0")}đ
                            </span>
                          </>
                        ) : (
                          <p className="font-roboto text-md flex justify-center text-primry font-semibold">
                            {numeral(item.price).format("0,0")}đ
                          </p>
                        )}
                      </div>
                      <div className="flex justify-center gap-2">
                        <Rate
                          allowHalf
                          disabled
                          defaultValue={calculateAverageRating(
                            item.id,
                            reviews
                          )}
                          style={{ fontSize: "18px" }}
                        />
                      </div>
                      <Divider>
                        <Button
                          className="bg-black text-white hover:bg-white hover:text-black font-light"
                          onClick={() => {
                            router.push(`/${item.id}`);
                          }}
                        >
                          Chi tiết
                        </Button>
                      </Divider>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </div>
  );
}

export default memo(SellingProduct);
