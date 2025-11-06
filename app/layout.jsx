import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Livik Technologies",
  description: "Smart, scalable, and secure digital products",
  icons: {
    icon: "/asset/livik-logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} m-0 p-0 bg-gradient-to-br from-[#1a3a4a] to-[#2d5266] min-h-screen min-w-screen flex items-center justify-center px-5`}
      >
        {children}
      </body>
    </html>
  );
}
