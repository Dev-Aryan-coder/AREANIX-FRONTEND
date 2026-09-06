# 🏆 AREANIX - Master 66 REST APIs Flow & Postman Execution Guide

This document maps out **all 66 REST API endpoints** in the exact logical order of user registration, role selection, and feature workflows:
1. **Phase 1: Authentication & User Management Flow (APIs 1–10)**
2. **Phase 2: How AREANIX Works for PLAYERS (APIs 11–18)**
3. **Phase 3: How AREANIX Works for RECRUITERS (APIs 19–24)**
4. **Phase 4: How AREANIX Works for ORGANIZERS (Streamers / YouTubers) (APIs 25–39)**
5. **Phase 5: Teams, Esports Communities, Social Friends & Leaderboards (APIs 40–58)**
6. **Phase 6: Admin Dashboard & Platform Governance (APIs 59–66)**

---

## 🛠️ Postman Setup Instructions

1. Open **Postman** -> Click **New -> Collection** -> Name it **`AREANIX Platform APIs`**.
2. Make sure your Spring Boot backend `Areanixx` is running on `http://localhost:8080`.
3. Set Header for `POST`, `PUT`, `PATCH` requests:
   - `Content-Type: application/json`

---

# 🔄 PHASE 1: Authentication & User Management Flow

### API #1: Register Base User Account
* **Flow Step 1:** User visits Signup page and submits Full Name, Email, and Password.
* **Method:** `POST`
* **URL:** `http://localhost:8080/user/register`
* **Postman Setup:** Body (raw JSON)
```json
{
  "fullname": "Aryan Anand",
  "email": "aryan@example.com",
  "password": "password123"
}
```
* **Expected Response:** `201 Created` - `"account created successfully!!!"`

---

### API #2: Login User
* **Flow Step 2:** User logs in with email and password.
* **Method:** `POST`
* **URL:** `http://localhost:8080/user/login`
* **Postman Setup:** Params -> Key: `email` (Value: `aryan@example.com`), Key: `password` (Value: `password123`)
* **Expected Response:** `200 OK` - Returns user object with `id`.

---

### API #3: Add Role to Account (`PLAYER`, `RECRUITER`, `ORGANIZER`)
* **Flow Step 3:** User selects their role on `Role.jsx` (`PLAYER`, `RECRUITER`, or `ORGANIZER`).
* **Method:** `POST`
* **URL:** `http://localhost:8080/user/{userId}/addrole/{role}`
* **Postman Setup:** Example URL: `http://localhost:8080/user/1/addrole/PLAYER`
* **Expected Response:** `201 Created` - `"PLAYER role added to this account!!!"`

---

### API #4: Get Account Roles
* **Flow Step 4:** Navbar role-switcher loads all assigned roles for this user.
* **Method:** `GET`
* **URL:** `http://localhost:8080/user/{userId}/roles`
* **Postman Setup:** Example URL: `http://localhost:8080/user/1/roles`
* **Expected Response:** `200 OK` - List of roles assigned.

---

### API #5: Forgot Password (Send Email OTP)
* **Flow Step 5a:** User requests password reset link/OTP.
* **Method:** `POST`
* **URL:** `http://localhost:8080/user/forgot-password`
* **Postman Setup:** Params -> Key: `email` (Value: `aryan@example.com`)
* **Expected Response:** `200 OK` - `"if an account exists for this email, an OTP has been sent!!!"`

---

### API #6: Verify Password Reset OTP
* **Flow Step 5b:** User submits the 6-digit OTP received via Gmail.
* **Method:** `POST`
* **URL:** `http://localhost:8080/user/verify-otp`
* **Postman Setup:** Params -> `email=aryan@example.com`, `otp=123456`
* **Expected Response:** `200 OK` - `"otp verified successfully!!!"`

---

### API #7: Reset Password
* **Flow Step 5c:** User sets a new password.
* **Method:** `POST`
* **URL:** `http://localhost:8080/user/reset-password`
* **Postman Setup:** Params -> `email=aryan@example.com`, `otp=123456`, `newPassword=newsecret123`
* **Expected Response:** `200 OK` - `"password reset successfully!!!"`

---

### API #8: Get User By ID
* **Method:** `GET`
* **URL:** `http://localhost:8080/user/getby/{id}`
* **Postman Setup:** Example URL: `http://localhost:8080/user/getby/1`

---

### API #9: Search Users
* **Method:** `GET`
* **URL:** `http://localhost:8080/user/search`
* **Postman Setup:** Params -> Key: `query` (Value: `Aryan`)

---

