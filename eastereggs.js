document.addEventListener("DOMContentLoaded", () => {
  // -----------------------
  // Approved submissions display
  // -----------------------
  const listEl = document.getElementById("submission-list");

  function renderApprovedItem(item) {
    if (!listEl) return;

    const li = document.createElement("li");

    const type = (item.submissionType || "Theory").toString();
    const title = (item.title || "").toString();
    const relatedTo = (item.relatedTo || "").toString();
    const details = (item.details || "").toString();
    const credit = (item.creditName || "").toString();
    const ts = (item.timestamp || "").toString();

    const article = document.createElement("article");
    article.className = "archive-entry";

    const h3 = document.createElement("h3");
    h3.className = "archive-title";
    h3.textContent = `${type}: ${title}`;
    article.appendChild(h3);

    if (relatedTo || ts) {
      const meta = document.createElement("p");
      meta.className = "archive-meta";

      if (relatedTo) {
        const label = document.createElement("span");
        label.className = "archive-label";
        label.textContent = "Related To:";
        meta.appendChild(label);
        meta.appendChild(document.createTextNode(" " + relatedTo));
      }

      if (relatedTo && ts) {
        meta.appendChild(document.createTextNode(" "));
        const dot = document.createElement("span");
        dot.className = "archive-timestamp";
        dot.textContent = `• ${ts}`;
        meta.appendChild(dot);
      } else if (!relatedTo && ts) {
        const time = document.createElement("span");
        time.className = "archive-timestamp";
        time.textContent = ts;
        meta.appendChild(time);
      }

      article.appendChild(meta);
    }

    const detailsWrap = document.createElement("div");
    detailsWrap.className = "archive-details";

    const detailsLabel = document.createElement("p");
    detailsLabel.className = "archive-label";
    detailsLabel.textContent = "Details:";
    detailsWrap.appendChild(detailsLabel);

    const detailsText = document.createElement("p");
    detailsText.className = "archive-text";
    detailsText.textContent = details;
    detailsWrap.appendChild(detailsText);

    article.appendChild(detailsWrap);

    if (credit) {
      const creditP = document.createElement("p");
      creditP.className = "archive-credit";
      creditP.textContent = `Submitted by ${credit}`;
      article.appendChild(creditP);
    }

    li.appendChild(article);
    listEl.appendChild(li);
  }

  async function loadApproved() {
    try {
      const res = await fetch("approved-submissions.json", { cache: "no-store" });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  (async () => {
    const approved = await loadApproved();
    if (!listEl) return;

    listEl.textContent = "";

    if (approved.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No approved submissions are available right now.";
      listEl.appendChild(li);
      return;
    }

    approved.forEach(renderApprovedItem);
  })();

  // -----------------------
  // Form submission + validation + success message
  // -----------------------
  const form = document.getElementById("egg-form");
  if (!form) return;

  const successBox = document.getElementById("form-success");
  const captchaError = document.getElementById("captcha-error");

  const fields = {
    submissionType: {
      el: document.getElementById("submissionType"),
      err: document.getElementById("submissionType-error"),
      validate: (v) => (v ? "" : "Please choose a submission type.")
    },
    title: {
      el: document.getElementById("title"),
      err: document.getElementById("title-error"),
      validate: (v) => {
        const t = v.trim();
        if (!t) return "Title is required.";
        if (t.length < 3) return "Title must be at least 3 characters.";
        if (t.length > 80) return "Title must be 80 characters or less.";
        return "";
      }
    },
    relatedTo: {
      el: document.getElementById("relatedTo"),
      err: document.getElementById("relatedTo-error"),
      validate: (v) => {
        const t = v.trim();
        if (!t) return "Please tell us what it’s from.";
        if (t.length < 2) return "This must be at least 2 characters.";
        if (t.length > 100) return "Please keep this to 100 characters or less.";
        return "";
      }
    },
    timestamp: {
      el: document.getElementById("timestamp"),
      err: document.getElementById("timestamp-error"),
      validate: (v) => {
        const t = v.trim();
        if (!t) return "";
        const ok = /^(\d{1,2}:)?\d{1,2}:\d{2}$/.test(t);
        return ok ? "" : "Use mm:ss or hh:mm:ss (example: 00:42:10).";
      }
    },
    details: {
      el: document.getElementById("details"),
      err: document.getElementById("details-error"),
      validate: (v) => {
        const t = v.trim();
        if (!t) return "Details is required.";
        if (t.length < 15) return "Please add more detail (15+ characters).";
        if (t.length > 800) return "Please keep details to 800 characters or less.";
        return "";
      }
    }
  };

  function setError(key, msg) {
    const f = fields[key];
    if (!f || !f.el || !f.err) return;

    f.err.textContent = msg;
    f.err.hidden = !msg;
    f.el.classList.toggle("input-error", Boolean(msg));
    f.el.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  function clearAllErrors() {
    for (const key of Object.keys(fields)) {
      setError(key, "");
    }

    if (captchaError) {
      captchaError.textContent = "";
      captchaError.hidden = true;
    }
  }

  function validateField(key) {
    const f = fields[key];
    const msg = f.validate(f.el.value);
    setError(key, msg);
    return !msg;
  }

  function validateAll() {
    let ok = true;
    for (const key of Object.keys(fields)) {
      if (!validateField(key)) ok = false;
    }
    return ok;
  }

  function showMessage(text) {
    if (!successBox) return;
    successBox.textContent = text;
    successBox.hidden = false;
  }

  function clearMessage() {
    if (!successBox) return;
    successBox.textContent = "";
    successBox.hidden = true;
  }

  for (const key of Object.keys(fields)) {
    const el = fields[key].el;
    if (!el) continue;

    el.addEventListener("input", () => validateField(key));
    el.addEventListener("blur", () => validateField(key));
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessage();
    clearAllErrors();

    const gotcha = form.querySelector('input[name="_gotcha"]');
    if (gotcha && gotcha.value.trim() !== "") return;

    if (!validateAll()) {
      const firstBad = Object.keys(fields).find((key) =>
        fields[key].el.classList.contains("input-error")
      );
      if (firstBad) fields[firstBad].el.focus();
      return;
    }

    if (window.grecaptcha && !grecaptcha.getResponse()) {
      if (captchaError) {
        captchaError.textContent = "Please complete the reCAPTCHA verification.";
        captchaError.hidden = false;
      }
      return;
    }

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (!res.ok) throw new Error("Submit failed");

      form.reset();
      clearAllErrors();
      if (window.grecaptcha) grecaptcha.reset();

      showMessage("Thanks! Your submission was sent for review. If approved, it will appear on the site.");
    } catch {
      showMessage("Sorry — something went wrong sending your submission. Please try again.");
    }
  });

  // -----------------------
  // Reset page state on back/forward cache restore
  // -----------------------
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;

    form.reset();
    clearMessage();
    clearAllErrors();

    if (window.grecaptcha) {
      grecaptcha.reset();
    }
  });
});
