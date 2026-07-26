# DIPS Umred — School Website

Website for Deoraoji Itankar Public School, Umred (CBSE). Built with Next.js and Tailwind CSS. Enquiry and contact forms email the school via Resend — no database required.

**To set up and deploy, see [SETUP.md](./SETUP.md).**

## Pages
Home · About · Academics · Admissions · Gallery · Contact

## Environment variables
Copy `.env.example` to `.env.local` (for local use) or add these in Vercel:
- `RESEND_API_KEY` — your Resend API key
- `SCHOOL_EMAIL` — inbox that receives enquiries (the Resend account email)
- `EMAIL_FROM` — sender label (default `DIPS Website <onboarding@resend.dev>`)

## Run locally (optional, needs Node 20.9+)
```bash
npm install
npm run dev
```
Then open http://localhost:3000
