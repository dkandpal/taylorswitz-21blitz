// Seeded random number generator for deterministic gameplay
export function mulberry32(seedStr: string) {
  let h = 1779033703 ^ seedStr.split('').reduce((a,c)=>((a<<5)-a + c.charCodeAt(0))|0,0);
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    const t = (h ^= h >>> 16) >>> 0;
    return (t & 0xfffffff) / 0x10000000; // [0,1)
  };
}

// Generate a random 6-character base36 seed
export function generateSeed(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}