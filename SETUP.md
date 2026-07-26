# DIPS Umred website — easy deploy guide

This is a complete website. You do **not** need to install Node or use the terminal.
The plan: put it on GitHub with the GitHub Desktop app, then let Vercel build and host it.

---

## Part A — Put it on GitHub (using GitHub Desktop)

1. **Install GitHub Desktop** from https://desktop.github.com and sign in with your GitHub account. (This also installs Git for you — nothing else to set up.)
2. **Unzip** the file I sent. You'll get a folder called **dip-school**. Move it somewhere easy, like your Desktop.
3. Open GitHub Desktop → **File → Add local repository** → choose the **dip-school** folder.
4. It will say this folder isn't a repository yet and offer to **create one** — click **Create a repository** (then **Create repository** again on the next screen). Leave the options as they are.
5. Click **Publish repository** (top right).
   - Give it a name, e.g. **dip-school-website**.
   - **Untick** "Keep this code private" if you'd like it public (either is fine for Vercel).
   - Click **Publish repository**.

Done — your code is now on GitHub. 🎉

> Your secret API key is never uploaded: the project's `.gitignore` keeps `.env*` files out of GitHub automatically.

## Part B — Get your email key (Resend)

The forms email the school through a service called Resend. It's free.

1. Go to https://resend.com and **sign up using the school's email** (dips.umred@gmail.com). This matters — it's what lets emails reach the school inbox without any extra setup.
2. Open **API Keys → Create API Key**, and copy the key (starts with `re_`). Keep it handy for Part C.

## Part C — Deploy on Vercel

1. Go to https://vercel.com and **sign in with GitHub**.
2. Click **Add New → Project**, and **Import** the repository you just published.
3. Before clicking Deploy, open **Environment Variables** and add these three:

   | Name | Value |
   |------|-------|
   | `RESEND_API_KEY` | your key from Part B (the `re_...` one) |
   | `SCHOOL_EMAIL` | dips.umred@gmail.com |
   | `EMAIL_FROM` | DIPS Website \<onboarding@resend.dev\> |

4. Click **Deploy**. In about a minute you'll get a live link you can open and share.

That's it. Whenever you change something on GitHub, Vercel updates the live site automatically.

---

## Good to know

- **Test the form:** open the live site, submit an enquiry, and check the school's Gmail — a formatted email should arrive.
- **If the deploy shows an error**, copy the message from Vercel's build log and send it to me — I'll fix it quickly.
- **Placeholders to swap later:** the homepage stat numbers, the three sample parent testimonials, and the photos (currently loaded from the old website). Send me the real ones and I'll drop them in.
- **A nicer "from" address** (like no-reply@dipsumred.org) or emailing parents directly needs the school's domain verified in Resend — a step for later.
