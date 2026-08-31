export type InquiryStatus = "New" | "Read" | "Closed";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  date: string;
};

export const inquiriesData: Inquiry[] = [
  {
    id: "inq-1",
    name: "James Wilson",
    email: "james@example.com",
    phone: "+1 202 555 0145",
    subject: "Consultation Request",
    message:
      "I would like to learn more about the LMCS framework and arrange a consultation.",
    status: "New",
    date: "Today, 09:42 AM",
  },
  {
    id: "inq-2",
    name: "Sarah Miller",
    email: "sarah@example.com",
    phone: "+1 202 555 0188",
    subject: "Website Inquiry",
    message:
      "Could you provide more information about your executive advisory services?",
    status: "Read",
    date: "Yesterday",
  },
  {
    id: "inq-3",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 202 555 0132",
    subject: "General Question",
    message: "I have a question regarding your services.",
    status: "Closed",
    date: "Aug 22, 2026",
  },
  {
    id: "inq-4",
    name: "Emily Carter",
    email: "emily.carter@example.com",
    phone: "+1 202 555 0117",
    subject: "Partnership Opportunity",
    message:
      "Our firm is interested in exploring a partnership with LMCS for joint advisory engagements.",
    status: "New",
    date: "Aug 29, 2026",
  },
  {
    id: "inq-5",
    name: "David Thompson",
    email: "d.thompson@example.com",
    phone: "+1 202 555 0166",
    subject: "ATLAS Framework Demo",
    message:
      "Is it possible to schedule a demo of the ATLAS assessment framework for our leadership team?",
    status: "New",
    date: "Aug 28, 2026",
  },
  {
    id: "inq-6",
    name: "Laura Chen",
    email: "laura.chen@example.com",
    phone: "+1 202 555 0198",
    subject: "Speaking Engagement",
    message:
      "We'd like to invite a member of your team to speak at our upcoming operations summit.",
    status: "Read",
    date: "Aug 27, 2026",
  },
  {
    id: "inq-7",
    name: "Robert Kim",
    email: "robert.kim@example.com",
    phone: "+1 202 555 0121",
    subject: "Pricing Question",
    message:
      "Could you send over pricing information for the Delivery Confidence engagement track?",
    status: "Closed",
    date: "Aug 25, 2026",
  },
  {
    id: "inq-8",
    name: "Nina Patel",
    email: "nina.patel@example.com",
    phone: "+1 202 555 0154",
    subject: "Media Request",
    message:
      "I'm writing a feature on organizational resilience and would like a brief interview.",
    status: "New",
    date: "Aug 24, 2026",
  },
  {
    id: "inq-9",
    name: "Thomas Reyes",
    email: "t.reyes@example.com",
    phone: "+1 202 555 0177",
    subject: "Technical Support",
    message:
      "I'm having trouble accessing the client portal — could someone assist?",
    status: "Read",
    date: "Aug 23, 2026",
  },
  {
    id: "inq-10",
    name: "Olivia Bennett",
    email: "olivia.b@example.com",
    phone: "+1 202 555 0109",
    subject: "Case Study Request",
    message:
      "Are there published case studies available on Project Drift outcomes?",
    status: "Closed",
    date: "Aug 20, 2026",
  },
];

export async function fetchInquiries(): Promise<Inquiry[]> {
  await new Promise((r) => setTimeout(r, 600));
  return inquiriesData;
}

export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<{ success: boolean; message: string }> {
  await new Promise((r) => setTimeout(r, 400));
  return {
    success: true,
    message: `Inquiry marked as ${status.toLowerCase()}.`,
  };
}
