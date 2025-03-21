// components/Container.tsx
export default function Container({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="container px-4">
        {children}
      </div>
    );
  }