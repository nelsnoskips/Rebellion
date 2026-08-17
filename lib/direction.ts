/**
 * Which art direction this build ships as its homepage.
 *
 * Both directions live in one codebase; a deploy chooses between them with
 * `NEXT_PUBLIC_DIRECTION`. That way the two client review sites are the same
 * commit with one environment variable different — content fixes land in both
 * without anything to keep in sync.
 *
 *   unset       both, for internal review: editorial at /, collage at /collage,
 *               and /directions to compare them
 *   "editorial" editorial at /, review affordances hidden
 *   "collage"   collage at /, review affordances hidden
 */
export type Direction = "editorial" | "collage";

const configured = process.env.NEXT_PUBLIC_DIRECTION;

export const direction: Direction =
  configured === "collage" ? "collage" : "editorial";

/** True on a single-direction deploy — the ones sent to the client. */
export const isSingleDirection =
  configured === "collage" || configured === "editorial";
