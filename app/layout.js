import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Vybe",
  description: "A community platform with emoji reactions instead of boring upvotes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
