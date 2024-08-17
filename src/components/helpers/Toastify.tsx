import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function Toastify() {
  return (
    <ToastContainer
      position="bottom-right"
      icon={false}
      theme="colored"
      toastStyle={{
        borderRadius: "8px",
        border: "2px solid #161420",
        background: "#15151c ",
      }}
      progressStyle={{
        background: "linear-gradient(95deg, #0ad1ce 0%, #14c156 100%)",
      }}
      autoClose={1000}
    />
  );
}

export default Toastify;
