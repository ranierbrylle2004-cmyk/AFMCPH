# AFMC Pickle Hub - Court Booking & Community Management System

## CSC 106 Software Proposal Presentation

### Slide 1: Title & Project Overview

**Project Title:** AFMC Pickle Hub - Court Booking & Community Management System  
**Tagline:** Serve. Rally. Believe.  
**Course & Section:** CSC 107, Activity 1  
**Date of Presentation:** September 2026

**Team Members and Roles:**
- Project Manager: [Team Member Name]
- Lead Developer: [Team Member Name]
- System Analyst: [Team Member Name]
- UI/UX Designer: [Team Member Name]

**Project Overview:**
AFMC Pickle Hub is a comprehensive web-based court booking and community management system designed for the Ampayon Free Methodist Court pickleball facility in Butuan City, Agusan del Norte. The system provides a modern, user-friendly platform for players to book courts, engage with the community, and for administrators to manage facility operations efficiently.

**Venue:** AFMC Pickle Hub  
**Location:** Ampayon, Butuan City, Agusan del Norte

### Slide 2: Problem Statement & Target Audience

**CSC 106 Artifact: Domain Analysis & Problem Identification**

**The Problem:**
The Ampayon Free Methodist Court pickleball facility currently lacks a modern, digital system for court reservations and community engagement. Players must manually book courts through phone calls or in-person visits, leading to scheduling conflicts, double-bookings, and inefficient resource utilization. Facility administrators struggle with manual record-keeping, payment tracking, and community communication, resulting in operational inefficiencies and poor user experience.

**Target Users:**
- **Primary Users:** Pickleball players and customers who need to book courts, make payments, and engage with the facility community
- **Secondary Users:** Facility administrators and staff who manage court availability, process bookings, moderate content, and handle customer support

**Current Solutions & Gaps:**
- **Manual phone/in-person booking:** Time-consuming, prone to errors, limited availability
- **Spreadsheets/paper records:** Difficult to track, no real-time updates, poor data organization
- **Social media groups:** Unstructured communication, no booking integration, limited moderation
- **Gap:** No integrated system that combines booking, payment, community features, and administrative tools in one platform

### Slide 3: Proposed Solution & Core Value Proposition

**CSC 106 Artifact: Concept Definition & System Objectives**

**High-Level Overview:**
AFMC Pickle Hub is a full-featured React-based web application that serves two primary user roles:

1. **Players/Customers:** Can browse available courts, view facility information, book time slots, make payments via GCash, participate in community discussions, and manage their personal bookings.

2. **Administrators:** Have full control over court availability, booking approvals, newsfeed moderation, system settings, and community management.

The system features a responsive design that works seamlessly across desktop and mobile devices, with a dark-themed UI featuring purple and orange brand colors that reflect the facility's vibrant court surfaces.

**Key Benefits and Core Value:**
- **Streamlined Booking Process:** Real-time court availability, interactive calendar, and instant booking confirmation
- **Payment Integration:** Secure GCash payment processing with receipt verification
- **Community Engagement:** Newsfeed, chat functionality, and social features for player interaction
- **Administrative Efficiency:** Centralized dashboard for booking management, content moderation, and system configuration
- **Enhanced User Experience:** Modern, intuitive interface with responsive design

**Scope Boundaries:**
**In Scope:**
- Court booking and reservation management
- Payment processing via GCash
- Community features (newsfeed, chat)
- Administrative dashboard and settings
- User authentication and role-based access

**Out of Scope:**
- Tournament management and bracket generation
- Membership system and tiered pricing
- Equipment inventory management
- External calendar integration
- Advanced analytics and reporting
- Mobile native applications

### Slide 4: Requirements Specification

**CSC 106 Artifact: Software Requirements Specification (SRS)**

**Functional Requirements (Priority Categorized):**

**High Priority:**
1. **User Authentication & Role-Based Access Control**
   - Login system for players and administrators
   - Role-based permissions (Player vs. Admin)
   - Session management and security

