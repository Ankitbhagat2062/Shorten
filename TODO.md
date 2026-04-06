# Fix MongoDB Peer Dependency for Vercel Deploy

## Steps:
- [x] Step 1: Edit package.json - downgrade mongodb to ^6.8.0
- [x] Step 2: Run `npm install` to update lockfile
- [x] Step 3: Test locally with `npm run dev`
- [x] Step 4: Verify auth works (login via GitHub/Google/OTP)
- [x] Step 5: Run `npm run build` - ensure no errors
- [ ] Step 6: Git commit & push → Vercel redeploy
- [ ] Step 7: Check Vercel deployment logs
