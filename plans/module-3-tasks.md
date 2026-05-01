# Module 3 Tasks

| Task ID | Title | Status | Depends On |
| --- | --- | --- | --- |
| module3-01-contracts | Define floor and reservation contracts | done | module-2-database-schema |
| module3-02-data-access | Implement data access layer | done | module3-01-contracts |
| module3-03-api-routes | Implement floor reservation routes | done | module3-02-data-access |
| module3-04-business-rules | Enforce reservation business rules | done | module3-03-api-routes |
| module3-05-web-floor-ui | Build floor and table UI | done | module3-01-contracts |
| module3-06-web-reservation-ui | Build reservation UI flows | done | module3-05-web-floor-ui, module3-03-api-routes |
| module3-07-error-loading-states | Add UX state handling | done | module3-06-web-reservation-ui |
| module3-08-integration-pass | Run module integration pass | blocked | module3-04-business-rules, module3-07-error-loading-states |
