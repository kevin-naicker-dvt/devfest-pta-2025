# Testing Guide - DevFest PTA 2025

## 🧪 End-to-End Testing Workflow

### Test Scenario: See Recruiter Updates as Applicant

This guide shows you how to test the complete workflow from application submission to seeing recruiter feedback.

---

## 📝 Step-by-Step Test

### Part 1: Submit Application (Applicant View)

1. **Open the app**: http://localhost:3000
2. Click **"Start Demo"** (logs you in as Alex Smith - Applicant)
3. Click **"Apply for Job"**
4. Fill out the form:
   - Username: `alex.smith` (or change to any name)
   - Email: `alex.smith@example.com` (or change)
   - Full Name: `Alex Smith` (or change)
   - Position: Select **"Frontend Developer"**
   - Click **"📎 Simulate CV Upload"**
   - Cover Letter (optional): "I have 5 years of React experience..."
5. Click **"🚀 Submit Application"**
6. You'll be redirected to **"My Applications"**
7. **Note the initial status**: 📤 Submitted (Blue badge)

---

### Part 2: Review and Update as Recruiter

1. Click **"Switch to Recruiter"** (top right)
2. You're now logged in as **Sarah Jones (Recruiter)**
3. Click **"👔 Open Dashboard"**
4. You'll see statistics and the applications table
5. Find your application (Alex Smith - Frontend Developer)
6. Click **"View"** button
7. In the modal dialog:
   - **Change Status**: Select "Under Review" or "Interview"
   - **Add Notes**: "Great React experience! Let's schedule a technical interview."
8. Click **"💾 Save Changes"**
9. Modal closes - you'll see the updated status in the table

---

### Part 3: See Updates as Applicant (THE KEY TEST!)

1. Click **"Switch to Applicant"** (top right)
2. You're back as **Alex Smith**
3. Click **"📋 View My Applications"**
4. **Click the "🔄 Refresh" button** (top right) to reload latest data
5. **Look at your application card** - You should now see:
   - ✅ **Updated status badge** (color changed)
   - ✅ **"Last Updated" timestamp** (shows when recruiter made changes)
   - ✅ **💬 Recruiter Feedback section** (highlighted in blue with the notes)
   - ✅ Your cover letter preview

---

## 🎯 What You Should See

### Before Recruiter Update:
```
┌─────────────────────────────────────┐
│ Frontend Developer         📤 Submitted │
├─────────────────────────────────────┤
│ Applied: November 21, 2025          │
│ Last Updated: November 21, 2025     │
│ CV: 📄 alex.smith_cv_123.pdf        │
│ Cover Letter: "I have 5 years..."   │
└─────────────────────────────────────┘
```

### After Recruiter Update:
```
┌─────────────────────────────────────┐
│ Frontend Developer      🗓️ Interview │
├─────────────────────────────────────┤
│ Applied: November 21, 2025          │
│ Last Updated: November 21, 2025 (UPDATED!) │
│ CV: 📄 alex.smith_cv_123.pdf        │
│ Cover Letter: "I have 5 years..."   │
│                                     │
│ ┌─ 💬 Recruiter Feedback ─────┐   │
│ │ Great React experience!       │   │
│ │ Let's schedule a technical    │   │
│ │ interview.                    │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🔄 Features Highlighted

### 1. **Refresh Button** 🔄
- Located in top right of "My Applications"
- Click anytime to reload latest data
- Shows "⏳ Refreshing..." while loading
- Perfect for seeing recruiter updates in real-time

### 2. **Enhanced Status Display**
- Color-coded badges for quick visual status
- Shows both "Applied" and "Last Updated" dates
- Last Updated changes when recruiter makes edits

### 3. **Recruiter Feedback Prominent**
- Highlighted blue box with gradient background
- 💬 emoji indicator
- Styled to stand out from other information
- Only appears when recruiter adds notes

### 4. **Cover Letter Preview**
- Shows first 150 characters
- Helps applicant remember what they wrote
- Italicized for distinction

---

## 🧪 Additional Test Scenarios

### Test Multiple Status Changes

1. As Recruiter:
   - Change status: **Submitted** → **Under Review**
   - Add note: "Resume looks good, reviewing portfolio"
   - Save
2. Switch to Applicant → Refresh → See update
3. Switch back to Recruiter
   - Change status: **Under Review** → **Interview**
   - Update note: "Scheduled interview for next Tuesday"
   - Save
4. Switch to Applicant → Refresh → See new update

### Test Multiple Candidates

1. Create 3-4 applications with different emails:
   - alex.smith@example.com
   - maria.garcia@example.com
   - david.chen@example.com
2. Switch to Recruiter
3. Update each with different statuses and notes
4. Switch back to Applicant
5. View each candidate's applications by logging in with their email

---

## ✅ Success Checklist

- [ ] Application submits successfully
- [ ] Initial status shows as "Submitted" 
- [ ] Can switch between Applicant and Recruiter roles
- [ ] Recruiter can view application details
- [ ] Recruiter can change status
- [ ] Recruiter can add notes
- [ ] Changes save successfully
- [ ] Applicant can click refresh button
- [ ] Updated status displays with new color
- [ ] Last Updated timestamp changes
- [ ] Recruiter feedback appears in highlighted box
- [ ] All information is clearly readable

---

## 🐛 Troubleshooting

**Issue**: Don't see recruiter notes after switching back
- **Solution**: Click the "🔄 Refresh" button in My Applications

**Issue**: Status not updating
- **Solution**: Make sure you clicked "Save Changes" in the recruiter modal

**Issue**: Applications not showing
- **Solution**: Make sure the email matches when viewing "My Applications"

---

## 📊 Quick Test Commands

```powershell
# Check backend is responding
Invoke-WebRequest -Uri "http://localhost:3001/api/applications" -UseBasicParsing

# Check container status
docker-compose -f docker/docker-compose.local.yml ps

# View backend logs
docker-compose -f docker/docker-compose.local.yml logs -f backend
```

---

**Happy Testing! 🎉**

This demonstrates the complete applicant-recruiter feedback loop in the DevFest Recruitment Application.

