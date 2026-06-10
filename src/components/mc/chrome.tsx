// Mission Control chrome: the Topbar and Sidebar shared by every screen.
// Ported from docs/product/prototype/mc-chrome.jsx. The command palette and
// cross-screen routing land with later screens; deferred affordances are
// rendered but clearly inert (the search field) or route to a not-built panel.
import type { ReactNode } from "react";

import {
  BUCKETS,
  liveAgentCount,
  syncCounts,
  unreadInboxCount,
} from "@/lib/mc-data";

import { Avatar, PMark } from "./atoms";

export type Screen =
  | "home"
  | "board"
  | "list"
  | "timeline"
  | "matrix"
  | "feed"
  | "bucket"
  | "repos"
  | "files"
  | "sync"
  | "task"
  | "new";

type Nav = (screen: Screen) => void;

export function Topbar({
  nav,
  dark,
  setDark,
}: {
  nav: Nav;
  dark: boolean;
  setDark: (next: boolean) => void;
}) {
  const c = syncCounts();
  const need = c.conflict + c.error;
  const cls = need > 0 ? "warn" : c.pending > 0 ? "pending" : "ok";
  const label =
    need > 0 ? `${need} to resolve` : c.pending > 0 ? `${c.pending} pending` : "Synced";

  return (
    <header className="mc-top">
      <div className="l">
        <button type="button" className="brand" onClick={() => nav("home")}>
          <span className="mark">Petra Lab-X</span>
          <span className="sub">Mission Control</span>
        </button>
        <div className="ws">
          <PMark acc />
          <span>PLX Engineering</span>
          <span className="chev">▾</span>
        </div>
      </div>
      <div className="r">
        {/* Command palette is deferred — this is a visual affordance for now. */}
        <div className="search" title="Command palette — coming soon">
          <span style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.1em" }}>
            Search · jump · create…
          </span>
          <span className="key">⌘K</span>
        </div>
        <button
          type="button"
          className={`topsync ${cls}`}
          onClick={() => nav("sync")}
          title="SharePoint sync"
        >
          <span className="d" />
          <span className="lb">{label}</span>
        </button>
        <button
          type="button"
          className="iconbtn"
          title={dark ? "Light mode" : "Dark mode"}
          onClick={() => setDark(!dark)}
        >
          {dark ? "☀" : "☾"}
        </button>
        <Avatar id="maya" size="lg" title="Maya Aldosari · Admin" />
      </div>
    </header>
  );
}

export function Sidebar({ screen, nav }: { screen: Screen; nav: Nav }) {
  const unread = unreadInboxCount();
  const live = liveAgentCount();
  const sc = syncCounts();
  const conflicts = sc.conflict + sc.error;

  const item = (
    target: Screen,
    ic: string,
    label: string,
    badge?: ReactNode
  ) => (
    <button
      type="button"
      className={`item${screen === target ? " active" : ""}`}
      onClick={() => nav(target)}
    >
      <span className="ic">{ic}</span>
      <span className="nm">{label}</span>
      {badge}
    </button>
  );

  return (
    <nav className="mc-side">
      <div className="grp">
        {item(
          "home",
          "⌂",
          "Inbox",
          unread ? <span className="badge acc">{unread}</span> : null
        )}
      </div>
      <div className="grp">
        <div className="h">Views</div>
        {item("board", "▦", "Board")}
        {item("list", "≣", "List")}
        {item("timeline", "▭", "Timeline")}
        {item("matrix", "⊞", "Traceability")}
        {item("feed", "◉", "Agent activity", <span className="badge acc">{live} live</span>)}
      </div>
      <div className="grp">
        <div className="h">Buckets</div>
        {BUCKETS.map((b) => (
          <button type="button" key={b.id} className="item" onClick={() => nav("bucket")}>
            <span className={`hl ${b.health}`} />
            <span className="nm">{b.name}</span>
          </button>
        ))}
      </div>
      <div className="grp">
        <div className="h">System of record</div>
        {item("repos", "❮❯", "Repos")}
        {item("files", "❒", "Files")}
        {item(
          "sync",
          "⇄",
          "Sync",
          conflicts ? <span className="badge hot">{conflicts}</span> : null
        )}
      </div>
    </nav>
  );
}
