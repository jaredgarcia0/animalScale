export function calculatePercentageError(actualMeters: number, guessMeters: number): number {
  if (actualMeters === 0) {
    return 0;
  }

  return Math.abs((guessMeters - actualMeters) / actualMeters) * 100;
}
