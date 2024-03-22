import Link from "next/link";
import React, { memo } from "react";
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

function ListFooter() {
    return (<div className="border-t border-gray">
        <div className="container sm:grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 flex flex-col items-center mt-[1.875rem] pb-[50px]">
            <div className="flex flex-col gap-[0.25rem] xxl:w-[20.375rem] w-[18.75rem]">
                <div className="flex justify-center items-center text-center">
                    <img src="./img/logo.png" alt="logo" className="w-[6.25rem]" />
                </div>
                <p className="font-roboto text-xl leading-[28px] font-medium text-primry flex justify-center">Jewellery</p>
                <p className="font-roboto text-sm leading-[28px]  flex justify-center">© 2017 Công Ty Cổ Phần Trang Sức Hải Châu
                    Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch & Đầu tư Đà Nẵng cấp lần đầu ngày 01/01/2010. Ngành, nghề kinh doanh.</p>
            </div>
            <div className="flex flex-col ga-[0.25rem] xxl:w-[20.375rem] w-[18.75rem] sm:mt-[6.25rem] mt-[1.25rem]">
                <h3 className="flex justify-center font-roboto text-xl font-bold leading-[1.75rem]">HỔ TRỢ</h3>
                <p className="font-roboto text-sm leading-[28px] hover:text-primry">
                    <Link
                        href="https://www.google.com/maps/place/K29+H%E1%BB%93+Xu%C3%A2n+H%C6%B0%C6%A1ng,+M%E1%BB%B9+An,+Ng%C5%A9+H%C3%A0nh+S%C6%A1n,+%C4%90%C3%A0+N%E1%BA%B5ng,+Vi%E1%BB%87t+Nam/@16.0397355,108.2419596,17z/data=!3m1!4b1!4m6!3m5!1s0x3142175df426c01b:0x520d565f2b990cf7!8m2!3d16.0397355!4d108.2445345!16s%2Fg%2F11fpp6tnrg?entry=ttu"
                        target="_blank"
                    >
                        K29 Hồ Xuân Hương, Bắc Mỹ An, Ngũ Hành Sơn, Đà Nẵng.
                    </Link>
                </p>
                <p className="font-roboto text-sm leading-[28px] hover:text-primry">
                    Email :
                    <Link href="mailto: jewellery@gmail.com" aria-label="email">
                        jewellery@gmail.com
                    </Link>
                </p>
                <p className="font-roboto text-sm leading-[28px] hover:text-primry">
                    Điện thoại :
                    <Link href="tel:+190028979" aria-label="phone">
                        +190028979
                    </Link>
                </p>
            </div>
            <div className="flex flex-col ga-[0.25rem] xxl:w-[20.375rem] w-[18.75rem] lg:mt-[100px] mt-[20px]">
                <h3 className="flex justify-center font-roboto text-xl font-bold leading-[1.75rem]">MUA HÀNG</h3>
                <Link
                    href="/products"
                    className="font-roboto text-sm leading-[28px] hover:text-primry "
                >
                    Sản phẩm chính hãng, uy tín, chất lượng cao.
                </Link>
                <Link href="/brand" aria-label="email" className="font-roboto text-sm leading-[28px] hover:text-primry ">
                    Thương hiệu lâu năm, luôn đặt lợi ích của khách hàng lên hàng đầu.
                </Link>
                <Link href="/" aria-label="phone" className="font-roboto text-sm leading-[28px] hover:text-primry ">
                    Hướng dẫn đo size trang sức.
                </Link>

            </div>
            <div className="flex flex-col gap-[0.5rem] xxl:w-[20.375rem] w-[18.75rem] lg:mt-[100px] mt-[20px]">
                <h3 className="flex justify-center font-roboto text-xl font-bold leading-[1.75rem]">KẾT NỐI VỚI CHÚNG TÔI</h3>
                <div className="flex gap-[16px]">
                    <Link href="https://www.facebook.com/hoangvinh02" className="rounded-full bg-black ssm:w-[40px] ssm:h-[40px] w-[30px] h-[30px] flex justify-center items-center">
                        <Facebook className="text-white" />
                    </Link>
                    <Link href="https://www.instagram.com/dzinhhh02">
                        <Instagram className="ssm:w-[40px] ssm:h-[40px] w-[30px] h-[30px]" />
                    </Link>
                    <Link href="https://twitter.com/">
                        <Twitter className="ssm:w-[40px] ssm:h-[40px] w-[30px] h-[30px]" />
                    </Link>
                    <Link href="https://www.linkedin.com/">
                        <Linkedin className="ssm:w-[40px] ssm:h-[40px] w-[30px] h-[30px]" />
                    </Link>
                </div>
                <h3 className="font-roboto text-xl font-bold flex ">QUAN TÂM ZALO</h3>
                <Link href="https://chat.zalo.me">
                    <img src="./img/zalo.jpg" alt="zalo" />
                </Link>

            </div>
        </div>

    </div>)
}
export default memo(ListFooter);