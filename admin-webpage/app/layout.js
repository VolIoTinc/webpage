import "./globals.css";

export const metadata = {
  title: "Admin Dashboard",
  description: "Store management dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-body">
        {children}
      </body>
    </html>
  );
}
