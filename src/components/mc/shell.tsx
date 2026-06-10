"use client";

// The Mission Control application shell: the brand boundary, dark-mode state,
// and the chrome (Topbar + Sidebar) shared by every screen. Today only the
// Inbox is built; other destinations render an honest "not built yet" panel so
// the navigation map is real without faking functionality.
import { useState } from "react";

import { BrandBoundary } from "@/components/brand";

import { Sidebar, Topbar } from "./chrome";
import type { Screen } from "./chrome";
import { InboxView } from "./inbox";

const SCREEN_TITLES: Record<Exclude<Screen, "home">, string> = {
  board: "Board",
  list: "List",
  timeline: "Timeline",
  matrix: "Traceability",
  feed: "Agent activity",
  bucket: "Initiative",
  repos: "Repos",
  files: "Files",
  sync: "Sync console",
  task: "Task detail",
  new: "New task",
};

function ComingSoon({ screen }: { screen: Exclude<Screen, "home"> }) {
  return (
    <div className="mc-main">
      <div className="ph">
        <div>
          <span className="kk">Mission Control</span>
          <h1>{SCREEN_TITLES[screen]}</h1>
          <p className="sub">This screen is part of the build, but isn&apos;t implemented yet.</p>
        </div>
      </div>
      <div className="notbuilt">
        <p className="lead">
          The shell and the Inbox are live. {SCREEN_TITLES[screen]} is rebuilt in a later
          increment, screen by screen, from the design handoff.
        </p>
        <p className="ref">spec · docs/product/README.md §6 · docs/product/screenshots/SCREENS.md</p>
      </div>
    </div>
  );
}

export function MissionControlShell() {
  const [dark, setDark] = useState(false);
  const [screen, setScreen] = useState<Screen>("home");

  return (
    <BrandBoundary className={`mc${dark ? " dark" : ""}`}>
      <Topbar nav={setScreen} dark={dark} setDark={setDark} />
      <div className="mc-shell">
        <Sidebar screen={screen} nav={setScreen} />
        {screen === "home" ? <InboxView nav={setScreen} /> : <ComingSoon screen={screen} />}
      </div>
    </BrandBoundary>
  );
}
