"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import { ChevronDown } from "@/components/icons/chevron-down";
import { duration, easing } from "@/design-system/tokens";
import { cn } from "@/lib/cn";
import { clamp } from "@/lib/math";

import { FieldFrame, fieldBorderStyles, fieldControlStyles } from "./field-frame";

/**
 * One option offered by {@link SelectField}.
 */
export interface SelectOption {
  /** Value reported to the form. */
  readonly value: string;
  /** Human readable label. */
  readonly label: string;
}

/**
 * Props accepted by {@link SelectField}.
 */
export interface SelectFieldProps {
  /** Unique identifier for the control. */
  readonly id: string;
  /** Two digit marker rendered before the label. */
  readonly index: string;
  /** Field label. */
  readonly label: string;
  /** Text shown while nothing is chosen. */
  readonly placeholder: string;
  /** The options, in the order they should be listed. */
  readonly options: readonly SelectOption[];
  /** Value of the chosen option, or an empty string. */
  readonly value: string;
  /** Invoked with the newly chosen value. */
  readonly onChange: (value: string) => void;
  /** Invoked when focus leaves the control, so the form can mark it touched. */
  readonly onBlur?: () => void;
  /** Current failure message. Omit while the field is valid or untouched. */
  readonly error?: string;
  /** Whether the field has been completed and passes its rules. */
  readonly isValid?: boolean;
}

const listVariants = {
  hidden: { opacity: 0, y: -6, scaleY: 0.94 },
  visible: { opacity: 1, y: 0, scaleY: 1 },
};

/**
 * A select built from a button and a listbox rather than from `<select>`.
 *
 * The native control cannot be styled into this system — its popup is drawn by
 * the operating system — so it is rebuilt here against the ARIA select-only
 * combobox pattern. The consequence is that every affordance the native element
 * would have provided has to be provided explicitly:
 *
 * - **Focus never leaves the trigger.** The active option is published through
 *   `aria-activedescendant` instead of being focused, which is what keeps a
 *   single tab stop and lets `Escape` and `Tab` behave the way they do
 *   everywhere else.
 * - **Pointer presses inside the list are cancelled** so the trigger keeps
 *   focus; without that, choosing an option with the mouse would blur the field
 *   and mark it touched before the value had landed.
 * - **Arrow keys, `Home`, `End`, `Enter`, `Space` and `Escape`** are all handled,
 *   plus a first-character jump, because a list of choices that only responds to
 *   the mouse is not a select.
 */
export function SelectField({
  id,
  index,
  label,
  placeholder,
  options,
  value,
  onChange,
  onBlur,
  error,
  isValid = false,
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const hasError = error !== undefined;
  const listboxId = `${id}-listbox`;
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex === -1 ? undefined : options[selectedIndex];

  const open = useCallback(() => {
    setActiveIndex(selectedIndex === -1 ? 0 : selectedIndex);
    setIsOpen(true);
  }, [selectedIndex]);

  /**
   * Commits a choice.
   *
   * The form is told the field was touched at the same moment, without waiting
   * for focus to leave. Picking an option is a deliberate, finished act in a way
   * that typing a first character into a text field is not, so there is nothing
   * to be gained by withholding the verdict until the visitor moves on.
   */
  const choose = useCallback(
    (position: number) => {
      const option = options[position];

      if (option !== undefined) {
        onChange(option.value);
      }

      setIsOpen(false);
      onBlur?.();
    },
    [onBlur, onChange, options],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node) || containerRef.current?.contains(event.target)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (isOpen) {
        choose(activeIndex);
      } else {
        open();
      }

      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        open();
        return;
      }

      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => clamp(current + step, 0, options.length - 1));
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();

      if (!isOpen) {
        open();
      }

      setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
      return;
    }

    if (event.key.length !== 1 || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const character = event.key.toLowerCase();
    const from = isOpen ? activeIndex + 1 : 0;
    const rotated = [...options.slice(from), ...options.slice(0, from)];
    const match = rotated.find((option) => option.label.toLowerCase().startsWith(character));

    if (match === undefined) {
      return;
    }

    if (!isOpen) {
      onChange(match.value);
      return;
    }

    setActiveIndex(options.indexOf(match));
  };

  const handleBlur = () => {
    setIsOpen(false);
    onBlur?.();
  };

  return (
    <FieldFrame id={id} index={index} label={label} error={error} isValid={isValid}>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          id={id}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={`${id}-label`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          aria-activedescendant={isOpen ? `${id}-option-${activeIndex}` : undefined}
          onClick={() => (isOpen ? setIsOpen(false) : open())}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={cn(
            fieldControlStyles,
            fieldBorderStyles(hasError),
            "flex items-center justify-between gap-4 text-left",
          )}
        >
          <span className={cn("truncate", selectedOption === undefined && "text-ash/40")}>
            {selectedOption?.label ?? placeholder}
          </span>
          <motion.span
            aria-hidden
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: duration.quick, ease: easing.quick }}
            className={cn("shrink-0", isOpen ? "text-volt" : "text-ash")}
          >
            <ChevronDown />
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen ? (
            <motion.ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={`${id}-label`}
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: duration.quick, ease: easing.snap }}
              onPointerDown={(event) => event.preventDefault()}
              className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 max-h-60 origin-top overflow-y-auto border-2 border-volt bg-abyss py-1"
            >
              {options.map((option, position) => {
                const isActive = position === activeIndex;
                const isSelected = option.value === value;

                return (
                  <li
                    key={option.value}
                    id={`${id}-option-${position}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => choose(position)}
                    onPointerEnter={() => setActiveIndex(position)}
                    className={cn(
                      "flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors duration-150",
                      isActive ? "bg-volt text-void" : "text-chalk",
                    )}
                  >
                    {option.label}
                    {isSelected ? (
                      <span
                        aria-hidden
                        className={cn(
                          "size-1.5 shrink-0 rotate-45",
                          isActive ? "bg-void" : "bg-volt",
                        )}
                      />
                    ) : null}
                  </li>
                );
              })}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>
    </FieldFrame>
  );
}
