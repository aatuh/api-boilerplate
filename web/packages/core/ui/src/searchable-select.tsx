"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { cx } from "./cx";

export type SelectOption = {
  value: string;
  label: string;
  hint?: string;
  keywords?: string[];
};

type SearchableSelectBaseProps = {
  items: SelectOption[];
  pinnedValues?: string[];
  disabled?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: string;
  loading?: boolean;
  loadingLabel?: string;
  emptyLabel?: string;
  loadMoreLabel?: string;
  canLoadMore?: boolean;
  onLoadMore?: () => void;
  query?: string;
  onQueryChange?: (query: string) => void;
  mobileTitle?: string;
  closeLabel?: string;
  clearQueryOnSelect?: boolean;
  "aria-label"?: string;
};

type SearchableSelectSingleProps = SearchableSelectBaseProps & {
  value: string;
  onSelect: (value: string) => void;
  multiple?: false;
};

type SearchableSelectMultiProps = SearchableSelectBaseProps & {
  values: string[];
  onChange: (values: string[]) => void;
  multiple: true;
};

type SearchableSelectProps = SearchableSelectSingleProps | SearchableSelectMultiProps;

export function SearchableSelect(props: SearchableSelectProps) {
  const {
    items,
    pinnedValues = [],
    disabled,
    placeholder,
    searchPlaceholder,
    error,
    loading,
    loadingLabel,
    emptyLabel,
    loadMoreLabel,
    canLoadMore,
    onLoadMore,
    query: controlledQuery,
    onQueryChange,
    mobileTitle,
    closeLabel,
    clearQueryOnSelect,
    multiple,
    value,
    values,
    onSelect,
    onChange,
    ...rest
  } = props as SearchableSelectProps & {
    multiple?: boolean;
    value?: string;
    values?: string[];
    onSelect?: (value: string) => void;
    onChange?: (values: string[]) => void;
  };
  const isMulti = Boolean(multiple);
  const selectedValues = useMemo(
    () => (isMulti ? values ?? [] : value ? [value] : []),
    [isMulti, value, values]
  );
  const [open, setOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const isQueryControlled = typeof controlledQuery === "string";
  const query = isQueryControlled ? controlledQuery : internalQuery;
  const setQueryValue = (next: string) => {
    if (!isQueryControlled) {
      setInternalQuery(next);
    }
    onQueryChange?.(next);
  };

  const combinedOptions = useMemo(() => {
    const pinned = pinnedValues
      .map((v) => items.find((i) => i.value === v))
      .filter(Boolean) as SelectOption[];
    const deduped: SelectOption[] = [];
    const seen = new Set<string>();
    for (const opt of [...pinned, ...items]) {
      if (seen.has(opt.value)) continue;
      seen.add(opt.value);
      deduped.push(opt);
    }
    return deduped;
  }, [items, pinnedValues]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return combinedOptions;
    return combinedOptions.filter((opt) => {
      const haystack = [
        opt.label,
        opt.hint || "",
        opt.value,
        ...(opt.keywords || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [combinedOptions, query]);

  const selectedLabel = useMemo(() => {
    if (isMulti) return "";
    return combinedOptions.find((o) => o.value === value)?.label || value || "";
  }, [combinedOptions, isMulti, value]);

  const selectedChips = useMemo(() => {
    if (!isMulti) return [];
    const labels = new Map(combinedOptions.map((opt) => [opt.value, opt.label]));
    return selectedValues.map((val) => ({
      value: val,
      label: labels.get(val) || val,
    }));
  }, [combinedOptions, isMulti, selectedValues]);

  const openDropdown = (initialKey?: string) => {
    if (disabled) return;
    const idx = filtered.findIndex((o) => o.value === (isMulti ? selectedValues[0] : value));
    setHighlightedIndex(idx >= 0 ? idx : 0);
    if (initialKey && initialKey.length === 1) {
      setQueryValue(initialKey);
    }
    setOpen(true);
  };

  const closeDropdown = () => {
    setOpen(false);
    optionRefs.current = [];
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open || disabled) return;
    const id = requestAnimationFrame(() => {
      searchRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open, disabled]);

  const handleSelect = (val: string) => {
    if (isMulti) {
      const exists = selectedValues.includes(val);
      const next = exists ? selectedValues.filter((v) => v !== val) : [...selectedValues, val];
      onChange?.(next);
      if (clearQueryOnSelect !== false) {
        setQueryValue("");
      }
    } else {
      onSelect?.(val);
      if (clearQueryOnSelect !== false) {
        setQueryValue("");
      }
      closeDropdown();
      toggleRef.current?.focus();
    }
  };

  const handleToggleClick = () => {
    if (disabled) return;
    if (open) closeDropdown();
    else openDropdown();
  };
  const handleToggleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    if (
      e.key === "ArrowDown" ||
      e.key === "Enter" ||
      /^[a-z0-9 ]$/i.test(e.key)
    ) {
      e.preventDefault();
      if (!open) {
        openDropdown(e.key.length === 1 ? e.key : undefined);
      }
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  };
  const toggleClassName = cx(
    "flex w-full items-start justify-between gap-2 rounded-xl border bg-surface px-3 py-2 text-left text-sm shadow-inner focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
    error ? "border-red-500" : "border-border",
    disabled ? "opacity-60" : ""
  );
  const toggleContent = isMulti ? (
    <span className="flex flex-1 flex-wrap gap-2">
      {selectedChips.length ? (
        selectedChips.map((chip) => (
          <span
            key={chip.value}
            className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-1 text-xs font-semibold text-foreground"
          >
            {chip.label}
            {!disabled ? (
              <span
                role="button"
                aria-label="Remove"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange?.(selectedValues.filter((v) => v !== chip.value));
                }}
                className="cursor-pointer text-muted-strong hover:text-foreground"
              >
                ×
              </span>
            ) : null}
          </span>
        ))
      ) : (
        <span className="text-muted">{placeholder}</span>
      )}
    </span>
  ) : (
    <span
      className={cx(
        "flex-1 break-words whitespace-normal leading-snug",
        selectedLabel ? "text-foreground" : "text-muted"
      )}
      title={selectedLabel || ""}
    >
      {selectedLabel || placeholder}
    </span>
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        ref={toggleRef}
        disabled={disabled}
        onClick={handleToggleClick}
        onKeyDown={handleToggleKeyDown}
        className={toggleClassName}
        {...rest}
      >
        {toggleContent}
        <span className="ml-2 shrink-0 text-muted">▾</span>
      </button>
      {open && !disabled ? (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 sm:hidden" onClick={closeDropdown} />
          <div className="fixed inset-x-4 bottom-4 top-16 z-50 flex flex-col rounded-2xl border border-border bg-surface p-3 shadow-soft sm:absolute sm:inset-auto sm:left-0 sm:right-0 sm:top-full sm:mt-2 sm:max-h-80">
            <div className="flex items-center justify-between pb-2 sm:hidden">
              <p className="text-sm font-semibold text-foreground">
                {mobileTitle || placeholder || "Select"}
              </p>
              <button
                type="button"
                className="text-sm font-semibold text-muted-strong hover:text-foreground"
                onClick={closeDropdown}
              >
                {closeLabel || "Close"}
              </button>
            </div>
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQueryValue(e.target.value)}
              placeholder={searchPlaceholder}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightedIndex((prev) => {
                    const next = Math.min(prev + 1, filtered.length - 1);
                    optionRefs.current[next]?.focus();
                    return next;
                  });
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightedIndex((prev) => {
                    const next = Math.max(prev - 1, 0);
                    optionRefs.current[next]?.focus();
                    return next;
                  });
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  const picked = filtered[highlightedIndex];
                  if (picked) handleSelect(picked.value);
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  closeDropdown();
                } else if (e.key === "Tab" && !e.shiftKey) {
                  e.preventDefault();
                  optionRefs.current[0]?.focus();
                }
              }}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            />
            <div className="scrollbar-thin mt-2 flex-1 overflow-y-auto overflow-x-hidden rounded-lg border border-border/60 [scrollbar-gutter:stable]">
              {loading && loadingLabel ? (
                <div className="px-3 py-2 text-sm text-muted">{loadingLabel}</div>
              ) : null}
              {!loading && filtered.length === 0 && emptyLabel ? (
                <div className="px-3 py-2 text-sm text-muted">{emptyLabel}</div>
              ) : null}
              {filtered.map((opt, idx) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <button
                    key={`${opt.value}-${idx}`}
                    ref={(el) => {
                      optionRefs.current[idx] = el;
                    }}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    tabIndex={highlightedIndex === idx ? 0 : -1}
                    className={cx(
                      "flex w-full min-w-0 items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-muted",
                      isSelected ? "bg-surface-muted text-foreground" : "text-muted-strong",
                      highlightedIndex === idx ? "bg-surface-muted" : ""
                    )}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelect(opt.value);
                      } else if (e.key === "Escape") {
                        e.preventDefault();
                        closeDropdown();
                      } else if (e.key === "Tab") {
                        e.preventDefault();
                        if (e.shiftKey) {
                          if (idx === 0) {
                            searchRef.current?.focus();
                            setHighlightedIndex(0);
                          } else {
                            const prev = Math.max(idx - 1, 0);
                            optionRefs.current[prev]?.focus();
                            setHighlightedIndex(prev);
                          }
                        } else {
                          if (idx === filtered.length - 1) {
                            closeDropdown();
                            toggleRef.current?.focus();
                          } else {
                            const next = Math.min(idx + 1, filtered.length - 1);
                            optionRefs.current[next]?.focus();
                            setHighlightedIndex(next);
                          }
                        }
                      }
                    }}
                  >
                    <span className="flex-1 break-words whitespace-normal leading-snug" title={opt.label}>
                      {opt.label}
                      {opt.hint ? (
                        <span className="mt-0.5 block text-xs text-muted-strong">
                          {opt.hint}
                        </span>
                      ) : null}
                    </span>
                    {isSelected ? (
                      <span className="text-xs font-semibold text-primary">✓</span>
                    ) : null}
                  </button>
                );
              })}
              {!loading && canLoadMore ? (
                <button
                  type="button"
                  onClick={() => onLoadMore?.()}
                  className="flex w-full items-center justify-center px-3 py-2 text-sm font-semibold text-primary hover:bg-surface-muted"
                >
                  {loadMoreLabel || "Load more"}
                </button>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
