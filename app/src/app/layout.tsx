import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./wrappers";
import "./paper.css";
import DeviceCheck from "@/app/_components/DeviceCheck";
import { Analytics } from "@vercel/analytics/next";

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
        <Providers>
          <DeviceCheck>{children}</DeviceCheck>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
