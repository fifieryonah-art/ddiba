import ResponsiveLayout from "./ResponsiveLayout";

export default function PageContainer({ children }) {
  return (
    <ResponsiveLayout className="app-shell">
      {children}
    </ResponsiveLayout>
  );
}