### API #10: Patch Base User Information
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/user/patch/{id}`
* **Postman Setup:** Body (raw JSON):
```json
{
  "fullname": "Aryan Anand Pilankar"
}
```

---

# ⚔️ PHASE 2: How AREANIX Works for PLAYERS (Player Flow)

### API #11: Onboard Player Profile
* **Player Step 1:** Player submits gamer tag, game choice, rank name, in-game role, age, region, and socials.
* **Method:** `POST`
* **URL:** `http://localhost:8080/player/onboard`
* **Postman Setup:** Body (raw JSON):
```json
{
  "userId": 1,
  "gamerTag": "AreanixKing",
  "game": "BGMI",
  "rankName": "Ace Dominator",
  "roleInGame": "Assaulter",
  "region": "India",
  "age": 21,
  "youtubeUrl": "https://youtube.com/@areanixking"
}
```
* **Expected Response:** `201 Created` - `"player profile created successfully!!!"`

---

### API #12: Update Player Availability Status
* **Player Step 2:** Player toggles availability status (`LOOKING_FOR_TEAM`, `OPEN_TO_OFFERS`, `NOT_AVAILABLE`).
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/player/{id}/availability`
* **Postman Setup:** Params -> Key: `status` (Value: `LOOKING_FOR_TEAM`)

---

### API #13: Get Player Profile By ID
* **Method:** `GET`
* **URL:** `http://localhost:8080/player/getby/{id}`

---

### API #14: Patch Player Profile
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/player/patch/{id}`

---

### API #15: Register Player / Team For Tournament
* **Player Step 3:** Player clicks "Participate" on a tournament.
* **Method:** `POST`
* **URL:** `http://localhost:8080/tournament/{id}/register`
* **Postman Setup:** Example URL: `http://localhost:8080/tournament/1/register`, Params -> `playerId=1`
* **Expected Response:** `201 Created` - `"registration submitted, pending approval!!!"`

---

### API #16: Get Player Tournament History
* **Player Step 4:** Displays all tournaments the player competed in.
* **Method:** `GET`
* **URL:** `http://localhost:8080/player/{id}/tournament-history`

---

### API #17: Get Player Achievements
* **Player Step 5:** Displays trophies and badges won by player.
* **Method:** `GET`
* **URL:** `http://localhost:8080/player/{id}/achievements`

---

### API #18: Get Player Performance Statistics
* **Player Step 6:** Displays historical kill counts, K/D ratio, and match snapshots.
* **Method:** `GET`
* **URL:** `http://localhost:8080/player/{id}/statistics`

---

# 🎯 PHASE 3: How AREANIX Works for RECRUITERS (Recruiter Flow)

### API #19: Onboard Recruiter Profile
* **Recruiter Step 1:** Recruiter enters Organization Name, Region, and Official Website.
* **Method:** `POST`
* **URL:** `http://localhost:8080/recruiter/onboard`
* **Postman Setup:** Body (raw JSON):
```json
{
  "userId": 1,
  "organizationName": "AREANIX Esports",
  "region": "India",
  "websiteUrl": "https://areanix.com"
}
```
* **Expected Response:** `201 Created` - `"recruiter profile created successfully!!!"`

---

### API #20: Search Players With Advanced Filters
* **Recruiter Step 2:** Recruiter searches candidate pool filtering by Game, Region, Rank, Role in Game, and Age.
* **Method:** `GET`
* **URL:** `http://localhost:8080/recruiter/search`
* **Postman Setup:** Params -> `game=BGMI`, `region=India`, `roleInGame=Assaulter`
* **Expected Response:** `200 OK` - Array of filtered PlayerProfiles.

---

### API #21: Shortlist Player
* **Recruiter Step 3:** Recruiter adds candidate to shortlist folder.
* **Method:** `POST`
* **URL:** `http://localhost:8080/recruiter/{recruiterId}/shortlist/{playerId}`
* **Postman Setup:** Example URL: `http://localhost:8080/recruiter/1/shortlist/1`

---

### API #22: View Recruiter Shortlist
* **Recruiter Step 4:** Recruiter views saved candidate profiles.
* **Method:** `GET`
* **URL:** `http://localhost:8080/recruiter/{recruiterId}/shortlist`

---

### API #23: Send Team Recruitment Invite
* **Recruiter Step 5:** Recruiter sends join offer to player.
* **Method:** `POST`
* **URL:** `http://localhost:8080/recruiter/{recruiterId}/invite/{playerId}`
* **Postman Setup:** Example URL: `http://localhost:8080/recruiter/1/invite/1`

---

