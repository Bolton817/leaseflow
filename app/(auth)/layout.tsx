export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B101A] p-4 text-slate-200">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">LeaseFlow</h1>
          <p className="text-slate-400 mt-2">Rent Collection. Simplified.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
