export const bookingCallMessage = "Hi Tariq, I’d like to book a free 15-minute call to discuss Unleash Your Power.";

export function bookingCallHref(number) {
  const digits = String(number).replaceAll(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(bookingCallMessage)}`;
}