### API #24: View Sent Recruitment Invites
* **Recruiter Step 6:** Recruiter tracks status of sent invitations.
* **Method:** `GET`
* **URL:** `http://localhost:8080/recruiter/{recruiterId}/invites`

---

# 📺 PHASE 4: How AREANIX Works for ORGANIZERS (Streamers / YouTubers Flow)

### API #25: Onboard Organizer Profile
* **Organizer Step 1:** Streamer/YouTuber submits phone number and YouTube Channel URL.
* **Method:** `POST`
* **URL:** `http://localhost:8080/organizer/onboard`
* **Postman Setup:** Body (raw JSON):
```json
{
  "userId": 1,
  "phoneNumber": "+919876543210",
  "youtubeChannelUrl": "https://youtube.com/@areanixstreamer"
}
```

---

### API #26: Send Organizer Email OTP
* **Organizer Step 2:** System emails a 6-digit OTP to organizer's account email.
* **Method:** `POST`
* **URL:** `http://localhost:8080/organizer/{id}/send-otp`

---

### API #27: Verify Organizer Email OTP
* **Organizer Step 3:** Organizer enters 6-digit OTP.
* **Method:** `POST`
* **URL:** `http://localhost:8080/organizer/{id}/verify-otp`
* **Postman Setup:** Params -> `otp=123456`

---

### API #28: Get Organizer Status
* **Organizer Step 4:** Check status (`PENDING`, `VERIFIED`).
* **Method:** `GET`
* **URL:** `http://localhost:8080/organizer/{id}/status`

---

### API #29: Get Organizer By ID
* **Method:** `GET`
* **URL:** `http://localhost:8080/organizer/getby/{id}`

---

### API #30: Create New Tournament
* **Organizer Step 5:** Organizer creates tournament with Prize Pool, YouTube stream link, and custom rules.
* **Method:** `POST`
* **URL:** `http://localhost:8080/tournament/create`
* **Postman Setup:** Body (raw JSON):
```json
{
  "organizerId": 1,
  "name": "AREANIX BGMI Championship 2026",
  "game": "BGMI",
  "region": "India",
  "format": "Squad Battle Royale",
  "prizePool": 50000.0,
  "streamLink": "https://youtube.com/live/areanix-stream",
  "rules": "No hacks allowed."
}
```

---

### API #31: Approve Player Registration
* **Organizer Step 6a:** Organizer approves registered player/team.
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/tournament/registration/{regId}/approve`

---

### API #32: Reject Player Registration
* **Organizer Step 6b:** Organizer rejects registration.
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/tournament/registration/{regId}/reject`

---

### API #33: Schedule Match Round
* **Organizer Step 7:** Organizer schedules round match between teams.
* **Method:** `POST`
* **URL:** `http://localhost:8080/tournament/{id}/schedule-match`
* **Postman Setup:** Params -> `round=1`, `teamAId=1`, `teamBId=2`, `scheduledTime=2026-08-15T18:00:00Z`

---

### API #34: Release Custom Match Room ID & Password
* **Organizer Step 8:** Organizer shares Room ID & Password prior to match start.
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/tournament/{id}/release-room`
* **Postman Setup:** Params -> `roomId=990011`, `roomPassword=areanixwin`

---

### API #35: Enter Match Results & Award Placements / XP
* **Organizer Step 9:** Organizer enters verified winner placements (1st, 2nd, 3rd place).
* **Method:** `POST`
* **URL:** `http://localhost:8080/tournament/{id}/enter-result`
* **Postman Setup:** Params -> `playerId=1`, `placement=1`

---

### API #36: Complete Tournament
* **Organizer Step 10:** Organizer marks tournament as `COMPLETED`.
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/tournament/{id}/complete`

---

### API #37: Get Tournament Details
* **Method:** `GET`
* **URL:** `http://localhost:8080/tournament/{id}/detail`

---

### API #38: List Live Tournaments
* **Method:** `GET`
* **URL:** `http://localhost:8080/tournament/live`

---

### API #39: List Tournaments By Status
* **Method:** `GET`
* **URL:** `http://localhost:8080/tournament/status/{status}`

---

# 🌐 PHASE 5: Teams, Esports Communities, Social Friends & Leaderboards

### API #40: Create Esports Team
* **Method:** `POST`
* **URL:** `http://localhost:8080/team/create`
* **Postman Setup:** Body (raw JSON):
```json
{
  "managerId": 1,
  "name": "AREANIX Titans",
  "gameFocus": "BGMI",
  "region": "India"
}
```

---

### API #41: Join Team As Manager
* **Method:** `POST`
* **URL:** `http://localhost:8080/team/{teamId}/join-as-manager/{userId}`

---

