import React from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { authorize } from "store/reducers/authReducer";
import { useAppDispatch } from "hooks/store";

import ShareIcon from "components/icons/ShareIcon";
import InstagramIcon from "components/icons/InstagramIcon";
import ArrowRight from "components/icons/ArrowRight";

import s from "./SettingsPageContent.module.scss";

function SettingsPageContent() {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  
  const handleAuth = () => {
    dispatch(authorize())
    navigate('/')
  }
  return (
    <>
      <div className={s.pageTitle}>Settings</div>
      <div className={s.sections}>
        <div className={s.section}>
          <div className={s.sectionTitle}>Profile</div>
          <ul className={s.sectionContent}>
            <li className={`${s.iconSetting} ${s.sectionContentItem}`}>
              Email
            </li>
            <li className={`${s.iconSetting} ${s.sectionContentItem}`}>
                <button type="button" className={s.linkButton} onClick={handleAuth}>
                  Exit
                </button>
              <ArrowRight />
            </li>
          </ul>
        </div>
        <div className={s.section}>
          <div className={s.sectionTitle}>General</div>
          <ul className={s.sectionContent}>
            <li className={`${s.iconSetting} ${s.sectionContentItem}`}>
              <button type="button" className={s.linkButton}>
                Language
              </button>
              <ArrowRight />
            </li>
          </ul>
        </div>
        <div className={s.section}>
          <div className={s.sectionTitle}>Social media</div>
          <ul className={s.sectionContent}>
            <li
              className={`${s.iconSettingWithoutSpaceBetween} ${s.sectionContentItem}`}
            >
              <ShareIcon />
              Share app
            </li>
            <li
              className={`${s.iconSettingWithoutSpaceBetween} ${s.sectionContentItem}`}
            >
              <InstagramIcon />
              <NavLink to="https://www.instagram.com/" target="_blank">
                Share on Instagram
              </NavLink>
            </li>
          </ul>
        </div>
        <div className={s.section}>
          <div className={s.sectionTitle}>Legal documents</div>
          <ul className={s.sectionContent}>
            <li className={`${s.iconSetting} ${s.sectionContentItem}`}>
              <NavLink to="#">Terms of Use </NavLink>
              <ArrowRight />
            </li>
            <li className={`${s.iconSetting} ${s.sectionContentItem}`}>
              <NavLink to="#">Privacy Policy </NavLink>
              <ArrowRight />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default SettingsPageContent;
