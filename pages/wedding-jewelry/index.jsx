import React, { useState, memo } from "react";
import { Search } from "lucide-react";
import { Divider, BackTop, Button, Rate } from "antd";
import numeral from "numeral";
import Link from "next/link";
import axiosClient from "@/libraries/axiosClient";
import { API_URL } from "@/constants";

function WeddingJewelry({ products, reviews }) {
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedStone, setSelectedStone] = useState("");

  const totalProducts = products.length;

  const handleShowMore = () => {
    const newVisibleProducts = visibleProducts + 8;
    const nextVisibleProducts = Math.min(newVisibleProducts, totalProducts);
    setVisibleProducts(nextVisibleProducts);
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
    <>
      <div className="container mt-5 font-roboto">
        <div className="flex justify-center w-full">
          <img
            src="https://file.hstatic.net/1000381168/collection/1920x820px_26f943dfb45a417eba1d409288cd08c0.png"
            alt="trang-suc-cuoi"
          />
        </div>

        <div className="mx-2.5 mt-8">
          <div className="flex items-center justify-between mb-1 space-x-4">
            <div className="w-1/4 md:flex hidden">
              <select
                id="filter-price"
                name="filter-price"
                className="w-full px-2 py-1.5 border"
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
            <div className="w-1/4 md:flex hidden">
              <select
                id="filter-material"
                name="filter-material"
                className="w-full px-2 py-1.5 border"
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
            <div className="w-1/4 md:flex hidden">
              <select
                id="filter-stone"
                name="filter-stone"
                className="w-full px-2 py-1.5 border"
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
          <div className="flex items-center mb-5">
            {selectedPrice && (
              <div className="flex items-center mr-2 border px-1 py-0.1 mt-3 bg-pink">
                <span>{selectedDisplayValue}</span>
                <button
                  className="text-red-500 ml-3 pb-0.5"
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
                  className="text-red-500 ml-3 pb-0.5"
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
                  className="text-red-500 ml-3 pb-0.5"
                  onClick={() => setSelectedStone("")}
                >
                  x
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="font-roboto font-medium text-primry text-3xl m-8 flex justify-center">
          NHẪN CƯỚI
        </p>

        <div className="grid lg:grid-cols-4 gap-10 md:grid-cols-3 sm:grid-cols-2 mx-2.5">
          {filteredProducts
            .filter((item) => item.categoryId === "65d72854f159c29036e3b592")
            .slice(0, visibleProducts)
            .map((item) => (
              <div
                key={item._id}
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
                  {item.discount > 0 && (
                    <span className="!absolute top-0 right-0 bg-primry font-poppins text-sm font-normal py-[4px] sm:px-[25px] px-[10px] text-white">
                      -{item.discount}%
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-[6px]">
                  <p className="font-roboto mx-4 text-sm font-normal flex justify-center xxl:truncate text-center">
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
                  <div className="flex justify-center gap-2">
                    <Rate
                      allowHalf
                      disabled
                      defaultValue={calculateAverageRating(item.id, reviews)}
                      style={{ fontSize: "18px" }}
                    />
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
                </div>
              </div>
            ))}
        </div>
        <span className="flex justify-center font-elle mt-7 mb-3">
          Hiển thị
          {Math.min(
            filteredProducts.filter(
              (item) => item.categoryId === "65d72854f159c29036e3b592"
            ).length,
            visibleProducts
          )}
          /
          {
            filteredProducts.filter(
              (item) => item.categoryId === "65d72854f159c29036e3b592"
            ).length
          }
        </span>
        {filteredProducts.filter(
          (item) => item.categoryId === "65d72854f159c29036e3b592"
        ).length > visibleProducts && (
          <button
            className=" block mx-auto py-3 px-5 mb-10 border border-primry text-black bg-white hover:bg-primry hover:text-white transition-colors duration-300"
            onClick={handleShowMore}
          >
            XEM THÊM SẢN PHẨM
          </button>
        )}
      </div>

      <div className="flex justify-center item-center mb-5">
        <img
          className="w-[500px] h-auto"
          alt=""
          src="https://scontent.fdad4-1.fna.fbcdn.net/v/t1.15752-9/432339548_650257733964462_1568424930694873481_n.png?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGf9V6MiNIgbLBSn15_uIskevuemWo27t56-56Zajbu3vORCZk75cyMaEack1RvBVkh1du209ZJjeLki06fV_t_&_nc_ohc=0enDyxGFN38AX8dNCkw&_nc_ht=scontent.fdad4-1.fna&oh=03_AdSm86IoQQ_PUXR_4K1KOyScRfzUOM5AKx-3BOpvvXwR8Q&oe=6617E221"
        />
      </div>

      <div className="container mt-5 font-roboto">
        <div className="mt-[3.125rem] flex justify-center w-full">
          <img
            src="https://www.mulloysjewelry.com/cdn/shop/collections/Memoire_Top_Banner_2307x630.jpg?v=1683717094"
            alt="trang-suc-cuoi"
          />
        </div>
        <p className="font-roboto font-medium text-primry text-3xl m-8 flex justify-center">
          QUÀ KỶ NIỆM
        </p>
        <div className="grid lg:grid-cols-4 gap-10 md:grid-cols-3 sm:grid-cols-2 mx-2.5">
          {filteredProducts
            .filter((item) => item.categoryId === "65f12a3743051681d5a2c8bd")
            .slice(0, visibleProducts)
            .map((item) => (
              <div
                key={item._id}
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
                  <div className="flex justify-center gap-2">
                    <Rate
                      allowHalf
                      disabled
                      defaultValue={calculateAverageRating(item.id, reviews)}
                      style={{ fontSize: "18px" }}
                    />
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
                </div>
              </div>
            ))}
        </div>
        <span className="flex justify-center font-elle mt-7 mb-3">
          Hiển thị
          {Math.min(
            filteredProducts.filter(
              (item) => item.categoryId === "65f12a3743051681d5a2c8bd"
            ).length,
            visibleProducts
          )}
          /
          {
            filteredProducts.filter(
              (item) => item.categoryId === "65f12a3743051681d5a2c8bd"
            ).length
          }
        </span>
        {filteredProducts.filter(
          (item) => item.categoryId === "65f12a3743051681d5a2c8bd"
        ).length > visibleProducts && (
          <button
            className=" block mx-auto py-3 px-5 mb-10 border border-primry text-black bg-white hover:bg-primry hover:text-white transition-colors duration-300"
            onClick={handleShowMore}
          >
            XEM THÊM SẢN PHẨM
          </button>
        )}
        <BackTop />
      </div>
    </>
  );
}
export default memo(WeddingJewelry);

export async function getStaticProps() {
  try {
    const [productsResponse, categoriesResponse, reviewsResponse] =
      await Promise.all([
        axiosClient.get("/products"),
        axiosClient.get("/categories"),
        axiosClient.get("/reviews"),
      ]);

    return {
      props: {
        products: productsResponse.data,
        categories: categoriesResponse.data,
        reviews: reviewsResponse.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
