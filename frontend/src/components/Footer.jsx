import React from 'react';
import "../styles/Footer.css"; // Adjust the path if necessary
export default function Footer() {
  return (
    <footer className="site-footer">
      © {new Date().getFullYear()} PATCH. All rights reserved.
    </footer>
  );
}
