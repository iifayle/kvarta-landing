import type { Metadata } from "next";
import { Inter, Tenor_Sans } from "next/font/google";
import "./globals.css";
import UtmCapture from "../components/UtmCapture";

const tenorSans = Tenor_Sans({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-tenor",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Кварта - свежее зерно",
  description: "Почувствуй свежесть момента",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${tenorSans.variable} ${inter.variable}`}
    >
      <body>
        <UtmCapture />
        {children}
      </body>
    </html>
  );
}
