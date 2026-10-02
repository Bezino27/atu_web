"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { flip } from "@floating-ui/dom";
import { sk } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./RecruitmentForm.module.css";
import { API_URL } from "@/app/lib/api";

type FormData = {
  child_full_name: string;
  birth_date: Date | null;
  email: string;
  phone: string;
  note: string;
};

type FormErrors = {
  child_full_name?: string[];
  birth_year?: string[];
  email?: string[];
  phone?: string[];
  note?: string[];
  non_field_errors?: string[];
};

const initialFormData: FormData = {
  child_full_name: "",
  birth_date: null,
  email: "",
  phone: "",
  note: "",
};

const RECRUITMENT_FORM_ENDPOINT =
  `${API_URL}/guli/recruitment-forms/create/`;

const PRIVACY_POLICY_URL =
  "/media/club_documents/Zasady_ochrany_osobnych_udajov_ATU_Kosice_Ji8ZnyO.pdf";

const monthNames = [
  "január",
  "február",
  "marec",
  "apríl",
  "máj",
  "jún",
  "júl",
  "august",
  "september",
  "október",
  "november",
  "december",
];

const currentYear = new Date().getFullYear();

const years = Array.from(
  { length: currentYear - 1990 + 1 },
  (_, index) => currentYear - index
);

