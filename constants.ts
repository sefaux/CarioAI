
export const ROUNDS_WITH_DESCRIPTIONS = [
  { name: "2 Tríos", description: "2 grupos de 3 cartas del mismo valor" },
  { name: "1 Trío y 1 Escala", description: "1 grupo de 3 cartas iguales y 1 escala de 4 cartas" },
  { name: "2 Escalas", description: "2 escaleras de 4 cartas" },
  { name: "3 Tríos", description: "3 grupos de 3 cartas del mismo valor" },
  { name: "2 Tríos y 1 Escala", description: "2 grupos de 3 cartas iguales y 1 escala de 4 cartas" },
  { name: "1 Trío y 2 Escalas", description: "1 grupo de 3 cartas iguales y 2 escaleras de 4 cartas" },
  { name: "3 Escalas", description: "3 escaleras de 4 cartas" },
  { name: "4 Tríos", description: "4 grupos de 3 cartas del mismo valor" },
  { name: "Escala Sucia", description: "1 escalera de 13 cartas (puede usar Jokers)" },
  { name: "Escala Real", description: "1 escalera de 13 cartas del mismo palo (sin Jokers)" },
];

// FIX: Export ROUNDS, an array of round names, to resolve the import error in Scoreboard.tsx.
export const ROUNDS = ROUNDS_WITH_DESCRIPTIONS.map(r => r.name);

export const DEFAULT_CARD_SCORES: Record<string, number> = {
    'A': 15,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10,
    'Joker': 30
};