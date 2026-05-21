did # Implementation Plan: Schedule API Integration & Type Fixes

This plan is strictly scoped to integrating the 17 new Doctor Schedule APIs from `sample.txt` and resolving the immediate TypeScript errors caused by these changes. The implementation is broken into isolated phases to ensure changes are easy to review.

## Phase 1: Data Models & Types
*Goal: Align frontend types with the new backend API contract without touching logic or UI.*
- [ ] Locate the primary schedule type definition (likely `DoctorScheduleResponseDTO` in `src/types/`).
- [ ] Add the missing scalar fields (e.g., `isBookingOpen`).
- [ ] Add the nested object definitions for `status` (`code`, `displayName`, `colorCode`).
- [ ] Add the nested object definitions for `payoutStatus` (`code`, `displayName`, `colorCode`).
- [ ] Ensure `PatientAppointmentDTO` definitions are stable and do not conflict with the schedule DTO.

## Phase 2: Service Layer Integration
*Goal: Map the 17 endpoints to the frontend `apiClient` service.*
- [ ] Open the relevant service file (e.g., `src/services/appointment/appointment.server.service.ts`).
- [ ] Implement/Update Part 1: Lifecycle Endpoints (`/close-booking`, `/complete`, `/cancel-cascade`, `/sync-queue`).
- [ ] Implement/Update Part 2: Fetch Endpoints (Paginated list, public upcoming, all schedules, details by ID, etc.).
- [ ] Implement/Update Part 3: Creation & Modification (Single create, Batch create, Update).
- [ ] Implement/Update Part 4: Deletion Endpoints (Soft delete, reactivate, hard delete).

## Phase 3: Fix Existing UI & Compilation Errors
*Goal: Ensure the application builds successfully with the updated types.*
- [ ] Update `AppointmentList.tsx`: Fix TanStack Table column definitions to use correct properties from the updated DTO. Remove `any` casts.
- [ ] Update `AppointmentDetailsDialog.tsx`: Fix state types and property accessors. Remove `any` casts.
- [ ] Run `npm run build` (or `tsc --noEmit`) to verify there are no lingering TypeScript errors related to these specific DTOs.

## Phase 4: Implement New Action UI
*Goal: Provide UI controls for the new lifecycle features.*
- [ ] In the Admin/Staff schedule management view, add UI triggers (buttons/dropdowns) for "Close Booking Early" and "Complete Session".
- [ ] Implement a specific confirmation dialog/form for the "Cancel & Cascade Refund" action to capture the required `reason` and `refundMethod`.
- [ ] Update schedule tables/cards to render the `displayName` and `colorCode` fields from the new `status` and `payoutStatus` objects.