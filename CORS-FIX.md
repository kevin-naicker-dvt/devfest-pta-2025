# 🔧 CORS Error Fix

## Problem

Frontend was calling `http://localhost:3001` instead of the actual backend URL because the `REACT_APP_API_URL` build argument wasn't being used in the Docker build.

## Root Cause

The `Dockerfile.frontend` didn't declare or use the build argument, so React was using the fallback value (`localhost:3001`) instead of the production backend URL.

## Fix Applied

Updated `docker/Dockerfile.frontend` to:
1. Declare `ARG REACT_APP_API_URL`
2. Set it as `ENV REACT_APP_API_URL=$REACT_APP_API_URL` before build
3. This makes it available to the React build process

## Deploy the Fix

```bash
git add docker/Dockerfile.frontend
git commit -m "Fix: Pass REACT_APP_API_URL to React build process"
git push origin main
```

## Expected Result

Frontend will now call:
- ✅ `https://devfest-backend-6xdwep4ueq-bq.a.run.app/api/applications`

Instead of:
- ❌ `http://localhost:3001/api/applications`

## Testing

After deployment completes (~5 minutes):
1. Refresh: https://devfest-frontend-6xdwep4ueq-bq.a.run.app
2. Open browser console (F12)
3. Try to submit an application
4. Should see successful API calls (no CORS errors)

