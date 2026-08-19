/**
 * The Rébellion house style guide, transcribed.
 *
 * Source: brand/Rebellion_Wine_Bar_Style_Guide.pdf, supplied by the client.
 * Everything here is read off that document — nothing is invented, and where
 * the guide contradicts itself the contradiction is recorded rather than
 * quietly resolved.
 */

export type BrandColor = {
  /** The guide's own name for the colour, which is a mood, not a hue. */
  name: string;
  pantone: string;
  cmyk: string;
  rgb: string;
  hex: string;
  /** Text colour that stays legible on the chip. */
  on: string;
  note?: string;
};

/**
 * Page 4. The guide is explicit about which values govern which medium:
 * "Reference PMS and CMYK color values for print and promotional use.
 * Reference Web and RGB color values for digital media." So the hexes below
 * are what the site uses.
 */
export const BRAND_COLORS: BrandColor[] = [
  {
    name: "Bold",
    pantone: "PMS 1945 C",
    cmyk: "C 0 · M 100 · Y 48 · K 26",
    rgb: "R 166 · G 10 · B 61",
    hex: "#A60A3D",
    on: "#ffffff",
    note: "The house red. Every headline in the guide is set in it.",
  },
  {
    name: "Comfortable",
    pantone: "PMS 5125 C",
    cmyk: "C 48 · M 82 · Y 16 · K 34",
    rgb: "R 105 · G 60 · B 94",
    hex: "#693C5E",
    on: "#ffffff",
    note: "Carries the subheads, and the second of the two reversed panels.",
  },
  {
    name: "Stylish",
    pantone: "Process Black",
    cmyk: "C 0 · M 0 · Y 0 · K 100",
    rgb: "R 0 · G 0 · B 0",
    hex: "#000000",
    on: "#ffffff",
    note: "The ink of the illustration and the splats.",
  },
  {
    name: "Accessible",
    pantone: "PMS 5503 C",
    cmyk: "C 79 · M 39 · Y 19 · K 26",
    rgb: "R 52 · G 101 · B 127",
    hex: "#34657F",
    on: "#ffffff",
    note:
      "The one value to check with the client: the swatch printed on page 4 " +
      "reads #91B6BC, a far paler teal, and page 2 reverses the logo out of " +
      "that pale tint rather than out of this. Both are carried in the site's " +
      "tokens until the client confirms which is canonical.",
  },
  {
    name: "Dependable",
    pantone: "PMS Cool Gray 7 C",
    cmyk: "C 38 · M 29 · Y 24 · K 5",
    rgb: "R 151 · G 153 · B 155",
    hex: "#97999B",
    on: "#ffffff",
  },
  {
    name: "Versatile",
    pantone: "PMS 142 C",
    cmyk: "C 0 · M 21 · Y 77 · K 0",
    rgb: "R 241 · G 190 · B 72",
    hex: "#F1BE48",
    on: "#181817",
  },
];

export type BrandFace = {
  name: string;
  /** The guide's label for the role this face plays. */
  role: string;
  /** The CSS custom property that resolves to it, if it is loaded. */
  token?: string;
  status: "supplied" | "not supplied";
  detail: string;
};

/** Page 5. */
export const BRAND_TYPE: BrandFace[] = [
  {
    name: "Festivo Letters No. 18",
    role: "Headline type",
    token: "var(--font-display)",
    status: "supplied",
    detail:
      "A light monoline face drawn caps-only. It sets every section head in " +
      "the guide, always in the house red.",
  },
  {
    name: "Trade Supply Textured",
    role: "Subhead style",
    token: "var(--font-subhead)",
    status: "supplied",
    detail:
      "Heavy, condensed and distressed — the same lettering as the WINE BAR " +
      "line of the lockup. It carries subheads, labels and navigation.",
  },
  {
    name: "Archer",
    role: "Body copy",
    status: "not supplied",
    detail:
      "A Hoefler&Co family; the guide shows Light through Bold with italics. " +
      "It did not come with the hand-off and needs a web licence, so body " +
      "copy runs on the interface sans until one exists.",
  },
  {
    name: "Minion Pro",
    role: "Editorial serif",
    token: "var(--font-editorial)",
    status: "supplied",
    detail:
      "Not in the guide, but supplied alongside it and used throughout the " +
      "client's own menu files. It holds the sentence-case editorial voice — " +
      "pull quotes and statements — that a caps-only face cannot.",
  },
];

/** Page 6. */
export const BRAND_ELEMENTS = [
  {
    name: "Splats",
    detail:
      "Five approved throws of ink. Shipped as alpha masks, so they take any " +
      "palette colour without a second file.",
  },
  {
    name: "Watercolor texture",
    detail:
      "Violet, coral and tan bleeding into each other. The one element that " +
      "carries its own colour and so is used as artwork, not as a tint.",
  },
  {
    name: "Signature pattern",
    detail:
      "A drawn field of bottles and glasses. One block, not a seamless tile — " +
      "it fills a panel and bleeds off an edge, which is the only way the " +
      "guide ever uses it.",
  },
] as const;