2. **Court Booking System**
   - Real-time court availability display
   - Interactive calendar with date/time slot selection
   - Booking confirmation and status tracking
   - Court selection with color-coded surfaces

3. **Payment Processing**
   - GCash payment integration
   - Receipt submission and verification
   - Payment status tracking
   - Paddle rental fee management

**Medium Priority:**
4. **Community Features**
   - Newsfeed with post categories (Tournament, Announcement, Emergency, Community)
   - Post creation, approval workflow, and moderation
   - Like and comment functionality
   - Pinned posts for important announcements

5. **Communication System**
   - Real-time chat between community members
   - Dedicated support channel
   - Conversation management with unread indicators
   - Admin communication tools

6. **Administrative Dashboard**
   - Booking request management and approval workflow
   - Content moderation and review queue
   - System configuration (rates, hours, court settings)
   - Statistics and reporting

**Non-Functional Requirements:**

**Performance:**
- Page load time < 2 seconds
- API response time < 500ms
- Support for concurrent users (50+ simultaneous bookings)

**Security:**
- Secure authentication with password hashing
- Role-based access control
- Input validation and sanitization
- Secure payment data handling

**Scalability:**
- Architecture supports addition of more courts
- Database design allows for user growth
- Component-based architecture for feature expansion

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

**Usability:**
- Intuitive interface with minimal learning curve
- Mobile-responsive design
- Clear error messages and feedback
- Consistent design patterns

### Slide 5: System Use Cases & User Flow

**CSC 106 Artifact: Behavioral Modeling (UML Use Case Diagram / Sequence Diagram)**

**System Actors:**
- **Player:** End user who books courts and participates in community
- **Administrator:** Facility staff who manages bookings and content
- **System:** Automated processes and notifications

**Core Use Cases:**

**Player Use Cases:**
1. **Book Court Slot**
   - Player browses available courts
   - Selects date and time slot
   - Chooses court and confirms booking
   - Submits payment via GCash
   - Receives booking confirmation

2. **Manage Bookings**
   - View booking history
   - Check booking status
   - Cancel pending bookings
   - View payment receipts

3. **Engage with Community**
   - Browse newsfeed posts
   - Create and submit posts
   - Like and comment on posts
   - Chat with other players

**Administrator Use Cases:**
1. **Manage Bookings**
   - Review booking requests
   - Approve/reject bookings
   - Verify payment receipts
   - Update booking status

2. **Moderate Content**
   - Review pending posts
   - Approve/reject community content
   - Pin important announcements
   - Remove inappropriate content

3. **Configure System**
   - Update pricing rates
   - Manage court availability
   - Set operating hours
   - Configure payment settings

**Critical User Flow Examples:**

**User Story 1: Court Booking Flow**
"As a player, I want to book a court slot online so that I can secure my playing time without calling the facility."

**Flow:**
1. Player logs into system
2. Navigates to "Book a Slot" screen
3. Selects preferred court from available options
4. Chooses date from weekly calendar
5. Selects available time slot
6. Reviews booking summary and pricing
7. Proceeds to checkout
8. Submits GCash payment receipt
9. Receives pending booking confirmation
10. Admin reviews and approves booking
11. Player receives final confirmation

**User Story 2: Community Post Flow**
"As a community member, I want to share tournament announcements so that other players can stay informed about upcoming events."

**Flow:**
1. Player accesses community newsfeed
2. Clicks "Create Post" button
3. Selects post category (Tournament)
4. Enters title and content
5. Submits post for review
6. Post enters pending queue
7. Admin reviews post content
8. Admin approves post
9. Post appears in live newsfeed
10. Community members can like and comment
- **Real-time Court Availability:** View current status of all 3 courts (Court 1, Court 2, Court 3)
- **Interactive Calendar:** Weekly calendar view with date and time slot selection
- **Dynamic Pricing:** Morning rate (₱250/hour) and evening rate (₱300/hour)
- **Time Slot Management:** Hourly slots from 6:00 AM to 8:00 PM
- **Court Selection:** Choose between available courts with color-coded surfaces (Purple/Orange)
- **Booking Confirmation:** Complete checkout process with payment integration

