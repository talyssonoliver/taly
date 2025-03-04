import type { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";

interface EmptyLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function EmptyLayout({ children, title }: EmptyLayoutProps) {
  return (
    <>
      <Head>
        <title>{title || "Taly Dashboard"}</title>
        <meta name="description" content="Taly Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <header className="border-b p-4 text-xl font-semibold">
          <Link href="/">Taly Dashboard</Link>
        </header>
        <main className="flex-1 p-4">{children}</main>
        <footer className="border-t p-4 text-center">
          &copy; {new Date().getFullYear()} Taly Inc. All rights reserved.
        </footer>
      </div>
    </>
  );
}
