import React, { memo } from "react";
import { Laugh, Medal, BookHeadphones, Repeat } from 'lucide-react';

function TopFooter() {
    return (
        <footer className="border-t border-primry">
            <div className="container sm:grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 flex flex-col items-center mt-[1.875rem] mb-[50px]">
                <div className="flex flex-col gap-[0.25rem] xxl:w-[20.375rem] w-[300px]">
                    <div className="flex justify-center items-center text-center">
                        <Laugh className="sm:w-[100px] sm:h-[70px] ssm:h-[60px] w-[50px] h-[40px] font-roboto stroke-primry" />
                    </div>
                    <h3 className="font-roboto font-semibold text-base flex justify-center">KHÁCH HÀNG HÀI LÒNG</h3>
                    <span className="font-roboto text-sm font-normal flex text-center">Đặt sự hài lòng của khách hàng là ưu tiên số 1 trong mọi suy nghĩ hành động.</span>
                </div>
                <div className="flex flex-col gap-[0.25rem] xxl:w-[20.375rem] w-[300px] sm:mt-0 mt-[1.25rem]">
                    <div className="flex justify-center items-center text-center">
                        <Medal className="sm:w-[100px] sm:h-[70px] ssm:h-[60px] w-[50px] h-[40px] font-roboto stroke-primry" />
                    </div>
                    <h3 className="font-roboto font-semibold text-base flex justify-center">CHẤT LƯỢNG CAO CẤP</h3>
                    <span className="font-roboto text-sm font-normal flex text-center">Mọi sản phẩm đều được thiết kế và chế tác bởi các nghệ nhân hàng đầu.</span>
                </div>
                <div className="flex flex-col gap-[0.25rem] xxl:w-[20.375rem] w-[300px] lg:mt-0 mt-[1.25rem]">
                    <div className="flex justify-center items-center text-center">
                        <Repeat className="sm:w-[100px] sm:h-[70px] ssm:h-[60px] w-[50px] h-[40px] font-roboto stroke-primry" />
                    </div>
                    <h3 className="font-roboto font-semibold text-base flex justify-center">ĐỔI TRẢ DỄ DÀNG</h3>
                    <span className="font-roboto text-sm font-normal flex text-center">Đổi trả sản phẩm trong vòng 10 ngày. Hoàn tiền nếu không hài lòng.</span></div>
                <div className="flex flex-col gap-[0.25rem] xxl:w-[20.375rem] w-[300px] lg:mt-0 mt-[1.25rem]">
                    <div className="flex justify-center items-center text-center">
                        <BookHeadphones className="sm:w-[100px] sm:h-[70px] ssm:h-[60px] w-[50px] h-[40px] font-roboto stroke-primry" />
                    </div>
                    <h3 className="font-roboto font-semibold text-base flex justify-center">HỔ TRỢ NHIỆT TÌNH</h3>
                    <span className="font-roboto text-sm font-normal flex text-center">Tất cả câu hỏi đều được chúng tôi tư vấn, giải đáp kỹ càng.</span>
                </div>
            </div>
        </footer>
    );
}
export default memo(TopFooter);