### Slide 6: System Architecture & Tech Stack

**CSC 106 Artifact: Architectural Design**

**System Architecture: Client-Server with Component-Based Frontend**

The AFMC Pickle Hub follows a modern client-server architecture with a React-based single-page application (SPA) frontend. The current implementation is a frontend-focused prototype with plans for backend integration in CSC 107.

**Architecture Overview:**
- **Presentation Layer:** React 19 components with TypeScript
- **State Management:** React hooks (useState) for component-level state
- **Routing:** Custom screen-based navigation system
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Build System:** Vite 8 for development and production builds

**Tech Stack Matrix:**

| Layer | Chosen Technology/Framework | Justification |
|-------|----------------------------|---------------|
| **Frontend** | React 19 + TypeScript 5.7 | Component reusability, type safety, large ecosystem, concurrent features for better performance |
| **Styling** | Tailwind CSS v4 | Utility-first approach, rapid development, consistent design system, built-in responsive design |
| **Build Tool** | Vite 8 | Fast development server, optimized production builds, modern ESM-based tooling |
| **State Management** | React Hooks (useState) | Simple, built-in state management, sufficient for current scope, easy to scale to Redux/Context API |
| **Routing** | Custom Screen Navigation | Lightweight, fits single-page application pattern, easy to extend to React Router |
| **Package Manager** | pnpm | Fast, disk space efficient, strict dependency management |
| **Code Formatting** | oxfmt | Consistent code style, automated formatting, integration with development workflow |
| **Type Checking** | TypeScript 5.7 | Type safety, better IDE support, catch errors at compile time, improved documentation |
| **Future Backend** | Node.js + Express (Planned) | Non-blocking I/O, asynchronous handling, JavaScript ecosystem consistency |
| **Future Database** | PostgreSQL (Planned) | Relational integrity for transactional data, ACID compliance, robust querying capabilities |
| **Future Hosting** | Vercel/Netlify (Planned) | Easy deployment, automatic HTTPS, global CDN, preview environments |

**Component Architecture:**
The system follows a component-based architecture with clear separation of concerns:
- **Layout Components:** Reusable UI elements (TopBar, Sidebar, Page, Drawer)
- **Screen Components:** Feature-specific pages organized by user role
- **Business Logic:** Encapsulated within screen components
- **Type Definitions:** Centralized TypeScript interfaces
- **Theme Constants:** Brand tokens and design system configuration
- **GCash Payment:** Integrated GCash payment system for booking fees
- **Paddle Rental:** Optional equipment rental for ₱50
- **Receipt Management:** Digital receipt submission and admin verification
- **Payment Status Tracking:** Real-time payment status updates

### Slide 7: Data Design / Database Schema

**CSC 106 Artifact: Structural Modeling (Entity-Relationship Diagram / Data Dictionary)**

**Entity-Relationship Diagram (ERD) Overview:**

**Core Entities and Relationships:**

**1. Users**
- Attributes: UserID (PK), Username, PasswordHash, Email, Role (Player/Admin), CreatedAt, LastLogin
- Relationships: 1:N with Bookings, 1:N with Posts, 1:N with Conversations

**2. Bookings**
- Attributes: BookingID (PK), UserID (FK), CourtID (FK), Date, TimeSlot, Status (Pending/Confirmed/Completed/Cancelled), Amount, PaymentReceipt, CreatedAt, UpdatedAt
- Relationships: N:1 with Users, N:1 with Courts

**3. Courts**
- Attributes: CourtID (PK), Name, Color, IsAvailable, Description, CreatedAt
- Relationships: 1:N with Bookings, 1:N with TimeSlots

**4. TimeSlots**
- Attributes: SlotID (PK), CourtID (FK), Date, Time, Status (Available/Reserved/Booked/Closed), BookingID (FK, nullable)
- Relationships: N:1 with Courts, N:1 with Bookings

