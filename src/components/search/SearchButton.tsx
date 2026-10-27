"use client";

import { SearchIcon } from "@/components/ui/icons";
import { useI18n } from "@/i18n/I18nProvider";
import { openSearch } from "./open-search";

export function SearchButton({ className }: { className?: string }) {
  const { dict } = useI18n();
  return (
    <button type="button" className={className} onClick={openSearch} aria-haspopup="dialog">
      <SearchIcon />
      <span>{dict.header.search}</span>
    </button>
  );
}
