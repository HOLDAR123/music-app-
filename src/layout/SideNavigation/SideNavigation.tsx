import React from "react";
import { Link, useLocation } from "react-router-dom";

import logo from "images/logo.png";
import SettingsIcon from "components/icons/SettingsIcon";
import GenerationIcon from "components/icons/GenerationIcon";
import LivePadsNavIcon from "components/icons/LivePadsNavIcon";
import AvatarIcon from "components/icons/AvatarIcon";
import s from "./SideNavigation.module.scss";

interface SideNavigationProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

function SideNavigation({ isOpen, setIsOpen }: SideNavigationProps) {
  const location = useLocation();

  return (
    <div
      className={`${s.sideNavigation}`}
      style={{ display: isOpen ? "flex" : "" }}
    >
      <div className={s.logoWrapper}>
        <img src={logo} alt="" className="fill" />
      </div>
      <div className={s.navigation}>
        <div className={s.sideNavigation}>
          <div
            className={`${s.linkItem} ${
              location.pathname === "/" ? s.activeLink : ""
            }`}
          >
            <div className={s.linkContent}>
              <GenerationIcon />
              <span className={s.title}>Generator</span>
              <Link to="/" className={s.link} />
            </div>
          </div>
          <div
            className={`${s.linkItem} ${
              location.pathname === "/tabs" ? s.activeLink : ""
            }`}
          >
            <div className={s.linkContent}>
              <LivePadsNavIcon />
              <span className={s.title}>Live Pads</span>
              <Link to="/tabs" className={s.link} />
            </div>
          </div>
        </div>

        <div className={s.sideNavigation}>
          <div
            className={`${s.linkItem} ${
              location.pathname === "/profile" ? s.activeLink : ""
            }`}
          >
            <div className={s.linkContentProfile}>
              <AvatarIcon className={s.avatarIcon} />
              <span className={s.profileTitle}>Profile</span>
              <Link to="/profile" className={s.link} />
            </div>
          </div>

          <div
            className={`${s.linkItem} ${
              location.pathname === "/settings" ? s.activeLink : ""
            }`}
          >
            <div className={s.linkContentSettings}>
              <SettingsIcon className={s.settingsIcon} />
              <span className={s.title}>Settings</span>
              <Link to="/settings" className={s.link} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNavigation;
