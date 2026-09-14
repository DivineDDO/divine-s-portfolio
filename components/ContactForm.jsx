"use client";
// The contact form at the bottom of the site. Sends the message straight to an
// inbox using EmailJS, since there's no backend server to handle it otherwise.
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

export default function ContactForm() {
  // What the visitor has typed into each field so far.
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);   // true once the email has gone out
  const [error, setError] = useState("");    // any message to show if something goes wrong

  // Fires on every keystroke, updating just the field that changed.
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // None of the three fields can be left empty.
  const isFormValid = () => {
    const { from_name, from_email, message } = formData;
    return from_name.trim() !== "" && from_email.trim() !== "" && message.trim() !== "";
  };

  // Runs when "Send Message" is clicked.
  const sendEmail = (e) => {
    e.preventDefault(); // stop the page from reloading, like a normal form submit would

    if (!isFormValid()) {
      setError("Please complete all fields before sending your message.");
      return;
    }

    setError("");
    // These three IDs just tell EmailJS which account/template to use — not secret keys.
    emailjs
      .send(
        "service_pcgxcow",
        "template_q6et97g",
        formData,
        "MiJhHTCU3UdEeKh_H"
      )
      .then(
        () => {
          setSent(true);
          setFormData({ from_name: "", from_email: "", message: "" });
        },
        (error) => {
          console.error("Email error:", error);
          setError("Your message could not be sent. Please try again.");
        }
      );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 max-w-md mx-auto bg-neutral-900/80 backdrop-blur-xl p-8 rounded-3xl border border-neutral-700/80 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-shadow"
    >
      <h2 className="text-3xl font-semibold text-white mb-4">
        Contact Me
      </h2>

      {/* Swap the form for a thank-you message once it's sent */}
      {sent ? (
        <p className="text-green-300 text-lg text-center">
          Message sent successfully! ✨
        </p>
      ) : (
        <form onSubmit={sendEmail} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="from_name"
              value={formData.from_name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-neutral-800/80 text-white placeholder-gray-400 border border-neutral-700 focus:outline-none focus:border-white/40 focus:bg-neutral-800 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="from_email"
              value={formData.from_email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-neutral-800/80 text-white placeholder-gray-400 border border-neutral-700 focus:outline-none focus:border-white/40 focus:bg-neutral-800 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-3 rounded-xl bg-neutral-800/80 text-white placeholder-gray-400 border border-neutral-700 focus:outline-none focus:border-white/40 focus:bg-neutral-800 transition"
            ></textarea>
          </div>

          {/* Only shows up if validation or sending fails */}
          {error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : null}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 rounded-xl bg-white text-neutral-950 font-semibold shadow-[0_8px_24px_rgba(255,255,255,0.15)] hover:bg-neutral-200 transition"
          >
            Send Message
          </motion.button>
        </form>
      )}

      <div className="absolute inset-0 rounded-3xl border border-white/5 -z-10"></div>
    </motion.div>
  );
}
