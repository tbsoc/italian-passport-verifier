'use client';

import QRCode from "react-qr-code";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export default function QRCodeDisplay({ value, size = 256, className = "" }: QRCodeDisplayProps) {
  return (
    <div className={`p-4 bg-white rounded-lg shadow-lg border-2 border-italian-green ${className}`}>
      <QRCode
        value={value}
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox={`0 0 256 256`}
        level="H"
      />
    </div>
  );
}