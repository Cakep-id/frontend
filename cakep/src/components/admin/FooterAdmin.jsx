import React from "react";

const FooterAdmin = () => {
  return (
    <footer
      className="text-center py-3 mt-auto"
      style={{
        background: "#f8f9fa",
        borderTop: "1px solid #e9ecef",
        fontSize: 15,
        color: "#6c757d",
        letterSpacing: 0.2,
      }}
    >
      <div>
        © {new Date().getFullYear()} <b>Cakep.id Admin</b> &mdash; All rights reserved.
      </div>
      <div style={{ fontSize: 13 }}>
        Sistem Manajemen Aset &mdash; Versi Admin
      </div>
    </footer>
  );
};

export default FooterAdmin;