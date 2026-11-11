import { media } from "@/lib/images";

/**
 * Book Me page copy — V1 (revised)
 * Editorial direction: Discreet · Sophisticated · Personal · Welcoming
 *
 * The whole enquiry happens in the hero (two steps, sent via WhatsApp);
 * only the FAQ follows below.
 */
export const bookMe = {
  seo: {
    title: "Book Gabrielle | Private Enquiries & Availability",
    description:
      "Get in touch with Gabrielle for private enquiries. Explore possible availability, introduce yourself and discuss your plans directly.",
  },
  hero: {
    eyebrow: "Private enquiries",
    title: "Let’s make time for something memorable.",
    lead: "Every encounter begins with an introduction.",
    paragraphs: [
      "If you are considering spending time together, I invite you to share a little about yourself, your plans and the experience you have in mind.",
      "I appreciate thoughtful introductions and clear communication. I look forward to hearing from you.",
    ],
    media: media("gabrielle-book-me-hero", "Gabrielle, elegant portrait in soft light"),
  },
  /** Passed to the client-side enquiry form */
  form: {
    stepLabel: "Step {n} of 2",
    continue: "Continue",
    back: "Back",
    availability: {
      eyebrow: "Let’s find a moment",
      title: "When would you like to meet?",
      text: "Select your preferred date, time and approximate duration to explore possible availability.",
      city: { label: "City", hint: "Where would you like to meet?", placeholder: "Select a city", other: "Another city", otherPlaceholder: "Which city?" },
      date: { label: "Date", hint: "Select your preferred date." },
      time: { label: "Time", hint: "What time would suit you best?" },
      duration: { label: "Duration", hint: "How much time would you like to spend together?" },
      durations: ["1 hour", "2 hours", "4 hours", "6 hours", "12 hours", "24 hours", "Other / Flexible"],
      /** Times offered in the selector; real availability comes from Google Calendar */
      times: ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
      states: {
        available: "This time appears to be available.",
        unavailable: "This time is not currently available.",
        none: "Please get in touch directly to enquire about other possibilities.",
      },
      note: "Availability is indicative and subject to confirmation.",
    },
    introduction: {
      eyebrow: "Tell me a little more",
      title: "What do you have in mind?",
      text: "A few details will help me understand your enquiry and get back to you.",
      about: { label: "A little about you", hint: "Tell me a little about yourself." },
      plans: { label: "Your plans", hint: "What kind of experience are you considering?" },
      other: { label: "Anything else?", hint: "Is there anything else you would like me to know?" },
      privacy: "Your information will only be used to respond to your enquiry.",
      preview: "Preview your enquiry",
      send: "Continue with WhatsApp",
      confirmation: "Submitting an enquiry does not constitute a confirmed booking.",
    },
  },
  faq: {
    eyebrow: "Frequently asked questions",
    title: "A few things you may wish to know.",
    items: [
      {
        q: "How far in advance should I get in touch?",
        a: "Getting in touch as early as possible is always appreciated, particularly when planning a specific date, a weekend or a trip.",
      },
      {
        q: "Can I enquire about a city that is not listed?",
        a: "Certainly. You are welcome to contact me about other destinations and travel possibilities.",
      },
      {
        q: "Does the availability calendar confirm a booking?",
        a: "No. The calendar is intended to help you explore possible availability. Every enquiry requires direct confirmation from me.",
      },
      {
        q: "Can I arrange a dinner, weekend or longer experience?",
        a: "Yes, you are welcome to introduce the kind of experience you have in mind. Please include your plans and preferred duration in your enquiry.",
      },
      {
        q: "How are arrangements and details discussed?",
        a: "All individual arrangements, including any applicable conditions, are discussed privately and directly.",
      },
      {
        q: "Which contact method should I use?",
        a: "You may contact me through WhatsApp, Telegram or email, whichever is most convenient for you.",
      },
    ],
  },
} as const;

export type EnquiryFormCopy = typeof bookMe.form;
