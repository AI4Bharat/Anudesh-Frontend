"use client";
import dynamic from "next/dynamic";

// Dynamically import the entire client app with SSR disabled.
// This prevents all browser-only modules (makeStyles, window.*, HashRouter, etc.)
// from being evaluated on the server during static page generation (output: "export").
const ClientApp = dynamic(() => import("./ClientApp"), { ssr: false });

export default function Root() {
  return <ClientApp />;
}
