export interface Article {
  id: string;
  title: string;
  source: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: string;
  dateAdded: string;
  tags: string[];
  excerpt: string;
  text: string;
}

export interface DictionaryPhonetic {
  text?: string;
  audio?: string;
}

export interface DictionaryDefinition {
  definition: string;
  definitionZh?: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
  synonyms?: string[];
  antonyms?: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
}

export interface Flashcard {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  definition: string;
  example?: string;
  addedAt: number;
  status: 'new' | 'known' | 'review';
}

export interface WordPopupData {
  word: string;
  x: number;
  y: number;
}
