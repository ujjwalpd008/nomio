# Product Requirements Document (PRD)
## Nominee Dashboard - MVP

**Version:** 1.0  
**Date:** January 9, 2026  
**Status:** Draft  
**Owner:** Product Team

---

## 1. Executive Summary

Nominee Dashboard is a centralized platform that helps individuals manage and track nominee information across all their financial accounts. The platform addresses the critical problem of unclaimed assets (₹1000+ crores in India alone) by ensuring nominees are informed about their entitlements in the unfortunate event of the account holder's demise.

### Vision
Enable every individual to create a clear financial legacy, ensuring their loved ones can easily access what rightfully belongs to them.

---

## 2. Problem Statement

### Current Pain Points
1. **Fragmented Information**: Users manage nominees across multiple platforms (banks, mutual funds, insurance, demat accounts) with no central tracking
2. **Lack of Awareness**: Nominees often don't know they've been named or what assets they're entitled to
3. **Unclaimed Assets**: Hundreds of crores remain unclaimed due to poor documentation and nominee awareness
4. **Manual Updates**: Life events (marriage, birth, divorce) require updating nominees across multiple platforms individually
5. **No Backup Plan**: If something happens to the account holder, family struggles to locate all assets

### Market Opportunity
- **Target Market**: India (initial focus)
- **TAM**: 150M+ financially active adults in India
- **SAM**: 50M+ individuals with 2+ financial accounts
- **SOM**: 500K users in Year 1

---

## 3. Goals & Objectives

### Business Goals
1. Launch MVP within 3 months
2. Acquire 1,000 active users in first 6 months
3. Achieve 70% user satisfaction score
4. Validate product-market fit

### User Goals
1. Centralize nominee information in one secure location
2. Ensure nominees are aware of their entitlements
3. Reduce time spent managing nominee updates from hours to minutes
4. Provide peace of mind about digital legacy

---

## 4. Target Users

### Primary Persona: "Planning Priya"
- **Age**: 30-45
- **Profile**: Working professional with multiple investments
- **Accounts**: 2-3 bank accounts, mutual funds, insurance policies, demat account
- **Tech Savviness**: Medium to High
- **Pain Point**: Juggling nominee details across platforms, worried family won't know about all assets

### Secondary Persona: "Concerned Ramesh"
- **Age**: 45-60
- **Profile**: Established career, significant assets
- **Accounts**: Multiple bank accounts, insurance, investments, real estate
- **Tech Savviness**: Low to Medium
- **Pain Point**: Wants to ensure family is taken care of, but overwhelmed by complexity

---

## 5. User Stories

### For Account Holders (Primary Users)

**Epic 1: Account Setup & Onboarding**
- As a user, I want to create an account with email/phone, so I can start managing my nominees
- As a user, I want to see an onboarding tutorial, so I understand how to use the platform
- As a user, I want to set up basic security (password, 2FA), so my data is protected

**Epic 2: Nominee Management**
- As a user, I want to add nominee details (name, relationship, contact), so I can track who I've nominated
- As a user, I want to edit/delete nominee information, so I can keep details up to date
- As a user, I want to see all my nominees in one place, so I have a clear overview

**Epic 3: Asset Management**
- As a user, I want to add financial accounts (bank, mutual fund, insurance, etc.), so I can track where I've added nominees
- As a user, I want to link specific nominees to each account, so I know who gets what
- As a user, I want to specify allocation percentages per nominee per account, so I can manage distribution
- As a user, I want to add account numbers and basic details, so nominees can identify accounts

**Epic 4: Document Storage**
- As a user, I want to upload important documents (PDFs, images), so I have backup copies
- As a user, I want to organize documents by account/category, so they're easy to find
- As a user, I want to mark certain documents as "critical" for nominees, so they know what's important

**Epic 5: Emergency Access**
- As a user, I want to designate trusted contacts, so they can initiate emergency access if needed
- As a user, I want to write a message to my nominees, so they receive guidance when accessing information

### For Nominees (Secondary Users)

**Epic 6: Nominee Notification & Access**
- As a nominee, I want to receive notification if I'm named as a beneficiary, so I'm aware of my entitlements
- As a nominee, I want to verify my identity, so I can access information meant for me
- As a nominee, I want to see what accounts I'm nominated for, so I know what to claim
- As a nominee, I want to access relevant documents, so I can complete the claim process

---

## 6. MVP Features & Requirements

### 6.1 Core Features (MUST HAVE - MVP)

#### F1: User Authentication & Authorization
**Priority**: P0 (Critical)

**Requirements**:
- Email/phone-based registration
- Password authentication (min 8 characters, 1 uppercase, 1 number, 1 special char)
- Email verification
- Secure password reset flow
- Session management
- Basic 2FA using OTP (SMS/Email)

