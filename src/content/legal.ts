/**
 * Legal pages — texts provided by the agency (16 November 2026).
 * Blocks: a string is a paragraph; { list } is a bulleted list; { lines } keeps line breaks.
 */
export type LegalBlock = string | { list: string[] } | { lines: string[] };
export type LegalSection = { title: string; blocks: LegalBlock[] };
export type LegalPage = { title: string; seoTitle: string; description: string; path: string; updated: string; sections: LegalSection[] };

const contact: LegalBlock = {
  lines: ["Email: geral@onda.work", "Correspondence Address:", "Rua Tomás Ribeiro, 47", "Picoas, Lisboa", "Portugal"],
};

export const privacyPolicy: LegalPage = {
  title: "Privacy Policy",
  seoTitle: "Privacy Policy | Gabrielle",
  description: "How personal information is handled when you visit and interact with Gabrielle's website.",
  path: "/privacy-policy",
  updated: "16 November 2026",
  sections: [
    {
      title: "Introduction",
      blocks: [
        "This Privacy Policy explains how personal information is handled when you visit and interact with the website of Gabrielle (the “Website”).",
        "Gabrielle is the primary data controller responsible for determining how and why personal data is processed through this Website.",
        "The Website is technically maintained by Onda Solutions, Lda., acting as a technical service provider.",
        "We are committed to respecting your privacy, protecting your information and collecting only what is necessary for the operation of the Website.",
      ],
    },
    {
      title: "Information We Collect",
      blocks: [
        "The Website is designed to minimise the collection and retention of personal information.",
        "We do not operate a traditional appointment enquiry database through the Website.",
        "The appointment enquiry feature allows visitors to select information such as a preferred destination, date, time and requested duration. This information is used locally in the visitor’s browser to generate a pre-filled WhatsApp message.",
        "The visitor decides whether to open WhatsApp and send that message. The Website does not receive or retain the contents of the generated message.",
        "We do not request a visitor’s name or email address through this appointment enquiry feature.",
      ],
    },
    {
      title: "Technical Information",
      blocks: [
        "When you visit the Website, limited technical information may be processed automatically by the hosting and infrastructure providers.",
        "This may include:",
        {
          list: [
            "IP address;",
            "Browser and device information;",
            "Date and time of access;",
            "Requested pages and technical requests;",
            "Security and server access information.",
          ],
        },
        "This information may be processed to maintain the security, stability and proper operation of the Website.",
        "The Website does not intentionally use this information to build advertising profiles or identify visitors for marketing purposes.",
      ],
    },
    {
      title: "Appointment Availability",
      blocks: [
        "The Website may connect to a private Google Calendar through a server-side API integration to display available appointment periods.",
        "This integration accesses availability information configured by Gabrielle.",
        "Visitors do not connect directly to the private calendar and cannot view private calendar events, descriptions or personal scheduling details.",
        "The Website displays availability information only. Selecting a date or time does not create a confirmed appointment.",
        "All arrangements must be confirmed directly with Gabrielle.",
      ],
    },
    {
      title: "Third-Party Services",
      blocks: [
        "The Website relies on selected third-party providers for its operation and communication.",
        "These may include:",
        {
          list: [
            "Vercel: Website hosting, deployment, infrastructure and technical security.",
            "GoDaddy: Domain registration and domain management.",
            "Google: Calendar API services used to retrieve availability information.",
            "WhatsApp: External communication when visitors choose to send an appointment enquiry.",
            "Instagram, Telegram and other social platforms: External services accessed through links on the Website.",
          ],
        },
        "These providers may process information according to their own privacy policies and applicable terms.",
        "We do not sell or rent visitors’ personal information to third parties for advertising purposes.",
      ],
    },
    {
      title: "Cookies and Similar Technologies",
      blocks: [
        "The Website is designed to operate without analytics, advertising or behavioural tracking cookies.",
        "No Google Analytics or Meta Pixel is intentionally installed.",
        "Technical cookies or similar technologies may be used by infrastructure or security services if strictly necessary for the operation of the Website.",
        "Please refer to our Cookie Policy for further information.",
      ],
    },
    {
      title: "Data Retention",
      blocks: [
        "The Website does not retain appointment enquiry form submissions because the information entered is used locally to generate a WhatsApp message.",
        "Technical information processed by hosting and infrastructure providers may be retained according to their respective operational, security and retention policies.",
        "When visitors choose to communicate through WhatsApp or another external platform, the communication is subject to that platform’s own data retention and privacy practices.",
      ],
    },
    {
      title: "Your Privacy Rights",
      blocks: [
        "Under applicable data protection legislation, including the General Data Protection Regulation (GDPR), you may have the right to:",
        {
          list: [
            "Request access to your personal data;",
            "Request correction of inaccurate information;",
            "Request erasure of personal data;",
            "Request restriction of processing;",
            "Object to certain processing activities;",
            "Request data portability, where applicable;",
            "Lodge a complaint with a competent data protection authority.",
          ],
        },
        "To exercise these rights or ask a question about this Policy, please contact us using the details below.",
      ],
    },
    {
      title: "Data Protection Contact",
      blocks: [
        { lines: ["Data Controller: Gabrielle", "Technical Service Provider: Onda Solutions, Lda."] },
        contact,
        "Please identify your enquiry as a privacy or data protection request so it can be directed appropriately.",
      ],
    },
    {
      title: "Changes to This Policy",
      blocks: [
        "This Privacy Policy may be updated to reflect changes in the Website, its services, applicable legislation or data processing practices.",
        "The latest version will always be published on this page.",
      ],
    },
  ],
};

