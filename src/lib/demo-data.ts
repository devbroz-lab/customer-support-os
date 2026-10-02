export type CaseStatus = "New" | "Open" | "Waiting" | "Escalated" | "Resolved";
export type Priority = "Low" | "Normal" | "High" | "Urgent";

export interface SupportCase {
  id: string;
  customer: { name: string; email: string; initials: string; tier: "Premier" | "Standard"; account: string; location: string };
  subject: string;
  preview: string;
  channel: "Email" | "Chat" | "Web";
  status: CaseStatus;
  priority: Priority;
  assignee: string | null;
  category: string;
  receivedAt: string;
  sla: "On track" | "Due soon" | "At risk" | "Breached";
  slaMinutes: number;
  aiConfidence: number;
  messages: Array<{ from: "customer" | "support"; name: string; time: string; body: string }>;
  draft: string;
  audit: Array<{ label: string; actor: string; time: string; detail?: string }>;
}

export const demoCases: SupportCase[] = [
  {
    id: "CS-2481", customer: { name: "Aisha Rahman", email: "aisha.rahman@email.com", initials: "AR", tier: "Premier", account: "LN-48291", location: "Mumbai, IN" },
    subject: "EMI payment marked overdue despite successful transfer", preview: "My payment was completed yesterday, but the app still shows an overdue balance.", channel: "Email", status: "Open", priority: "Urgent", assignee: "Maya Chen", category: "Payment dispute", receivedAt: "12 min ago", sla: "At risk", slaMinutes: 18, aiConfidence: 92,
    messages: [
      { from: "customer", name: "Aisha Rahman", time: "Today, 10:18 AM", body: "Hello team, I completed my EMI payment of Rs. 8,450 yesterday through UPI. The amount has left my account, but the app is still showing an overdue balance and I received a reminder. Please resolve this urgently." },
      { from: "support", name: "SupportOS AI", time: "Today, 10:20 AM", body: "We are looking into your payment status and will update you shortly." },
      { from: "customer", name: "Aisha Rahman", time: "Today, 10:31 AM", body: "I have attached the transaction reference. I am concerned this may affect my credit record." },
    ],
    draft: "Hi Aisha,\n\nThank you for sharing the transaction reference. We have verified your UPI payment of Rs. 8,450 and confirmed it is currently pending reconciliation on our side.\n\nYour account will not be reported as overdue while we complete this update. We expect the payment status to refresh within 24 hours and will notify you as soon as it is reflected.\n\nRegards,\nDevbroz Support Team",
    audit: [{ label: "Case created", actor: "Automation", time: "10:18 AM" }, { label: "Payment evidence verified", actor: "SupportOS AI", time: "10:20 AM" }, { label: "Assigned to Maya Chen", actor: "Routing", time: "10:21 AM" }],
  },
  {
    id: "CS-2480", customer: { name: "Daniel Brooks", email: "daniel.brooks@email.com", initials: "DB", tier: "Standard", account: "AC-73018", location: "Bengaluru, IN" },
    subject: "Update registered mobile number", preview: "I no longer have access to my old number and need to update it.", channel: "Web", status: "New", priority: "High", assignee: null, category: "Account access", receivedAt: "28 min ago", sla: "Due soon", slaMinutes: 46, aiConfidence: 88,
    messages: [{ from: "customer", name: "Daniel Brooks", time: "Today, 10:02 AM", body: "I no longer have access to my old mobile number. Please let me know how I can update it securely." }],
    draft: "Hi Daniel,\n\nWe can help you update your registered mobile number. For your security, please reply with a suitable time for a verification call.\n\nRegards,\nDevbroz Support Team", audit: [{ label: "Case created", actor: "Automation", time: "10:02 AM" }],
  },
  {
    id: "CS-2479", customer: { name: "Priya Nair", email: "priya.nair@email.com", initials: "PN", tier: "Premier", account: "LN-10933", location: "Kochi, IN" },
    subject: "Requesting statement for loan closure", preview: "Could you share the final closure statement for my records?", channel: "Email", status: "Waiting", priority: "Normal", assignee: "Jordan Lee", category: "Loan closure", receivedAt: "1 hr ago", sla: "On track", slaMinutes: 184, aiConfidence: 96,
    messages: [{ from: "customer", name: "Priya Nair", time: "Today, 9:18 AM", body: "Could you please share the final closure statement for my loan? I need it for my records." }, { from: "support", name: "Jordan Lee", time: "Today, 9:34 AM", body: "We have requested the statement from our lending operations team and will send it once available." }],
    draft: "Hi Priya,\n\nYour closure statement has been requested from our lending operations team. We will share it with you within two business days.\n\nRegards,\nDevbroz Support Team", audit: [{ label: "Case created", actor: "Automation", time: "9:18 AM" }, { label: "Reply sent", actor: "Jordan Lee", time: "9:34 AM" }],
  },
  {
    id: "CS-2478", customer: { name: "Rohan Kapoor", email: "rohan.kapoor@email.com", initials: "RK", tier: "Standard", account: "AC-33502", location: "Delhi, IN" },
    subject: "Duplicate charge on recent transaction", preview: "I can see the same transaction twice in my account history.", channel: "Chat", status: "Escalated", priority: "High", assignee: "Payments Team", category: "Payment dispute", receivedAt: "2 hrs ago", sla: "On track", slaMinutes: 95, aiConfidence: 76,
    messages: [{ from: "customer", name: "Rohan Kapoor", time: "Today, 8:18 AM", body: "I can see the same charge twice in my account history. Please investigate." }],
    draft: "Hi Rohan,\n\nWe are investigating the duplicate transaction with our payments team. We will share a confirmed update within one business day.\n\nRegards,\nDevbroz Support Team", audit: [{ label: "Case escalated", actor: "SupportOS AI", time: "8:25 AM", detail: "Duplicate charge requires ledger review" }],
  },
  {
    id: "CS-2477", customer: { name: "Elena Torres", email: "elena.torres@email.com", initials: "ET", tier: "Standard", account: "AC-91084", location: "Pune, IN" },
    subject: "Unable to download tax certificate", preview: "The document page keeps returning an error when I try to download.", channel: "Web", status: "Resolved", priority: "Low", assignee: "Maya Chen", category: "Documents", receivedAt: "Yesterday", sla: "On track", slaMinutes: 0, aiConfidence: 94,
    messages: [{ from: "customer", name: "Elena Torres", time: "Yesterday, 3:09 PM", body: "I cannot download my tax certificate from the portal." }],
    draft: "Hi Elena,\n\nThe issue has been resolved. You can now download your tax certificate from the Documents section of your account.\n\nRegards,\nDevbroz Support Team", audit: [{ label: "Case resolved", actor: "Maya Chen", time: "Yesterday, 3:46 PM" }],
  },
];

