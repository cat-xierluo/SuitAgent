import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';

/**
 * Watches case directories for file changes and emits refresh events.
 * Uses recursive fs.watch for cross-platform compatibility.
 */
export class FileWatcher extends EventEmitter {
  private workspaceRoot: string;
  private watchers: fs.FSWatcher[] = [];
  private debounceTimer: NodeJS.Timeout | null = null;
  private interval: number;
  private lastRefresh = 0;

  constructor(workspaceRoot: string, interval = 5000) {
    super();
    this.workspaceRoot = workspaceRoot;
    this.interval = interval;
  }

  /** Start watching case directories */
  start() {
    this.stop();

    try {
      // Watch the root for new/removed case directories
      const rootWatcher = fs.watch(this.workspaceRoot, { recursive: false }, (eventType, filename) => {
        if (filename && /^\d{6}\s/.test(filename)) {
          this.debounceRefresh();
        }
      });
      this.watchers.push(rootWatcher);

      // Watch each existing case directory recursively
      const entries = fs.readdirSync(this.workspaceRoot)
        .filter(name => /^\d{6}\s/.test(name));

      for (const dirName of entries) {
        const casePath = path.join(this.workspaceRoot, dirName);
        try {
          const watcher = fs.watch(casePath, { recursive: true }, () => {
            this.debounceRefresh();
          });
          this.watchers.push(watcher);
        } catch { /* skip inaccessible dirs */ }
      }
    } catch { /* workspace root may not be accessible */ }
  }

  /** Stop all watchers */
  stop() {
    for (const w of this.watchers) {
      try { w.close(); } catch { /* ignore */ }
    }
    this.watchers = [];
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  /** Force a refresh event */
  forceRefresh() {
    this.emit('refresh');
  }

  private debounceRefresh() {
    const now = Date.now();
    if (now - this.lastRefresh < this.interval) {
      return; // Too soon, skip
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.lastRefresh = Date.now();
      this.emit('refresh');
      this.debounceTimer = null;
    }, 1000); // 1s debounce for file system events
  }

  dispose() {
    this.stop();
    this.removeAllListeners();
  }
}
