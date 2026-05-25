"use client";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useThemeToggle } from "@/app/layout";
import { useEffect, useState } from "react";

const ThemeToggleButton = () => {
  const { toggleTheme } = useThemeToggle();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setIsDark(saved === "dark");
  }, []);

  const handleToggle = () => {
    toggleTheme();
    setIsDark((prev) => !prev);
  };

  return (
    <Tooltip
      title={
        <span style={{ fontFamily: "Roboto, sans-serif" }}>
          {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </span>
      }
    >
      <IconButton onClick={handleToggle}>
        {isDark ? (
          <LightModeOutlinedIcon color="primary" fontSize="large" />
        ) : (
          <DarkModeOutlinedIcon color="primary" fontSize="large" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;