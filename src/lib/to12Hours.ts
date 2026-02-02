export function to12Hour(time24: string): string {
  const [h, m] = time24.split(":").map(Number);

  if (h < 0 || h > 23 || m < 0 || m > 59) {
    throw new Error("Invalid time");
  }

  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;

  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}
