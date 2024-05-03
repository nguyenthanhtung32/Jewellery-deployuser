import React, { memo, useRef, useState, useEffect } from "react";
import {
  ShoppingCart,
  Phone,
  AlignJustify,
  X,
  Search,
  LogOut,
} from "lucide-react";
import classNames from "classnames";
import Link from "next/link";
import { listAccount } from "@/constants/data-account.js";
import { API_URL } from "@/constants";
import { useRouter } from "next/router";
import { UserAddOutlined, LoginOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import axios from "../../../libraries/axiosClient";
import useCartStore from "@/store/CartStore";
import { toast } from "react-toastify";
("../navigation/index");

function TopHeader() {
  const router = useRouter();
  const dropdownRef = useRef(null);

  const HandleDropAccount = () => {
    setIsShowAccount(!isShowAccount);
  };
  const [isShowAccount, setIsShowAccount] = React.useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = React.useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLogin(true);
      const decoded = jwtDecode(token);
      setCustomerId(decoded._id);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogin(false);

    router.push("/");
    toast.success("Đăng xuất thành công");
  };

  const { getCartItems } = useCartStore();

  const cartItems = getCartItems(customerId);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsShowAccount(false);
    }
  };

  React.useEffect(() => {
    const handleDocumentClick = (e) => {
      handleClickOutside(e);
    };
    document.addEventListener("mousedown", handleDocumentClick);
  }, [isShowAccount, setIsShowAccount]);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const customerId = decoded._id;

      const response = await axios.get(`/customers/${customerId}`);
      const data = response.data;

      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (customerId) {
      // Check if customerId exists
      fetchCustomers(); // Fetch customer data for the current customerId
    }
  }, [customerId]); // useEffect will run again whenever customerId changes

  const [open, setOpen] = React.useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex justify-between container pt-[0.625rem]">
      <Link href="/" className="flex justify-end">
        <img
          src="/img/logo.png"
          alt="user"
          title="wiicamp-logo"
          className="md:w-[5rem] md:h-[4rem] w-[2.5rem] h-[2.5rem]"
        />
        <span className="items-center flex text-primry text-xl font-normal leading-7 font-roboto">
          JEWELLERY
        </span>
      </Link>

      <div className="flex justify-end ssm:gap-[2.5rem] gap-[1rem] items-center">
        {isLogin ? (
          <>
            <div className="flex gap-[0.25rem]" ref={dropdownRef}>
              <button
                type="button"
                id="user"
                aria-label="user"
                onClick={HandleDropAccount}
              >
                <img
                  src={`${API_URL}/${customers.avatarUrl}`}
                  alt="user"
                  title="wiicamp-logo"
                  className=" md:w-[2rem] md:h-[2rem] w-[1.5rem] h-[1.5rem] rounded-full"
                />
              </button>
              <span className="text-sm text-black leading-7 font-normal sm:block hidden font-roboto">
                {customers.lastName} {customers.firstName}
              </span>
              <div
                id="myDropdown"
                className={classNames(
                  "absolute min-w-[13rem] bg-primry z-40",
                  isShowAccount ? "block right-48 mt-[30px]" : "hidden"
                )}
              >
                <div className="pt-[18px] pr-[12px] pb-[10px] pl-[20px] flex flex-col gap-[13px] ">
                  {listAccount &&
                    listAccount.map((item) => {
                      return (
                        <a
                          className="flex gap-[16px] items-center text-white"
                          key={item.id}
                          href={item.link}
                          onClick={item.onClick}
                        >
                          <p>{item.icon}</p>
                          <p className="font-poppins text-sm font-normal leading-5">
                            {item.name}
                          </p>
                        </a>
                      );
                    })}
                  <button
                    className="flex gap-[16px] items-center text-white"
                    onClick={handleLogout}
                  >
                    <p>
                      <LogOut size={24} />
                    </p>
                    <p className="font-poppins text-sm font-normal leading-5">
                      Đăng xuất
                    </p>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-[0.25rem]">
              <Link href="/cart" aria-label="cart">
                <div className="relative">
                  <ShoppingCart className="md:w-[1.75rem] md:h-[1.75rem] w-[1.5rem] h-[1.5rem]" />
                  {cartItems.length >= 0 && (
                    <span className="top-[-8px] right-[-6px] absolute rounded-full bg-red text-white text-xs font-normal leading-[1.125rem] shrink-0 w-[1.25rem] h-[1.25rem] flex justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </div>
              </Link>
              <span className="text-sm text-black leading-7 font-normal sm:block hidden font-roboto">
                Giỏ hàng
              </span>
            </div>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="flex">
              <LoginOutlined className="text-2xl md:w-[1.75rem] md:h-[1.75rem] w-[1.5rem] h-[1.5rem]" />
              <span className="text-sm text-black leading-7 font-normal sm:block hidden font-roboto">
                Đăng nhập
              </span>
            </Link>

            <Link href="/sign-up" className="flex">
              <UserAddOutlined className="text-2xl md:w-[1.75rem] md:h-[1.75rem] w-[1.5rem] h-[1.5rem]" />
              <span className="text-sm text-black leading-7 font-normal sm:block hidden font-roboto">
                Đăng ký
              </span>
            </Link>
          </>
        )}

        <div>
          <AlignJustify onClick={showDrawer} className="md:hidden block" />
          {open && (
            <div
              className={classNames(
                "h-screen absolute right-0 bg-white top-0 drop-shadow-2xl w-[12.5rem] p-2"
              )}
              ref={dropdownRef}
            >
              <div className="flex justify-end">
                <X onClick={onClose} className="cursor-pointer mr-4 pt-2" />
              </div>
              <div className="flex justify-center items-center gap-[0.25rem] text-center py-[0.5rem]">
                <Phone className="w-[1.3rem] h-[1.3rem] text-primry" />
                <Link
                  href="tel:+88015-88888-9999"
                  aria-label="phone"
                  className="text-xl font-roboto font-medium leading-7 text-primry"
                >
                  190028979
                </Link>
              </div>
              <ul className="sm:hidden flex flex-col gap-[0.5rem] items-center">
                <li
                  className={classNames(
                    "text-base font-normal font-roboto leading-7"
                  )}
                >
                  <Link
                    href="/"
                    className={`flex items-center ${router.pathname === "/" ? "text-primry" : ""
                      }`}
                  >
                    Trang chủ
                  </Link>
                </li>
                <li
                  className={classNames(
                    "text-base font-normal font-roboto leading-7"
                  )}
                >
                  <Link
                    href="/products"
                    className={`flex items-center ${router.pathname === "/products" ? "text-primry" : ""
                      }`}
                  >
                    Sản phẩm
                  </Link>
                </li>
                <li
                  className={classNames(
                    "text-base font-normal font-roboto leading-7"
                  )}
                >
                  <Link
                    href="/wedding-jewelry"
                    className={`flex items-center ${router.pathname === "/wedding-jewelry"
                        ? "text-primry"
                        : ""
                      }`}
                  >
                    Trang sức cưới
                  </Link>
                </li>
                <li
                  className={classNames(
                    "text-base font-normal font-roboto leading-7"
                  )}
                >
                  <Link
                    href="/brand"
                    className={`flex items-center ${router.pathname === "/brand" ? "text-primry" : ""
                      }`}
                  >
                    Thương Hiệu
                  </Link>
                </li>
                <li
                  className={classNames(
                    "text-base font-normal font-roboto leading-7"
                  )}
                >
                  <Link
                    href="/promotion"
                    className={`flex items-center ${router.pathname === "/promotion" ? "text-primry" : ""
                      }`}
                  >
                    Khuyến mãi
                  </Link>
                </li>
                <li
                  className={classNames(
                    "text-base font-normal font-roboto leading-7"
                  )}
                >
                  <Link
                    href="/contact"
                    className={`flex items-center ${router.pathname === "/contact" ? "text-primry" : ""
                      }`}
                  >
                    Liên hệ
                  </Link>
                </li>
              </ul>
              <div className="relative sm:justify-center border-red md:hidden sm:pt-2 pt-[0.5rem]">
                <input
                  id="search"
                  className="block p-2 text-sm border-2 border-primry rounded-full lg:w-[24rem] md:w-[18rem]"
                  placeholder="Tìm kiếm nhanh...."
                  required
                  type="text"
                />
                <button
                  type="submit"
                  id="search"
                  aria-label="search"
                  className="text-black absolute right-2.5 lg:bottom-2.5 bottom-0.5 rounded-lg sm:absolute:none truncate"
                >
                  <Search className="text-primry" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default memo(TopHeader);