### API #42: Add Player Member To Team Roster
* **Method:** `POST`
* **URL:** `http://localhost:8080/team/{teamId}/addmember/{playerId}`

---

### API #43: Remove Member From Team Roster
* **Method:** `DELETE`
* **URL:** `http://localhost:8080/team/{teamId}/removemember/{playerId}`

---

### API #44: Get Team Roster
* **Method:** `GET`
* **URL:** `http://localhost:8080/team/{teamId}/roster`

---

### API #45: Get Teams Managed By User
* **Method:** `GET`
* **URL:** `http://localhost:8080/team/managed-by/{userId}`

---

### API #46: Search Teams
* **Method:** `GET`
* **URL:** `http://localhost:8080/team/search`
* **Postman Setup:** Params -> `query=Titans`

---

### API #47: Create Esports Community
* **Method:** `POST`
* **URL:** `http://localhost:8080/community/create`
* **Postman Setup:** Body (raw JSON):
```json
{
  "createdBy": 1,
  "name": "BGMI India Elite Scrims",
  "description": "Official community for daily BGMI custom rooms.",
  "visibility": "PUBLIC"
}
```

---

### API #48: Search Communities
* **Method:** `GET`
* **URL:** `http://localhost:8080/community/search`
* **Postman Setup:** Params -> `query=BGMI`

---

### API #49: Join Community
* **Method:** `POST`
* **URL:** `http://localhost:8080/community/{communityId}/join/{userId}`

---

### API #50: Get Community Members
* **Method:** `GET`
* **URL:** `http://localhost:8080/community/{communityId}/members`

---

### API #51: Send Friend Request
* **Method:** `POST`
* **URL:** `http://localhost:8080/friend/request/{fromUserId}/{toUserId}`

---

### API #52: Accept Friend Request
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/friend/accept/{friendshipId}`

---

### API #53: Block Friend
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/friend/block/{friendshipId}`

---

### API #54: Get User Friend List
* **Method:** `GET`
* **URL:** `http://localhost:8080/friend/{userId}/list`

---

### API #55: Get Global / Per-Game XP Leaderboard
* **Method:** `GET`
* **URL:** `http://localhost:8080/leaderboard/xp`
* **Postman Setup:** Params -> `game=BGMI`, `mode=solo`, `topN=50`

---

### API #56: Get Player XP Rank
* **Method:** `GET`
* **URL:** `http://localhost:8080/leaderboard/xp/rank/{playerId}`

---

### API #57: Get Live Tournament Standings
* **Method:** `GET`
* **URL:** `http://localhost:8080/tournament/{id}/leaderboard`

---

### API #58: Get Live Player Streamers
* **Method:** `GET`
* **URL:** `http://localhost:8080/player/live`
* **Postman Setup:** Params -> `game=BGMI`

---

# 👑 PHASE 6: Admin Dashboard & Platform Governance (Admin Flow)

### API #59: Get Pending Organizer Approvals
* **Admin Step 1:** Admin reviews organizer verification queue.
* **Method:** `GET`
* **URL:** `http://localhost:8080/admin/organizers/pending`

---

### API #60: Approve Organizer Account
* **Admin Step 2a:** Admin verifies organizer identity.
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/admin/organizers/{id}/approve`

---

### API #61: Reject Organizer Account
* **Admin Step 2b:** Admin rejects fake organizer account.
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/admin/organizers/{id}/reject`

---

### API #62: Admin Search Users
* **Method:** `GET`
* **URL:** `http://localhost:8080/admin/users/search`
* **Postman Setup:** Params -> `query=Aryan`

---

### API #63: Suspend User Account
* **Admin Step 3:** Admin suspends cheater or toxic user account.
* **Method:** `PATCH`
* **URL:** `http://localhost:8080/admin/users/{id}/suspend`

---

### API #64: Get Flagged Tournaments
* **Admin Step 4:** Admin reviews reported/flagged tournaments.
* **Method:** `GET`
* **URL:** `http://localhost:8080/admin/tournaments/flagged`

---

### API #65: Get Open Disputes
* **Admin Step 5:** Admin inspects player score disputes.
* **Method:** `GET`
* **URL:** `http://localhost:8080/admin/disputes`

---

### API #66: Get Platform Statistics
* **Admin Step 6:** Admin views total user counts, active tournaments, and platform analytics.
* **Method:** `GET`
* **URL:** `http://localhost:8080/admin/stats`

---

## 🚀 You are all set!
All 66 APIs are organized in your exact user flow: **Authentication ➔ Player Flow ➔ Recruiter Flow ➔ Organizer Flow ➔ Social & Communities ➔ Admin Governance**!
