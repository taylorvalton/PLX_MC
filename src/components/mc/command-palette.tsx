"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { AGENTS, BUCKETS } from "@/lib/mc-data";
import { useMcVersion } from "@/lib/mc-data/hooks";
import { allTasks } from "@/lib/mc-data/store";

import type { Nav } from "./route";

export interface PaletteItem {
  key: string;
  icon: string;
  label: string;
  hint?: string;
}

export interface PaletteGroup<T extends PaletteItem> {
  title: string;
  items: T[];
}

export function filterPaletteGroups<T extends PaletteItem>(
  groups: PaletteGroup<T>[],
  query: string
): PaletteGroup<T>[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return groups;
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const haystack = `${item.label} ${item.hint ?? ""}`.toLowerCase();
        return haystack.includes(normalized);
      }),
    }))
    .filter((group) => group.items.length > 0);
}

interface PaletteCommand extends PaletteItem {
  run: () => void;
}

export function CommandPalette({
  onClose,
  nav,
  onOpenNewTask,
}: {
  onClose: () => void;
  nav: Nav;
  onOpenNewTask: () => void;
}) {
  useMcVersion();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const tasks = allTasks();

  const groups = useMemo<PaletteGroup<PaletteCommand>[]>(() => {
    const firstBucket = BUCKETS[0]?.id;
    const firstTask = tasks[0]?.id;
    const create: PaletteCommand[] = [
      { key: "create:new-task", icon: "+", label: "New task", hint: "create", run: onOpenNewTask },
      { key: "create:new-bucket", icon: "+", label: "New bucket", hint: "create", run: () => {} },
      {
        key: "create:draft-prd",
        icon: "✎",
        label: "Draft PRD with Scribe",
        hint: "agent",
        run: () => {},
      },
    ];

    const navigate: PaletteCommand[] = [
      { key: "nav:home", icon: "⌂", label: "Go to Inbox", run: () => nav("home") },
      { key: "nav:board", icon: "▦", label: "Go to Board", run: () => nav("board") },
      { key: "nav:list", icon: "≣", label: "Go to List", run: () => nav("list") },
      { key: "nav:timeline", icon: "▭", label: "Go to Timeline", run: () => nav("timeline") },
      { key: "nav:mine", icon: "☉", label: "Go to My Tasks", run: () => nav("mine") },
      { key: "nav:insights", icon: "◔", label: "Go to Insights", run: () => nav("insights") },
      { key: "nav:matrix", icon: "⊞", label: "Go to Traceability", run: () => nav("matrix") },
      { key: "nav:feed", icon: "◉", label: "Go to Agent activity", run: () => nav("feed") },
      {
        key: "nav:bucket",
        icon: "●",
        label: "Go to Initiative detail",
        hint: firstBucket ?? "no initiatives",
        run: () => {
          if (firstBucket) nav("bucket", { bucketId: firstBucket });
        },
      },
      { key: "nav:repos", icon: "❮❯", label: "Go to Repos", run: () => nav("repos") },
      { key: "nav:files", icon: "❒", label: "Go to Files", run: () => nav("files") },
      { key: "nav:sync", icon: "⇄", label: "Go to Sync console", run: () => nav("sync") },
      {
        key: "nav:task",
        icon: "▸",
        label: "Go to Task detail",
        hint: firstTask ?? "no tasks",
        run: () => {
          if (firstTask) nav("task", { taskId: firstTask });
        },
      },
    ];

    const buckets: PaletteCommand[] = BUCKETS.map((bucket) => ({
      key: `bucket:${bucket.id}`,
      icon: "●",
      label: `Bucket · ${bucket.name}`,
      hint: bucket.id,
      run: () => nav("bucket", { bucketId: bucket.id }),
    }));

    const taskCommands: PaletteCommand[] = tasks.map((task) => ({
      key: `task:${task.id}`,
      icon: "▸",
      label: `${task.id} · ${task.title}`,
      hint: "task",
      run: () => nav("task", { taskId: task.id }),
    }));

    const assignAgents: PaletteCommand[] = Object.values(AGENTS).map((agent) => ({
      key: `assign:${agent.id}`,
      icon: "◧",
      label: `Assign open task to ${agent.name}`,
      hint: agent.model,
      run: () => {},
    }));

    return [
      { title: "Create", items: create },
      { title: "Navigate", items: navigate },
      { title: "Buckets", items: buckets },
      { title: "Tasks", items: taskCommands },
      { title: "Assign agents", items: assignAgents },
    ];
  }, [nav, onOpenNewTask, tasks]);

  const filtered = useMemo(() => filterPaletteGroups(groups, query), [groups, query]);
  const flat = useMemo(() => filtered.flatMap((group) => group.items), [filtered]);
  const selectedIndex = flat.length === 0 ? 0 : Math.min(selected, flat.length - 1);
  const indexedGroups = useMemo(() => {
    let index = 0;
    return filtered.map((group) => ({
      title: group.title,
      rows: group.items.map((item) => ({ item, index: index++ })),
    }));
  }, [filtered]);

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowDown") {
        if (flat.length === 0) return;
        event.preventDefault();
        setSelected((prev) => Math.min(flat.length - 1, prev + 1));
        return;
      }

      if (event.key === "ArrowUp") {
        if (flat.length === 0) return;
        event.preventDefault();
        setSelected((prev) => Math.max(0, prev - 1));
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const command = flat[selectedIndex];
        if (!command) return;
        command.run();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flat, onClose, selectedIndex]);

  return (
    <div className="mc-cmdk-overlay" onClick={onClose}>
      <div className="mc-cmdk" onClick={(event) => event.stopPropagation()}>
        <div className="cin">
          <span className="pre">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelected(0);
            }}
            placeholder="Create a task, jump to a bucket, assign an agent..."
          />
          <span className="esc">ESC</span>
        </div>

        <div style={{ maxHeight: "52vh", overflowY: "auto" }}>
          {flat.length === 0 ? (
            <div className="cgrp">
              <div className="cres" style={{ color: "var(--p-muted)" }}>
                No matches
              </div>
            </div>
          ) : null}

          {indexedGroups.map((group) => (
            <div className="cgrp" key={group.title}>
              <div className="gh">{group.title}</div>
              {group.rows.map(({ item, index }) => {
                return (
                  <div
                    key={item.key}
                    className={`cres${selectedIndex === index ? " on" : ""}`}
                    onMouseEnter={() => setSelected(index)}
                    onClick={() => {
                      item.run();
                      onClose();
                    }}
                  >
                    <span className="ic">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.hint ? <span className="hint">{item.hint}</span> : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
