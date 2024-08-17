import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Slider as MuiSlider } from "@mui/material";

import s from "./Slider.module.scss";

interface SliderProps {
  width?: number;
  height?: number;
  primary: string;
  secondary: string;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  step?: number;
  value: number;
  className?: string
}

function Slider({
  width = 50,
  height = 50,
  primary,
  secondary,
  min = 0,
  max = 100,
  onChange,
  step = 1,
  value,
  className = ""
}: SliderProps) {
  const theme = createTheme({
    palette: {
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <MuiSlider
        className={`${s.separator} ${className}`}
        value={value}
        color="primary"
        track="inverted"
        min={min}
        max={max}
        step={step}
        onChange={(event, newValue) => onChange(newValue as number)}
        sx={{
          "& .MuiSlider-thumb": {
            width: { xs: "30px", sm: "40px", md: `${width}px` },
            height: { xs: "30px", sm: "40px", md: `${height}px` },
            borderRadius: "50%",
            cursor: "pointer",
            zIndex: 2,
            boxShadow: "none",
            backgroundColor: "white",
            "&:hover, &.Mui-focusVisible, & .MuiSlider-active": {
              boxShadow: "none",
            },
          },
          "& .MuiSlider-track": {
            backgroundColor: theme.palette.primary.main,
            border: "none",
          },
          "& .MuiSlider-rail": {
            backgroundColor: theme.palette.secondary.main,
          },
        }}
      />
    </ThemeProvider>
  );
}

export default Slider;
