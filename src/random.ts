export const seedRandom = (s: string) => {
  const a = new Array(4).fill(0)
  for (let i = 0; i < s.length; i++) {
    a[i%4] = ((a[i%4] << 5) - a[i%4]) + s.charCodeAt(i)
  }
  return () => {
    const t = a[0] ^ (a[0] << 11)
    a[0] = a[1]
    a[1] = a[2]
    a[2] = a[3]
    a[3] = (a[3] ^ (a[3] >> 19) ^ t ^ (t >> 8))
    return (a[3]>>>0) / ((1 << 31)>>>0)
  }
}
