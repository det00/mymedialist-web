import '/app/globals.css';
import Container from '@/components/Containter';
import Navbar from "@/components/Navbar"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Container>
        {children}
      </Container>
    </>
  );
}