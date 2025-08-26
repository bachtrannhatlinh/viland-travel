import * as React from "react";

export const PdfIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <rect width="20" height="20" rx="3" fill="#D32F2F" />
    <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="Arial" dy=".3em">PDF</text>
  </svg>
);