**Acceptance Criteria**:
- User can register with email and password
- User receives verification email and can verify account
- User can log in with verified credentials
- User can reset password if forgotten
- Sessions expire after 30 days of inactivity

---

#### F2: Nominee Management
**Priority**: P0 (Critical)

**Requirements**:
- Add nominee with fields:
  - Full Name (required)
  - Relationship (dropdown: Spouse, Parent, Child, Sibling, Friend, Other)
  - Email (optional)
  - Phone Number (required)
  - Date of Birth (optional)
  - PAN Number (optional)
  - Address (optional)
- Edit nominee details
- Delete nominee (with confirmation)
- View all nominees in a list/card view
- Search/filter nominees

**Acceptance Criteria**:
- User can add a nominee with required fields
- User can edit any nominee detail
- User can delete a nominee (only if not linked to active accounts)
- User can see all nominees in a clean dashboard view
- Changes are saved immediately and persist

---

#### F3: Asset/Account Management
**Priority**: P0 (Critical)

**Requirements**:
- Add financial accounts with fields:
  - Account Type (dropdown: Bank Account, Mutual Fund, Life Insurance, Health Insurance, Term Insurance, Demat Account, PPF, EPF, NPS, Fixed Deposit, Other)
  - Institution Name (required)
  - Account Number (required)
  - Approximate Value (optional)
  - Account Status (Active/Closed)
  - Notes (optional text field)
- Link one or more nominees to each account
- Set allocation percentage per nominee per account (must total 100%)
- Edit account details
- Mark account as closed/inactive
- View all accounts in a dashboard

**Acceptance Criteria**:
- User can add an account with all required fields
- User can assign multiple nominees with percentage allocation
- System validates that allocation totals 100%
- User can view all accounts grouped by type
- User can see which nominees are linked to each account

---

#### F4: Dashboard & Overview
**Priority**: P0 (Critical)

**Requirements**:
- Overview of total accounts added
- Overview of total nominees
- Quick stats: Total estimated value (if provided)
- List of recent activities
- Quick action buttons (Add Nominee, Add Account)
- Visual representation of wealth distribution by nominee

**Acceptance Criteria**:
- User sees a clear summary of their setup on dashboard
- User can navigate to nominees or accounts from dashboard
- Dashboard loads in <2 seconds

---

#### F5: Document Storage (Basic)
**Priority**: P1 (High)

**Requirements**:
- Upload documents (PDF, JPG, PNG) - max 10MB per file
- Link documents to specific accounts
- Add document title/description
- Mark documents as "Critical for Nominees"
- Download uploaded documents
- Delete documents
- Maximum 50 documents per user (MVP limit)

**Acceptance Criteria**:
- User can upload a document and link it to an account
- User can view, download, and delete their documents
- Documents are stored securely and accessible only to the user
- File size and type validations work correctly

---

#### F6: Trusted Contact System
**Priority**: P1 (High)

**Requirements**:
- Add 1-3 trusted contacts (name, email, phone)
- Trusted contacts can initiate "emergency access" request
- Emergency access requires:
  - Death certificate upload
  - Government ID proof
  - 48-hour waiting period (security measure)
- Admin/manual review for MVP (automated verification in future)
- Notification sent to user's registered email (to prevent fraud if still alive)

**Acceptance Criteria**:
- User can add trusted contacts
- Trusted contact receives email explaining their role
- Emergency access flow is documented and functional
- Security measures prevent unauthorized access

---

#### F7: Nominee Portal (Read-Only Access)
**Priority**: P1 (High)

