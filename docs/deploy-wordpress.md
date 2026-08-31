# Deploying into the client's WordPress

The site is a static export — plain HTML, CSS, JS and images, no runtime. That
makes it a folder you drop onto their existing Apache host and serve alongside
WordPress, rather than something that has to be rebuilt as a theme.

## The decision this assumes

The bistro lives at `rebellionrestaurants.com/rebellionbistro/` today, so that
is the path this is built for. **The path is baked into the build** — Next
writes it into every route and into the asset manifest — so it has to be
decided before the build, not after. Building for the wrong path produces a
page that loads blank and 404s every asset, which is the most common way this
particular deploy fails.

### The better option, found late

**The client already owns `rebellionbistro.com`**, and it currently does
nothing but 301 to `rebellionrestaurants.com/rebellionbistro/` through
GoDaddy's domain forwarding. Pointing it at the site directly is strictly
simpler than the subdirectory deploy:

- No base path, so nothing is baked into the build and the rebase step is a
  no-op.
- No contact with WordPress's rewrites, Apache's `.htaccess`, or the nginx
  layer in front of it — the three things most likely to go wrong here.
- `robots.txt` works, because the site is at a domain root.
- **It cannot break the live site.** Nothing is uploaded to their server at
  all, so the wine bar and cantina pages are untouched and the rollback is a
  DNS change.
- The bistro gets its own domain, which is what the domain was bought for.

Hosting it does not have to be their server. A static host — Netlify is already
configured in `netlify.toml` — serves this build directly from the repository,
which also means every future change deploys on a push instead of a re-upload.

If that route is taken, redirect `rebellionrestaurants.com/rebellionbistro/` to
the new home so existing links and any accumulated search equity follow.

The subdirectory instructions below still stand if the client would rather keep
everything on one host.

## Build the bundle

```bash
SITE_BASE_PATH=/rebellionbistro \
NEXT_PUBLIC_SITE_URL=https://rebellionrestaurants.com/rebellionbistro \
npm run package
```

Writes `dist/rebellion-rebellionbistro-<date>.zip`. Inside it:

| | |
| --- | --- |
| the exported site | pages, images, fonts, artwork |
| `.htaccess` | the rewrites that stop WordPress swallowing the URLs |
| `_next/static/.htaccess` | year-long caching for fingerprinted assets |
| `DEPLOY-README.txt` | what this bundle was built for, in the bundle |

The script also prunes routes listed in `deploy/hidden-routes.json` — currently
the bottle shop — so they return a real 404 instead of a 200 with a not-found
body.

## Which panel this host actually uses

Checked against the live site rather than assumed:

| | |
| --- | --- |
| IP | `50.62.180.234` — GoDaddy |
| Panel | **Plesk**, not cPanel (`x-powered-by: PleskLin`) |
| Front end | nginx, proxying to Apache |

That matters in three places. The panel is reached through the GoDaddy account
rather than at `/cpanel`. The document root is **`httpdocs`**, not
`public_html`. And because nginx sits in front, the `.htaccess` may never be
read for this directory — see the nginx fallback at the end.

## Put it on the server

1. **Back up first.** Whatever is at `/rebellionbistro/` today, take a copy.
   This is the rollback.
2. Upload the **contents** of the zip into `httpdocs/rebellionbistro/` — in
   Plesk that is Websites & Domains → the domain → **Files**. SFTP works too.
3. **Check the two `.htaccess` files arrived.** File managers hide dotfiles by
   default and this is the failure people lose an afternoon to. Plesk's File
   Manager shows them once **Settings → Show hidden files** is ticked.
4. **Do not touch the WordPress root `.htaccess`.** Nothing here needs it
   changed, and editing it is how the whole site goes down.
5. In WordPress, **unpublish or delete the existing page at that slug**. A real
   directory on disk wins over WordPress's rewrite, so the old page becomes
   unreachable the moment the files land — but leaving it published means the
   CMS still lists a page that no longer resolves, and someone will eventually
   "fix" it by deleting the directory.

## Check it worked

```
/rebellionbistro/                 the homepage, with images and fonts
/rebellionbistro/menus            no .html extension
/rebellionbistro/private-events   the inquiry form
/rebellionbistro/nope             a 404, not a WordPress themed page
/rebellionbistro/bottle-shop      a 404 while the shop is hidden
```

What failure looks like, so it is recognisable:

- **Unstyled text, no images** — built for the wrong base path. Rebuild.
- **WordPress's own 404 theme** on `/rebellionbistro/menus`, while
  `/rebellionbistro/menus.html` loads fine — Apache never read the `.htaccess`.
  On this host the likely cause is nginx serving the directory itself. Paste
  `deploy/nginx-directives.conf` into Plesk → Apache & nginx Settings →
  Additional nginx directives. The other possibility is `AllowOverride None`,
  which is a host setting support can change.
- **Fonts missing, everything else fine** — `mod_mime` did not pick up
  `.woff2`. The `.htaccess` declares it; check it arrived.

## Before it goes live

- [ ] Rebuild with `NEXT_PUBLIC_INDEXABLE=true`. Until then every page carries
      a noindex tag, which is correct for a rehearsal and wrong for a launch.
- [ ] Check the WordPress root `robots.txt` does not disallow the directory.
      The `robots.txt` in this bundle sits at `/rebellionbistro/robots.txt`,
      which **crawlers ignore** — only the domain root counts.
- [ ] Submit `/rebellionbistro/sitemap.xml` in Search Console.
- [ ] Redirect any old bistro URLs that are disappearing. Nobody has audited
      the current page's inbound links yet; that is worth ten minutes in
      Search Console before launch, not after.
- [ ] Confirm the Resy venue ID and API key so the inline widget replaces the
      deep link (`reservations` in `lib/site.ts`).
- [ ] Point the private-events form at something real. It posts nowhere today;
      the page shows michelle@rebellionwinebar.com as the working route.

## Rolling back

Delete the directory contents and restore the backup from step 1. Nothing here
touches the WordPress database, the theme, or any other venue's pages, so a
rollback is only ever this directory.
