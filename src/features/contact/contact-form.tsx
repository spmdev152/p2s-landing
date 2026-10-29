"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { SelectField, TextAreaField, TextField } from "@/components/form";
import { ArrowUpRight } from "@/components/icons/arrow-up-right";
import { OffsetButton } from "@/components/ui/offset-button";
import type { ContactContent } from "@/content/contact-content";
import { duration, easing } from "@/design-system/tokens";

import {
  validateChoice,
  validateEmail,
  validateMessage,
  validateName,
  type ContactRequest,
  type ContactSubmissionResult,
} from "./contact-request";

/**
 * Props accepted by {@link ContactForm}.
 */
export interface ContactFormProps {
  /** Copy, options and validation messages. */
  readonly content: ContactContent;
  /**
   * Delivers a validated request.
   *
   * The form does not know or care whether this reaches an inbox, a queue or a
   * webhook — it only needs an answer, which is what lets the transport be
   * swapped without touching anything here.
   */
  readonly onSubmit: (request: ContactRequest) => Promise<ContactSubmissionResult>;
}

/**
 * What the form is currently showing in place of, or alongside, the fields.
 */
type SubmissionStatus = "idle" | "sent" | "failed";

const panelVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const noticeVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
};

/**
 * The contact form.
 *
 * Validation runs on `onTouched`: nothing is marked wrong while a visitor is
 * still typing into a field for the first time, and from the moment they leave
 * it the message tracks every keystroke. Complaining before someone has finished
 * their first attempt is the fastest way to make a form feel hostile.
 *
 * The same rules run again on the server. These ones exist to give an answer
 * without a round trip, not to decide whether a request is acceptable — a
 * request that arrives over the network never passed through them.
 */
export function ContactForm({ content, onSubmit }: ContactFormProps) {
  const formId = useId();
  const [status, setStatus] = useState<SubmissionStatus>("idle");

  const {
    control,
    formState: { errors, isSubmitting, touchedFields },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ContactRequest>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: "",
      budget: "",
      message: "",
    },
  });

  const fieldId = (field: keyof ContactRequest) => `${formId}-${field}`;
  const isSatisfied = (field: keyof ContactRequest) =>
    touchedFields[field] === true && errors[field] === undefined;

  const submit = handleSubmit(async (values) => {
    try {
      const result = await onSubmit(values);

      if (result.ok) {
        reset();
        setStatus("sent");
        return;
      }

      setStatus("failed");

      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(field as keyof ContactRequest, { type: "server", message });
      }
    } catch {
      setStatus("failed");
    }
  });

  if (status === "sent") {
    return (
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: duration.base, ease: easing.snap }}
        className="relative border-2 border-volt bg-carbon p-8 lg:p-10"
      >
        <span aria-hidden className="absolute -top-1.5 -left-1.5 size-3 rotate-45 bg-volt" />

        <div className="flex flex-col items-start gap-6">
          <h3 className="font-display text-display text-volt uppercase">
            {content.successTitle}
          </h3>
          <p className="max-w-md text-lede text-ash">{content.successBody}</p>

          <OffsetButton tone="outline" onClick={() => setStatus("idle")}>
            {content.successResetLabel}
          </OffsetButton>
        </div>
      </motion.div>
    );
  }

  return (
    <form noValidate aria-label={content.formLabel} onSubmit={submit}>
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <TextField
          id={fieldId("name")}
          index={content.fields.name.index}
          label={content.fields.name.label}
          placeholder={content.fields.name.placeholder}
          autoComplete="name"
          error={errors.name?.message}
          isValid={isSatisfied("name")}
          registration={register("name", {
            validate: (value) => validateName(value, content.validation),
          })}
        />

        <TextField
          id={fieldId("email")}
          index={content.fields.email.index}
          label={content.fields.email.label}
          placeholder={content.fields.email.placeholder}
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          isValid={isSatisfied("email")}
          registration={register("email", {
            validate: (value) => validateEmail(value, content.validation),
          })}
        />

        <div className="sm:col-span-2">
          <TextField
            id={fieldId("company")}
            index={content.fields.company.index}
            label={content.fields.company.label}
            placeholder={content.fields.company.placeholder}
            autoComplete="organization"
            optionalLabel={content.optionalLabel}
            registration={register("company")}
          />
        </div>

        <Controller
          name="projectType"
          control={control}
          rules={{
            validate: (value) => validateChoice(value, content.validation.projectTypeRequired),
          }}
          render={({ field, fieldState }) => (
            <SelectField
              id={fieldId("projectType")}
              index={content.fields.projectType.index}
              label={content.fields.projectType.label}
              placeholder={content.fields.projectType.placeholder}
              options={content.projectTypeChoices}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              isValid={fieldState.isTouched && fieldState.error === undefined}
            />
          )}
        />

        <Controller
          name="budget"
          control={control}
          rules={{
            validate: (value) => validateChoice(value, content.validation.budgetRequired),
          }}
          render={({ field, fieldState }) => (
            <SelectField
              id={fieldId("budget")}
              index={content.fields.budget.index}
              label={content.fields.budget.label}
              placeholder={content.fields.budget.placeholder}
              options={content.budgetChoices}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              isValid={fieldState.isTouched && fieldState.error === undefined}
            />
          )}
        />

        <div className="sm:col-span-2">
          <TextAreaField
            id={fieldId("message")}
            index={content.fields.message.index}
            label={content.fields.message.label}
            placeholder={content.fields.message.placeholder}
            error={errors.message?.message}
            isValid={isSatisfied("message")}
            registration={register("message", {
              validate: (value) => validateMessage(value, content.validation),
            })}
          />
        </div>
      </div>

      <AnimatePresence>
        {status === "failed" ? (
          <motion.div
            variants={noticeVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: duration.quick, ease: easing.quick }}
            className="overflow-hidden"
          >
            <p
              role="status"
              className="mt-2 border-2 border-ember/50 bg-ember/10 px-4 py-3 font-mono text-[0.6875rem] leading-relaxed tracking-[0.04em] text-ember"
            >
              {content.failureMessage}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <OffsetButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? content.submittingLabel : content.submitLabel}
          {isSubmitting ? (
            <motion.span
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, ease: "linear", repeat: Infinity }}
              className="size-2.5 border-2 border-void border-t-transparent"
            />
          ) : (
            <ArrowUpRight />
          )}
        </OffsetButton>

        <p className="font-mono text-eyebrow text-ash/60 uppercase">{content.responseNote}</p>
      </div>
    </form>
  );
}