**Requirements**:
- After emergency access is granted:
  - Nominees receive email/SMS notification
  - Nominees can create an account (if don't have one)
  - Nominees can view accounts where they're nominated
  - Nominees can view allocation percentage
  - Nominees can access documents marked "Critical for Nominees"
  - Nominees can see account holder's final message (if provided)
  - Nominees can view claim instructions

**Acceptance Criteria**:
- Nominee receives notification after verification
- Nominee can log in and see relevant information
- Nominee cannot edit or access other nominees' information
- Nominee can download necessary documents

---

### 6.2 Secondary Features (NICE TO HAVE - MVP)

#### F8: Profile & Settings
**Priority**: P2 (Medium)

- Edit user profile (name, contact details)
- Change password
- Enable/disable notifications
- Deactivate account

---

#### F9: Account Holder's Message
**Priority**: P2 (Medium)

- Text area to write a personal message to nominees
- Message is shown to nominees when they gain access
- Can include instructions, passwords, guidance

---

#### F10: Export Data
**Priority**: P2 (Medium)

- Export nominee list as CSV/PDF
- Export account list as CSV/PDF
- Generate summary report of all information

---

### 6.3 Future Features (POST-MVP)

**Phase 2 Features**:
- Mobile app (iOS/Android)
- Reminders to review nominations annually
- Integration with financial institutions' APIs
- Automated death certificate verification via government databases
- Legal will integration
- Multi-language support
- Premium features: financial advisor access, estate planning tools
- Beneficiary claim tracking
- Video message recording
- Recurring nomination review reminders
- Nominee consent/acknowledgment
- Family tree visualization
- Asset value tracking over time

---

## 7. Technical Requirements

### 7.1 Platform
- **Web Application**: Responsive design (mobile-first approach)
- **Browser Support**: Chrome, Safari, Firefox, Edge (latest 2 versions)

### 7.2 Technology Stack (Suggested)

**Frontend**:
- React.js or Next.js
- TypeScript
- Tailwind CSS or Material-UI
- React Query for data fetching
- React Hook Form for form management

**Backend**:
- Node.js with Express or Next.js API routes
- PostgreSQL database
- Prisma ORM
- JWT for authentication
- bcrypt for password hashing

**Storage**:
- AWS S3 or Cloudflare R2 for document storage
- Encryption at rest for all documents

**Hosting**:
- Vercel/Netlify (frontend)
- Railway/Render/AWS (backend & database)

**Security**:
- HTTPS everywhere
- Data encryption in transit (TLS 1.3)
- Data encryption at rest (AES-256)
- Regular security audits
- GDPR/data protection compliance

### 7.3 Database Schema (High-Level)

**Tables**:
1. `users` - Account holders
2. `nominees` - Nominee details
3. `accounts` - Financial accounts/assets
4. `account_nominees` - Many-to-many relationship with allocation %
5. `documents` - Uploaded files metadata
6. `trusted_contacts` - Emergency contacts
7. `emergency_requests` - Access requests and their status
8. `audit_logs` - Activity tracking

### 7.4 Performance Requirements
- Page load time: <2 seconds
- API response time: <500ms (95th percentile)
- Document upload: <30 seconds for 10MB file
- 99.9% uptime SLA

### 7.5 Security Requirements
- All passwords hashed with bcrypt (min 10 rounds)
- 2FA required for sensitive operations
- Rate limiting on all APIs
- SQL injection prevention (use parameterized queries)
- XSS protection
- CSRF protection
- Regular dependency updates
- Security headers (CSP, HSTS, etc.)

---

## 8. User Experience & Design

### 8.1 Design Principles
1. **Simplicity**: Clean, intuitive interface
2. **Trust**: Professional design that conveys security
3. **Empathy**: Sensitive tone given the nature of the product
4. **Accessibility**: WCAG 2.1 AA compliance

### 8.2 Key User Flows

**Flow 1: First-Time User Onboarding**
1. Land on homepage → Sign Up
2. Email verification
3. Welcome screen with value proposition
4. Quick tutorial (optional, can skip)
5. Add first nominee
6. Add first account and link nominee
7. Dashboard overview

**Flow 2: Adding Complete Information**
1. Dashboard → Add Nominee
2. Fill nominee form → Save
3. Dashboard → Add Account
4. Select account type → Fill details
5. Link nominees with allocation %
6. Upload documents (optional)
7. Set up trusted contacts

**Flow 3: Emergency Access**
1. Trusted contact receives email with access instructions
2. Trusted contact logs in/creates account
3. Initiates emergency access request
4. Uploads death certificate & ID proof
5. 48-hour waiting period + admin review
6. Access granted → Nominees notified
7. Nominees log in and view their entitlements

### 8.3 Wireframe Requirements
- Homepage/Landing page
- Sign up/Login pages
- Dashboard
- Add/Edit Nominee form
- Add/Edit Account form
- Nominee list view
- Account list view
- Document upload interface
- Trusted contacts setup
- Nominee portal view
- Emergency access request form

---

## 9. Success Metrics (KPIs)

### Primary Metrics
1. **User Acquisition**: 1,000 registered users in 6 months
2. **Activation Rate**: 60% of users add at least 1 nominee and 1 account
3. **Retention**: 40% MAU/WAU ratio
4. **Completion Rate**: 70% of users complete full setup (3+ accounts, 2+ nominees)

### Secondary Metrics
1. **Average nominees per user**: Target 2.5
2. **Average accounts per user**: Target 4
3. **Document upload rate**: 50% of users upload at least 1 document
4. **Trusted contact setup rate**: 60% of users add at least 1 trusted contact
5. **User satisfaction score**: 4+/5

### Health Metrics
1. **Bug rate**: <5 critical bugs per month
2. **Response time**: <500ms API responses
3. **Uptime**: 99.9%
4. **Support tickets**: <10 per 100 active users

---

## 10. Timeline & Milestones

### Phase 0: Pre-Development (Week 1-2)
- ✅ PRD finalization
- ⬜ Wireframes & mockups
- ⬜ Technical architecture documentation
- ⬜ Database schema design
- ⬜ Development environment setup

### Phase 1: Core Development (Week 3-8)
**Week 3-4: Foundation**
- Authentication system
- Database setup
- Basic UI components
- Dashboard skeleton

**Week 5-6: Core Features**
- Nominee management (F2)
- Account management (F3)
- Dashboard & overview (F4)

**Week 7-8: Secondary Features**
- Document storage (F5)
- Trusted contacts (F6)
- Profile & settings (F8)

### Phase 2: Nominee Portal & Testing (Week 9-10)
- Nominee portal development (F7)
- Emergency access flow
- Comprehensive testing
- Bug fixes

### Phase 3: Launch Preparation (Week 11-12)
- Security audit
- Performance optimization
- User acceptance testing
- Documentation (user guides, FAQs)
- Landing page optimization
- Launch marketing materials

### Phase 4: MVP Launch (Week 13)
- Soft launch to beta users (50-100)
- Gather feedback
- Iterate quickly
- Public launch

---

## 11. Out of Scope (MVP)

The following features are explicitly **NOT** included in the MVP:

1. ❌ Mobile native apps (iOS/Android)
2. ❌ API integrations with banks/financial institutions
3. ❌ Automated death certificate verification
4. ❌ Legal will creation/storage
5. ❌ Financial advisor integrations
6. ❌ Asset value tracking over time
7. ❌ Email/SMS reminders
8. ❌ Multi-language support
9. ❌ Video message recording
10. ❌ Payment/subscription features
11. ❌ Claim process tracking
12. ❌ Dispute resolution mechanism
13. ❌ Advanced analytics/reporting
14. ❌ Social features (sharing, recommendations)
15. ❌ White-label solutions for institutions

---

## 12. Risks & Mitigations

### Risk 1: Security Breach
- **Impact**: Critical
- **Mitigation**: Regular security audits, encryption, penetration testing, bug bounty program

### Risk 2: Low User Adoption
- **Impact**: High
- **Mitigation**: Strong marketing, referral program, partnerships with financial advisors

### Risk 3: Fraud/Unauthorized Access
- **Impact**: Critical
- **Mitigation**: Multi-factor authentication, waiting periods, manual verification for MVP

### Risk 4: Legal Compliance Issues
- **Impact**: High
- **Mitigation**: Legal consultation, clear disclaimers, data protection compliance

### Risk 5: Technical Complexity
- **Impact**: Medium
- **Mitigation**: Phased approach, MVP focus, experienced development team

---

## 13. Legal & Compliance

### 13.1 Disclaimers Required
- Platform is for informational purposes only
- Does not replace legal nominations or wills
- User is responsible for accuracy of information
- Platform cannot guarantee nominee claims will be processed by institutions

### 13.2 Data Protection
- Comply with Information Technology Act, 2000 (India)
- GDPR compliance for international users
- Clear privacy policy
- Data retention and deletion policy
- User consent for data processing

### 13.3 Terms of Service
- User agreement on sign-up
- Liability limitations
- Service level agreement
- Termination clauses

---

## 14. Open Questions & Decisions Needed

1. **Pricing Strategy**: Free for MVP or freemium model from day 1?
2. **Verification Process**: Manual review vs. automated for emergency access?
3. **Geographic Focus**: India-only or international from start?
4. **Marketing Channels**: What's the primary acquisition strategy?
5. **Partnerships**: Should we partner with financial institutions early?
6. **Customer Support**: In-house vs. outsourced for MVP?
7. **Admin Dashboard**: Do we need internal tools for managing emergency requests?

---

## 15. Appendix

### A. Glossary
- **Account Holder**: Primary user who manages nominees and accounts
- **Nominee**: Person designated to receive assets/information
- **Trusted Contact**: Person authorized to initiate emergency access
- **Emergency Access**: Process to grant nominees access after account holder's death
- **Allocation**: Percentage of an account assigned to a nominee

### B. References
- India's unclaimed assets: [RBI Unclaimed Deposits](https://m.rbi.org.in/)
- Data protection: [IT Act 2000](https://www.meity.gov.in/)

### C. Revision History
| Version | Date | Author | Changes |
|---------|------|--------- |---------|
| 1.0 | Jan 9, 2026 | Product Team | Initial MVP PRD |

---

## 16. Approval & Sign-off

**Product Owner**: ___________________ Date: ___________

**Engineering Lead**: ___________________ Date: ___________

**Design Lead**: ___________________ Date: ___________

---

**Questions or Feedback?**  
Contact: [Your Email/Slack Channel]
