// Seed content aligned with TTMIK / Sejong Korean / TOPIK I structure

export interface VocabItem {
  id: string;
  korean: string;
  romanization: string;
  english: string;
  topicId: string;
}

export interface GrammarPoint {
  id: string;
  title: string;
  korean: string;
  explanation: string;
  examples: { korean: string; romanization: string; english: string }[];
  topicId: string;
}

export interface ConversationPrompt {
  id: string;
  title: string;
  scenario: string;
  topicId: string;
  suggestedPhrases: { korean: string; romanization: string; english: string }[];
  modelSentence: { korean: string; romanization: string; english: string };
  grammarIds: string[];
}

export interface Topic {
  id: string;
  title: string;
  titleKorean: string;
  emoji: string;
  description: string;
  order: number;
}

export const topics: Topic[] = [
  { id: "greetings", title: "Greetings", titleKorean: "인사", emoji: "👋", description: "Say hello, goodbye, and introduce yourself", order: 1 },
  { id: "cafe", title: "At the Café", titleKorean: "카페에서", emoji: "☕", description: "Order drinks, ask about the menu", order: 2 },
  { id: "daily-life", title: "Daily Life", titleKorean: "일상생활", emoji: "🌅", description: "Talk about your day and routine", order: 3 },
  { id: "family", title: "Family", titleKorean: "가족", emoji: "👨‍👩‍👧", description: "Talk about your family members", order: 4 },
  { id: "food", title: "Food & Eating", titleKorean: "음식", emoji: "🍜", description: "Discuss food, order at restaurants", order: 5 },
];

export const vocabulary: VocabItem[] = [
  // Greetings
  { id: "v1", korean: "안녕하세요", romanization: "annyeonghaseyo", english: "Hello (formal)", topicId: "greetings" },
  { id: "v2", korean: "감사합니다", romanization: "gamsahamnida", english: "Thank you (formal)", topicId: "greetings" },
  { id: "v3", korean: "네", romanization: "ne", english: "Yes", topicId: "greetings" },
  { id: "v4", korean: "아니요", romanization: "aniyo", english: "No", topicId: "greetings" },
  { id: "v5", korean: "저는", romanization: "jeoneun", english: "I am (topic marker)", topicId: "greetings" },
  { id: "v6", korean: "이름", romanization: "ireum", english: "Name", topicId: "greetings" },
  { id: "v7", korean: "만나서 반갑습니다", romanization: "mannaseo bangapseumnida", english: "Nice to meet you", topicId: "greetings" },
  { id: "v8", korean: "안녕히 가세요", romanization: "annyeonghi gaseyo", english: "Goodbye (to someone leaving)", topicId: "greetings" },

  // Café
  { id: "v9", korean: "커피", romanization: "keopi", english: "Coffee", topicId: "cafe" },
  { id: "v10", korean: "아메리카노", romanization: "amerikano", english: "Americano", topicId: "cafe" },
  { id: "v11", korean: "주세요", romanization: "juseyo", english: "Please give me", topicId: "cafe" },
  { id: "v12", korean: "하나", romanization: "hana", english: "One", topicId: "cafe" },
  { id: "v13", korean: "얼마예요?", romanization: "eolmayeyo?", english: "How much is it?", topicId: "cafe" },
  { id: "v14", korean: "뜨거운", romanization: "tteugeoun", english: "Hot", topicId: "cafe" },
  { id: "v15", korean: "차가운", romanization: "chagaun", english: "Cold/Iced", topicId: "cafe" },

  // Daily life
  { id: "v16", korean: "오늘", romanization: "oneul", english: "Today", topicId: "daily-life" },
  { id: "v17", korean: "어제", romanization: "eoje", english: "Yesterday", topicId: "daily-life" },
  { id: "v18", korean: "일하다", romanization: "ilhada", english: "To work", topicId: "daily-life" },
  { id: "v19", korean: "학교", romanization: "hakgyo", english: "School", topicId: "daily-life" },
  { id: "v20", korean: "집", romanization: "jip", english: "Home/House", topicId: "daily-life" },
  { id: "v21", korean: "가다", romanization: "gada", english: "To go", topicId: "daily-life" },

  // Family
  { id: "v22", korean: "엄마", romanization: "eomma", english: "Mom", topicId: "family" },
  { id: "v23", korean: "아빠", romanization: "appa", english: "Dad", topicId: "family" },
  { id: "v24", korean: "언니/누나", romanization: "eonni/nuna", english: "Older sister (F/M speaker)", topicId: "family" },
  { id: "v25", korean: "오빠/형", romanization: "oppa/hyeong", english: "Older brother (F/M speaker)", topicId: "family" },
  { id: "v26", korean: "동생", romanization: "dongsaeng", english: "Younger sibling", topicId: "family" },

  // Food
  { id: "v27", korean: "밥", romanization: "bap", english: "Rice / Meal", topicId: "food" },
  { id: "v28", korean: "맛있다", romanization: "masitda", english: "Delicious", topicId: "food" },
  { id: "v29", korean: "먹다", romanization: "meokda", english: "To eat", topicId: "food" },
  { id: "v30", korean: "물", romanization: "mul", english: "Water", topicId: "food" },
  { id: "v31", korean: "배고파요", romanization: "baegopayo", english: "I'm hungry", topicId: "food" },
];

