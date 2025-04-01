// components/Container.tsx
export default function Container({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="bg-dark-subtle mt-110 bg-content p-4 rounded-4 text-secondary">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}