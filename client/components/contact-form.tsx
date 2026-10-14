"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    sessionStorage.setItem("portfolioContact", JSON.stringify(Object.fromEntries(formData)));

    try {
      const response = await fetch("/backend-api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: formData.get("firstName"),
          lastname: formData.get("lastName"),
          email: formData.get("email"),
        }),
      });

      if (!response.ok) {
        const result: unknown = await response.json().catch(() => null);
        const serverMessage = result && typeof result === "object" && "error" in result
          && typeof result.error === "string"
          ? result.error
          : "The message could not be sent.";
        throw new Error(serverMessage);
      }

      // A full-page redirect remains reliable on hosted builds and shows the success notice.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/?message=received");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "The message could not be sent.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>First name<input name="firstName" autoComplete="given-name" required /></label>
        <label>Last name<input name="lastName" autoComplete="family-name" required /></label>
      </div>
      <div className="form-row">
        <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
        <label>Contact number<input name="phone" type="tel" autoComplete="tel" /></label>
      </div>
      <label>Message<textarea name="message" rows={6} required /></label>
      {status === "error" && <p className="form-status form-status--error" role="alert">{errorMessage}</p>}
      <button className="button button--primary" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
