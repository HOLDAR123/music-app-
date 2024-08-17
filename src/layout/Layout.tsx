import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Toastify from "components/helpers/Toastify";

import SideNavigation from "./SideNavigation";
import MobileMenu from "./MobileMenu";

import s from "./Layout.module.scss";

function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={s.layout}
      style={{
        display: "grid",
        gridTemplateColumns: isOpen ? "8.25rem 1fr" : "",
      }}
    >
      <SideNavigation isOpen={isOpen} setIsOpen={toggleMenu} />
      <MobileMenu isOpen={isOpen} setIsOpen={toggleMenu} />
      <div className={isOpen ? s.outletBlur : ""}>
        <Outlet />
      </div>
      <div className={s.toastifyContainer}>
        <Toastify />
      </div>
    </div>
  );
}

export default Layout;
