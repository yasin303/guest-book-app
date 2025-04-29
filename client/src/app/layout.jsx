import { Inter } from "next/font/google";
import "./globals.css"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Guest Book",
  description: "A simple guest book application made by Yasin Abdul",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <div className="container mx-auto px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
