export function formatPrice(amount: number, currency: string = 'BRL') {
  return amount.toLocaleString(undefined, {
    style: 'currency',
    currency,
  });
}
