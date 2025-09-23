import React from "react";

const RECSeal = ({ sealId }) => (
  <div style={{
    width: 180,
    height: 140,
    position: "relative",
    margin: "0 auto",
    textAlign: "center"
  }}>
    <svg width="180" height="120" viewBox="0 0 180 120">
      {/* Outer circle */}
      <circle cx="90" cy="60" r="50" stroke="#1a365d" strokeWidth="2" fill="none" />
      {/* Inner circle */}
      <circle cx="90" cy="60" r="40" stroke="#1a365d" strokeWidth="1" fill="none" />
      
      {/* Decorative stars */}
      <text x="40" y="65" fontSize="12" fill="#0066cc" textAnchor="middle">★</text>
      <text x="140" y="65" fontSize="12" fill="#0066cc" textAnchor="middle">★</text>
      <text x="90" y="25" fontSize="12" fill="#0066cc" textAnchor="middle">★</text>
      <text x="90" y="105" fontSize="12" fill="#0066cc" textAnchor="middle">★</text>
      
      {/* Seal Text */}
      <text x="90" y="45" fontSize="14" fill="#1a365d" fontWeight="bold" textAnchor="middle">REC</text>
      <text x="90" y="60" fontSize="8" fill="#1a365d" fontWeight="bold" textAnchor="middle">RAJALAKSHMI</text>
      <text x="90" y="70" fontSize="8" fill="#1a365d" fontWeight="bold" textAnchor="middle">ENGINEERING COLLEGE</text>
      <text x="90" y="80" fontSize="7" fill="#1a365d" textAnchor="middle">Thandalam, Chennai</text>
      <text x="90" y="90" fontSize="7" fill="#1a365d" textAnchor="middle">OFFICIAL SEAL</text>
    </svg>
    
    <div style={{ fontSize: 10, color: "#666", marginTop: 5, textAlign: "center" }}>
      {sealId && `Seal ID: ${sealId}`}
    </div>
  </div>
);

export default RECSeal;