export const grammar: GrammarPoint[] = [
  {
    id: "g1",
    title: "Polite ending -요 (-yo)",
    korean: "-요",
    explanation: "The most common polite speech level. Add -요 to verb/adjective stems to speak politely in everyday situations. This is the 해요체 (haeyoche) style.",
    examples: [
      { korean: "좋아요", romanization: "joayo", english: "It's good / I like it" },
      { korean: "가요", romanization: "gayo", english: "I go / I'm going" },
      { korean: "먹어요", romanization: "meogeoyo", english: "I eat / I'm eating" },
    ],
    topicId: "greetings",
  },
  {
    id: "g2",
    title: "Topic marker 은/는",
    korean: "은/는",
    explanation: "Marks the topic of a sentence. Use 은 after consonants and 는 after vowels. Think of it as 'as for [topic]...'",
    examples: [
      { korean: "저는 학생이에요", romanization: "jeoneun haksaengieyo", english: "I am a student" },
      { korean: "오늘은 좋아요", romanization: "oneureun joayo", english: "Today is good" },
    ],
    topicId: "greetings",
  },
  {
    id: "g3",
    title: "Object marker 을/를",
    korean: "을/를",
    explanation: "Marks the object of a verb. Use 을 after consonants and 를 after vowels.",
    examples: [
      { korean: "커피를 주세요", romanization: "keopireul juseyo", english: "Please give me coffee" },
      { korean: "밥을 먹어요", romanization: "babeul meogeoyo", english: "I eat rice" },
    ],
    topicId: "cafe",
  },
  {
    id: "g4",
    title: "Past tense -았/었어요",
    korean: "-았/었어요",
    explanation: "To talk about the past, change the verb ending. Use -았어요 with bright vowels (ㅏ, ㅗ) and -었어요 with dark vowels.",
    examples: [
      { korean: "갔어요", romanization: "gasseoyo", english: "I went" },
      { korean: "먹었어요", romanization: "meogeosseoyo", english: "I ate" },
      { korean: "했어요", romanization: "haesseoyo", english: "I did" },
    ],
    topicId: "daily-life",
  },
  {
    id: "g5",
    title: "Asking questions with -요?",
    korean: "-요?",
    explanation: "In Korean, you can make a question just by raising your intonation at the end. The sentence structure stays the same!",
    examples: [
      { korean: "커피 좋아해요?", romanization: "keopi joahaeyo?", english: "Do you like coffee?" },
      { korean: "어디 가요?", romanization: "eodi gayo?", english: "Where are you going?" },
    ],
    topicId: "cafe",
  },
  {
    id: "g6",
    title: "있어요 / 없어요 (have / don't have)",
    korean: "있어요/없어요",
    explanation: "있어요 means 'there is' or 'I have.' 없어요 is the opposite: 'there isn't' or 'I don't have.'",
    examples: [
      { korean: "동생이 있어요", romanization: "dongsaengi isseoyo", english: "I have a younger sibling" },
      { korean: "시간이 없어요", romanization: "sigani eopseoyo", english: "I don't have time" },
    ],
    topicId: "family",
  },
];

