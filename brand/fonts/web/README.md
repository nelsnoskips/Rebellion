# The faces the client already serves

These are lifted from the client's own live site, where the *Use Any Font*
WordPress plugin publishes them at
`rebellionrestaurants.com/wp-content/uploads/useanyfont/`:

| File                     | Live as             | Role here      |
| ------------------------ | ------------------- | -------------- |
| `ArcherBook.woff2`       | `archer-book-pro`   | body copy      |
| `ArcherMedium.woff2`     | `archer-medium`     | descriptions   |
| `FestivoLettersNo1.woff2`| `festivo-1`         | interface      |

Two things this settled that nothing else could:

**Archer, actually Archer.** The brand book specifies it for all body copy and
it was never in the hand-off, so the site ran on Bitter as a stand-in. The
client has been serving the real thing on their own domain the whole time.

**Festivo Letters No. 1**, which was not in the hand-off either. It is the
heavy condensed uppercase cut — the "Festivo Basic" the type spec asked for in
navigation and buttons, and the face their own site already uses there.

## The licence question, which is real

`Use Any Font` is a self-hosting plugin. It uploads whatever file you give it
and serves it publicly; it does not check, or grant, anything. Archer is a
Hoefler&Co family and a **web font licence is a separate purchase from a
desktop one** — so the fact that these are already on the client's server is
evidence of a deployment, not of a licence.

Reusing the client's own files for the same client's own site does not change
their exposure either way: the same font is served from the same brand's site
to the same visitors. But it does not fix anything either. Confirm the web
licence with Hoefler&Co before launch, and if there isn't one, either buy it or
repoint `--font-body` at the open-licence stand-in — one token, and every
paragraph follows.

Trade Supply and Festivo No. 18 are also published there. Those come from the
supplied OTFs instead (see `scripts/build-fonts.py`), which subset better.
