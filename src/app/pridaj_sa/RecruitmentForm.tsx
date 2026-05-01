"use client";

import { FormEvent, useMemo, useState } from "react";
import { API_URL } from "@/app/lib/api";
import styles from "./RecruitmentForm.module.css";

type FormData = {
  child_full_name: string;
  birth_year: string;
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
  birth_year: "",
  email: "",
  phone: "",
  note: "",
};

export default function RecruitmentForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const endpoint = useMemo(() => {
    return `${API_URL}/guli/recruitment-forms/create/`;
  }, []);

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage("");
    setSubmitError("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          child_full_name: formData.child_full_name,
          birth_year: Number(formData.birth_year),
          email: formData.email,
          phone: formData.phone,
          note: formData.note,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data);
        setSubmitError("Formulár sa nepodarilo odoslať. Skontrolujte údaje.");
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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.formWrap}>
      <form className={styles.formPanel} onSubmit={handleSubmit} noValidate>
        <div className={styles.formGrid}>
          <div className={styles.formFieldFull}>
            <label htmlFor="child_full_name">Meno a priezvisko dieťaťa</label>
            <input
              id="child_full_name"
              name="child_full_name"
              type="text"
              placeholder="Napíšte meno a priezvisko"
              value={formData.child_full_name}
              onChange={handleChange}
            />

            {errors.child_full_name?.map((error) => (
              <p key={error} className={styles.fieldError}>
                {error}
              </p>
            ))}
          </div>

          <div className={styles.formField}>
            <label htmlFor="birth_year">Rok narodenia</label>
            <input
              id="birth_year"
              name="birth_year"
              type="number"
              placeholder="Napr. 2013"
              value={formData.birth_year}
              onChange={handleChange}
            />

            {errors.birth_year?.map((error) => (
              <p key={error} className={styles.fieldError}>
                {error}
              </p>
            ))}
          </div>

          <div className={styles.formField}>
            <label htmlFor="phone">Telefón</label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="+421 900 000 000"
              value={formData.phone}
              onChange={handleChange}
            />

            {errors.phone?.map((error) => (
              <p key={error} className={styles.fieldError}>
                {error}
              </p>
            ))}
          </div>

          <div className={styles.formFieldFull}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="vas@email.sk"
              value={formData.email}
              onChange={handleChange}
            />

            {errors.email?.map((error) => (
              <p key={error} className={styles.fieldError}>
                {error}
              </p>
            ))}
          </div>

          <div className={styles.formFieldFull}>
            <label htmlFor="note">Poznámka</label>
            <textarea
              id="note"
              name="note"
              placeholder="Voliteľné – môžete doplniť krátku poznámku"
              value={formData.note}
              onChange={handleChange}
              rows={5}
            />

            {errors.note?.map((error) => (
              <p key={error} className={styles.fieldError}>
                {error}
              </p>
            ))}
          </div>
        </div>

        {submitError ? (
          <p className={styles.submitError}>{submitError}</p>
        ) : null}

        {successMessage ? (
          <p className={styles.successMessage}>{successMessage}</p>
        ) : null}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Odosielam..." : "Chcem skúsiť tréning"}
        </button>
      </form>
    </div>
  );
}