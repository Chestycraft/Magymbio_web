// components/LayoutClient.jsx
"use client";

import { usePathname } from "next/navigation";
import { Navigation } from './navigation';

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isinLogin = pathname === "/login";

  return (
    <>
      {!isinLogin && (
        <header>
          <Navigation />
        </header>
      )}

      <main className="flex-grow">{children}</main>

      {!isinLogin && (
        <footer>
         <p className="mb-2 sm:mb-0 text-xs text-gray-400">
  &copy; {new Date().getFullYear()} MAGYMBO Fitness Center. Built for portfolio/demo purposes.
</p>
        </footer>
      )}
    </>
  );
}
