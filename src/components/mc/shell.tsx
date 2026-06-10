"use client";

// The Mission Control application shell: the brand boundary, dark-mode state,
// route state, and the chrome (Topbar + Sidebar) shared by every screen.
// Screens come from the registry in screens.tsx; modal-level surfaces (New
// Task, command palette) mount here when their lane lands.
import { useCallback, useEffect, useState } from "react";

import { BrandBoundary } from "@/components/brand";
import { hydrateFromStorage } from "@/lib/mc-data/store";

import { Sidebar, Topbar } from "./chrome";
import { CommandPalette } from "./command-palette";
import { InboxView } from "./inbox";
import { NewTaskModal } from "./new-task-modal";
import type { Nav, Route, Screen } from "./route";
import { SCREENS } from "./screens";

export function MissionControlShell() {
  const [dark, setDark] = useState(false);
  const [route, setRoute] = useState<Route>({ screen: "home" });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTaskCtx, setNewTaskCtx] = useState<{ bucketId?: string } | undefined>(undefined);

  // Rehydrate user-created tasks / invited people after hydration so SSR HTML
  // and the first client render stay identical.
  useEffect(() => {
    hydrateFromStorage();
  }, []);

  const nav = useCallback<Nav>((screen: Screen, extra) => {
    setRoute({ screen, ...extra });
  }, []);

  const openPalette = useCallback(() => {
    setPaletteOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setPaletteOpen(false);
  }, []);

  const openNewTask = useCallback((ctx?: { bucketId?: string }) => {
    setPaletteOpen(false);
    setNewTaskCtx(ctx);
    setNewTaskOpen(true);
  }, []);

  const closeNewTask = useCallback(() => {
    setNewTaskOpen(false);
    setNewTaskCtx(undefined);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (newTaskOpen) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [newTaskOpen]);

  const ScreenComponent = SCREENS[route.screen];

  return (
    <BrandBoundary className={`mc${dark ? " dark" : ""}`}>
      <Topbar nav={nav} dark={dark} setDark={setDark} onOpenPalette={openPalette} />
      <div className="mc-shell">
        <Sidebar route={route} nav={nav} />
        {route.screen === "home" ? (
          <InboxView route={route} nav={nav} openNewTask={() => openNewTask()} />
        ) : (
          <ScreenComponent route={route} nav={nav} />
        )}
      </div>
      {paletteOpen ? (
        <CommandPalette
          onClose={closePalette}
          nav={nav}
          onOpenNewTask={() => openNewTask({ bucketId: route.bucketId })}
        />
      ) : null}
      {newTaskOpen ? <NewTaskModal ctx={newTaskCtx} onClose={closeNewTask} nav={nav} /> : null}
    </BrandBoundary>
  );
}
