import React from "react";

import Button from "components/common/Button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "hooks/store";
import { authorize } from "store/reducers/authReducer";

import GoogleMediaIcon from "components/icons/GoogleMediaIcon";
import MagiclyMediaIcon from "components/icons/MagiclyMediaIcon";

import logo from "images/logo.png";

import s from "./AuthorizationPage.module.scss";

function AuthorizationPage() {
  const location = useLocation();

  const isSignUpPage = location.pathname === "/";

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAuth = () => {
    dispatch(authorize());
    navigate("/");
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.logo}>
          <img src={logo} alt="logo" />
        </div>
        <div className={s.authorizationActions}>
          <Button
            variant={isSignUpPage ? "filledColored" : "filled"}
            link="/login"
          >
            Login
            <NavLink to="/login" className={s.link} />
          </Button>
          <div className={s.separation} />
          <Button variant={isSignUpPage ? "filled" : "filledColored"} link="/">
            Sign Up
          </Button>
        </div>
      </div>
      <div className={s.registrationForm}>
        <div className={s.registrationFormTitle}>
          {isSignUpPage ? "Sign" : "Login"} to your account
        </div>
        <div className={s.registrationFormRecoveryPassword}>
          If you need help recovering your
          <div>
            password
            <NavLink to="#" className={s.linkPassword}>
              {" click here"}
            </NavLink>
          </div>
        </div>
        <div className={s.formContainer}>
          {isSignUpPage && (
            <input type="text" placeholder="Username" className={s.formInput} />
          )}
          <input
            type="email"
            placeholder="Email address"
            className={s.formInput}
          />
          <input
            type="password"
            placeholder="Password"
            className={s.formInput}
          />
          <Button
            variant="filledColored"
            classNameForContainer={s.signIn}
            onClick={handleAuth}
          >
            {isSignUpPage ? "Register" : "Sign In"}
          </Button>
        </div>
        <div className={s.socialMediaContainer}>
          <div className={s.socialMediaTitle}>
            <div className={s.lineFirst} />
            Or use Social media
            <div className={s.lineSecond} />
          </div>
          <div className={s.socialMediaContent}>
            <div className={s.socialMedias}>
              <Button variant="filled" className={s.iconSetting}>
                <div className={s.magiclyMediaIconWrapper}>
                  <MagiclyMediaIcon />
                </div>
                Magicly.ai
              </Button>
              <Button variant="filled" className={s.iconSetting}>
                <GoogleMediaIcon />
                Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthorizationPage;
