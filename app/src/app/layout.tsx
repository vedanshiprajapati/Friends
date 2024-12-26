import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./wrappers";
import "./paper.css";
export const metadata: Metadata = {
  title: "Friends",
  description: "chat like you are in central perk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
