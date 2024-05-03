import React, { memo } from "react";
import Slide from "./slide"
import SellingProducts from "./selling-products";
import NewProduct from "./new-product";
import Diamond from "./diamond-jewelry";
import GoldJewelry from "./gold-jewelry";
import SliverJewelry from "./silver-jewelry";

function HomePage({products, reviews}) {
    return (
        <>
            <Slide />
            <SellingProducts products={products} reviews={reviews}/>
            <NewProduct products={products} reviews={reviews}/>
            <Diamond products={products} reviews={reviews}/>
            <GoldJewelry products={products} reviews={reviews}/>
            <SliverJewelry products={products} reviews={reviews}/>
        </>
    )
}
export default memo(HomePage);