import router from "next/router";
import React, { useState, memo } from "react";
import { ShoppingCart, Search } from "lucide-react";
import { BackTop, Button, Divider } from "antd";
import numeral from "numeral";
import Link from "next/link";
import axiosClient from "@/libraries/axiosClient";
import { API_URL } from "@/constants";

function Products({ products, categories }) {
  const [visibleProducts, setVisibleProducts] = useState(20);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedStone, setSelectedStone] = useState("");

  const totalProducts = products.length;

  const handleAddCart = (productId) => {
    addToCart(productId);
  };

  const handleShowMore = () => {
    const newVisibleProducts = visibleProducts + 20;
    const nextVisibleProducts = Math.min(newVisibleProducts, totalProducts);
    setVisibleProducts(nextVisibleProducts);
  };

  const handleCategorySelect = (categoryId) => {
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
    setSelectedCategory(categoryId);
  };

  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
  };

  const handleStoneSelect = (stone) => {
    setSelectedStone(stone);
  };

  const handlePriceSelect = (price) => {
    setSelectedPrice(price);
  };

  const filterProducts = () => {
    let filteredProducts = products;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryId === selectedCategory
      );
    }

    if (selectedMaterial) {
      filteredProducts = filteredProducts.filter((product) =>
        product.productName
          .toLowerCase()
          .includes(selectedMaterial.toLowerCase())
      );
    }

    if (selectedStone) {
      filteredProducts = filteredProducts.filter((product) =>
        product.productName.toLowerCase().includes(selectedStone.toLowerCase())
      );
    }

    if (selectedPrice) {
      filteredProducts = filteredProducts.filter((product) =>
        checkDiscountedPriceRange(product, selectedPrice)
      );
    }

    if (searchKeyword) {
      filteredProducts = filteredProducts.filter((product) =>
        product.productName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    return filteredProducts;
  };

  const getDiscountedPrice = (product) => {
    return product.discount
      ? product.price - (product.price * product.discount) / 100
      : product.price;
  };

  const formatSelectedValue = (selectedValue) => {
    if (selectedValue === "- 5000000") {
      return "Dưới 5,000,000đ";
    }
    if (selectedValue === "5000000 - 10000000")
      return "5,000,000đ - 10,000,000đ";
    if (selectedValue === "10000000 - 20000000")
      return "10,000,000đ - 20,000,000đ";
    if (selectedValue === "20000000 - 30000000")
      return "20,000,000đ - 30,000,000đ";
    if (selectedValue === "30000000 - 50000000")
      return "30,000,000đ - 50,000,000đ";
    if (selectedValue === "50000000 - 70000000")
      return "50,000,000đ - 70,000,000đ";
    if (selectedValue === "70000000 - 100000000")
      return "70,000,000đ - 100,000,000đ";
    if (selectedValue === "100000000 - 150000000")
      return "100,000,000đ - 150,000,000đ";
    if (selectedValue === "150000000 - 200000000")
      return "150,000,000đ - 200,000,000đ";
    if (selectedValue === "200000000 -") return "Trên 200,000,000đ";
  };

  const checkDiscountedPriceRange = (product, selectedPrice) => {
    const [minPrice, maxPrice] = selectedPrice.split("-");
    const price = getDiscountedPrice(product);

    if (minPrice && maxPrice) {
      return price >= parseInt(minPrice) && price <= parseInt(maxPrice);
    } else if (minPrice) {
      return price >= parseInt(minPrice);
    } else if (maxPrice) {
      return price <= parseInt(maxPrice);
    }
  };
  const selectedDisplayValue = formatSelectedValue(selectedPrice);
  const filteredProducts = filterProducts();

  return (
    <div className="container mt-5">
      <div className="flex justify-center">
        <img className="mb-5" src="./img/banner-product.png" alt="products" />
      </div>
      <div className="mb-5 mx-2.5">
        <div className="flex items-center justify-between mb-1 space-x-4 ">
          <div className="w-1/4 md:flex border">
            <select
              id="filter-category"
              name="filter-category"
              className="w-full px-2 py-1.5"
              onChange={(e) => handleCategorySelect(e.target.value)}
              value={selectedCategory}
            >
              <option value="" disabled hidden>
                Danh Mục
              </option>
              {categories.slice(1, 6).map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/4 md:flex border">
            <select
              id="filter-price"
              name="filter-price"
              className="w-full px-2 py-1.5"
              onChange={(e) => handlePriceSelect(e.target.value)}
              value={selectedPrice}
            >
              <option value="" disabled hidden>
                Lọc Giá Sản Phẩm
              </option>
              <option value="- 5000000">Dưới 5,000,000đ</option>
              <option value="5000000 - 10000000">
                5,000,000đ - 10,000,000đ
              </option>
              <option value="10000000 - 20000000">
                10,000,000đ - 20,000,000đ
              </option>
              <option value="20000000 - 30000000">
                20,000,000đ - 30,000,000đ
              </option>
              <option value="30000000 - 50000000">
                30,000,000đ - 50,000,000đ
              </option>
              <option value="50000000 - 70000000">
                50,000,000đ - 70,000,000đ
              </option>
              <option value="70000000 - 100000000">
                70,000,000đ - 100,000,000đ
              </option>
              <option value="100000000 - 150000000">
                100,000,000đ - 150,000,000đ
              </option>
              <option value="150000000 - 200000000">
                150,000,000đ - 200,000,000đ
              </option>
              <option value="200000000 -">Trên 200,000,000đ</option>
            </select>
          </div>
          <div className="w-1/4 relative flex ">
            <input
              id="search"
              className="border w-full px-2 py-1.5 text-left"
              placeholder="Tìm kiếm..."
              required
              type="text"
              onChange={(e) => setSearchKeyword(e.target.value)}
              value={searchKeyword}
            />
            <button
              type="submit"
              id="search"
              aria-label="search"
              className="absolute right-2.5 mt-1.5 mr-1"
            >
              <Search className="text-primry" />
            </button>
          </div>
          <div className="w-1/4 md:flex border">
            <select
              id="filter-material"
              name="filter-material"
              className="w-full px-2 py-1.5"
              onChange={(e) => handleMaterialSelect(e.target.value)}
              value={selectedMaterial}
            >
              <option value="" disabled hidden>
                Chất Liệu
              </option>
              <option value="Vàng">Vàng</option>
              <option value="Bạc">Bạc</option>
            </select>
          </div>
          <div className="w-1/4 md:flex border">
            <select
              id="filter-stone"
              name="filter-stone"
              className="w-full px-2 py-1.5"
              onChange={(e) => handleStoneSelect(e.target.value)}
              value={selectedStone}
            >
              <option value="" disabled hidden>
                Đá Đính Kèm
              </option>
              <option value="Kim Cương">Kim Cương</option>
              <option value="Đá">Đá</option>
            </select>
          </div>
        </div>
        <div className="flex items-center mb-5 ">
          {selectedCategory && (
            <div className="flex items-center mr-2 border px-1 py-0.1 mt-3  ">
              <span>
                {
                  categories.find(
                    (category) => category._id === selectedCategory
                  )?.name
                }
              </span>
              <button
                className="ml-1 text-red-500 ml-3 pb-0.5"
                onClick={() => setSelectedCategory("")}
              >
                x
              </button>
            </div>
          )}

          {selectedPrice && (
            <div className="flex items-center mr-2 border px-1 py-0.1 mt-3 bg-pink">
              <span>{selectedDisplayValue}</span>
              <button
                className="ml-1 text-red-500 ml-3 pb-0.5"
                onClick={() => setSelectedPrice("")}
              >
                x
              </button>
            </div>
          )}

          {selectedMaterial && (
            <div className="flex items-center mr-2 border px-1 py-0.1 mt-3 bg-pink">
              <span>{selectedMaterial}</span>
              <button
                className="ml-1 text-red-500 ml-3 pb-0.5"
                onClick={() => setSelectedMaterial("")}
              >
                x
              </button>
            </div>
          )}

          {selectedStone && (
            <div className="flex items-center mr-2 border px-1 py-0.1 mt-3 bg-pink">
              <span>{selectedStone}</span>
              <button
                className="ml-1 text-red-500 ml-3 pb-0.5"
                onClick={() => setSelectedStone("")}
              >
                x
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-4 gap-10 md:grid-cols-3 sm:grid-cols-2 mx-2.5">
        {filteredProducts.slice(0, visibleProducts).map((item) => (
          <div
            key={item._id}
            className="sm:min-w-[15.625rem] sm:min-h-[12.5rem] min-w-[100px] min-h-[100px] shadow-md rounded hover:bg-second-3 flex flex-col justify-center items-center"
            style={{
              background: "-webkit-linear-gradient(top,#fff 0%,#f7f7f7 100%)",
            }}
          >
            <div className="group relative inline-flex justify-center overflow-hidden items-center">
              <Link href={`/${item.id}`}>
                <img
                  src={`${API_URL}/${item.imageUrl}`}
                  alt={`slide-${item.id}`}
                  className="hover:-translate-y-1 hover:scale-105  duration-300 sm:w-full sm:block flex items-center w-[7.5rem] object-contain"
                />
              </Link>
            </div>
            {item.discount > 0 && (
              <span className="!absolute top-0 left-0 bg-primry font-poppins text-sm font-normal py-[4px] sm:px-[25px] px-[10px] text-white">
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
        ))}
      </div>
      <span className="flex justify-center font-elle mt-7 mb-3">
        Hiển thị {Math.min(filteredProducts.length, visibleProducts)}/
        {filteredProducts.length}
      </span>
      {filteredProducts.length > visibleProducts && (
        <button
          className=" block mx-auto py-3 px-5 mb-10 border border-primry text-black bg-white hover:bg-primry hover:text-white transition-colors duration-300"
          onClick={handleShowMore}
        >
          XEM THÊM SẢN PHẨM
        </button>
      )}
      <BackTop />
    </div>
  );
}
export default memo(Products);

export async function getStaticProps() {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      axiosClient.get("/products"),
      axiosClient.get("/categories"),
    ]);

    return {
      props: {
        products: productsResponse.data,
        categories: categoriesResponse.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
