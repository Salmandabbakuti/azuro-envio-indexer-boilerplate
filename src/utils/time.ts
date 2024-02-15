export function daysBetweenTimestamps(from: bigint, to: bigint): number {
  const fromTimestamp = new Date(Number(from) * 1000);
  const toTimestamp = new Date(Number(to) * 1000);
  const diff = toTimestamp.getTime() - fromTimestamp.getTime();

  const daysDiff = diff / (1000 * 3600 * 24);

  if (daysDiff < 0) {
    return 0;
  }

  return Math.ceil(daysDiff);
}
