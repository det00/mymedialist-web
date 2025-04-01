"use client"

import "/app/globals.css";
import Container from "@/components/Containter";
import Navbar from "@/components/Navbar";
/* import "bootstrap/dist/css/bootstrap.min.css"; */
import { useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    import("bootstrap");
  }, []);

  return (
    <>
      <Navbar />
      <Container>{children}</Container>
    </>
  );
}
