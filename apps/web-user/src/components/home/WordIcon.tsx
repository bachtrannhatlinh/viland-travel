import * as React from "react";

export const WordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
    <rect width="20" height="20" rx="3" fill="#2B579A" />
    <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="Arial" dy=".3em">W</text>
  </svg>
);
