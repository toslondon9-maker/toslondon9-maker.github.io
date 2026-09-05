const invitation = "I’ve been exploring a 24-week Master Key System programme called Unleash Your Power. There’s a free 7-Day Experience if you want to try it for yourself. No pressure — I just thought you might find it interesting.";
const startFreeUrl = "https://toslondon9-maker.github.io/start-free/";

export function referralPage(data) {
  return {
    route: data.routes.referral,
    language: "en",
    title: "Share the Journey | Unleash Your Power",
    description: "Invite someone you care about to begin the free Unleash Your Power 7-Day Experience.",
    titleKey: "route.referral.metaTitle",
    descriptionKey: "route.referral.metaDescription",
    body: `<main class="referralPage" id="main-content">
      <section class="referralHero" aria-labelledby="referral-title">
        <div class="referralHero__copy"><p class="eyebrow">SHARE THE JOURNEY</p><h1 id="referral-title">Help Someone You Care About <em>Begin Their Journey</em></h1><p class="referralHero__lead">If the Master Key System has helped you think more clearly, feel more focused, and create with greater confidence, you may know someone who could benefit from experiencing it too.</p><p>Introduce them to the 7-Day Experience.<br>No pressure. Just a meaningful opportunity.</p><a class="button--primary" href="#personal-invite">REFER A FRIEND</a><small class="referralTrust">🔒 Secure. Private. No spam.</small></div>
        <figure class="referralHero__portrait"><img src="/images/tariq-happiness-harmony.png" width="1088" height="1445" loading="eager" fetchpriority="high" alt="Tariq Saddique, guide for the Unleash Your Power journey."></figure>
      </section>
      <section class="referralSection" aria-labelledby="how-it-works"><p class="eyebrow">A SIMPLE INVITATION</p><h2 id="how-it-works">HOW IT WORKS</h2><div class="referralCards"><article><span aria-hidden="true">01</span><h3>Think of someone</h3><p>Think of a friend, family member or colleague who may benefit from more clarity, confidence and direction.</p></article><article><span aria-hidden="true">02</span><h3>Introduce them</h3><p>Share your unique referral link or invite them directly. It only takes a moment.</p></article><article><span aria-hidden="true">03</span><h3>Let them start free</h3><p>They’ll get immediate access to the 7-Day Experience completely free.</p></article></div></section>
      <section class="referralSection referralWhy" aria-labelledby="why-refer"><p class="eyebrow">SHARING WITH PURPOSE</p><h2 id="why-refer">WHY REFER?</h2><div class="referralReasons"><p><span aria-hidden="true">✦</span>Meaningful rewards for helping others</p><p><span aria-hidden="true">✦</span>No selling. No pressure.</p><p><span aria-hidden="true">✦</span>Just sharing an opportunity that helped you</p><p><span aria-hidden="true">✦</span>You could be the beginning of something life-changing</p></div></section>
      <section class="referralInvite" id="personal-invite" aria-labelledby="invite-title"><p class="eyebrow">YOUR PERSONAL INVITE</p><h2 id="invite-title">Share a thoughtful first step.</h2><blockquote data-referral-copy>${invitation}</blockquote><div class="referralInvite__actions"><a class="button--primary" data-referral-whatsapp href="https://wa.me/?text=${encodeURIComponent(`${invitation} ${startFreeUrl}`)}" target="_blank" rel="noopener noreferrer">SHARE ON WHATSAPP</a><button class="button--secondary" data-referral-copy-button type="button">COPY MESSAGE</button></div><p class="referralInvite__status" data-referral-status role="status" aria-live="polite"></p><p class="referralInvite__url">${startFreeUrl}</p></section>
      <section class="referralCta"><div><p class="eyebrow">PASS IT ON</p><h2>Ready to share the gift of growth?</h2><p>Your invitation could be the key that unlocks their next chapter.</p></div><a class="button--primary" href="#personal-invite">REFER A FRIEND TODAY</a></section>
    </main>`,
    scripts: ["/assets/referral.mjs"],
  };
}

export { invitation, startFreeUrl };
