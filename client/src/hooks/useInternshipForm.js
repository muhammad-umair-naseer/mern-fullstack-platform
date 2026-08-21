import { useEffect, useMemo, useState } from 'react';
import API_BASE_URL from '../config';
import { useIntroTimeline } from './useIntroTimeline';

/**
 * Form state, per-field validation and submission for the internship
 * application. Extracted so the page component is only markup — the validation
 * rules (notably the Pakistani phone formats) are easier to find and test here.
 */
export function useInternshipForm(internshipTitle, onClose) {
  const introRef = useIntroTimeline();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    internshipTitle: internshipTitle || "",
    skills: "",
    notes: "",
    company: "" // honeypot
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, internshipTitle: internshipTitle || "" }));
  }, [internshipTitle]);

  const normalizePhone = useMemo(
    () => (value) => value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, ""),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = name === "phone" ? normalizePhone(value) : value;
    setForm((f) => ({ ...f, [name]: next }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    validateField(name, form[name]);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 2) error = "Name must be at least 2 characters";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email";
        break;
      case "phone": {
        const v = normalizePhone(value);
        const localOK = /^0[3]\d{9}$/.test(v);     // 03XXYYYYYYY
        const intlOK = /^\+92[3]\d{9}$/.test(v);   // +923XXYYYYYYY
        if (!v) error = "Phone number is required";
        else if (!(localOK || intlOK)) error = "Enter a valid PK number (e.g., 03001234567 or +923001234567)";
        break;
      }
      case "skills":
        if (!value.trim()) error = "Please list your relevant skills";
        break;
      case "notes":
        if (!value.trim()) error = "Please tell us why we should select you";
        break;
      default:
        break;
    }

    setErrors((er) => ({ ...er, [name]: error }));
    return !error;
  };

  const validateForm = () => {
    let isValid = true;
    Object.keys(form).forEach((key) => {
      if (key !== "internshipTitle" && key !== "company") {
        if (!validateField(key, form[key])) isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot
    if (form.company) {
      setStatus("❌ Submission blocked");
      return;
    }

    setTouched({
      name: true,
      email: true,
      phone: true,
      skills: true,
      notes: true
    });

    if (!validateForm()) {
      setStatus("Please fix the errors above");
      return;
    }

    setSubmitting(true);
    setStatus("Submitting...");

    try {
      // Normalize PK local number to +92
      let phone = form.phone;
      if (/^0[3]\d{9}$/.test(phone)) {
        phone = "+92" + phone.slice(1);
      }

      const res = await fetch(`${API_BASE_URL}/api/internships/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus("✅ Application submitted successfully!");
        setForm({
          name: "",
          email: "",
          phone: "",
          internshipTitle: internshipTitle || "",
          skills: "",
          notes: "",
          company: ""
        });
        setErrors({});
        setTouched({});
        // setTimeout(() => onClose?.(), 1200);
      } else {
        if (data?.errors && typeof data.errors === "object") {
          setErrors((prev) => ({ ...prev, ...data.errors }));
        }
        setStatus("❌ " + (data.message || "Failed to submit application"));
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return { errors, form, handleBlur, handleChange, handleSubmit, introRef, normalizePhone, setErrors, setForm, setStatus, setSubmitting, setTouched, status, submitting, touched, validateField, validateForm };
}
