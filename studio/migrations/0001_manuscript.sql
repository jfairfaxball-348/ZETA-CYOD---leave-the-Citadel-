-- W006: one current graph plus append-only historical snapshots.
-- Apply with: npx wrangler d1 migrations apply zeta-manuscript --remote
CREATE TABLE IF NOT EXISTS zeta_manuscript (
 id TEXT PRIMARY KEY CHECK(id = 'book-one'),
 revision INTEGER NOT NULL CHECK(revision >= 0),
 document TEXT,
 updated_at TEXT
);
INSERT OR IGNORE INTO zeta_manuscript(id,revision,document,updated_at)
VALUES('book-one',0,NULL,NULL);
CREATE TABLE IF NOT EXISTS zeta_revision (
 revision INTEGER PRIMARY KEY CHECK(revision > 0),
 document TEXT NOT NULL,
 created_at TEXT NOT NULL,
 restored_from INTEGER
);
