import "./globals.css";

export const metadata = {
  title: "hybrid-ai-ats-analyzer",
  description: "Enterprise Batch Processing Engine Core Suite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark bg-[#070A14]">
      <body className="antialiased min-h-screen text-slate-200">
        {children}
      </body>
    </html>
  );
}