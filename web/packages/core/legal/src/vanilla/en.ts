import type { LegalSnippet, LegalTemplate } from "../types";

export const vanillaSnippetsEn: Record<string, LegalSnippet> = {
  "terms.introduction": {
    id: "terms.introduction",
    blocks: [
      {
        type: "paragraph",
        text: "Welcome to {{SERVICE_NAME}} (\"we\", \"us\", \"our\").",
      },
      {
        type: "paragraph",
        text:
          "Please read these Terms of Service (\"Terms\") carefully before using the {{SERVICE_NAME}} website, applications, and related services (collectively, the \"Service\").",
      },
      {
        type: "paragraph",
        text:
          "By accessing or using the Service you agree to be bound by these Terms and our [Privacy Policy](/privacy). If you do not agree, do not access or use the Service.",
      },
    ],
  },
  "terms.definitions": {
    id: "terms.definitions",
    blocks: [
      {
        id: "terms-definitions",
        type: "table",
        headers: ["Term", "Meaning"],
        rows: [
          ["Account", "The user profile created to access the Service."],
          ["Content", "Data, text, images, feedback, or other materials submitted through the Service."],
          ["Subscription", "A paid plan granting time-limited access to premium features."],
        ],
      },
    ],
  },
  "terms.eligibility": {
    id: "terms.eligibility",
    blocks: [
      {
        type: "paragraph",
        text:
          "You must be at least 18 years old (or the age of majority in your jurisdiction) and have the authority to enter into these Terms on behalf of yourself or an organisation.",
      },
    ],
  },
  "terms.account": {
    id: "terms.account",
    blocks: [
      {
        type: "list",
        items: [
          "Provide accurate information and keep it updated.",
          "Keep credentials confidential; you are responsible for all activity under your Account.",
          "We may suspend or terminate Accounts that breach these Terms.",
        ],
      },
    ],
  },
  "terms.service": {
    id: "terms.service",
    blocks: [
      {
        type: "list",
        items: [
          "{{SERVICE_DESCRIPTION}}",
          "We may modify or discontinue features at any time with reasonable notice.",
        ],
      },
    ],
  },
  "terms.fees": {
    id: "terms.fees",
    blocks: [
      {
        type: "list",
        items: [
          "Certain features may require a Subscription billed in advance on a recurring basis (for example, monthly or annually).",
          "Prices are shown inclusive of VAT where applicable.",
          "Payments are processed by {{PAYMENTS_PROVIDER}}; we do not store full card details.",
          "Subscriptions auto-renew unless cancelled before the end of the current billing period.",
          "You may cancel at any time; no refunds for partial periods unless required by law.",
        ],
      },
    ],
  },
  "terms.acceptableUse": {
    id: "terms.acceptableUse",
    blocks: [
      {
        type: "paragraph",
        text: "You agree not to:",
      },
      {
        type: "list",
        items: [
          "Upload unlawful, harmful, or infringing Content.",
          "Attempt to disrupt or reverse-engineer the Service.",
          "Use the Service to store or transmit personal data without a lawful basis.",
          "Misrepresent your affiliation or impersonate others.",
        ],
      },
      {
        type: "paragraph",
        text: "We reserve the right to remove Content or suspend Accounts that breach this section.",
      },
    ],
  },
  "terms.intellectualProperty": {
    id: "terms.intellectualProperty",
    blocks: [
      {
        type: "list",
        items: [
          "Ownership: The Service and all software, trademarks, and content (excluding user Content) are our property or that of our licensors.",
          "Licence: We grant you a non-exclusive, non-transferable right to use the Service during the Subscription term.",
          "User Content: You retain all rights to Content you upload. You grant us a worldwide licence to host and process it for the purpose of operating the Service.",
        ],
      },
    ],
  },
  "terms.thirdParties": {
    id: "terms.thirdParties",
    blocks: [
      {
        type: "paragraph",
        text:
          "The Service may integrate third-party tools (for example, analytics or payment processors). Use of those services is subject to their separate terms and privacy practices.",
      },
    ],
  },
  "terms.termination": {
    id: "terms.termination",
    blocks: [
      {
        type: "list",
        items: [
          "You may terminate your Subscription via the dashboard or by contacting support.",
          "We may terminate or suspend the Service (with reasonable notice) if you breach these Terms or fail to pay fees.",
          "Upon termination, your right to use the Service stops immediately and we may delete your Content after 30 days.",
        ],
      },
    ],
  },
  "terms.disclaimers": {
    id: "terms.disclaimers",
    blocks: [
      {
        type: "paragraph",
        text: "The Service is provided \"as is\" and \"as available\" without warranties of any kind, express or implied.",
      },
      {
        type: "paragraph",
        text:
          "We do not guarantee that the Service will be uninterrupted, error-free, or meet your specific requirements.",
      },
    ],
  },
  "terms.liability": {
    id: "terms.liability",
    blocks: [
      {
        type: "paragraph",
        text: "To the maximum extent permitted by law:",
      },
      {
        type: "list",
        items: [
          "Our total liability for any claim arising out of these Terms will not exceed the total fees paid by you in the 12 months preceding the claim.",
          "We are not liable for indirect, incidental, special, consequential, or punitive damages.",
        ],
      },
      {
        type: "paragraph",
        text:
          "Nothing in these Terms limits liability for gross negligence, wilful misconduct, or where limitation is prohibited by applicable law (for example, consumer rights).",
      },
    ],
  },
  "terms.indemnification": {
    id: "terms.indemnification",
    blocks: [
      {
        type: "paragraph",
        text:
          "You agree to indemnify and hold us harmless from any claims arising out of your breach of these Terms or misuse of the Service.",
      },
    ],
  },
  "terms.governingLaw": {
    id: "terms.governingLaw",
    blocks: [
      {
        type: "list",
        items: [
          "These Terms are governed by the laws of {{GOVERNING_LAW}} without regard to conflict-of-law principles.",
          "Any dispute shall be submitted to the exclusive jurisdiction of the courts of {{GOVERNING_VENUE}}.",
          "Consumers in the EU may also apply to the EU Online Dispute Resolution platform.",
        ],
      },
    ],
  },
  "terms.changes": {
    id: "terms.changes",
    blocks: [
      {
        type: "paragraph",
        text:
          "We may update these Terms occasionally. Material changes will be announced 14 days in advance via email or in-app notice. Continued use after the effective date constitutes acceptance.",
      },
    ],
  },
  "terms.contact": {
    id: "terms.contact",
    blocks: [
      {
        type: "paragraph",
        text: "Questions? Reach us via the [contact form]({{CONTACT_URL}}).",
      },
    ],
  },
  "privacy.whoWeAre": {
    id: "privacy.whoWeAre",
    blocks: [
      {
        type: "paragraph",
        text:
          "For the purposes of the EU General Data Protection Regulation (GDPR) and applicable local data protection laws, {{COMPANY_NAME}} ({{SERVICE_NAME}}, \"we\", \"our\", or \"us\") is the data controller for the processing activities described in this policy.",
      },
      {
        type: "note",
        text: "Contact: [contact form]({{CONTACT_URL}})\nAddress: {{COMPANY_ADDRESS}}",
      },
    ],
  },
  "privacy.dataWeCollect": {
    id: "privacy.dataWeCollect",
    blocks: [
      {
        id: "privacy-data-collection",
        type: "table",
        headers: ["Category", "Examples", "Purpose", "Legal basis"],
        rows: [],
      },
      {
        type: "paragraph",
        text: "We do not intentionally collect names, phone numbers, or precise locations from end-user actions.",
      },
    ],
  },
  "privacy.dataWeCollect.service": {
    id: "privacy.dataWeCollect.service",
    tableRows: {
      tableId: "privacy-data-collection",
      rows: [
        [
          "{{SERVICE_DATA_CATEGORY}}",
          "{{SERVICE_DATA_EXAMPLES}}",
          "Deliver core service functionality",
          "Art. 6(1)(b) - Performance of a contract",
        ],
      ],
    },
  },
  "privacy.dataWeCollect.payments": {
    id: "privacy.dataWeCollect.payments",
    tableRows: {
      tableId: "privacy-data-collection",
      rows: [
        [
          "Payment Data (via {{PAYMENTS_PROVIDER}})",
          "Card token, last 4 digits, billing address, VAT ID",
          "Process subscription payments and comply with tax law",
          "Art. 6(1)(b) - Contract and Art. 6(1)(c) - Legal obligation",
        ],
      ],
    },
  },
  "privacy.dataWeCollect.usage": {
    id: "privacy.dataWeCollect.usage",
    tableRows: {
      tableId: "privacy-data-collection",
      rows: [
        [
          "Device and Usage Data",
          "Browser UA string, OS, IP (truncated), pages visited",
          "Service security, debugging, aggregated metrics",
          "Art. 6(1)(f) - Legitimate interests",
        ],
      ],
    },
  },
  "privacy.dataWeCollect.email": {
    id: "privacy.dataWeCollect.email",
    tableRows: {
      tableId: "privacy-data-collection",
      rows: [
        [
          "Email (optional)",
          "Address you enter in a newsletter or contact form",
          "Send product updates and respond to requests",
          "Art. 6(1)(a) - Consent",
        ],
      ],
    },
  },
  "privacy.dataWeCollect.cookies": {
    id: "privacy.dataWeCollect.cookies",
    tableRows: {
      tableId: "privacy-data-collection",
      rows: [
        [
          "Cookies",
          "__session, __clerk*, __stripe*",
          "Session management, security, and preferences",
          "Art. 6(1)(f) or Art. 6(1)(a) depending on category",
        ],
      ],
    },
  },
  "privacy.useOfData": {
    id: "privacy.useOfData",
    blocks: [
      {
        type: "list",
        items: [
          "Deliver core functionality - {{SERVICE_DESCRIPTION}}",
          "Process payments and invoices through {{PAYMENTS_PROVIDER}}.",
          "Improve the product with aggregated usage trends.",
          "Maintain security and prevent abuse.",
          "Send marketing communications only if you opt in.",
        ],
      },
      {
        type: "paragraph",
        text:
          "We do not sell personal data. We share it only with our processors and, where you opt in, limited analytics or advertising partners—never for their own resale.",
      },
    ],
  },
  "privacy.subprocessors": {
    id: "privacy.subprocessors",
    blocks: [
      {
        id: "privacy-subprocessors",
        type: "table",
        headers: ["Service", "Purpose", "Region", "Safeguard"],
        rows: [],
      },
      {
        type: "paragraph",
        text:
          "We primarily store and process data in {{DATA_REGION_PRIMARY}}. Some providers may process or back up data outside that region (for example {{DATA_REGION_BACKUP}}); when they do, we rely on safeguards such as Standard Contractual Clauses (SCCs) or an adequacy decision (GDPR Art. 45-46).",
      },
    ],
  },
  "privacy.subprocessors.auth": {
    id: "privacy.subprocessors.auth",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Authentication provider (e.g. Clerk)", "User authentication and accounts", "{{DATA_REGION_PRIMARY}}", "DPA + SCCs"]],
    },
  },
  "privacy.subprocessors.payments": {
    id: "privacy.subprocessors.payments",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [
        [
          "{{PAYMENTS_PROVIDER}}",
          "Subscription and payment processing",
          "{{DATA_REGION_PRIMARY}} (primary), {{DATA_REGION_BACKUP}} (backup)",
          "DPA + SCCs + PSD2 compliance",
        ],
      ],
    },
  },
  "privacy.subprocessors.hosting": {
    id: "privacy.subprocessors.hosting",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Web hosting provider (e.g. Vercel)", "Web and edge hosting", "{{DATA_REGION_PRIMARY}}", "DPA + SCCs"]],
    },
  },
  "privacy.subprocessors.db": {
    id: "privacy.subprocessors.db",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Database provider (e.g. Neon)", "Database", "{{DATA_REGION_PRIMARY}}", "DPA + SCCs"]],
    },
  },
  "privacy.subprocessors.email": {
    id: "privacy.subprocessors.email",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Email provider (e.g. Resend)", "Transactional and promotional emails", "{{DATA_REGION_PRIMARY}}", "DPA + SCCs"]],
    },
  },
  "privacy.subprocessors.analytics": {
    id: "privacy.subprocessors.analytics",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Analytics provider (e.g. Umami)", "Privacy-friendly statistics", "{{DATA_REGION_PRIMARY}}", "No cookies or personal data"]],
    },
  },
  "privacy.subprocessors.googleAds": {
    id: "privacy.subprocessors.googleAds",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Google Ireland", "Google Ads (if enabled)", "{{DATA_REGION_PRIMARY}}", "DPA + SCCs"]],
    },
  },
  "privacy.subprocessors.meta": {
    id: "privacy.subprocessors.meta",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["Meta Platforms Ireland", "Meta Pixel (if enabled)", "{{DATA_REGION_PRIMARY}}", "DPA + SCCs"]],
    },
  },
  "privacy.subprocessors.linkedin": {
    id: "privacy.subprocessors.linkedin",
    tableRows: {
      tableId: "privacy-subprocessors",
      rows: [["LinkedIn Ireland", "Insight Tag (if enabled)", "{{DATA_REGION_PRIMARY}}", "DPA + SCCs"]],
    },
  },
  "privacy.retention": {
    id: "privacy.retention",
    blocks: [
      {
        id: "privacy-retention",
        type: "table",
        headers: ["Data type", "Retention period"],
        rows: [],
      },
    ],
  },
  "privacy.retention.service": {
    id: "privacy.retention.service",
    tableRows: {
      tableId: "privacy-retention",
      rows: [["{{SERVICE_DATA_TYPE}}", "{{SERVICE_DATA_TYPE_DESCRIPTION}}"]],
    },
  },
  "privacy.retention.newsletter": {
    id: "privacy.retention.newsletter",
    tableRows: {
      tableId: "privacy-retention",
      rows: [["Newsletter email addresses", "Until you unsubscribe"]],
    },
  },
  "privacy.retention.logs": {
    id: "privacy.retention.logs",
    tableRows: {
      tableId: "privacy-retention",
      rows: [["Error logs", "30 days"]],
    },
  },
  "privacy.retention.analytics": {
    id: "privacy.retention.analytics",
    tableRows: {
      tableId: "privacy-retention",
      rows: [["Analytics session ID", "Stored in browser storage; not server-side identifiable"]],
    },
  },
  "privacy.rights": {
    id: "privacy.rights",
    blocks: [
      {
        type: "list",
        items: [
          "Access your personal data",
          "Rectify inaccurate data",
          "Erase data (right to be forgotten)",
          "Restrict or object to processing",
          "Data portability",
          "Withdraw consent at any time (newsletters, non-essential cookies)",
        ],
      },
      {
        type: "note",
        text: "How to exercise: Send a request via the [contact form]({{CONTACT_URL}}). We respond within 30 days.",
      },
      {
        type: "paragraph",
        text:
          "If you believe your rights are violated, you may lodge a complaint with your local supervisory authority.",
      },
    ],
  },
  "privacy.security": {
    id: "privacy.security",
    blocks: [
      {
        type: "list",
        items: [
          "Data at rest: industry-standard encryption such as AES-256.",
          "Data in transit: TLS 1.3 encryption.",
          "Secure processing: secure coding practices and access controls aligned with OWASP Top 10.",
        ],
      },
    ],
  },
  "privacy.cookies": {
    id: "privacy.cookies",
    blocks: [
      {
        type: "paragraph",
        text:
          "We use cookies and similar technologies for essential site functions, analytics and, with your permission, personalised advertising. Details and your current choices are explained in our [Cookie Policy](/cookies).",
      },
    ],
  },
  "privacy.changes": {
    id: "privacy.changes",
    blocks: [
      {
        type: "paragraph",
        text:
          "We will update this document when we introduce new processing activities or change sub-processors. Material changes will be announced 14 days in advance via in-app notice and/or email.",
      },
    ],
  },
  "privacy.contact": {
    id: "privacy.contact",
    blocks: [
      {
        type: "paragraph",
        text: "Questions or concerns? Send a request via the [contact form]({{CONTACT_URL}}).",
      },
    ],
  },
  "cookies.introduction": {
    id: "cookies.introduction",
    blocks: [
      {
        type: "paragraph",
        text:
          "This Cookie Policy explains how {{SERVICE_NAME}} (\"we\", \"us\") uses cookies and similar technologies when you visit our websites and apps (the \"Service\").",
      },
      {
        type: "paragraph",
        text: "It should be read together with our [Privacy Policy](/privacy).",
      },
    ],
  },
  "cookies.definition": {
    id: "cookies.definition",
    blocks: [
      {
        type: "paragraph",
        text:
          "Cookies are small text files stored on your device. They enable core site functionality, help us understand usage patterns, allow social features, and show relevant ads.",
      },
    ],
  },
  "cookies.usage": {
    id: "cookies.usage",
    blocks: [
      {
        id: "cookies-categories",
        type: "table",
        headers: ["Category", "Typical cookie names", "Purpose", "Consent?", "Lifetime"],
        rows: [],
      },
      {
        type: "note",
        text: "Exact lifetimes may vary by provider.",
      },
    ],
  },
  "cookies.usage.strict": {
    id: "cookies.usage.strict",
    tableRows: {
      tableId: "cookies-categories",
      rows: [
        [
          "Strictly necessary",
          "__client*, __clerk*, clerk*, __session, __stripe*, __refresh*",
          "Login, security, load-balancing, payments",
          "Not required",
          "1 year",
        ],
      ],
    },
  },
  "cookies.usage.preferences": {
    id: "cookies.usage.preferences",
    tableRows: {
      tableId: "cookies-categories",
      rows: [["Preferences", "cookie_preferences, theme, locale", "Remember UI and cookie choices", "Yes", "1 year"]],
    },
  },
  "cookies.usage.advertising": {
    id: "cookies.usage.advertising",
    tableRows: {
      tableId: "cookies-categories",
      rows: [["Advertising", "_gads, _gcl_au, _fbp", "Personalised ads", "Yes", "3-24 months"]],
    },
  },
  "cookies.usage.social": {
    id: "cookies.usage.social",
    tableRows: {
      tableId: "cookies-categories",
      rows: [["Social / pixels", "bcookie, li_gc, fr", "Measure social campaigns", "Yes", "3-12 months"]],
    },
  },
  "cookies.choices": {
    id: "cookies.choices",
    blocks: [
      {
        type: "list",
        items: [
          "First visit - we load only Strictly Necessary cookies.",
          "Change your mind anytime - use the Cookie Policy link in the footer to update preferences or withdraw consent.",
          "Browser controls - you can delete or block cookies via your browser settings (Chrome, Firefox, Safari).",
        ],
      },
    ],
  },
  "cookies.thirdParty": {
    id: "cookies.thirdParty",
    blocks: [
      {
        type: "paragraph",
        text: "We use trusted providers; they only run after you opt in to their category.",
      },
      {
        id: "cookies-third-party",
        type: "table",
        headers: ["Provider", "Service", "Region", "Safeguard"],
        rows: [],
      },
    ],
  },
  "cookies.thirdParty.googleAds": {
    id: "cookies.thirdParty.googleAds",
    tableRows: {
      tableId: "cookies-third-party",
      rows: [["Google Ireland", "Google Ads (Consent Mode v2)", "EU primary, US backup", "SCCs"]],
    },
  },
  "cookies.thirdParty.meta": {
    id: "cookies.thirdParty.meta",
    tableRows: {
      tableId: "cookies-third-party",
      rows: [["Meta Platforms Ireland", "Meta Pixel (if enabled)", "EU", "SCCs"]],
    },
  },
  "cookies.thirdParty.linkedin": {
    id: "cookies.thirdParty.linkedin",
    tableRows: {
      tableId: "cookies-third-party",
      rows: [["LinkedIn Ireland", "Insight Tag (if enabled)", "EU", "SCCs"]],
    },
  },
  "cookies.thirdParty.payments": {
    id: "cookies.thirdParty.payments",
    tableRows: {
      tableId: "cookies-third-party",
      rows: [
        ["{{PAYMENTS_PROVIDER}}", "Payment session cookies", "{{DATA_REGION_PRIMARY}} primary, {{DATA_REGION_BACKUP}} backup", "PSD2, SCCs"],
      ],
    },
  },
  "cookies.retention": {
    id: "cookies.retention",
    blocks: [
      {
        type: "paragraph",
        text: "Cookie lifetimes are listed on this page.",
      },
    ],
  },
  "cookies.updates": {
    id: "cookies.updates",
    blocks: [
      {
        type: "paragraph",
        text: "We may revise this policy to reflect changes in cookies, providers, or legislation.",
      },
    ],
  },
  "cookies.contact": {
    id: "cookies.contact",
    blocks: [
      {
        type: "paragraph",
        text: "Questions? Reach us via the [contact form]({{CONTACT_URL}}).",
      },
    ],
  },
};

