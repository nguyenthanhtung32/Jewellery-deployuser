import React, { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import "swiper/css";

function Slide() {
    const listSlider = [
        {
            id: "4",
            src: "./img/anh-banner-5.jpg",
        },
        {
            id: "5",
            src: "./img/anh-banner-10.jpg",
        },
        {
            id: "6",
            src: "./img/anh-banner-9.jpg",
        },
    ];
    return (
        <div className="pt-[20px] md:flex block gap-4">
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                autoplay={{ delay: 2000 }}
                pagination={{
                    clickable: true,
                }}
                className="swiper_banner "
            >
                {listSlider.map((item) => {
                    return (
                        <SwiperSlide key={item.id}>
                            <img src={item.src} alt={`slide-${item.id}`} className="w-full sm:h-[27rem] h-[15rem] object-cover hover:-translate-y-1 hover:scale-105 duration-300" />
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            <div className="md:flex md:flex-col w-full hidden">
            <img src="./img/anh-banner-5.jpg" alt="aaa" className="sm:h-[9rem] h-[5rem] hover:-translate-y-1 hover:scale-105 duration-300" />
            <img src="./img/anh-banner-10.jpg" alt="aaa" className="sm:h-[9rem] h-[5rem] hover:-translate-y-1 hover:scale-105 duration-300" />
            <img src="./img/anh-banner-9.jpg" alt="aaa" className="sm:h-[9rem] h-[5rem] hover:-translate-y-1 hover:scale-105 duration-300" />
            </div>
        </div>)
}
export default memo(Slide);