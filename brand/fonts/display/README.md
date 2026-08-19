# The licensed display face

Drop the licensed headline font here, then run:

```bash
python3 scripts/build-display-font.py
```

That is the whole job. The script subsets each file to WOFF2, writes the
`@font-face` rules, and every headline on the site switches over. No component
or token needs editing — the site asks for one family name, `Rebellion
Display`, and only this folder decides what answers to it.

## Which files

Two weights, matching what the site actually sets:

| Site role       | Weight | Canela           | Editorial New          |
| --------------- | ------ | ---------------- | ---------------------- |
| `.display-soft` | 500    | Canela Medium    | Editorial New Regular  |
| `.display`      | 600    | Canela Semibold  | Editorial New Ultrabold |

Italics are optional; name them with `Italic` in the filename and they are
picked up as a separate face. `.otf`, `.ttf`, `.woff2` and `.woff` all work.

Weight is read from the filename, so keep the foundry's naming — anything
containing `semibold`, `demi`, `bold`, `black` or `heavy` becomes 600 and
everything else becomes 500.

## While the folder is empty

Headlines run on Cormorant Garamond, which is the open-licence stand-in. The
generated stylesheet is empty and nothing 404s.

## Licensing

Canela is Commercial Type; Editorial New is Pangram Pangram. Both need a **web
font** licence, which is a separate purchase from a desktop licence — the web
licence is usually priced on monthly pageviews. Buy it before the site goes
public; a preview behind `noindex` is not the same thing as shipping.

The source files here are deliberately **not** committed — the licence covers
the client, not everyone who can clone the repo. The subsetted WOFF2 the script
writes into `public/fonts/` *is* committed, because that is what the deploy
serves and a web font licence is a licence to serve it publicly. Add the
licence certificate to the project record when it arrives.
