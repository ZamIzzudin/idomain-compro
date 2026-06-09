/** @format */

import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col min-w-[98dvw] max-w-[100dvw] min-h-[100dvh] items-center overflow-x-hidden">
      {children}
    </main>
  );
}
