export default function getDaysDiff(date1: Date, date2 = new Date()) {
  const daysDiff =
    Math.abs(date2.getTime() - date1.getTime()) / (1000 * 3600 * 24)

  if (daysDiff < 1) {
    if (Math.abs(date1.getDate() - date2.getDate()) === 1) {
      return 1
    }
  }

  return Math.round(daysDiff)
}