export const cookiePolicy: LegalPage = {
  title: "Cookie Policy",
  seoTitle: "Cookie Policy | Gabrielle",
  description: "How cookies and similar technologies may be used on Gabrielle's website.",
  path: "/cookie-policy",
  updated: "16 November 2026",
  sections: [
    {
      title: "Introduction",
      blocks: [
        "This Cookie Policy explains how cookies and similar technologies may be used on Gabrielle’s website.",
        "The Website is designed with privacy in mind and aims to minimise the use of tracking technologies.",
      ],
    },
    {
      title: "Cookies Used on This Website",
      blocks: [
        "At the time of publication, the Website does not intentionally use:",
        {
          list: [
            "Google Analytics cookies;",
            "Meta Pixel or advertising cookies;",
            "Behavioural advertising cookies;",
            "Third-party analytics cookies;",
            "Marketing or profiling cookies.",
          ],
        },
        "The Website does not intentionally use cookies to track visitors across other websites.",
      ],
    },
    {
      title: "Essential Technical Technologies",
      blocks: [
        "The Website may rely on strictly necessary technical technologies provided by its hosting or infrastructure services to ensure security, availability and proper operation.",
        "These technologies may include technical session identifiers, security mechanisms or infrastructure-related storage, where required.",
        "Such technologies are not used for advertising or behavioural profiling.",
        "If any cookies or similar technologies are introduced, their purposes and relevant details will be reflected in this Policy.",
      ],
    },
    {
      title: "External Services",
      blocks: [
        "The Website contains links to external platforms, including WhatsApp, Instagram and Telegram.",
        "When you choose to access these services, you leave the Website and become subject to the respective platform’s privacy and cookie policies.",
        "The appointment enquiry feature generates a pre-filled WhatsApp message locally in your browser. The Website does not store the message contents.",
        "Videos displayed on the Website are intended to be hosted directly on its own infrastructure rather than embedded from external video platforms.",
      ],
    },
    {
      title: "Analytics and Advertising",
      blocks: [
        "The Website does not currently use Google Analytics, Meta Pixel or other advertising and behavioural tracking tools.",
        "If such services are introduced in the future, this Policy will be updated and any legally required consent will be obtained before non-essential cookies or similar technologies are activated.",
      ],
    },
    {
      title: "Managing Cookies",
      blocks: [
        "You can manage or delete cookies through your browser settings.",
        "Please note that disabling strictly necessary technical technologies may affect the operation of certain website features.",
      ],
    },
    {
      title: "Contact",
      blocks: ["For questions about this Cookie Policy, please contact:", { lines: ["Gabrielle"] }, contact],
    },
  ],
};
