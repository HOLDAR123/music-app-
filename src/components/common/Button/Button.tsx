import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";

import "./ButtonStyles.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outlined" | "filledColored";
  classNameForContainer?: string;
  link?: string;
}

function Button({
  variant = "filled",
  children,
  className,
  classNameForContainer = "",
  link = undefined,
  ...props
}: ButtonProps) {
  const classNames = useMemo(() => {
    let result = "button";
    if (variant === "filled") result += " buttonFilled";
    if (variant === "outlined") result += " buttonOutlined";
    if (variant === "filledColored") result += " buttonFilledColored";
    result += ` ${classNameForContainer}`;
    return result;
  }, [classNameForContainer, variant]);
  return (
    <button className={classNames} type="button" {...props}>
      <span className={`buttonLabel ${className}`}>{children}</span>
      {link && <NavLink to={link} className="link" />}
    </button>
  );
}

export default Button;
