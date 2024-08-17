import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Close from "@mui/icons-material/Close";

import s from "./MobileMenu.module.scss";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

function MobileMenu({ isOpen, setIsOpen }: MobileMenuProps) {
  return (
    <div
      className={s.mobileMenuButton}
      style={{ left: isOpen ? "8.25rem" : "0px" }}
    >
      {!isOpen ? (
        <MenuIcon
          fontSize="medium"
          className={s.menuIcon}
          onClick={setIsOpen}
        />
      ) : (
        <Close fontSize="medium" className={s.menuIcon} onClick={setIsOpen} />
      )}
    </div>
  );
}

export default MobileMenu;