function normalizeSlovakPhone(value: string) {
  const compact = value.trim().replace(/[\s().\/-]/g, "");

  if (!compact) return "";
  if (/^0\d{9}$/.test(compact)) return `+421${compact.slice(1)}`;
  if (/^00421\d{9}$/.test(compact)) return `+${compact.slice(2)}`;
  if (/^421\d{9}$/.test(compact)) return `+${compact}`;
  if (/^\+421\d{9}$/.test(compact)) return compact;

  return null;
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M3 10h18" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 16.92v2.25a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 3.4 2 2 0 0 1 4.11 1.25h2.25a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.8a2 2 0 0 1-.45 2.11L7.6 8.85a16 16 0 0 0 6.55 6.55l.97-.97a2 2 0 0 1 2.11-.45c.9.31 1.84.53 2.8.66A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function RecruitmentForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrorAttempt, setSubmitErrorAttempt] = useState(0);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);

  const endpoint = useMemo(() => {
    return RECRUITMENT_FORM_ENDPOINT;
  }, []);

  const isSuccess = Boolean(successMessage);

  useEffect(() => {
    if (!isSuccess) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [isSuccess]);

  useEffect(() => {
    if (retryAfterSeconds <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRetryAfterSeconds((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [retryAfterSeconds]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setSuccessMessage("");
    setSubmitError("");
  }

  function handleDateChange(date: Date | null) {
    setFormData((prev) => ({
      ...prev,
      birth_date: date,
    }));

    setErrors((prev) => ({
      ...prev,
      birth_year: undefined,
    }));

    setSuccessMessage("");
    setSubmitError("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting || retryAfterSeconds > 0) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");
    setSubmitError("");

    const normalizedPhone = normalizeSlovakPhone(formData.phone);

    if (normalizedPhone === null) {
      setErrors({
        phone: [
          "Zadajte slovenské číslo, napríklad 0905 748 845 alebo +421 905 748 845.",
        ],
      });
      setSubmitError("Formulár sa nepodarilo odoslať. Skontrolujte údaje.");
      setSubmitErrorAttempt((attempt) => attempt + 1);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          child_full_name: formData.child_full_name.trim(),
          birth_year: formData.birth_date
            ? formData.birth_date.getFullYear()
            : null,
          email: formData.email.trim(),
          phone: normalizedPhone,
          note: formData.note.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfterHeader = Number.parseInt(
            response.headers.get("Retry-After") ?? "",
            10
          );
          const retryAfter = Number.isFinite(retryAfterHeader)
            ? Math.max(1, retryAfterHeader)
            : 60;

          setErrors({});
          setRetryAfterSeconds(retryAfter);
          setSubmitError(
            `Odoslali ste viac požiadaviek za sebou. Skúste to znova o ${retryAfter} sekúnd.`
          );
          setSubmitErrorAttempt((attempt) => attempt + 1);
          return;
        }

        setErrors(data);
        setSubmitError("Formulár sa nepodarilo odoslať. Skontrolujte údaje.");
        setSubmitErrorAttempt((attempt) => attempt + 1);
        return;
      }

      setFormData(initialFormData);
      setErrors({});
      setSuccessMessage(
        "Ďakujeme, formulár bol úspešne odoslaný. Čoskoro sa vám ozveme."
      );
    } catch {
      setSubmitError(
        "Nastala chyba pri odosielaní formulára. Skúste to prosím znova."
      );
      setSubmitErrorAttempt((attempt) => attempt + 1);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.formWrap}>
      <form className={styles.formPanel} onSubmit={handleSubmit} noValidate>
        <div className={styles.formGrid}>
          <div className={styles.formFieldFull}>
            <label htmlFor="child_full_name">
              Meno a priezvisko dieťaťa <span>*</span>
            </label>

            <div className={styles.inputWrap}>
              <input
                id="child_full_name"
                name="child_full_name"
                type="text"
                placeholder="Zadajte meno a priezvisko"
                value={formData.child_full_name}
                onChange={handleChange}
              />

              <span className={styles.inputIcon}>
                <UserIcon />
              </span>
            </div>

            {errors.child_full_name?.map((error) => (
              <p key={error} className={styles.fieldError}>
                {error}
              </p>
            ))}
          </div>

          <div className={styles.formField}>
            <label htmlFor="birth_date">
              Dátum narodenia dieťaťa <span>*</span>
            </label>

            <div className={styles.inputWrap}>
              <DatePicker
                id="birth_date"
                selected={formData.birth_date}
                onChange={handleDateChange}
                dateFormat="dd.MM.yyyy"
                locale={sk}
                placeholderText="Vyberte alebo napíšte dátum"
                maxDate={new Date()}
                className={styles.dateInput}
                wrapperClassName={styles.datePickerWrapper}
                popperClassName={styles.datePickerPopper}
                calendarClassName={styles.datePickerCalendar}
                popperPlacement="bottom-start"
                popperModifiers={[
                  flip({
                    fallbackPlacements: ["bottom-start"],
                  }),
                ]}
                showPopperArrow={false}
                formatWeekDay={(nameOfDay) => nameOfDay.slice(0, 2)}
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className={styles.datePickerHeader}>
                    <div className={styles.datePickerTopRow}>
                      <button
                        type="button"
                        className={styles.datePickerNavButton}
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        aria-label="Predchádzajúci mesiac"
                      >
                        ‹
                      </button>

                      <div className={styles.datePickerTitle}>
                        {monthNames[date.getMonth()]} {date.getFullYear()}
                      </div>

                      <button
                        type="button"
                        className={styles.datePickerNavButton}
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        aria-label="Nasledujúci mesiac"
                      >
                        ›
                      </button>
                    </div>

                    <div className={styles.datePickerSelectors}>
                      <select
                        className={styles.datePickerSelect}
                        value={date.getMonth()}
                        onChange={(e) => changeMonth(Number(e.target.value))}
                      >
                        {monthNames.map((month, index) => (
                          <option key={month} value={index}>
                            {month}
                          </option>
                        ))}
                      </select>

                      <select
                        className={styles.datePickerSelect}
                        value={date.getFullYear()}
                        onChange={(e) => changeYear(Number(e.target.value))}
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              />

              <span className={styles.inputIcon}>
                <CalendarIcon />
              </span>
            </div>

            {errors.birth_year?.map((error) => (
              <p key={error} className={styles.fieldError}>
                {error}
              </p>
            ))}
          </div>

          <div className={styles.formField}>
            <label htmlFor="phone">Telefón</label>

            <div className={styles.inputWrap}>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+421 900 000 000"
                value={formData.phone}
                onChange={handleChange}
              />

              <span className={styles.inputIcon}>
                <PhoneIcon />
              </span>
            </div>

            {errors.phone?.map((error) => (
              <p key={error} className={styles.fieldError}>
                {error}
              </p>
            ))}
          </div>

          <div className={styles.formFieldFull}>
            <label htmlFor="email">
              Email <span>*</span>
            </label>

            <div className={styles.inputWrap}>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="vas@email.sk"
                value={formData.email}
                onChange={handleChange}
              />

              <span className={styles.inputIcon}>
                <MailIcon />
              </span>
            </div>

            {errors.email?.map((error) => (
              <p key={error} className={styles.fieldError}>
                {error}
              </p>
            ))}
          </div>

          <div className={styles.formFieldFull}>
            <label htmlFor="note">Poznámka</label>

            <div className={styles.inputWrap}>
              <textarea
                id="note"
                name="note"
                placeholder="Voliteľné – môžete doplniť krátku poznámku"
                value={formData.note}
                onChange={handleChange}
                rows={5}
              />

              <span className={styles.inputIcon}>
                <NoteIcon />
              </span>
            </div>

            {errors.note?.map((error) => (
              <p key={error} className={styles.fieldError}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {errors.non_field_errors?.map((error) => (
          <p key={error} className={styles.submitError}>
            {error}
          </p>
        ))}

        {submitError ? (
          <p className={styles.submitError}>{submitError}</p>
        ) : null}

        <p className={styles.srOnly} aria-live="polite">
          {isSubmitting
            ? "Formulár sa odosiela."
            : isSuccess
              ? successMessage
              : ""}
        </p>

        <div className={styles.submitArea}>
          {isSuccess ? (
            <span className={styles.successBurst} aria-hidden="true">
              <span className={styles.successBurstGlow} />
              <span className={`${styles.successRay} ${styles.successRayOne}`} />
              <span className={`${styles.successRay} ${styles.successRayTwo}`} />
              <span className={`${styles.successRay} ${styles.successRayThree}`} />
              <span className={`${styles.successRay} ${styles.successRayFour}`} />
              <span className={`${styles.successRay} ${styles.successRayFive}`} />
            </span>
          ) : null}

          <button
            key={submitError ? submitErrorAttempt : "submit"}
            type="submit"
            className={`${styles.submitButton} ${
              isSubmitting ? styles.submitButtonLoading : ""
            } ${isSuccess ? styles.submitButtonSuccess : ""} ${
              submitError ? styles.submitButtonError : ""
            }`}
            disabled={isSubmitting || isSuccess || retryAfterSeconds > 0}
          >
            {isSubmitting ? (
              <>
                <span className={styles.loadingIcon} aria-hidden="true">
                  <span className={styles.loadingRing} />
                  <span className={styles.loadingDot} />
                </span>
                <span className={styles.submitButtonLabel}>
                  Odosielame prihlášku
                  <span className={styles.loadingDots} aria-hidden="true">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>
              </>
            ) : isSuccess ? (
              <>
                <span className={styles.buttonCheck} aria-hidden="true">
                  <CheckIcon />
                </span>
                <span className={styles.submitButtonLabel}>
                  Prihláška odoslaná
                </span>
              </>
            ) : retryAfterSeconds > 0 ? (
              <span className={styles.submitButtonLabel}>
                Skúste znova o {retryAfterSeconds} s
              </span>
            ) : (
              <span className={styles.submitButtonLabel}>
                Chcem skúsiť tréning
              </span>
            )}
          </button>
        </div>

        <div className={styles.safeNotice}>
          <span className={styles.safeNoticeIcon}>
            <LockIcon />
          </span>

          <span>Vaše údaje sú u nás v bezpečí.</span>
        </div>

        <p className={styles.privacyNotice}>
          Odoslaním formulára beriem na vedomie spracúvanie osobných údajov
          mňa a dieťaťa podľa{" "}
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Zásad ochrany osobných údajov
          </a>
          .
        </p>
      </form>
    </div>
  );
}
