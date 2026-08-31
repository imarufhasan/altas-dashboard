export type LegalStatus = "Published" | "Draft";

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  content: string;
  status: LegalStatus;
  version: string;
  effectiveDate?: string;
  updatedAt: string;
};

export const legalData: LegalDoc[] = [
  {
    slug: "privacy-notice",
    title: "Privacy Notice",
    description:
      "How LMCS collects, uses, and safeguards personal information.",
    content:
      "This Privacy Notice explains what personal information Leadership Mission Critical Solutions collects, how it is used, who it may be shared with, and the choices available to you regarding your data. It applies to all visitors and clients interacting with our website and services.",
    status: "Published",
    version: "v2.1",
    effectiveDate: "2026-07-01",
    updatedAt: "Aug 20, 2026",
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    description: "The terms governing access to and use of the LMCS website.",
    content:
      "By accessing this website you agree to be bound by these Terms of Use. These terms cover permitted use, intellectual property rights, disclaimers of warranty, limitation of liability, and the governing law that applies to any dispute arising from your use of this site.",
    status: "Published",
    version: "v1.8",
    effectiveDate: "2026-06-15",
    updatedAt: "Aug 18, 2026",
  },
  {
    slug: "cookie-notice",
    title: "Cookie / Analytics Notice",
    description:
      "Details on cookies, tracking technologies, and analytics tools in use.",
    content:
      "We use cookies and similar tracking technologies to operate our website, understand usage patterns, and improve performance. This notice explains the categories of cookies we use, the analytics providers involved, and how you can manage your preferences.",
    status: "Published",
    version: "v1.3",
    effectiveDate: "2026-05-01",
    updatedAt: "Aug 15, 2026",
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    description:
      "Our commitment to digital accessibility and current conformance status.",
    content:
      "Leadership Mission Critical Solutions is committed to ensuring digital accessibility for people of all abilities. We continually improve the user experience for everyone and apply relevant accessibility standards. This statement outlines our current conformance status and how to report accessibility issues.",
    status: "Draft",
    version: "v1.0",
    updatedAt: "Aug 12, 2026",
  },
  {
    slug: "contact-notice",
    title: "Legal / Contact Notice",
    description:
      "Official legal entity details and how to reach us regarding legal matters.",
    content:
      "This notice provides the official legal entity information for Leadership Mission Critical Solutions, including registered address, contact details for legal correspondence, and the appropriate channels for regulatory or compliance inquiries.",
    status: "Published",
    version: "v1.4",
    effectiveDate: "2026-04-10",
    updatedAt: "Aug 10, 2026",
  },
];

export function getLegalDocBySlug(slug: string) {
  return legalData.find((doc) => doc.slug === slug);
}
