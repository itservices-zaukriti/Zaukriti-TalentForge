# 🛑 CRITICAL ACTION REQUIRED: Add Service Role Key

## ❌ Blocking Issue
The registration system has been upgraded to use the **Supabase Service Role Key** to bypass RLS policies (as requested).
However, this key is **MISSING** from your `.env.local` file.

**Current Error:**
```
❌ FATAL: SUPABASE_SERVICE_ROLE_KEY is not set in environment variables
```

## 🔑 How to Fix It

### 1. Get the Key
1. Go to your **Supabase Dashboard**.
2. Click on **Project Settings** (gear icon) -> **API**.
3. Look for the `service_role` key (secret).
4. **Copy** the key (it starts with `ey...`).

### 2. Add to `.env.local`
1. Open `c:\dev\git-ready\Zaukriti-TalentForge\.env.local`
2. Add this line at the bottom:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJh......<PASTE_YOUR_KEY_HERE>
```

### 3. Restart Server
After saving the file, you MUST restart your development server for the new environment variable to be loaded:

```bash
# In your terminal running npm run dev
# Press Ctrl+C to stop
npm run dev
```

## 🧪 Verification
Once you've added the key and restarted the server, run the test again:

```bash
node .gemini/test_registration_v2.js
```

**Expected Result:** `✅ REQUEST SUCCEEDED`

---

## ⚠️ SECURITY WARNING
The `service_role` key has **admin privileges** and can bypass all Row Level Security.
- **NEVER** expose this key in the browser (client-side code).
- **NEVER** commit this key to Git (ensure `.env.local` is in `.gitignore`).
- The current implementation correctly uses it ONLY in the server-side API route (`app/api/register/route.ts`).
