import { DailyQuote } from '../types';

export const WINTER_ARC_QUOTES: DailyQuote[] = [
  {
    id: 1,
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    source: "Meditations"
  },
  {
    id: 2,
    quote: "Do not be sorry. Be better.",
    author: "Kratos",
    source: "God of War"
  },
  {
    id: 3,
    quote: "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter. Everything is within.",
    author: "Miyamoto Musashi",
    source: "The Book of Five Rings"
  },
  {
    id: 4,
    quote: "It ain't about how hard you hit. It's about how hard you can get hit and keep moving forward.",
    author: "Rocky Balboa",
    source: "Rocky Balboa"
  },
  {
    id: 5,
    quote: "Don't stop when you're tired. Stop when you're done.",
    author: "David Goggins",
    source: "Can't Hurt Me"
  },
  {
    id: 6,
    quote: "Discipline equals freedom.",
    author: "Jocko Willink",
    source: "Discipline Equals Freedom"
  },
  {
    id: 7,
    quote: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols"
  },
  {
    id: 8,
    quote: "No man is free who is not master of himself.",
    author: "Epictetus",
    source: "Discourses"
  },
  {
    id: 9,
    quote: "I have no desire to fit in. No desire to be normal. I just want to be great.",
    author: "Kobe Bryant",
    source: "Mamba Mentality"
  },
  {
    id: 10,
    quote: "Difficulties strengthen the mind, as labor does the body.",
    author: "Seneca",
    source: "Letters from a Stoic"
  },
  {
    id: 11,
    quote: "Think lightly of yourself and deeply of the world.",
    author: "Miyamoto Musashi",
    source: "Dokkodo (The Path of Aloneness)"
  },
  {
    id: 12,
    quote: "Close your heart to their suffering. Close your heart to it. On our journey, we will be attacked by all manner of creature. Do not feel for them.",
    author: "Kratos",
    source: "God of War"
  },
  {
    id: 13,
    quote: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    source: "Meditations"
  },
  {
    id: 14,
    quote: "Every champion was once a contender that refused to give up.",
    author: "Rocky Balboa",
    source: "Rocky"
  },
  {
    id: 15,
    quote: "You must be willing to suffer today in order to grow tomorrow.",
    author: "David Goggins",
    source: "Never Finished"
  },
  {
    id: 16,
    quote: "Today not possible, tomorrow possible. If you decide to do it, you must do it.",
    author: "Miyamoto Musashi",
    source: "Dokkodo"
  },
  {
    id: 17,
    quote: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    source: "Letters from a Stoic"
  },
  {
    id: 18,
    quote: "First say to yourself what you would be; and then do what you have to do.",
    author: "Epictetus",
    source: "Discourses"
  },
  {
    id: 19,
    quote: "Rest at the end, not in the middle.",
    author: "Kobe Bryant",
    source: "The Mamba Mentality"
  },
  {
    id: 20,
    quote: "Winter is not a punishment. It is the forge.",
    author: "The Iron Protocol",
    source: "Winter Arc Canon"
  }
];

export function getQuoteForDay(dayNumber: number): DailyQuote {
  const index = Math.max(0, (dayNumber - 1) % WINTER_ARC_QUOTES.length);
  return WINTER_ARC_QUOTES[index];
}