export const vanillaTemplatesEn: Record<string, LegalTemplate> = {
  terms: {
    slug: "terms",
    title: "Terms of Service",
    summary: "Please read these Terms of Service carefully before using {{SERVICE_NAME}}.",
    sections: [
      { id: "introduction", title: "Introduction", snippetIds: ["terms.introduction"] },
      { id: "definitions", title: "1. Definitions", snippetIds: ["terms.definitions"] },
      { id: "eligibility", title: "2. Eligibility", snippetIds: ["terms.eligibility"] },
      { id: "account-registration", title: "3. Account Registration", snippetIds: ["terms.account"] },
      { id: "service", title: "4. The Service", snippetIds: ["terms.service"] },
      { id: "fees", title: "5. Fees and Payment", snippetIds: ["terms.fees"] },
      { id: "acceptable-use", title: "6. Acceptable Use", snippetIds: ["terms.acceptableUse"] },
      { id: "intellectual-property", title: "7. Intellectual Property", snippetIds: ["terms.intellectualProperty"] },
      { id: "third-parties", title: "8. Third-Party Services", snippetIds: ["terms.thirdParties"] },
      { id: "termination", title: "9. Termination", snippetIds: ["terms.termination"] },
      { id: "disclaimers", title: "10. Disclaimers", snippetIds: ["terms.disclaimers"] },
      { id: "liability", title: "11. Limitation of Liability", snippetIds: ["terms.liability"] },
      { id: "indemnification", title: "12. Indemnification", snippetIds: ["terms.indemnification"] },
      { id: "governing-law", title: "13. Governing Law and Dispute Resolution", snippetIds: ["terms.governingLaw"] },
      { id: "changes", title: "14. Changes to Terms", snippetIds: ["terms.changes"] },
      { id: "contact", title: "15. Contact", snippetIds: ["terms.contact"] },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "How {{SERVICE_NAME}} collects, uses, and protects your data.",
    sections: [
      { id: "who-we-are", title: "1. Who we are", snippetIds: ["privacy.whoWeAre"] },
      { id: "data-we-collect", title: "2. What data we collect", snippetIds: ["privacy.dataWeCollect"] },
      { id: "use-of-data", title: "3. How we use your data", snippetIds: ["privacy.useOfData"] },
      { id: "subprocessors", title: "4. Sub-processors and data location", snippetIds: ["privacy.subprocessors"] },
      { id: "retention", title: "5. Data retention", snippetIds: ["privacy.retention"] },
      { id: "rights", title: "6. Your rights (GDPR Art. 12-23)", snippetIds: ["privacy.rights"] },
      { id: "security", title: "7. Security", snippetIds: ["privacy.security"] },
      { id: "cookies", title: "8. Cookies and similar technologies", snippetIds: ["privacy.cookies"] },
      { id: "changes", title: "9. Changes to this policy", snippetIds: ["privacy.changes"] },
      { id: "contact", title: "10. Contact us", snippetIds: ["privacy.contact"] },
    ],
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    summary: "How {{SERVICE_NAME}} uses cookies and similar technologies.",
    sections: [
      { id: "introduction", title: "Introduction", snippetIds: ["cookies.introduction"] },
      { id: "what-are-cookies", title: "1. What are cookies?", snippetIds: ["cookies.definition"] },
      { id: "how-we-use", title: "2. How we use cookies", snippetIds: ["cookies.usage"] },
      { id: "choices", title: "3. Managing your choices", snippetIds: ["cookies.choices"] },
      { id: "third-party", title: "4. Third-party cookies", snippetIds: ["cookies.thirdParty"] },
      { id: "retention", title: "5. Retention", snippetIds: ["cookies.retention"] },
      { id: "updates", title: "6. Updates", snippetIds: ["cookies.updates"] },
      { id: "contact", title: "7. Contact", snippetIds: ["cookies.contact"] },
    ],
  },
};
