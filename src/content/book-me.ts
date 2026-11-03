import { photo } from "@/lib/images";

/**
 * Book Me page copy — V1
 * Editorial direction: Discreet · Sophisticated · Personal · Welcoming
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
    image: photo("gabrielle-book-me-hero", "Gabrielle, elegant portrait in soft light"),
  },
  before: {
    eyebrow: "A thoughtful introduction",
    title: "A little about you.",
    paragraphs: [
      "To help me understand your plans, please share a few details when getting in touch.",
      "Whether you are planning a dinner, a special evening, a weekend away or a journey together, a little context is always appreciated.",
    ],
    listTitle: "Please include:",
    list: [
      "A brief introduction about yourself.",
      "The city where you would like to meet.",
      "Your preferred date and time.",
      "The approximate duration you have in mind.",
      "A few words about the experience you are considering.",
    ],
    closing: "The more context you share, the easier it will be for me to respond.",
    image: photo("gabrielle-book-me-introduction", "Gabrielle writing a note at a table"),
  },
  /** Passed to the client-side enquiry form */
  form: {
    availability: {
      eyebrow: "Let’s find a moment",
      title: "When would you like to meet?",
      text: "Select your preferred date, time and approximate duration to explore possible availability.",
      city: { label: "City", hint: "Where would you like to meet?", other: "Another city", otherPlaceholder: "Which city?" },
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
      name: { label: "Your name", hint: "How should I address you?" },
      email: { label: "Your email", hint: "Where can I reach you?", requiredForEmail: "Needed if you choose email." },
      about: { label: "A little about you", hint: "Tell me a little about yourself." },
      plans: { label: "Your plans", hint: "What kind of experience are you considering?" },
      other: { label: "Anything else?", hint: "Is there anything else you would like me to know?" },
      privacy: "Your information will only be used to respond to your enquiry.",
    },
    channels: {
      eyebrow: "Your preferred way to connect",
      title: "How would you like me to reach you?",
      text: "Once you have completed your introduction, choose the channel that feels most convenient.",
      whatsapp: { title: "WhatsApp", text: "Continue the conversation on WhatsApp.", cta: "Continue with WhatsApp" },
      telegram: { title: "Telegram", text: "Send your enquiry directly through Telegram.", cta: "Continue with Telegram" },
      email: { title: "Email", text: "Prefer email? Send your introduction and I will get back to you.", cta: "Send enquiry by email" },
    },
  },
  important: {
    eyebrow: "A note before we begin",
    title: "Every enquiry is personal.",
    paragraphs: [
      "Submitting an enquiry does not constitute a confirmed booking.",
      "I will personally review your message and get back to you to discuss availability, arrangements and any relevant details.",
      "Please wait for my direct confirmation before making any plans based on your enquiry.",
    ],
    closing: "Thank you for your understanding.",
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
  closing: {
    eyebrow: "I look forward to hearing from you",
    title: "A good introduction is always welcome.",
    paragraphs: [
      "If you have something in mind, feel free to get in touch. Tell me a little about yourself and let’s see what might be possible.",
    ],
    primaryCta: { label: "Start Your Enquiry", href: "#enquiry" },
    image: photo("gabrielle-book-me-closing", "Gabrielle, warm evening portrait"),
  },
} as const;

export type EnquiryFormCopy = typeof bookMe.form;
