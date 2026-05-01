# Module 2 Tasks

| Task ID | Title | Status | Depends On |
| --- | --- | --- | --- |
| module2-01-ddl-decisions | Finalize schema decisions | done | - |
| module2-02-base-tables | Create base tables migration | done | module2-01-ddl-decisions |
| module2-03-constraints-fks | Add constraints and foreign keys | done | module2-02-base-tables |
| module2-04-indexing | Add performance indexes | done | module2-03-constraints-fks |
| module2-05-seed-data | Create seed migration | done | module2-03-constraints-fks |
| module2-06-schema-snapshot | Sync schema snapshot | done | module2-04-indexing, module2-05-seed-data |
| module2-07-migration-validation | Validate migration workflow | blocked | module2-06-schema-snapshot |
| module2-08-contract-notes | Publish schema contract notes | blocked | module2-07-migration-validation |