export const conversationPrompts: ConversationPrompt[] = [
  {
    id: "c1",
    title: "Introduce yourself",
    scenario: "You meet someone new at a gathering. Introduce yourself — say your name and something about yourself.",
    topicId: "greetings",
    suggestedPhrases: [
      { korean: "안녕하세요", romanization: "annyeonghaseyo", english: "Hello" },
      { korean: "저는 ___이에요/예요", romanization: "jeoneun ___ieyo/yeyo", english: "I am ___" },
      { korean: "만나서 반갑습니다", romanization: "mannaseo bangapseumnida", english: "Nice to meet you" },
    ],
    modelSentence: { korean: "안녕하세요! 저는 민지예요. 만나서 반갑습니다.", romanization: "Annyeonghaseyo! Jeoneun Minjiyeyo. Mannaseo bangapseumnida.", english: "Hello! I'm Minji. Nice to meet you." },
    grammarIds: ["g1", "g2"],
  },
  {
    id: "c2",
    title: "Order at a café",
    scenario: "You're at a Korean café. Order an iced Americano and ask how much it costs.",
    topicId: "cafe",
    suggestedPhrases: [
      { korean: "아이스 아메리카노", romanization: "aiseu amerikano", english: "Iced Americano" },
      { korean: "하나 주세요", romanization: "hana juseyo", english: "One please" },
      { korean: "얼마예요?", romanization: "eolmayeyo?", english: "How much is it?" },
    ],
    modelSentence: { korean: "아이스 아메리카노 하나 주세요. 얼마예요?", romanization: "Aiseu amerikano hana juseyo. Eolmayeyo?", english: "One iced Americano please. How much is it?" },
    grammarIds: ["g3", "g5"],
  },
  {
    id: "c3",
    title: "Talk about your weekend",
    scenario: "A friend asks what you did this weekend. Tell them you went somewhere and ate something.",
    topicId: "daily-life",
    suggestedPhrases: [
      { korean: "주말에", romanization: "jumare", english: "On the weekend" },
      { korean: "갔어요", romanization: "gasseoyo", english: "I went" },
      { korean: "먹었어요", romanization: "meogeosseoyo", english: "I ate" },
    ],
    modelSentence: { korean: "주말에 카페에 갔어요. 케이크를 먹었어요.", romanization: "Jumare kapee gasseoyo. Keikereul meogeosseoyo.", english: "I went to a café on the weekend. I ate cake." },
    grammarIds: ["g4"],
  },
  {
    id: "c4",
    title: "Describe your family",
    scenario: "Someone asks about your family. Tell them who is in your family.",
    topicId: "family",
    suggestedPhrases: [
      { korean: "우리 가족은", romanization: "uri gajogeun", english: "My family" },
      { korean: "명이에요", romanization: "myeongieyo", english: "__ people (counter)" },
      { korean: "있어요", romanization: "isseoyo", english: "I have / There is" },
    ],
    modelSentence: { korean: "우리 가족은 네 명이에요. 엄마, 아빠, 언니가 있어요.", romanization: "Uri gajogeun ne myeongieyo. Eomma, appa, eonniga isseoyo.", english: "My family has four people. I have a mom, dad, and older sister." },
    grammarIds: ["g2", "g6"],
  },
  {
    id: "c5",
    title: "Say you're hungry",
    scenario: "It's lunchtime. Tell your friend you're hungry and suggest eating together.",
    topicId: "food",
    suggestedPhrases: [
      { korean: "배고파요", romanization: "baegopayo", english: "I'm hungry" },
      { korean: "같이", romanization: "gachi", english: "Together" },
      { korean: "먹을까요?", romanization: "meogeulkkayo?", english: "Shall we eat?" },
    ],
    modelSentence: { korean: "배고파요! 같이 밥 먹을까요?", romanization: "Baegopayo! Gachi bap meogeulkkayo?", english: "I'm hungry! Shall we eat together?" },
    grammarIds: ["g1", "g5"],
  },
];