**5. Posts**
- Attributes: PostID (PK), UserID (FK), Type (Tournament/Announcement/Emergency/Community), Title, Body, Status (Approved/Pending/Rejected), LikesCount, CommentsCount, IsPinned, CreatedAt, UpdatedAt
- Relationships: N:1 with Users, 1:N with Comments

**6. Comments**
- Attributes: CommentID (PK), PostID (FK), UserID (FK), Content, CreatedAt
- Relationships: N:1 with Posts, N:1 with Users

**7. Conversations**
- Attributes: ConversationID (PK), User1ID (FK), User2ID (FK), LastMessage, LastMessageTime, UnreadCount, IsSupportChannel, CreatedAt
- Relationships: N:1 with Users (twice), 1:N with Messages

**8. Messages**
- Attributes: MessageID (PK), ConversationID (FK), SenderID (FK), Content, CreatedAt, IsRead
- Relationships: N:1 with Conversations, N:1 with Users

**9. Settings**
- Attributes: SettingID (PK), MorningRate, EveningRate, PaddleRentalFee, OpenTime, CloseTime, MorningCutoff, GCashNumber, GCashName, VenueName, VenueTagline, VenueLocation, VenueDescription, UpdatedAt
- Relationships: Singleton entity (system-wide configuration)

**Relationship Cardinalities:**
- User ↔ Booking: 1:N (One user can have multiple bookings)
- User ↔ Post: 1:N (One user can create multiple posts)
- Court ↔ Booking: 1:N (One court can have multiple bookings)
- Court ↔ TimeSlot: 1:N (One court has multiple time slots)
- Post ↔ Comment: 1:N (One post can have multiple comments)
- Conversation ↔ Message: 1:N (One conversation contains multiple messages)

**Data Persistence Strategy:**
- **Current Implementation:** Client-side state management using React hooks (temporary storage)
- **Planned Implementation:** PostgreSQL database with proper indexing and constraints
- **Backup Strategy:** Regular database backups with point-in-time recovery
- **Caching:** Redis for frequently accessed data (court availability, user sessions)
- **Data Validation:** Application-level validation + database constraints
- **Booking History:** View all personal bookings with status tracking
- **Status Management:** Track Pending, Confirmed, Completed, and Cancelled bookings
- **Quick Actions:** Easy access to new bookings and account management

### Slide 8: User Interface Mockups & Wireframes

**CSC 106 Artifact: UI/UX Design & Prototyping**

**Key User Interface Screens:**

**1. Login Screen (Authentication)**
- **Purpose:** User authentication with role selection
- **Layout:** Centered card with ambient background effects
- **Elements:**
  - AFMC branding (logo, tagline "Serve. Rally. Believe.")
  - Role selection cards (Player vs. Admin)
  - Login form with username/password fields
  - Password visibility toggle
  - Error messaging and validation feedback
  - Loading states for authentication
- **Interactions:** Role selection → Form input → Authentication → Dashboard redirect

**2. Home Screen (Landing Page)**
- **Purpose:** Facility overview and court status display
- **Layout:** Hero section with stats grid below
- **Elements:**
  - Hero image with gradient overlay
  - Court availability indicator (animated pulse)
  - "AFMC Pickle Hub" branding with tagline
  - Action buttons (View Courts, Community)
  - Stats grid (Courts, Per Hour, Bookings, Posts)
  - Court status cards with availability indicators
  - Photo gallery strip (facility images)
  - Feature cards (Play. Compete. Connect., Premium Indoor Facility, Great Community)
- **Interactions:** Court cards → Calendar, Gallery → Venue Detail, Community button → Newsfeed

**3. Calendar Screen (Court Booking)**
- **Purpose:** Interactive court booking interface
- **Layout:** Split view (calendar + booking summary)
- **Elements:**
  - Court image header with venue info
  - Court selector (horizontal scroll)
  - Weekly calendar picker (Mon-Sun)
  - Time slot grid with status indicators
  - Legend (Available, Reserved, Booked, Closed)
  - Desktop booking summary sidebar
  - Mobile bottom sheet with total and action button
