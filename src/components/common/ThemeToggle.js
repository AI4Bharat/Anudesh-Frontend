"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
    >
      <div
        style={{
          position: "relative",
          width: "56px",
          height: "32px",
          borderRadius: "9999px",
          backgroundColor: isDarkMode ? "#3a3a3a" : "#e5e7eb",
          border: "1px solid #fb923c",
          display: "flex",
          alignItems: "center",
          padding: "4px",
          transition: "background-color 0.3s",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "4px",
            left: "4px",
            width: "24px",
            height: "24px",
            borderRadius: "9999px",
            backgroundColor: isDarkMode ? "#2a2a2a" : "#ffffff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: isDarkMode ? "translateX(24px)" : "translateX(0)",
            transition: "transform 0.3s",
          }}
        >
          {isDarkMode ? (
            <Moon size={14} color="#ececec" />
          ) : (
            <Sun size={14} color="#f97316" />
          )}
        </div>
      </div>
    </button>
  );
}