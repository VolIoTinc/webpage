import "./globals.css";

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_DISPLAY_NAME} — ${process.env.NEXT_PUBLIC_TAGLINE}`,
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-primary text-white">
        {children}
      </body>
    </html>
  );
}