- **Interactions:** Court selection → Date selection → Time slot selection → Checkout

**4. Admin Bookings Screen (Booking Management)**
- **Purpose:** Administrator booking request management
- **Layout:** Stats row + filter tabs + booking cards
- **Elements:**
  - Stats grid (Pending, Confirmed, Completed, Cancelled counts)
  - Filter tabs (All, Pending, Confirmed, Completed, Cancelled)
  - Expandable booking cards with:
    - Player avatar and name
    - Booking status badge
    - Court, date, time information
    - Expanded details (Booking ID, Sport, Amount)
    - GCash receipt verification (for pending)
    - Action buttons (Accept/Reject for pending, Cancel/Complete for confirmed)
- **Interactions:** Filter selection → Card expansion → Action button → Status update

**5. Newsfeed Screen (Community)**
- **Purpose:** Community content and engagement
- **Layout:** Feed with sidebar (desktop)
- **Elements:**
  - Category filter tabs (All Posts, Tournament, Announcement, Emergency, Community)
  - Post creation form (expandable)
  - Pending post notification
  - Pinned posts section with pin icon
  - Post cards with:
    - Author avatar and name
    - Post type badge
    - Title and content
    - Like and comment counts
    - Like button with toggle state
  - Desktop sidebar with AFMC stats
- **Interactions:** Category filter → Create post → Like/comment → Post submission

