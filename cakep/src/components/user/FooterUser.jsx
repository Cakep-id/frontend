import React from "react";

const FooterUser = () => {
  const theme = typeof window !== "undefined" ? (localStorage.getItem("theme") || "light") : "light";
  const isDark = theme === "dark";

  return (
    <footer
      style={{
        width: "100%",
        background: isDark ? "#23272f" : "#f8f9fa",
        color: isDark ? "#fff" : "#222",
        padding: "18px 0",
        textAlign: "center",
        borderTop: isDark ? "1px solid #444" : "1px solid #eaeaea",
        position: "fixed",
        left: 0,
        bottom: 0,
        zIndex: 1020
      }}
    >
      <div>
        &copy; {new Date().getFullYear()} Cakep.id &mdash; User Portal
      </div>
    </footer>
  );
};

export default FooterUser;