export const team = ["Maya Chen", "Jordan Lee", "Alex Morgan", "Payments Team"];

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  team: string;
  availability: "Available" | "In review" | "Away";
  quality: string;
  resolved: number;
  firstResponse: string;
  slaCompliance: string;
  csat: string;
  aiAcceptance: string;
  trend: number[];
  specialties: string[];
  strengths: string[];
  coaching: string;
}

export const teamMembers: TeamMember[] = [
  { id: "maya-chen", name: "Maya Chen", initials: "MC", role: "Senior Support Reviewer", team: "Customer Operations", availability: "Available", quality: "98.4%", resolved: 164, firstResponse: "9m 12s", slaCompliance: "99.1%", csat: "4.9 / 5", aiAcceptance: "86%", trend: [18, 24, 21, 31, 28, 34, 30], specialties: ["Payment disputes", "Escalation review", "Loan servicing"], strengths: ["Exceptional policy adherence", "Fast, high-quality decisions", "Strong customer recovery outcomes"], coaching: "Continue sharing payment-dispute playbooks with the wider review team." },
  { id: "jordan-lee", name: "Jordan Lee", initials: "JL", role: "Customer Support Specialist", team: "Customer Operations", availability: "In review", quality: "97.9%", resolved: 148, firstResponse: "11m 06s", slaCompliance: "97.6%", csat: "4.8 / 5", aiAcceptance: "82%", trend: [16, 22, 25, 27, 23, 29, 31], specialties: ["Account access", "Documents", "Loan closure"], strengths: ["Clear customer communication", "Consistent SLA ownership", "Strong documentation quality"], coaching: "Build confidence escalating complex transaction exceptions earlier." },
  { id: "alex-morgan", name: "Alex Morgan", initials: "AM", role: "Customer Support Specialist", team: "Customer Operations", availability: "Available", quality: "96.7%", resolved: 126, firstResponse: "13m 45s", slaCompliance: "95.4%", csat: "4.7 / 5", aiAcceptance: "78%", trend: [14, 17, 20, 19, 25, 22, 26], specialties: ["Customer onboarding", "Profile updates", "General service"], strengths: ["High-volume case handling", "Warm customer tone", "Reliable follow-through"], coaching: "Review AI evidence before responding to reduce clarification follow-ups." },
];
