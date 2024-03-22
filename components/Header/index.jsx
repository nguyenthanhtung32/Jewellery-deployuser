import React, {memo} from "react";
import TopHeader from "./top-header";
import Navigation from "./navigation";

function Header(){
    return(<div className="sticky top-0 z-40 " style={{
        background:
          "-webkit-linear-gradient(top,#fff 0%,#f7f7f7 100%)",
      }}>
        <TopHeader/>    
        <Navigation/>
    </div>)
}
export default memo(Header);
