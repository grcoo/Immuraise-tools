export function shuffle<T>(member: T[]): T[] {
  for (let i = member.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [member[i], member[j]] = [member[j], member[i]];
  }
  return member;
}