**Design System Consistency:**
- **Color Palette:** Purple (#7c3aed) primary, Orange (#f97316) accent, dark backgrounds
- **Typography:** Barlow Condensed for headings, system fonts for body
- **Components:** Rounded-2xl corners, gradient buttons, subtle borders
- **Spacing:** Consistent padding and margins using Tailwind spacing scale
- **Responsiveness:** Mobile-first approach with breakpoints for tablet and desktop
- **States:** Hover, active, disabled, loading, and error states for all interactive elements
- **Newsfeed:** Community-driven posts and announcements
- **Post Categories:** Tournament, Announcement, Emergency, and Community posts
- **Post Submission:** Create and submit posts for admin approval
- **Engagement:** Like and comment on community posts
- **Pinned Content:** Important announcements pinned to top of feed

### Slide 9: Feasibility Analysis & Risk Assessment

**CSC 106 Artifact: Project Feasibility & Risk Management**

**Feasibility Evaluation:**

**Technical Feasibility:**
- **Assessment:** HIGH - The proposed technology stack (React, TypeScript, Vite, Tailwind CSS) is well-established with extensive community support and documentation
- **Resources:** Development team has foundational knowledge of JavaScript and web development
- **Complexity:** Component-based architecture reduces complexity; modular design allows iterative development
- **Integration Points:** GCash API integration may require additional research but is well-documented

**Operational Feasibility:**
- **Assessment:** HIGH - The system addresses clear operational pain points at the facility
- **User Adoption:** Intuitive interface minimizes training requirements for both players and administrators
- **Workflow Integration:** System aligns with existing facility operations while modernizing processes
- **Support Structure:** Admin dashboard provides centralized management for facility staff

**Economic Feasibility:**
- **Assessment:** MEDIUM-HIGH - Development costs are justified by operational efficiency gains
- **Cost-Benefit Analysis:**
  - **Development Costs:** Time investment by development team, minimal software licensing costs (open-source technologies)
  - **Operational Savings:** Reduced manual booking time, fewer scheduling conflicts, improved resource utilization
  - **Revenue Impact:** Potential for increased bookings due to improved accessibility
  - **ROI Timeline:** Expected positive ROI within 6-12 months of implementation

**Top 3 Risks & Mitigation Strategies:**

**Risk 1: Data Privacy and Security Concerns**
- **Description:** User personal information, payment data, and booking records require robust security measures
- **Impact:** HIGH - Data breach could damage reputation and legal liability
- **Mitigation:**
  - Implement secure authentication with password hashing
  - Use HTTPS for all data transmission
  - Follow OWASP security guidelines
  - Regular security audits and penetration testing
  - GCash integration through official API (not direct payment handling)

**Risk 2: Scope Creep During Development**
- **Description:** Additional features may be requested during development, extending timeline and complexity
- **Impact:** MEDIUM - Could delay project completion and increase development costs
- **Mitigation:**
  - Clearly defined scope boundaries in requirements specification
  - Phased implementation approach (MVP first, enhancements later)
  - Change request process for any additional features
  - Regular stakeholder reviews to align expectations
  - Prioritize features using MoSCoW method (Must have, Should have, Could have, Won't have)

**Risk 3: GCash Integration Complexity**
- **Description:** Payment integration may be more complex than anticipated due to API requirements or compliance issues
- **Impact:** MEDIUM-HIGH - Could delay core booking functionality
- **Mitigation:**
  - Implement manual receipt verification as backup plan
  - Research GCash API documentation early in development
  - Create payment abstraction layer for multiple payment methods
  - Allow enough time in schedule for payment integration testing
  - Have fallback to manual payment processing if needed

**Additional Risk Considerations:**
- **Technical Debt:** Rapid prototyping may require refactoring for production readiness
- **User Adoption:** Resistance to change from manual booking processes
- **Performance:** Handling concurrent bookings during peak times
- **Maintenance:** Ongoing updates and bug fixes after deployment
- **Real-time Chat:** Direct messaging with community members
- **Support Channel:** Dedicated AFMC Support conversation
- **Conversation Management:** Organized chat threads with unread indicators
- **Admin Communication:** Direct communication with facility management

### Slide 10: Implementation Roadmap for CSC 107

**CSC 106 Artifact: Project Plan & Transition to SE 2 (Implementation)**

**High-Level Development Timeline (CSC 107 Semester):**

**Sprint 1: Foundation & Backend Setup (Weeks 1-3)**
- **Objectives:** Establish development environment and backend infrastructure
- **Tasks:**
  - Set up Node.js/Express backend server
  - Configure PostgreSQL database and implement schema
  - Create database migration scripts
  - Set up development and testing environments
  - Implement basic API structure and routing
  - Configure environment variables and security settings
- **Deliverables:** Working backend server, database schema, API endpoint structure

**Sprint 2: Core API Development (Weeks 4-6)**
- **Objectives:** Implement RESTful API for core functionality
- **Tasks:**
  - User authentication API (login, registration, session management)
  - Court management API (CRUD operations for courts and time slots)
  - Booking system API (create, read, update, delete bookings)
  - Payment processing API (GCash integration, receipt verification)
  - Input validation and error handling
  - API documentation (Swagger/OpenAPI)
- **Deliverables:** Functional REST API with authentication, booking, and payment endpoints

**Sprint 3: Frontend-Backend Integration (Weeks 7-9)**
- **Objectives:** Connect React frontend to backend API
- **Tasks:**
  - Replace mock data with API calls
  - Implement API client with error handling
  - Add loading states and optimistic UI updates
  - Implement real-time updates (WebSockets for live availability)
  - Session management and authentication flow
  - Form validation and user feedback
- **Deliverables:** Fully integrated application with real data persistence

**Sprint 4: Community Features & Testing (Weeks 10-12)**
- **Objectives:** Complete community features and comprehensive testing
- **Tasks:**
  - Implement newsfeed API and frontend integration
  - Build chat system with real-time messaging
  - Content moderation workflow
  - Unit testing for critical components
  - Integration testing for API endpoints
  - User acceptance testing with facility staff
  - Performance optimization and bug fixes
- **Deliverables:** Complete community features, tested application, bug fixes

**Sprint 5: Deployment & Documentation (Weeks 13-15)**
- **Objectives:** Prepare for production deployment
- **Tasks:**
  - Set up production hosting (Vercel for frontend, appropriate backend hosting)
  - Configure domain and SSL certificates
  - Database backup and monitoring setup
  - User documentation and admin guide
  - Final security audit
  - Performance testing and optimization
  - Training for facility administrators
- **Deliverables:** Production deployment, documentation, administrator training

**Current Status:**

**Completed (CSC 106):**
- ✅ Project requirements analysis and specification
- ✅ System architecture design
- ✅ Database schema design
- ✅ UI/UX wireframes and mockups
- ✅ Frontend prototype with React components
- ✅ Design system and component library
- ✅ Basic state management and navigation
- ✅ Responsive layout implementation

**To Be Built (CSC 107):**
- ⏳ Backend API development (Node.js/Express)
- ⏳ Database implementation (PostgreSQL)
- ⏳ Authentication system with proper security
- ⏳ Payment integration (GCash API)
- ⏳ Real-time features (WebSockets)
- ⏳ Comprehensive testing suite
- ⏳ Production deployment
- ⏳ User documentation and training materials

**Key Development Milestones:**
1. **Week 3:** Backend server running with database connection
2. **Week 6:** Core booking API functional with authentication
3. **Week 9:** Frontend fully integrated with backend
4. **Week 12:** All features implemented and tested
5. **Week 15:** Production deployment and handover

**Success Criteria:**
- Users can successfully book courts through the system
- Payments are processed and verified correctly
- Administrators can manage bookings and content efficiently
- System performs adequately under expected load
- Application is deployed and accessible to users
- Facility staff is trained to use administrative features

---

## Evaluation Criteria for Activity 1 (100 Points Total)

**CSC 106 Artifact Alignment (30%):**
- ✅ Requirements specification with functional and non-functional requirements
- ✅ System architecture with clear component structure
- ✅ Database schema design with entity relationships
- ✅ Use case documentation with user flows
- ✅ UI/UX design with mockups and wireframes

**Technical Feasibility & Design Quality (25%):**
- ✅ Appropriate technology stack selection (React, TypeScript, Tailwind CSS)
- ✅ Realistic database design with proper relationships
- ✅ Clear UI mockups for critical user interactions
- ✅ Component-based architecture for maintainability
- ✅ Security considerations in design

**Transition Plan for CSC 107 (20%):**
- ✅ Clear roadmap with sprint timelines
- ✅ Specific development milestones
- ✅ Distinction between completed (CSC 106) and planned (CSC 107) work
- ✅ Actionable implementation steps
- ✅ Risk mitigation strategies

**Presentation & Communication (15%):**
- Structured document following CSC 106 template
- Clear organization with slide-based sections
- Comprehensive coverage of all required topics
- Professional technical documentation

**Q&A Preparation (10%):**
- Architectural decisions are justified in tech stack matrix
- Design choices align with project requirements
- Feasibility analysis demonstrates realistic understanding
- Risk assessment shows proactive planning

---

## Conclusion

The AFMC Pickle Hub system represents a modern, user-friendly approach to sports facility management. By combining court booking, community engagement, and administrative tools into a single cohesive platform, the system addresses the core needs of pickleball facility management while providing room for future growth and feature expansion.

The CSC 106 artifacts demonstrate thorough analysis and planning, including detailed requirements specification, system architecture design, database schema, UI/UX design, and implementation planning. The transition plan for CSC 107 provides a clear roadmap for transforming the prototype into a fully functional production system.

The React-based architecture ensures maintainability and scalability, while the responsive design provides optimal user experience across all devices. The dark-themed UI with vibrant brand colors creates an engaging user experience that reflects the dynamic nature of the sport.

This project showcases the application of software engineering principles from requirement analysis through design to implementation planning, preparing for successful execution in CSC 107.

---

**Version:** 1.0.0  
**Last Updated:** September 2026  
**Developed for:** Ampayon Free Methodist Court, Butuan City  
**Course:** CSC 107 - Software Engineering 2  
**Activity:** Activity 1 - Software Proposal Presentation