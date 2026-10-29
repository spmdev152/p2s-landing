/**
 * Session storage key recording that this visit has already seen the loader.
 */
export const INTRO_SEEN_KEY = "p2s:intro-seen";

/**
 * Attribute the boot script sets on the document element when the loader should
 * not play on this load.
 */
export const INTRO_SEEN_ATTRIBUTE = "data-intro-seen";

/** The page a manual reload replays the loader on. */
const HOME_PATH = "/";

/**
 * Runs in the document head, before the first paint, on every full page load,
 * and decides whether the loader plays.
 *
 * - **A manual reload of the home page plays it**, and starts the page at the
 *   very top: the browser's own scroll restoration is switched off for the
 *   rest of that document's life, so a reload from halfway down the page does
 *   not land back there behind the loader. It has to stay off: the browser
 *   restores scroll after the load event, so switching it back on at that
 *   point still restores. Moves between pages inside the site are Next.js's
 *   own and do their own scrolling, so they are unaffected.
 * - **Any other load in a visit that has already seen it skips it**: reloads
 *   of other pages, and navigations Next.js completes with a full load, such
 *   as links to routes that do not exist yet. The document is marked so the
 *   loader, which is still in the server's HTML, is hidden by CSS from the
 *   first frame, scrolling is unlocked and entrance animations are released,
 *   all before any bundle script runs.
 * - **The first load of a visit plays it**, whatever the page.
 *
 * Storage and the navigation timing API can both be unavailable; the loader
 * then simply plays.
 */
export const INTRO_BOOT_SCRIPT = `try{var d=document.documentElement,n=performance.getEntriesByType("navigation")[0],r=n&&n.type==="reload"&&location.pathname===${JSON.stringify(HOME_PATH)};if(r){history.scrollRestoration="manual";window.scrollTo(0,0);window.addEventListener("load",function(){window.scrollTo(0,0)})}else if(sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)})){d.setAttribute(${JSON.stringify(INTRO_SEEN_ATTRIBUTE)},"");d.setAttribute("data-intro","done");d.removeAttribute("data-loader")}}catch(e){}`;

/**
 * Records that the loader has played, so the rest of this visit skips it. If
 * storage is unavailable the loader just plays again on the next full load,
 * which is harmless, so the failure is ignored.
 */
export function rememberIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    return;
  }
}
