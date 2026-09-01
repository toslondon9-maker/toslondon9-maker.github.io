import { siteData as canonicalSiteData } from "../../content/site-data.mjs";

const email = (data) => `<a href="mailto:${data.contact.email}">${data.contact.email}</a>`;
const contactSection = (data) => `<section><h2>Contact Us</h2><p>For a privacy question, a request about your information, or a question about these terms, contact Unleash Your Power at ${email(data)}.</p></section>`;
const section = (heading, body) => `<section><h2>${heading}</h2>${body}</section>`;

function privacyContent(data) {
  return [
    section("Who We Are", `<p>Unleash Your Power is an independent online study and coaching experience led by Tariq Saddique. It is inspired by the Master Key System and is not presented as an official service of, or endorsement by, Charles F. Haanel or Helmar Rudolph. We aim to handle personal information responsibly and in accordance with applicable data protection requirements.</p>`),
    section("Information You Provide", `<p>You may choose to provide your name, email address, telephone or WhatsApp details, country or time zone, and information about your enquiry or goals when you contact us. The website's contact actions open your own email or WhatsApp application; the website does not currently operate a server-side contact-form database.</p>`),
    section("Information Collected Automatically", `<p>The public website is a static GitHub Pages site. Like most websites, the hosting and delivery services involved may process basic technical information needed to deliver pages, such as IP address, browser type, device information and request logs. The site also uses browser-local storage for limited features, including seven-day progress and a referral identifier. That local data remains on your device unless you choose to send it in an enquiry.</p>`),
    section("How We Use Information", `<p>Information you choose to send may be used to respond to your question, discuss coaching or a programme, arrange requested communication, and keep necessary records of that communication. We do not use it to make automated decisions about you.</p>`),
    section("Cookies and Analytics", `<p>We do not currently use website analytics or advertising tracking cookies. Some browser features use local storage rather than cookies to remember progress or a referral code on your device. Third-party websites you visit through a link may use their own cookies and analytics under their own policies.</p>`),
    section("Contact and Communication", `<p>If you email us, the email provider you use and the recipient's email service will process your message. Please only send information you are comfortable sharing by email. We may retain relevant correspondence for as long as reasonably needed to respond, manage an ongoing coaching relationship, or meet legal and administrative obligations.</p>`),
    section("WhatsApp and External Communication Services", `<p>If you choose the WhatsApp link, you leave this website and WhatsApp processes the communication under its own terms and privacy policy. WhatsApp messages are not submitted through or stored by this website before you choose to send them.</p>`),
    section("Embedded Content and Videos", `<p>The site may link to books, videos and other material hosted by third parties. When you follow one of those links, that provider may collect information in accordance with its own privacy policy. We do not control those external services.</p>`),
    section("AI Mentor and AI Services", `<p>The AI Mentor is an independent study aid. Where an AI response service is available, your selected study context and question may be sent to a third-party AI service to generate a response. Do not enter sensitive personal, health, financial, legal or confidential information. Availability and data handling may depend on the relevant service provider; the website does not offer user accounts or promise confidential AI conversations.</p>`),
    section("Payments and Third-Party Payment Providers", `<p>We do not currently collect card payments through this website. If a coaching or programme payment is arranged separately, the applicable payment provider and agreed process will handle payment information under their own terms and privacy notices.</p>`),
    section("Referral and External Links", `<p>A referral code may be stored locally in your browser and may be included in a pre-filled enquiry only if you choose to send it. Referral arrangements are handled manually. External links are provided for convenience and do not make us responsible for third-party content or privacy practices.</p>`),
    section("Data Retention", `<p>We keep personal information only for as long as reasonably necessary for the purpose for which it was provided, including responding to enquiries, supporting an agreed service, resolving disputes, and meeting legal or administrative requirements.</p>`),
    section("Data Security", `<p>We use reasonable administrative and technical measures appropriate to the nature of the information we handle. No online transmission or storage method is completely secure, so please avoid sending highly sensitive information through ordinary email or messaging services.</p>`),
    section("Third-Party and International Services", `<p>Our website hosting, email, messaging, AI, book and video links may involve service providers located outside your country. Those providers process information according to their own terms and privacy policies. Where applicable, we take reasonable steps to use services that provide appropriate safeguards.</p>`),
    section("Your Privacy Rights", `<p>Depending on applicable law, you may have rights to ask for access to, correction of, deletion of, restriction of, or objection to the processing of your personal information, and to request portability where relevant. You may also withdraw consent where processing is based on consent. Contact us to make a request; we may need to verify your identity before responding.</p>`),
    section("Children’s Privacy", `<p>This website is not directed at children. Please do not send us personal information about a child without appropriate parental or guardian involvement.</p>`),
    section("Changes to This Privacy Policy", `<p>We may update this policy when the website or its services change. The latest version will be published on this page with its updated date.</p>`),
    contactSection(data),
  ].join("");
}

