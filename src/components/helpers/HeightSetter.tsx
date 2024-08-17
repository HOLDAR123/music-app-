import { useEffect } from "react";

const setHeight = () => {
  const height = window.innerHeight;
  document.documentElement.style.setProperty("--height", `${height}px`);
};

function HeightSetter() {
  useEffect(() => {
    setHeight();
    window.addEventListener("resize", setHeight);

    return () => window.removeEventListener("resize", setHeight);
  }, []);

  return null;
}

export default HeightSetter;
