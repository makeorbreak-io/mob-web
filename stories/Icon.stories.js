import React from "react";

import Icon from "components/2020/uikit/Icon";

export default { title: "Icon" };

export const MainColor = () => (
  <>
    <section><Icon type="email" /></section>
    <section><Icon type="facebook" /></section>
    <section><Icon type="medium" /></section>
    <section><Icon type="twitter" /></section>
  </>
);

export const FooterColor = () => (
  <>
    <section className="black"><Icon color="footer" type="email" /></section>
    <section className="black"><Icon color="footer" type="facebook" /></section>
    <section className="black"><Icon color="footer" type="medium" /></section>
    <section className="black"><Icon color="footer" type="twitter" /></section>
  </>
);
