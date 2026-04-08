import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Умный гайд по страхованию",
  description: "Интерактивный гайд по страхованию",
};

export default function GuideAppLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
