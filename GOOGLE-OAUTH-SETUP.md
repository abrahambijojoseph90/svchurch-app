# Google OAuth Setup Guide — Spring Valley Church

> **Status:** Not yet configured. Follow these steps when ready.
> **Google Cloud Project:** "SVC website" (project=svc-website-489914)
> **Console:** https://console.cloud.google.com/apis/library?project=svc-website-489914

---

## Step 1: Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen** in the left sidebar
2. Select **"External"** and click **Create**
3. Fill in:
   - **App name:** `Spring Valley Church`
   - **User support email:** pick your email from the dropdown
   - **App logo:** optional, skip for now
   - **App domain** section:
     - Application home page: `https://svchurch.co.uk`
     - Privacy policy: `https://svchurch.co.uk/privacy-policy`
   - **Authorized domains:** click "Add Domain" and add:
     - `svchurch.co.uk`
     - `vercel.app`
   - **Developer contact email:** your email
4. Click **Save and Continue**
5. On the **Scopes** page — click **"Add or Remove Scopes"**, check these three:
   - `email`
   - `profile`
   - `openid`
6. Click **Update**, then **Save and Continue**
7. On **Test Users** — just click **Save and Continue** (skip it)
8. Click **Back to Dashboard**
9. **Important:** Click the **"Publish App"** button so anyone can sign in (not just test users)

---

## Step 2: Create OAuth Credentials

1. Go to **APIs & Services > Credentials** in the left sidebar
2. Click **"+ Create Credentials"** at the top, then **"OAuth client ID"**
3. **Application type:** `Web application`
4. **Name:** `SVC Website`
5. Under **"Authorized JavaScript origins"**, click **Add URI** and add:
   - `http://localhost:3000`
   - `https://svchurch.co.uk`
   - `https://svchurch-app.vercel.app`
6. Under **"Authorized redirect URIs"**, click **Add URI** and add:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://svchurch.co.uk/api/auth/callback/google`
   - `https://svchurch-app.vercel.app/api/auth/callback/google`
7. Click **Create**
8. A popup will show your **Client ID** and **Client Secret** — copy both

---

## Step 3: Add credentials to the project

### Local development (.env file)
```
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### Vercel production
Add via Vercel dashboard (Settings > Environment Variables) or CLI:
```bash
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
```

---

## Step 4: Verify it works

1. Start dev server: `npm run dev`
2. Go to `http://localhost:3000/sign-in`
3. Click "Continue with Google"
4. Sign in with any Google account
5. You should be redirected to `/my-posts`
6. Check the database — a new User with role `CONTRIBUTOR` and provider `google` should exist

---

## Notes
- Google OAuth sign-in is for **public users** (church members writing blogs)
- Admin login remains at `/admin-login` with email/password credentials
- New Google users are auto-assigned the `CONTRIBUTOR` role
- No APIs need to be enabled in the API Library — NextAuth handles OAuth directly
