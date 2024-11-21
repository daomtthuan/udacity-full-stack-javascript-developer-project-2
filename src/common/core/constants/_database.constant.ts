/** Database Module type. */
export const enum DatabaseModuleType {
  Postgresql = 'postgresql',
}

/** Migration table. */
export const MIGRATION_TABLE = {
  NAME: '__migrations',
  COLUMN: {
    NAME: 'name',
    APPLIED_AT: 'applied_at',
  },
};
