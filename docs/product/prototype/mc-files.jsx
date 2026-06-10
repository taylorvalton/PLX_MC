/* ══════════════════════════════════════════════════════════════════════════
   PLX MISSION CONTROL — Files (Project Documents library)
   Mirrors the SharePoint "Project Documents" document library: one top-level
   folder per initiative (PRD · Evidence · Deeds · Reports) plus a Shared root.
   Two-way: files land here or in SharePoint and reconcile on sweep.
   ══════════════════════════════════════════════════════════════════════════ */

const { useState: useStateF } = React;

const F_KIND = { folder: "DIR", doc: "DOC", pdf: "PDF", sheet: "XLS", img: "IMG", zip: "ZIP", md: "MD" };

function crumbsFor(id) {
  const out = [];
  let cur = id ? window.MC_fileById(id) : null;
  while (cur) { out.unshift(cur); cur = cur.parent ? window.MC_fileById(cur.parent) : null; }
  return out;
}

function FilesView({ nav }) {
  const lib = window.MC_SP_LIST.documents;
  const [folder, setFolder] = useStateF(null);
  const [rev, setRev] = useStateF(0);
  const [syncing, setSyncing] = useStateF(false);

  const items = window.MC_filesIn(folder).slice().sort((a, b) => {
    if ((a.kind === "folder") !== (b.kind === "folder")) return a.kind === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  const crumbs = crumbsFor(folder);
  const pending = window.MC_FILES.filter((f) => f.sync && f.sync.state === "pending").length;

  const syncNow = () => {
    if (syncing) return;
    setSyncing(true);
    setTimeout(() => {
      const d = new Date(); const p = (n) => String(n).padStart(2, "0");
      const stamp = d.getFullYear() + "." + p(d.getMonth() + 1) + "." + p(d.getDate()) + " · " + p(d.getHours()) + ":" + p(d.getMinutes());
      window.MC_FILES.forEach((f) => { if (f.sync && f.sync.state === "pending") { f.sync.state = "synced"; f.sync.ts = stamp; } });
      lib.counts.synced += lib.counts.pending; lib.counts.pending = 0; lib.lastSync = stamp;
      setSyncing(false); setRev((r) => r + 1);
      window.dispatchEvent(new Event("mc-sync"));
    }, 900);
  };

  return (
    <div className="mc-main">
      <div className="ph">
        <div>
          <span className="kk">System of record · {lib.title}</span>
          <h1>Files</h1>
          <p className="sub">The shared document library — PRDs, evidence bundles, sealed deeds and reports. Mirrors two-way with the SharePoint <b>{lib.title}</b> library; folders are scoped per initiative.</p>
        </div>
        <div className="r">
          <a className="splink" href="#" onClick={(e) => e.preventDefault()}>Open in SharePoint ↗</a>
          <button className="btn acc" disabled={syncing || pending === 0} onClick={syncNow}>{syncing ? "Syncing…" : pending ? "Sync now ↻ · " + pending : "Synced ✓"}</button>
        </div>
      </div>

      <div className="files">
        <div className="fcrumbs">
          <span className={"cb" + (folder === null ? " on" : "")} onClick={() => setFolder(null)}>Project Documents</span>
          {crumbs.map((c) => (
            <React.Fragment key={c.id}>
              <span className="sep">/</span>
              <span className={"cb" + (c.id === folder ? " on" : "")} onClick={() => setFolder(c.id)}>{c.name}</span>
            </React.Fragment>
          ))}
          <span className="fcount">{items.length} item{items.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="ftable">
          <div className="frow head">
            <span className="h">Name</span><span className="h">Type</span><span className="h">Modified</span><span className="h">By</span><span className="h">Sync</span>
          </div>
          {items.length === 0 && <div className="colempty" style={{ margin: 14 }}>Empty folder</div>}
          {items.map((f) => (
            <div className={"frow" + (f.kind === "folder" ? " isfolder" : "")} key={f.id} onClick={() => f.kind === "folder" && setFolder(f.id)}>
              <span className="nm">
                <span className={"fk k-" + f.kind}>{F_KIND[f.kind] || "FILE"}</span>
                <span className="t">{f.name}</span>
                {f.bucket && f.kind === "folder" && <span className="binit" style={{ background: "var(--p-" + (window.MC_BUCKET_IDX[f.bucket].health === "track" ? "ok" : window.MC_BUCKET_IDX[f.bucket].health === "risk" ? "warn" : "hot") + ")" }}></span>}
              </span>
              <span className="ty">{f.kind === "folder" ? "Folder" : (f.docType || "—")}</span>
              <span className="md">{f.modified || "—"}</span>
              <span className="by">{f.modifiedBy ? <Avatar id={f.modifiedBy} size="sm" /> : <span style={{ color: "var(--p-muted)", fontFamily: "var(--mono)", fontSize: 10 }}>—</span>}</span>
              <span className="sy">{f.sync ? <SyncTick sync={f.sync} showTs={false} /> : (f.kind === "folder" ? <span className="folderdir">{window.MC_filesIn(f.id).length} items</span> : null)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FilesView });
