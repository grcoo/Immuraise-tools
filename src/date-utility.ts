export function isRemining5minutes(now: number, setTime: number): boolean {
  const timeLeft = setTime - now;
  return timeLeft >= 300000 && timeLeft < 360000;
}

export function isRemining1minutes(now: number, setTime: number): boolean {
  const timeLeft = setTime - now;
  return timeLeft >= 60000 && timeLeft < 120000;
}
