import React, { memo } from "react";
import TopFooter from "./top-footer";
import ListFooter from "./list-footer";

function Footer() {
  return (
    <footer className="border-t border-primry" style={{
      background:
        "-webkit-linear-gradient(top,#fff 0%,#f7f7f7 100%)",
    }}>
      <TopFooter />
      <ListFooter />
    </footer>
  );
}
export default memo(Footer);
