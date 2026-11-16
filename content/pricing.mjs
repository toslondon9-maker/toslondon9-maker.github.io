function deepFreeze(value) {
  for (const nested of Object.values(value)) {
    if (nested && typeof nested === "object") deepFreeze(nested);
  }
  return Object.freeze(value);
}

export const pricing = deepFreeze({
  foundation: { gbp: "£97", en: "£97", es: "£97" },
  visualisation: { gbp: "£197", en: "£197", es: "£197" },
  concentration: { gbp: "£397", en: "£397", es: "£397" },
  mastery: { gbp: "£497", en: "£497", es: "£497" },
  complete: { gbp: "£997", en: "£997", es: "£997" },
  separate: { gbp: "£1,188", en: "£1,188", es: "£1,188" },
  foundingSaving: { gbp: "£191", en: "£191", es: "£191" },
  balance: { gbp: "£900", en: "£900", es: "£900" },
  masteryCircle: { gbp: "£3,000–£5,000", en: "£3,000–£5,000", es: "£3,000–£5,000" },
  privateMentoring: { gbp: "£7,500–£15,000", en: "£7,500–£15,000", es: "£7,500–£15,000" },
  alumni: { gbp: "£49/month", en: "£49/month", es: "£49/month" },
  corporate: { gbp: "From £5,000", en: "From £5,000", es: "Desde £5,000" },
});

export const pricingNote = Object.freeze({
  en: "All prices are shown in GBP (£).",
  es: "Todos los precios se muestran en GBP (£).",
});
