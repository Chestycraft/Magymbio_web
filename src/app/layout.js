// app/layout.jsx
import "./globals.css";
import LayoutClient from './components/common/LayoutClient';
import { SupabaseProvider } from './lib/supabaseProvider';

export const metadata = {
  title: "MAGYMBO",
  description: "Gym App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter&display=swap" rel="stylesheet"/>
      </head>
      <body className="flex flex-col min-h-screen">
        <SupabaseProvider>
          <LayoutClient>{children}</LayoutClient>
        </SupabaseProvider>
      </body>
    </html>
  );
}
