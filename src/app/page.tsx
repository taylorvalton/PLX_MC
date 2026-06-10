import Image from "next/image";

import { BrandBoundary, Kicker } from "@/components/brand";

export default function Home() {
  return (
    <BrandBoundary>
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          background: "var(--p-canvas)",
          color: "var(--p-ink)",
        }}
      >
        <Image
          src="/brand/logo-horizontal-ink.png"
          alt="Petra Lab-X"
          width={188}
          height={48}
          priority
        />
        <Kicker>Mission Control</Kicker>
        <h1
          style={{
            fontFamily: "var(--font-mazius-display)",
            fontWeight: 400,
            fontSize: "38px",
            lineHeight: 0.95,
            letterSpacing: "-0.022em",
            margin: 0,
          }}
        >
          Everything resolves to a <em style={{ color: "var(--p-accent)" }}>Task</em>
        </h1>
        <p style={{ color: "var(--p-muted)", maxWidth: "66ch", fontSize: "13px" }}>
          The cockpit is under construction. SharePoint is the system of record;
          this surface is the lens. The build spec lives in docs/product/.
        </p>
      </main>
    </BrandBoundary>
  );
}
