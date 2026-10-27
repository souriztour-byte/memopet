/** Opens the search overlay (SearchOverlay.tsx) from any button on the page. */
export const OPEN_SEARCH_EVENT = "mimipets:open-search";
export const openSearch = () => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
