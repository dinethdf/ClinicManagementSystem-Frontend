# 🏥 CureGuard Clinic Management System — Manual Testing Guide

> **How to use this file:** Work through each section top-to-bottom. Tick `[x]` when a test passes, mark `[F]` if it fails (add a note below it). Test environment URL: `http://localhost:3000`

---

## 📋 Table of Contents

1. [Authentication & Access Control](#1-authentication--access-control)
2. [Clinic Admin — Dashboard](#2-clinic-admin--dashboard)
3. [Clinic Admin — Patient Management](#3-clinic-admin--patient-management)
4. [Clinic Admin — Doctor Management](#4-clinic-admin--doctor-management)
5. [Clinic Admin — Appointment Management](#5-clinic-admin--appointment-management)
6. [Clinic Admin — Appointment Schedule](#6-clinic-admin--appointment-schedule)
7. [Clinic Admin — Staff Management](#7-clinic-admin--staff-management)
8. [Clinic Admin — Lab Tests](#8-clinic-admin--lab-tests)
9. [Clinic Admin — Payments](#9-clinic-admin--payments)
10. [Clinic Admin — Payouts (Doctor Payouts)](#10-clinic-admin--payouts-doctor-payouts)
11. [Clinic Admin — Reports](#11-clinic-admin--reports)
12. [Clinic Admin — Settings](#12-clinic-admin--settings)
13. [Doctor Portal — Dashboard](#13-doctor-portal--dashboard)
14. [Doctor Portal — Consultation](#14-doctor-portal--consultation)
15. [Doctor Portal — Schedule Management](#15-doctor-portal--schedule-management)
16. [Doctor Portal — Financials](#16-doctor-portal--financials)
17. [Doctor Portal — Account Settings](#17-doctor-portal--account-settings)
18. [Patient Portal — Dashboard](#18-patient-portal--dashboard)
19. [Patient Portal — Appointments](#19-patient-portal--appointments)
20. [Patient Portal — Medical Records](#20-patient-portal--medical-records)
21. [Patient Portal — Billing](#21-patient-portal--billing)
22. [Patient Portal — Family Management](#22-patient-portal--family-management)
23. [Patient Portal — Account Settings](#23-patient-portal--account-settings)
24. [Public Features — Book Appointment](#24-public-features--book-appointment)
25. [Public Features — Queue Tracker](#25-public-features--queue-tracker)
26. [Public Features — Print Pages](#26-public-features--print-pages)
27. [Cross-Cutting Concerns](#27-cross-cutting-concerns)

---

## 1. Authentication & Access Control

### 1.1 Clinic Admin / Staff Login
- [ ] Navigate to `/en/login` — login page loads correctly
- [ ] Enter **invalid credentials** → error message shown, not logged in
- [ ] Enter **valid clinic admin credentials** → redirected to clinic dashboard
- [ ] Enter **valid staff credentials** → redirected to appropriate view
- [ ] Leave email/password blank → form validation fires (required fields)
- [ ] Enter invalid email format → validation error shown
- [ ] **Remember me** functionality (if present) — session persists after browser close
- [ ] **Show/hide password** toggle works

### 1.2 Patient Login
- [ ] Navigate to patient login page → loads correctly
- [ ] Enter **invalid patient credentials** → error shown
- [ ] Enter **valid patient credentials** → redirected to patient portal dashboard
- [ ] Leave fields blank → validation fires

### 1.3 Doctor Login
- [ ] Enter **valid doctor credentials** → redirected to doctor portal
- [ ] Doctor cannot access clinic admin routes (should redirect or 403)

### 1.4 Forgot Password
- [ ] Navigate to `/en/forgot-password`
- [ ] Enter a **registered email** → success message shown
- [ ] Enter an **unregistered email** → appropriate error shown
- [ ] Leave email blank → validation fires

### 1.5 User Registration (if applicable)
- [ ] Navigate to `/en/register`
- [ ] Fill in all required fields → account created successfully
- [ ] Submit with duplicate email → error: email already exists
- [ ] Submit with password mismatch → validation error
- [ ] Submit with all blank fields → all validations fire

### 1.6 Session & Route Guards
- [ ] Unauthenticated user accessing protected clinic route → redirected to login
- [ ] Unauthenticated user accessing protected patient route → redirected to patient login
- [ ] Logged-in patient cannot access clinic admin pages
- [ ] Logged-in doctor cannot access clinic admin pages
- [ ] Logged-in clinic admin cannot access patient portal pages
- [ ] Logout button → clears session and redirects to login

---

## 2. Clinic Admin — Dashboard

**URL:** `/en/clinic/(dashboard)`

- [ ] Dashboard loads without errors (no console errors)
- [ ] **Statistics cards** display (Total Patients, Doctors, Appointments, Revenue — or similar)
- [ ] **Revenue Report** chart renders and shows data
- [ ] **Today's Sessions** card shows correct upcoming sessions
- [ ] **Specialization Summary Chart** renders correctly
- [ ] **Upcoming Appointments** table shows today's or this week's appointments
- [ ] **Schedules by Doctor** list/table displays
- [ ] **Quick Action** buttons (if present) navigate to correct pages
- [ ] All charts are interactive (hover tooltips, etc.)
- [ ] Refreshing the page retains the dashboard state
- [ ] Date/time displayed is correct for the current timezone

---

## 3. Clinic Admin — Patient Management

### 3.1 Patient List
**URL:** `/en/clinic/patient/list`

- [ ] Patient list loads with data
- [ ] **Search/filter** by name, phone, ID — results update correctly
- [ ] **Pagination** works (next/prev page, page size)
- [ ] Clicking a patient row → navigates to patient details
- [ ] **Sort** columns (if sortable) — order changes correctly
- [ ] Empty state shown when no patients match filter

### 3.2 Register New Patient
**URL:** `/en/clinic/patient/register`

- [ ] Registration form loads all fields
- [ ] Fill in all required fields → patient created successfully
- [ ] Missing required field → validation error on that field
- [ ] **Duplicate NIC/phone** → appropriate error message
- [ ] After successful registration → redirected or shown success message
- [ ] Patient appears in the patient list after registration

### 3.3 Patient Details
**URL:** `/en/clinic/patient/details/[id]`

- [ ] Patient details page loads without errors
- [ ] All patient info (name, DOB, contact, NIC) displayed correctly
- [ ] **Edit** patient info → updates saved successfully
- [ ] Invalid/non-existent patient ID → 404 or not-found shown

### 3.4 Patient Clinical Profile
**URL:** `/en/clinic/patient/clinical-profile/[id]`

- [ ] Clinical profile tabs load (Profile, Connections, Teams, Projects — or clinic-specific tabs)
- [ ] Medical history/visit history displayed
- [ ] Profile header shows patient name and photo (or placeholder)
- [ ] Tabs switch without page reload

---

## 4. Clinic Admin — Doctor Management

### 4.1 Doctor List
**URL:** `/en/clinic/doctors/list`

- [ ] Doctor list loads with data
- [ ] Search by name, specialization — results filter correctly
- [ ] Clicking doctor → navigates to doctor details/view
- [ ] Pagination works correctly
- [ ] Doctor status (Active/Inactive) shown correctly

### 4.2 Register New Doctor
**URL:** `/en/clinic/doctors/register`

- [ ] Registration form loads with all fields (name, specialization, email, phone, etc.)
- [ ] Submit with all valid data → doctor created successfully
- [ ] Submit with missing required fields → validation errors shown
- [ ] Duplicate email → error shown
- [ ] After registration → doctor appears in doctor list

### 4.3 Doctor Details / View
**URL:** `/en/clinic/doctors/view/[id]`

- [ ] Doctor profile loads correctly
- [ ] All details displayed (name, specialization, contact, schedule summary)
- [ ] Edit doctor info works and saves
- [ ] Tabs/sections (if any) switch correctly

---

## 5. Clinic Admin — Appointment Management

### 5.1 Appointment List
**URL:** `/en/clinic/appoinment/list`

- [ ] Appointment list loads with data
- [ ] **Filter by date range** → appointments filter correctly
- [ ] **Filter by doctor** → only that doctor's appointments shown
- [ ] **Filter by status** (Pending, Confirmed, Completed, Cancelled)
- [ ] Pagination works
- [ ] Clicking appointment → appointment details shown

### 5.2 Create Appointment
**URL:** `/en/clinic/appoinment/create`

- [ ] Create appointment form loads
- [ ] **Select patient** (search/dropdown) works
- [ ] **Select doctor** works — available doctors shown
- [ ] **Select date and time** — calendar/time picker works
- [ ] Submit with all valid data → appointment created
- [ ] Submit missing required field → validation error
- [ ] Time slot conflict → error shown (double-booking prevented)
- [ ] Appointment appears in the list after creation

### 5.3 Appointment Details
**URL:** `/en/clinic/appoinment/details/[id]`

- [ ] Appointment details load correctly
- [ ] Patient and doctor info displayed
- [ ] **Change appointment status** works (Confirm, Cancel, Mark Complete)
- [ ] **Appointment payment** link/section available

### 5.4 Appointment Payment
**URL:** `/en/clinic/appoinment/payment/[id]`

- [ ] Payment form/page loads
- [ ] Payment amount shown correctly
- [ ] Process payment → success/confirmation shown
- [ ] Receipt or confirmation is accessible after payment

---

## 6. Clinic Admin — Appointment Schedule

**URL:** `/en/clinic/appoinment-shedule/`

### 6.1 Schedule List
- [ ] Schedule list loads
- [ ] Schedules shown with doctor name, day, time slots

### 6.2 Add New Schedule
- [ ] Navigate to add schedule → form loads
- [ ] Select doctor, day(s), start time, end time → schedule created
- [ ] Overlapping schedule → error or warning shown
- [ ] Created schedule appears in the list

### 6.3 Schedule Details
- [ ] Schedule details page loads
- [ ] Edit schedule (change time slots) → saved successfully

### 6.4 Manage Schedule
- [ ] Manage page (activate/deactivate schedules) works
- [ ] Deactivated schedules not shown for new appointments

---

## 7. Clinic Admin — Staff Management

### 7.1 Staff List
**URL:** `/en/clinic/staff/list`

- [ ] Staff list loads with data
- [ ] Search/filter by name, role works
- [ ] Staff role shown correctly

### 7.2 Register New Staff
**URL:** `/en/clinic/staff/register`

- [ ] Registration form loads
- [ ] Fill in all required fields → staff member created
- [ ] Duplicate email → error shown
- [ ] Staff appears in list after registration

### 7.3 Staff Details / View
**URL:** `/en/clinic/staff/view/[id]`

- [ ] Staff details displayed correctly
- [ ] Edit staff info → saves successfully

### 7.4 Staff Queue
**URL:** `/en/clinic/staff/queue`

- [ ] Queue view loads
- [ ] Current appointment queue shown
- [ ] Queue status updates (if real-time)

---

## 8. Clinic Admin — Lab Tests

### 8.1 Lab Test Types
**URL:** `/en/clinic/lab-test/test-types`

- [ ] Test types list loads
- [ ] **Add new test type** → form opens, submits successfully
- [ ] Edit existing test type → saved
- [ ] Delete test type (if applicable) → confirmation dialog shown

### 8.2 Lab Test Requests
*(If accessible from clinic admin side)*

- [ ] Lab test requests list loads
- [ ] Filter by patient, status works
- [ ] Clicking a request → details shown
- [ ] **Update test result** (if applicable) → saved and visible on patient record

---

## 9. Clinic Admin — Payments

### 9.1 Appointment Payments
**URL:** `/en/clinic/payment/appoinment`

- [ ] Payment list loads
- [ ] Filter by date, status works
- [ ] Payment details (amount, method, date) shown correctly
- [ ] Unpaid appointments visible with payment action
- [ ] Process payment for unpaid appointment → success

### 9.2 Lab Test Payments
*(If separate)*

- [ ] Lab test payment list loads
- [ ] Process lab payment → success

---

## 10. Clinic Admin — Payouts (Doctor Payouts)

**URL:** `/en/clinic/payouts/doctor`

- [ ] Doctor payouts list loads
- [ ] Payout amounts calculated correctly (based on completed sessions)
- [ ] **Process payout** for a doctor → confirmation shown
- [ ] Payout history shown
- [ ] Filter by doctor, date range works

---

## 11. Clinic Admin — Reports

**URL:** `/en/clinic/reports`

- [ ] Reports page loads
- [ ] **Revenue report** shows correct totals
- [ ] **Appointment report** (count by period, by doctor, by status)
- [ ] **Patient report** (new registrations over time)
- [ ] **Doctor report** (sessions count, revenue per doctor)
- [ ] Export to PDF/CSV (if available) → file downloads correctly
- [ ] Date range filter updates charts/tables
- [ ] Charts render without errors

---

## 12. Clinic Admin — Settings

**URL:** `/en/clinic/settings`

### 12.1 General Settings Tab
- [ ] Settings page loads
- [ ] Clinic name, address, phone, email shown
- [ ] Edit any field → Save → changes persisted
- [ ] Invalid data (empty required fields) → validation error

### 12.2 Branding Settings Tab
- [ ] Logo upload works (valid image format)
- [ ] Invalid file type → error shown
- [ ] Logo preview updates after upload
- [ ] Save branding → changes visible across app

### 12.3 Subscription Tab
- [ ] Subscription info displayed (plan, expiry date, status)
- [ ] Upgrade/downgrade option (if applicable)

### 12.4 Secrets / API Keys Tab
- [ ] API secrets/keys shown (masked by default)
- [ ] Toggle to show/hide key value
- [ ] Regenerate key (if available) → confirmation prompt shown

---

## 13. Doctor Portal — Dashboard

**URL:** `/en/doctor/(dashboard)`

- [ ] Doctor dashboard loads without errors
- [ ] Today's appointment count shown
- [ ] Upcoming appointments listed
- [ ] Quick links/actions work

---

## 14. Doctor Portal — Consultation

**URL:** `/en/doctor/consultation/[id]`

- [ ] Consultation page loads for a given appointment
- [ ] **Patient info sidebar** shows correct patient details (name, DOB, allergies, etc.)
- [ ] **Prescription Manager** loads
  - [ ] Add new medicine/drug → appears in prescription list
  - [ ] Search/autocomplete for medicine name works
  - [ ] Set dosage, frequency, duration for each drug
  - [ ] Remove a medicine from prescription
  - [ ] Save prescription → persisted
- [ ] **Clinical notes** / Diagnosis section works
  - [ ] Type and save clinical notes
  - [ ] Previously saved notes load on return
- [ ] **Lab test ordering** (if present)
  - [ ] Select test type → test ordered
  - [ ] Ordered tests appear in lab test list
- [ ] **Mark consultation as complete** → status updates
- [ ] Print/Export consultation summary (if available)

---

## 15. Doctor Portal — Schedule Management

**URL:** `/en/doctor/schedule`

- [ ] Schedule view loads
- [ ] Doctor's current schedules listed
- [ ] **Set availability** (days and time slots) works
- [ ] **Finish/close a schedule** (ScheduleFinishView) → schedule closed
- [ ] Changes reflected in clinic admin's schedule view

---

## 16. Doctor Portal — Financials

**URL:** `/en/doctor/financials`

- [ ] Doctor financials page loads
- [ ] Summary (total earnings, pending payouts, completed payouts) shown
- [ ] **Filter by date range** → figures update
- [ ] Session-wise breakdown table shown
- [ ] Correct commission/fee percentage applied

---

## 17. Doctor Portal — Account Settings

**URL:** `/en/doctor/account-settings`

- [ ] Account settings page loads
- [ ] Profile info (name, bio, photo) displayed
- [ ] Edit profile → changes saved
- [ ] **Change password** form works
  - [ ] Incorrect current password → error
  - [ ] New password mismatch → error
  - [ ] Valid change → success message
- [ ] Profile photo upload works

---

## 18. Patient Portal — Dashboard

**URL:** `/en/patient/(dashboard)`

- [ ] Patient dashboard loads without errors
- [ ] Welcome message with patient name shown
- [ ] Upcoming appointments summary shown
- [ ] Quick links (Book Appointment, Records, Billing) work
- [ ] **Realtime Live Queue Card** (if on current session) shows queue position and updates

---

## 19. Patient Portal — Appointments

**URL:** `/en/patient/appointments`

- [ ] Appointments list loads
- [ ] **Upcoming** and **Past** tabs (or filters) work
- [ ] Each appointment shows doctor name, date, time, status
- [ ] Click appointment → **Appointment Details Dialog** opens
  - [ ] All appointment info shown (doctor, clinic, date, time, status)
  - [ ] Cancel appointment (if allowed) → confirmation prompt → cancelled
  - [ ] Download/print appointment slip (if available)
- [ ] **Live Queue Card**
  - [ ] Shows current position in queue
  - [ ] Estimated wait time displayed
  - [ ] Queue updates in real-time (or on refresh)

---

## 20. Patient Portal — Medical Records

**URL:** `/en/patient/medical-records`

### 20.1 Health Profile Tab
- [ ] Health profile tab loads
- [ ] Blood type, allergies, chronic conditions shown
- [ ] Edit and save health info works

### 20.2 Lab Reports Tab
- [ ] Lab reports listed (test name, date, result status)
- [ ] View result → opens detail (normal/abnormal flags shown)
- [ ] Download lab report (if available)

### 20.3 Medications Tab
- [ ] Current and past medications listed
- [ ] Medication details (name, dosage, frequency, prescribed by) shown
- [ ] Active vs completed medications differentiated

---

## 21. Patient Portal — Billing

**URL:** `/en/patient/billing`

### 21.1 Billing History
- [ ] Billing history list loads
- [ ] Each bill shows date, service, amount, payment status
- [ ] Filter by date range works
- [ ] Download invoice/receipt (if available)

### 21.2 Insurance Card
- [ ] Insurance card section loads
- [ ] Insurance details (provider, policy number, expiry) shown
- [ ] Add/edit insurance info → saved correctly

---

## 22. Patient Portal — Family Management

**URL:** `/en/patient/family`

- [ ] Family list loads
- [ ] Existing dependents shown
- [ ] **Add Dependent** dialog
  - [ ] Opens correctly
  - [ ] Fill all required fields → dependent added
  - [ ] Missing fields → validation errors
  - [ ] Duplicate dependent → error (if applicable)
- [ ] Remove dependent (if allowed) → confirmation prompt
- [ ] Book appointment on behalf of dependent (if available)

---

## 23. Patient Portal — Account Settings

**URL:** `/en/patient/account-settings`

- [ ] Account settings page loads
- [ ] Profile info (name, email, phone, address) displayed
- [ ] Edit profile info → changes saved
- [ ] Change password works (same checks as Doctor section above)
- [ ] Profile photo upload (if available)
- [ ] Notification preferences (if available) saved correctly

---

## 24. Public Features — Book Appointment

**URL:** `/en/book-appointment`

- [ ] Book appointment page loads without login
- [ ] Select clinic (if multi-clinic) → doctors list updates
- [ ] Select doctor → available schedules shown
- [ ] Select date → available time slots shown
- [ ] Select time slot → form to enter patient details shown
- [ ] Submit with valid data → booking confirmation shown
- [ ] Submit with missing fields → validation errors
- [ ] Already booked slot → unavailable / error shown
- [ ] Confirmation page / receipt shown after booking

---

## 25. Public Features — Queue Tracker

**URL:** `/en/queue-tracker` and `/en/queue-tracker/[encoded]`

- [ ] Queue tracker page loads without login
- [ ] Enter appointment token/code → queue status shown
- [ ] Queue position updates (or refresh updates position)
- [ ] "Your turn" / "Now serving" state shown correctly when at front
- [ ] Invalid token → error or not-found shown
- [ ] Clinic name and doctor shown on tracker

---

## 26. Public Features — Print Pages

**URL:** `/en/print-page`

- [ ] Print page loads with correct data
- [ ] Layout renders correctly for printing (no overflow, proper margins)
- [ ] Browser Print (`Ctrl+P`) shows clean print preview
- [ ] Appointment receipt/slip print works
- [ ] Lab report print (if applicable) works

---

## 27. Cross-Cutting Concerns

### 27.1 Navigation & Layout
- [ ] Sidebar navigation links all go to correct pages
- [ ] Active menu item highlighted correctly
- [ ] Breadcrumbs (if present) show correct path
- [ ] Back button in browser works without breaking state
- [ ] Page titles (browser tab) are descriptive
- [ ] Logo/brand name click → goes to dashboard

### 27.2 Responsive Design
- [ ] Desktop (1920×1080) — all layouts correct
- [ ] Laptop (1366×768) — no overflow, sidebar collapsible
- [ ] Tablet (768px) — layout adapts (sidebar collapses)
- [ ] Mobile (375px) — key features accessible, no broken layout

### 27.3 Error Handling
- [ ] API call fails → error toast/message shown to user (not blank screen)
- [ ] Navigate to non-existent route → 404 page shown
- [ ] Unauthorized route access → redirected or 403 shown
- [ ] Form submission error from server → error displayed in form context

### 27.4 Loading States
- [ ] Pages show loading spinner while data fetches
- [ ] Buttons show loading state while action is processing
- [ ] Tables show skeleton/loading state while data loads

### 27.5 Notifications & Toasts
- [ ] Success actions → green success toast/notification shown
- [ ] Error actions → red error toast shown
- [ ] Toast auto-dismisses after a few seconds
- [ ] Multiple toasts stack correctly (don't overlap)

### 27.6 Data Persistence
- [ ] Refresh page after save → data still present
- [ ] Go back and forward in browser → correct data shown
- [ ] Two tabs open → changes in one eventually reflect in other (or on refresh)

### 27.7 Internationalization (i18n)
- [ ] Language switch (if available) changes all UI text
- [ ] Dates formatted according to locale
- [ ] No hardcoded English text visible when non-English language selected
- [ ] URL `[lang]` segment changes correctly

### 27.8 Performance (Visual Check)
- [ ] No visible flickering on page load
- [ ] Charts animate smoothly
- [ ] Large list pages (100+ items) still responsive
- [ ] No frozen/laggy UI after heavy operations

---

## 🧪 Test Notes Log

Use this section to record failures or issues found during testing.

| # | Module | Issue Description | Severity | Status |
|---|--------|-------------------|----------|--------|
| 1 |        |                   |          |        |
| 2 |        |                   |          |        |
| 3 |        |                   |          |        |
| 4 |        |                   |          |        |
| 5 |        |                   |          |        |
| 6 |        |                   |          |        |
| 7 |        |                   |          |        |
| 8 |        |                   |          |        |
| 9 |        |                   |          |        |
|10 |        |                   |          |        |

> **Severity Levels:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## ✅ Testing Summary

| Section | Total Tests | Passed | Failed | Skipped |
|---------|-------------|--------|--------|---------|
| 1. Authentication | | | | |
| 2. Admin Dashboard | | | | |
| 3. Patient Management | | | | |
| 4. Doctor Management | | | | |
| 5. Appointments | | | | |
| 6. Schedule | | | | |
| 7. Staff | | | | |
| 8. Lab Tests | | | | |
| 9. Payments | | | | |
| 10. Payouts | | | | |
| 11. Reports | | | | |
| 12. Settings | | | | |
| 13. Doctor Dashboard | | | | |
| 14. Consultation | | | | |
| 15. Doctor Schedule | | | | |
| 16. Doctor Financials | | | | |
| 17. Doctor Account | | | | |
| 18. Patient Dashboard | | | | |
| 19. Patient Appointments | | | | |
| 20. Medical Records | | | | |
| 21. Billing | | | | |
| 22. Family | | | | |
| 23. Patient Account | | | | |
| 24. Book Appointment | | | | |
| 25. Queue Tracker | | | | |
| 26. Print Pages | | | | |
| 27. Cross-Cutting | | | | |
| **TOTAL** | | | | |

---

*Last updated: 2026-05-21 | Tester: _______________*
