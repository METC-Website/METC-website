import type { Metadata } from "next";
import "./globals.css";
import { withSiteBasePath } from "../lib/site-path";
import { ResourcePreloader } from "../components/resource-preloader";

export const metadata: Metadata = {
  title: "METC — Math and Engineering Teaching Club",
  description: "A student-created, student-centered math and engineering teaching club.",
  icons: {
    icon: withSiteBasePath("/images/metc-graduation-logo.jpg")
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><ResourcePreloader />{children}</body>
    </html>
  );
}
