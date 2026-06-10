// Inbox / Home — the default cockpit screen.
// Ported from docs/product/prototype/mc-views.jsx › InboxView. Two sections:
// "Needs your attention" (notifications) and "Assigned to me" (the viewer's tasks).
import { ACTORS, CURRENT_USER, INBOX, tasksForUser, unreadInboxCount } from "@/lib/mc-data";

import { Confidence } from "./atoms";
import type { Screen } from "./chrome";

export function InboxView({ nav }: { nav: (screen: Screen) => void }) {
  const firstName = ACTORS[CURRENT_USER].name.split(" ")[0];
  const mine = tasksForUser().slice(0, 5);
  const unread = unreadInboxCount();

  return (
    <div className="mc-main">
      <div className="ph">
        <div>
          <span className="kk">Good morning, {firstName}</span>
          <h1>
            Mission <em>control</em>
          </h1>
          <p className="sub">
            Your inbox and what&apos;s assigned to you. Agents work in the background — you review
            and approve. Everything resolves to a task, and every change mirrors to the record.
          </p>
        </div>
        <div className="r">
          <button type="button" className="btn ghost" onClick={() => nav("feed")}>
            Agent activity ◉
          </button>
          <button type="button" className="btn" onClick={() => nav("new")}>
            New ⌘K
          </button>
        </div>
      </div>

      <div className="inbox">
        <div className="grouphd">
          <span className="nm">Needs your attention</span>
          <span className="ct">{unread} unread</span>
        </div>
        {INBOX.map((n) => (
          <button
            type="button"
            className={`nrow${n.unread ? " unread" : ""}`}
            key={n.id}
            onClick={() => nav("task")}
          >
            <span className="dot" />
            <span style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span className={`tag ${n.kind}`}>{n.kind}</span>
              <span className="body">{n.text}</span>
            </span>
            <span className="age">{n.age}</span>
          </button>
        ))}

        <div className="grouphd">
          <span className="nm">Assigned to me</span>
          <span className="ct">{mine.length} reporting</span>
        </div>
        {mine.map((t) => (
          <button type="button" className="nrow" key={t.id} onClick={() => nav("task")}>
            <span className="dot" />
            <span style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
              <span className="id">{t.id}</span>
              <span className="body">{t.title}</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Confidence task={t} showLabel={false} />
              <span className="age">{t.due}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
