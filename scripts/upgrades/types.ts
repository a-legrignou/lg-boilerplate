export type UpgradeContext = {
  rootDir: string;
  log: (msg: string) => void;
  exec: (cmd: string) => Promise<void>;
};

export type Upgrade = {
  /** Source version (semver, e.g. "1.0.0") */
  from: string;
  /** Target version (semver, e.g. "1.1.0") */
  to: string;
  /** One-sentence summary shown to the user before applying. */
  description: string;
  /** True if the upgrade contains breaking changes (renames, removed APIs, schema deletions). */
  breaking: boolean;
  /** Multi-line markdown shown after the upgrade, with manual follow-ups if any. */
  releaseNotes?: string;
  /** Apply the upgrade. Idempotent ideally. */
  up: (ctx: UpgradeContext) => Promise<void>;
};
