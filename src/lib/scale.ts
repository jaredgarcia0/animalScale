export function calculatePercentageError(actualMeters: number, guessMeters: number): number {
  if (actualMeters === 0) {
    return 0;
  }

  return Math.abs((guessMeters - actualMeters) / actualMeters) * 100;
}

export function calculateRoundScore(percentageError: number): number {
  return Math.max(0, Math.round(100 - percentageError));
}
