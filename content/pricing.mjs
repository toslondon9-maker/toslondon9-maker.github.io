function deepFreeze(value) {
  for (const nested of Object.values(value)) {
    if (nested && typeof nested === "object") deepFreeze(nested);
  }
  return Object.freeze(value);
}

export const pricing = deepFreeze({
  foundation: { gbp: "£97", en: "£97 / approximately €114", es: "£97 / aproximadamente €114" },
  visualisation: { gbp: "£197", en: "£197 / approximately €231", es: "£197 / aproximadamente €231" },
  concentration: { gbp: "£397", en: "£397 / approximately €465", es: "£397 / aproximadamente €465" },
  mastery: { gbp: "£497", en: "£497 / approximately €582", es: "£497 / aproximadamente €582" },
  complete: { gbp: "£997", en: "£997 / approximately €1,167", es: "£997 / aproximadamente €1,167" },
  separate: { gbp: "£1,188", en: "£1,188 / approximately €1,390", es: "£1,188 / aproximadamente €1,390" },
  foundingSaving: { gbp: "£191", en: "£191 / approximately €223", es: "£191 / aproximadamente €223" },
  balance: { gbp: "£900", en: "£900 / approximately €1,053", es: "£900 / aproximadamente €1,053" },
  masteryCircle: { gbp: "£3,000–£5,000", en: "£3,000–£5,000 / approximately €3,510–€5,850", es: "£3,000–£5,000 / aproximadamente €3,510–€5,850" },
  privateMentoring: { gbp: "£7,500–£15,000", en: "£7,500–£15,000 / approximately €8,776–€17,551", es: "£7,500–£15,000 / aproximadamente €8,776–€17,551" },
  alumni: { gbp: "£29–£79/month", en: "£29–£79/month / approximately €34–€92/month", es: "£29–£79/month / aproximadamente €34–€92/month" },
  corporate: { gbp: "From £5,000", en: "From £5,000 / approximately from €5,850", es: "Desde £5,000 / aproximadamente desde €5,850" },
});

export const pricingNote = Object.freeze({
  en: "GBP is the payment currency. EUR figures are approximate and may vary slightly with exchange rates and payment-provider conversion.",
  es: "La moneda de pago es GBP. Las cifras en EUR son aproximadas y pueden variar ligeramente según los tipos de cambio y la conversión del proveedor de pagos.",
});
