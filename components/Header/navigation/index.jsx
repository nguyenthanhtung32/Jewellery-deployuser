import React, { memo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";
import useSearch from "@/store/SearchBar";
import { Search } from "lucide-react";

function Navigation() {
  const router = useRouter();

  const keyword = useSearch((state) => state.keyword);
  const setKeyword = useSearch((state) => state.setKeyword);
  const clearKeyword = useSearch((state) => state.clearKeyword);

  // search
  React.useEffect(() => {
    const isSearchPage = router.pathname === "/search-products";
    if (isSearchPage) {
      setKeyword(router.query.q || "");
    } else {
      clearKeyword();
    }
  }, [router.pathname, router.query.q, setKeyword, clearKeyword]);

  const onSearch = () => {
    const encodeSearchQuery = encodeURI(keyword);
    router.push(`/search-products?q=${encodeSearchQuery}`);
  };

  return (
    <div className="flex container justify-between mt-[0.625rem] pb-[0.625rem]">
      <ul className="sm:flex xl:gap-[60px] md:gap-[20px] gap-[40px] hidden">
        <li
          className={classNames(
            "text-base font-normal font-roboto leading-7 hover:-translate-y-1 hover:scale-105  duration-300"
          )}
        >
          <Link
            href="/"
            className={`flex items-center ${
              router.pathname === "/" ? "border-b-2 border-primry" : ""
            }`}
          >
            Trang chủ
          </Link>
        </li>
        <li
          className={classNames(
            "text-base font-normal font-roboto leading-7 hover:-translate-y-1 hover:scale-105  duration-300"
          )}
        >
          <Link
            href="/products"
            className={`flex items-center ${
              router.pathname === "/products" ? "border-b-2 border-primry" : ""
            }`}
          >
            Sản phẩm
          </Link>
        </li>
        <li
          className={classNames(
            "text-base font-normal font-roboto leading-7 hover:-translate-y-1 hover:scale-105  duration-300"
          )}
        >
          <Link
            href="/wedding-jewelry"
            className={`flex items-center ${
              router.pathname === "/wedding-jewelry"
                ? "border-b-2 border-primry"
                : ""
            }`}
          >
            Trang sức cưới
          </Link>
        </li>
        <li
          className={classNames(
            "text-base font-normal font-roboto leading-7 hover:-translate-y-1 hover:scale-105  duration-300"
          )}
        >
          <Link
            href="/brand"
            className={`flex items-center ${
              router.pathname === "/brand" ? "border-b-2 border-primry" : ""
            }`}
          >
            Thương Hiệu
          </Link>
        </li>
        <li
          className={classNames(
            "text-base font-normal font-roboto leading-7 hover:-translate-y-1 hover:scale-105  duration-300"
          )}
        >
          <Link
            href="/promotion"
            className={`flex items-center ${
              router.pathname === "/promotion" ? "border-b-2 border-primry" : ""
            }`}
          >
            Khuyến mãi
          </Link>
        </li>
        <li
          className={classNames(
            "text-base font-normal font-roboto leading-7 hover:-translate-y-1 hover:scale-105  duration-300"
          )}
        >
          <Link
            href="/contact"
            className={`flex items-center ${
              router.pathname === "/contact" ? "border-b-2 border-primry" : ""
            }`}
          >
            Liên hệ
          </Link>
        </li>
      </ul>
      <div className="relative md:flex sm:justify-center hidden hover:-translate-y-1 hover:scale-105  duration-300 ">
        <input
          id="search"
          className="block p-2 text-sm border-2 border-primry rounded-full lg:w-[24rem] md:w-[14rem]"
          placeholder="Tìm kiếm nhanh...."
          required
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
        />
        <button
          type="button" // Change type to "button" to prevent form submission
          aria-label="search"
          onClick={onSearch}
          className="text-black absolute right-2.5 lg:bottom-2.5 bottom-0.5 rounded-lg absolute:none truncate"
        >
          <Search className="text-primry" />
        </button>
      </div>
    </div>
  );
}

export default memo(Navigation);
