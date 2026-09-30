function deepFreeze(value) {
  for (const nested of Object.values(value)) {
    if (nested && typeof nested === "object") deepFreeze(nested);
  }
  return Object.freeze(value);
}

export const pricing = deepFreeze({
  foundation: { gbp: "£97", en: "£97 / €114", es: "£97 / €114" },
  visualisation: { gbp: "£197", en: "£197 / €231", es: "£197 / €231" },
  concentration: { gbp: "£397", en: "£397 / €465", es: "£397 / €465" },
  mastery: { gbp: "£497", en: "£497 / €582", es: "£497 / €582" },
  complete: { gbp: "£997", en: "£997 / €1,167", es: "£997 / €1,167" },
  separate: { gbp: "£1,188", en: "£1,188 / €1,390", es: "£1,188 / €1,390" },
  foundingSaving: { gbp: "£191", en: "£191 / €223", es: "£191 / €223" },
  balance: { gbp: "£900", en: "£900 / €1,053", es: "£900 / €1,053" },
  masteryCircle: { gbp: "£3,000–£5,000", en: "£3,000–£5,000 / €3,510–€5,850", es: "£3,000–£5,000 / €3,510–€5,850" },
  privateMentoring: { gbp: "£7,500–£15,000", en: "£7,500–£15,000 / €8,776–€17,551", es: "£7,500–£15,000 / €8,776–€17,551" },
  alumni: { gbp: "£29–£79/month", en: "£29–£79/month / €34–€92/month", es: "£29–£79/month / €34–€92/month" },
  corporate: { gbp: "From £5,000", en: "From £5,000 / from €5,850", es: "Desde £5,000 / desde €5,850" },
});

export const pricingNote = Object.freeze({
  en: "GBP is the payment currency. EUR figures are indicative and may vary slightly with exchange rates and payment-provider conversion.",
  es: "El pago se realiza en GBP. Las cifras en EUR son orientativas y pueden variar ligeramente según el tipo de cambio y la conversión del proveedor de pago.",
});
