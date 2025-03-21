// app/(auth)/layout.tsx
import Container from "@/components/Containter";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <Container>
        {children}
      </Container>
    </div>
  );
}