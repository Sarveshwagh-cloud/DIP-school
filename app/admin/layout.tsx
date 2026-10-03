export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin pages don't use the main site Navbar/Footer
  return <>{children}</>;
}
