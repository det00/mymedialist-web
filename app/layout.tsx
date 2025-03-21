// app/layout.tsx
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="min-vh-100">
          {children}
        </main>
      </body>
    </html>
  );
}