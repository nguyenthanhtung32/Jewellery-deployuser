import React, { Component } from "react";
import { FacebookProvider, CustomChat } from "react-facebook";

export default class Example extends Component {
  render() {
    return (
      <FacebookProvider appId="1606419203484962" chatSupport>
        <CustomChat pageId="271506132704343" minimized={false} />
      </FacebookProvider>
    );
  }
}