function termsContent(data) {
  return [
    section("Acceptance of These Terms", `<p>By using this website, its free resources, study material or coaching enquiries, you agree to use them lawfully and in line with these Terms of Use. If you do not agree, please do not use the website or services.</p>`),
    section("About Unleash Your Power", `<p>Unleash Your Power is an independent study and coaching experience led by Tariq Saddique. It is inspired by the Master Key System and does not claim official affiliation with, approval from, or endorsement by Charles F. Haanel or Helmar Rudolph.</p>`),
    section("Educational and Coaching Purpose", `<p>The website, its study resources, the seven-day experience, AI study tools and coaching are offered for education, reflection and personal development. Coaching is not therapy, medical treatment, legal advice, financial advice or a substitute for a qualified professional service.</p>`),
    section("The Master Key System", `<p>The Master Key System contains philosophical and metaphysical concepts presented for study, reflection and personal development. These concepts are not presented on this website as established scientific facts. You remain responsible for deciding how, whether and when to apply any idea in your own life.</p>`),
    section("No Guaranteed Results", `<p>We do not promise manifestation, wealth, healing, business growth, financial success, career progress, relationship outcomes or life transformation. Individual experiences and outcomes will vary.</p>`),
    section("Personal Responsibility", `<p>You are responsible for your choices, actions, wellbeing and use of information from this website or coaching. Use your own judgement and seek qualified support where appropriate.</p>`),
    section("Health and Wellbeing Disclaimer", `<p>Nothing on this website is medical, psychological, therapeutic or mental-health advice. If you have a health, wellbeing or mental-health concern, seek advice from an appropriately qualified professional or urgent assistance where needed.</p>`),
    section("Financial and Business Disclaimer", `<p>Nothing on this website is financial, investment, legal, tax or business advice. You should obtain independent professional advice before making a financial, business, legal or investment decision.</p>`),
    section("AI Mentor and AI-Generated Information", `<p>AI-generated responses may contain errors, omissions or unsuitable suggestions. They are provided for educational and reflective purposes only and are not professional medical, legal, financial or mental-health advice. Check information where accuracy matters and do not rely on an AI response as a replacement for qualified professional advice.</p>`),
    section("Intellectual Property", `<p>The Unleash Your Power website design, original copy, programme materials and original resources are protected by applicable intellectual-property laws. You may use them for your own personal study, but may not copy, republish, sell, distribute or create derivative commercial materials without prior written permission, except where law permits otherwise.</p>`),
    section("Charles F. Haanel and Third-Party Materials", `<p>Charles F. Haanel is identified as the author of the Master Key System. References, quotations and study material are used for educational context. Unleash Your Power is not an official product of, or endorsed by, Charles F. Haanel or his estate.</p>`),
    section("Helmar Rudolph and Third-Party Materials", `<p>Helmar Rudolph and related books or resources may be referenced as third-party study material. Those references do not mean that Helmar Rudolph created, approved, endorsed or is affiliated with Unleash Your Power.</p>`),
    section("Books, External Websites and Services", `<p>Links to books, videos, stores, AI services and other external websites are provided for convenience. Their availability, pricing, content, terms and privacy practices are controlled by their providers. We are not responsible for third-party websites or services.</p>`),
    section("Payments", `<p>Current programme information and prices are displayed on the website where applicable. Enrolment, availability, confirmation and payment are arranged through the agreed process. We do not currently process card payments through this website. Any payment terms will be made clear before payment is requested.</p>`),
    section("Acceptable Use", `<p>You must not misuse the website, interfere with its operation, attempt unauthorised access, introduce malicious code, use the site unlawfully, or use its content to misrepresent an affiliation, endorsement or service.</p>`),
    section("Account or Service Availability", `<p>Some features, including AI services or external links, may be unavailable, changed or withdrawn without notice. We do not guarantee uninterrupted, error-free or secure access to every website feature.</p>`),
    section("Website Changes", `<p>We may update, correct, remove or change website material, resources and services as the programme develops. We will not intentionally alter agreed coaching arrangements without communicating where appropriate.</p>`),
    section("Limitation of Liability", `<p>To the fullest extent permitted by applicable law, Unleash Your Power and Tariq Saddique are not liable for indirect, incidental, consequential or special loss arising from use of the website, external services, study material or coaching. Nothing in these terms excludes liability that cannot lawfully be excluded.</p>`),
    section("Governing Law", `<p>These terms are intended to be interpreted in accordance with the laws of England and Wales, except where mandatory consumer-protection law in your country applies. We will seek to resolve concerns directly and reasonably before formal proceedings where possible.</p>`),
    section("Changes to These Terms", `<p>We may update these terms from time to time. The current version will be published on this page with its updated date. Continued use after an update means you accept the updated terms, where permitted by law.</p>`),
    contactSection(data),
  ].join("");
}

export function legalPage(kind, data = canonicalSiteData) {
  const privacy = kind === "privacy";
  const title = privacy ? "Privacy Policy | Unleash Your Power" : "Terms of Use | Unleash Your Power";
  const description = privacy
    ? "Read how Unleash Your Power handles enquiries, browser-local features and third-party services."
    : "Read the terms for Unleash Your Power study resources, AI tools and coaching.";
  const heading = privacy ? "PRIVACY POLICY" : "TERMS OF USE";
  const purpose = privacy
    ? "How Unleash Your Power handles information connected with enquiries, study tools and external services."
    : "The terms that support responsible use of Unleash Your Power study resources and coaching.";
  const routeKey = privacy ? "route.privacy" : "route.terms";

  return {
    route: privacy ? data.routes.privacy : data.routes.terms,
    language: "en",
    title,
    description,
    titleKey: privacy ? "route.privacy.metaTitle" : "route.terms.metaTitle",
    descriptionKey: privacy ? "route.privacy.metaDescription" : "route.terms.metaDescription",
    body: `<main id="main-content"><article class="routeShell card legalPage"><p class="eyebrow">UNLEASH YOUR POWER</p><h1 data-i18n="${routeKey}.heading">${heading}</h1><p class="routeShell__purpose" data-i18n="${routeKey}.purpose">${purpose}</p><p><strong>Last updated: 1 September 2026</strong></p>${privacy ? privacyContent(data) : termsContent(data)}<a class="button--primary routeShell__action" href="${data.routes.contact}" data-i18n="${routeKey}.action">${privacy ? "Ask a privacy question" : "Ask about these terms"}</a></article></main>`,
    scripts: [],
  };
}
