// Content aligned with TTMIK / Sejong Korean / TOPIK I structure
// Research basis: 7-8 varied exposures across different activity types
// yields ~80% retention (Bahrick 1993, Pashler 2007, PNAS 2019).
// Each topic has 10 vocab items to support: learn → quiz (MC + fill-in-blank) → speak.

export interface VocabItem {
  id: string;
  korean: string;
  romanization: string;
  english: string;
  topicId: string;
  exampleSentence: {
    korean: string;
    blanked: string;
    blankAnswer: string;
    english: string;
  };
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

// ─── Vocabulary (10 items per topic, each with context sentence for fill-in-blank) ───

export const vocabulary: VocabItem[] = [
  // ── Greetings ──
  {
    id: "v1", korean: "안녕하세요", romanization: "annyeonghaseyo", english: "Hello (formal)", topicId: "greetings",
    exampleSentence: { korean: "안녕하세요! 저는 민지예요.", blanked: "___! 저는 민지예요.", blankAnswer: "안녕하세요", english: "Hello! I'm Minji." },
  },
  {
    id: "v2", korean: "감사합니다", romanization: "gamsahamnida", english: "Thank you (formal)", topicId: "greetings",
    exampleSentence: { korean: "도와주셔서 감사합니다.", blanked: "도와주셔서 ___.", blankAnswer: "감사합니다", english: "Thank you for helping me." },
  },
  {
    id: "v3", korean: "네", romanization: "ne", english: "Yes", topicId: "greetings",
    exampleSentence: { korean: "네, 맞아요.", blanked: "___, 맞아요.", blankAnswer: "네", english: "Yes, that's right." },
  },
  {
    id: "v4", korean: "아니요", romanization: "aniyo", english: "No", topicId: "greetings",
    exampleSentence: { korean: "아니요, 괜찮아요.", blanked: "___, 괜찮아요.", blankAnswer: "아니요", english: "No, it's okay." },
  },
  {
    id: "v5", korean: "저는", romanization: "jeoneun", english: "I am (topic marker)", topicId: "greetings",
    exampleSentence: { korean: "저는 학생이에요.", blanked: "___ 학생이에요.", blankAnswer: "저는", english: "I am a student." },
  },
  {
    id: "v6", korean: "이름", romanization: "ireum", english: "Name", topicId: "greetings",
    exampleSentence: { korean: "이름이 뭐예요?", blanked: "___이 뭐예요?", blankAnswer: "이름", english: "What is your name?" },
  },
  {
    id: "v7", korean: "만나서 반갑습니다", romanization: "mannaseo bangapseumnida", english: "Nice to meet you", topicId: "greetings",
    exampleSentence: { korean: "만나서 반갑습니다! 잘 부탁해요.", blanked: "___! 잘 부탁해요.", blankAnswer: "만나서 반갑습니다", english: "Nice to meet you! Please take care of me." },
  },
  {
    id: "v8", korean: "안녕히 가세요", romanization: "annyeonghi gaseyo", english: "Goodbye (to someone leaving)", topicId: "greetings",
    exampleSentence: { korean: "안녕히 가세요! 또 만나요.", blanked: "___! 또 만나요.", blankAnswer: "안녕히 가세요", english: "Goodbye! See you again." },
  },
  {
    id: "v9", korean: "잘 지내세요?", romanization: "jal jinaeseyo?", english: "How are you?", topicId: "greetings",
    exampleSentence: { korean: "요즘 잘 지내세요?", blanked: "요즘 ___?", blankAnswer: "잘 지내세요", english: "How have you been lately?" },
  },
  {
    id: "v10", korean: "실례합니다", romanization: "sillyehamnida", english: "Excuse me (formal)", topicId: "greetings",
    exampleSentence: { korean: "실례합니다, 잠시만요.", blanked: "___, 잠시만요.", blankAnswer: "실례합니다", english: "Excuse me, just a moment." },
  },

  // ── Café ──
  {
    id: "v11", korean: "커피", romanization: "keopi", english: "Coffee", topicId: "cafe",
    exampleSentence: { korean: "커피를 마셔요.", blanked: "___를 마셔요.", blankAnswer: "커피", english: "I drink coffee." },
  },
  {
    id: "v12", korean: "아메리카노", romanization: "amerikano", english: "Americano", topicId: "cafe",
    exampleSentence: { korean: "아메리카노 하나 주세요.", blanked: "___ 하나 주세요.", blankAnswer: "아메리카노", english: "One Americano please." },
  },
  {
    id: "v13", korean: "주세요", romanization: "juseyo", english: "Please give me", topicId: "cafe",
    exampleSentence: { korean: "물 주세요.", blanked: "물 ___.", blankAnswer: "주세요", english: "Water please." },
  },
  {
    id: "v14", korean: "하나", romanization: "hana", english: "One", topicId: "cafe",
    exampleSentence: { korean: "하나만 주세요.", blanked: "___만 주세요.", blankAnswer: "하나", english: "Just one please." },
  },
  {
    id: "v15", korean: "얼마예요?", romanization: "eolmayeyo?", english: "How much is it?", topicId: "cafe",
    exampleSentence: { korean: "이거 얼마예요?", blanked: "이거 ___?", blankAnswer: "얼마예요", english: "How much is this?" },
  },
  {
    id: "v16", korean: "뜨거운", romanization: "tteugeoun", english: "Hot", topicId: "cafe",
    exampleSentence: { korean: "뜨거운 커피 주세요.", blanked: "___ 커피 주세요.", blankAnswer: "뜨거운", english: "Hot coffee please." },
  },
  {
    id: "v17", korean: "차가운", romanization: "chagaun", english: "Cold / Iced", topicId: "cafe",
    exampleSentence: { korean: "차가운 물 주세요.", blanked: "___ 물 주세요.", blankAnswer: "차가운", english: "Cold water please." },
  },
  {
    id: "v18", korean: "차", romanization: "cha", english: "Tea", topicId: "cafe",
    exampleSentence: { korean: "녹차를 좋아해요.", blanked: "녹___를 좋아해요.", blankAnswer: "차", english: "I like green tea." },
  },
  {
    id: "v19", korean: "케이크", romanization: "keikeu", english: "Cake", topicId: "cafe",
    exampleSentence: { korean: "케이크가 맛있어요.", blanked: "___가 맛있어요.", blankAnswer: "케이크", english: "The cake is delicious." },
  },
  {
    id: "v20", korean: "여기요", romanization: "yeogiyo", english: "Excuse me (to staff)", topicId: "cafe",
    exampleSentence: { korean: "여기요! 주문할게요.", blanked: "___! 주문할게요.", blankAnswer: "여기요", english: "Excuse me! I'd like to order." },
  },

  // ── Daily Life ──
  {
    id: "v21", korean: "오늘", romanization: "oneul", english: "Today", topicId: "daily-life",
    exampleSentence: { korean: "오늘 날씨가 좋아요.", blanked: "___ 날씨가 좋아요.", blankAnswer: "오늘", english: "The weather is nice today." },
  },
  {
    id: "v22", korean: "어제", romanization: "eoje", english: "Yesterday", topicId: "daily-life",
    exampleSentence: { korean: "어제 뭐 했어요?", blanked: "___ 뭐 했어요?", blankAnswer: "어제", english: "What did you do yesterday?" },
  },
  {
    id: "v23", korean: "일하다", romanization: "ilhada", english: "To work", topicId: "daily-life",
    exampleSentence: { korean: "회사에서 일해요.", blanked: "회사에서 ___.", blankAnswer: "일해요", english: "I work at a company." },
  },
  {
    id: "v24", korean: "학교", romanization: "hakgyo", english: "School", topicId: "daily-life",
    exampleSentence: { korean: "학교에 가요.", blanked: "___에 가요.", blankAnswer: "학교", english: "I go to school." },
  },
  {
    id: "v25", korean: "집", romanization: "jip", english: "Home / House", topicId: "daily-life",
    exampleSentence: { korean: "집에서 쉬어요.", blanked: "___에서 쉬어요.", blankAnswer: "집", english: "I rest at home." },
  },
  {
    id: "v26", korean: "가다", romanization: "gada", english: "To go", topicId: "daily-life",
    exampleSentence: { korean: "어디에 가요?", blanked: "어디에 ___?", blankAnswer: "가요", english: "Where are you going?" },
  },
  {
    id: "v27", korean: "아침", romanization: "achim", english: "Morning", topicId: "daily-life",
    exampleSentence: { korean: "아침에 운동해요.", blanked: "___에 운동해요.", blankAnswer: "아침", english: "I exercise in the morning." },
  },
  {
    id: "v28", korean: "저녁", romanization: "jeonyeok", english: "Evening", topicId: "daily-life",
    exampleSentence: { korean: "저녁에 뭐 해요?", blanked: "___에 뭐 해요?", blankAnswer: "저녁", english: "What do you do in the evening?" },
  },
  {
    id: "v29", korean: "내일", romanization: "naeil", english: "Tomorrow", topicId: "daily-life",
    exampleSentence: { korean: "내일 만나요!", blanked: "___ 만나요!", blankAnswer: "내일", english: "Let's meet tomorrow!" },
  },
  {
    id: "v30", korean: "공부하다", romanization: "gongbuhada", english: "To study", topicId: "daily-life",
    exampleSentence: { korean: "한국어를 공부해요.", blanked: "한국어를 ___.", blankAnswer: "공부해요", english: "I study Korean." },
  },

  // ── Family ──
  {
    id: "v31", korean: "가족", romanization: "gajok", english: "Family", topicId: "family",
    exampleSentence: { korean: "가족이 보고 싶어요.", blanked: "___이 보고 싶어요.", blankAnswer: "가족", english: "I miss my family." },
  },
  {
    id: "v32", korean: "엄마", romanization: "eomma", english: "Mom", topicId: "family",
    exampleSentence: { korean: "엄마가 요리해요.", blanked: "___가 요리해요.", blankAnswer: "엄마", english: "Mom cooks." },
  },
  {
    id: "v33", korean: "아빠", romanization: "appa", english: "Dad", topicId: "family",
    exampleSentence: { korean: "아빠는 회사에 가요.", blanked: "___는 회사에 가요.", blankAnswer: "아빠", english: "Dad goes to the office." },
  },
  {
    id: "v34", korean: "언니", romanization: "eonni", english: "Older sister (female speaker)", topicId: "family",
    exampleSentence: { korean: "언니가 두 명 있어요.", blanked: "___가 두 명 있어요.", blankAnswer: "언니", english: "I have two older sisters." },
  },
  {
    id: "v35", korean: "오빠", romanization: "oppa", english: "Older brother (female speaker)", topicId: "family",
    exampleSentence: { korean: "오빠는 대학생이에요.", blanked: "___는 대학생이에요.", blankAnswer: "오빠", english: "My older brother is a college student." },
  },
  {
    id: "v36", korean: "동생", romanization: "dongsaeng", english: "Younger sibling", topicId: "family",
    exampleSentence: { korean: "동생이 한 명 있어요.", blanked: "___이 한 명 있어요.", blankAnswer: "동생", english: "I have one younger sibling." },
  },
  {
    id: "v37", korean: "할머니", romanization: "halmeoni", english: "Grandmother", topicId: "family",
    exampleSentence: { korean: "할머니 집에 가요.", blanked: "___ 집에 가요.", blankAnswer: "할머니", english: "I go to grandmother's house." },
  },
  {
    id: "v38", korean: "할아버지", romanization: "harabeoji", english: "Grandfather", topicId: "family",
    exampleSentence: { korean: "할아버지는 건강해요.", blanked: "___는 건강해요.", blankAnswer: "할아버지", english: "Grandfather is healthy." },
  },
  {
    id: "v39", korean: "사랑해요", romanization: "saranghaeyo", english: "I love you", topicId: "family",
    exampleSentence: { korean: "가족을 사랑해요.", blanked: "가족을 ___.", blankAnswer: "사랑해요", english: "I love my family." },
  },
  {
    id: "v40", korean: "명", romanization: "myeong", english: "Counter for people", topicId: "family",
    exampleSentence: { korean: "우리 가족은 네 명이에요.", blanked: "우리 가족은 네 ___이에요.", blankAnswer: "명", english: "My family has four people." },
  },

  // ── Food & Eating ──
  {
    id: "v41", korean: "밥", romanization: "bap", english: "Rice / Meal", topicId: "food",
    exampleSentence: { korean: "밥을 먹었어요.", blanked: "___을 먹었어요.", blankAnswer: "밥", english: "I ate a meal." },
  },
  {
    id: "v42", korean: "맛있다", romanization: "masitda", english: "Delicious", topicId: "food",
    exampleSentence: { korean: "이 음식이 맛있어요!", blanked: "이 음식이 ___!", blankAnswer: "맛있어요", english: "This food is delicious!" },
  },
  {
    id: "v43", korean: "먹다", romanization: "meokda", english: "To eat", topicId: "food",
    exampleSentence: { korean: "뭐 먹을까요?", blanked: "뭐 ___?", blankAnswer: "먹을까요", english: "What shall we eat?" },
  },
  {
    id: "v44", korean: "물", romanization: "mul", english: "Water", topicId: "food",
    exampleSentence: { korean: "물 한 잔 주세요.", blanked: "___ 한 잔 주세요.", blankAnswer: "물", english: "One glass of water please." },
  },
  {
    id: "v45", korean: "배고파요", romanization: "baegopayo", english: "I'm hungry", topicId: "food",
    exampleSentence: { korean: "배고파요! 밥 먹자!", blanked: "___! 밥 먹자!", blankAnswer: "배고파요", english: "I'm hungry! Let's eat!" },
  },
  {
    id: "v46", korean: "김치", romanization: "gimchi", english: "Kimchi", topicId: "food",
    exampleSentence: { korean: "김치를 좋아해요.", blanked: "___를 좋아해요.", blankAnswer: "김치", english: "I like kimchi." },
  },
  {
    id: "v47", korean: "고기", romanization: "gogi", english: "Meat", topicId: "food",
    exampleSentence: { korean: "고기를 먹어요.", blanked: "___를 먹어요.", blankAnswer: "고기", english: "I eat meat." },
  },
  {
    id: "v48", korean: "매워요", romanization: "maewoyo", english: "It's spicy", topicId: "food",
    exampleSentence: { korean: "이 음식이 매워요!", blanked: "이 음식이 ___!", blankAnswer: "매워요", english: "This food is spicy!" },
  },
  {
    id: "v49", korean: "주문하다", romanization: "jumunhada", english: "To order", topicId: "food",
    exampleSentence: { korean: "주문할게요.", blanked: "___.", blankAnswer: "주문할게요", english: "I'll order." },
  },
  {
    id: "v50", korean: "맛없다", romanization: "maseoptda", english: "Not delicious", topicId: "food",
    exampleSentence: { korean: "이 음식은 맛없어요.", blanked: "이 음식은 ___.", blankAnswer: "맛없어요", english: "This food doesn't taste good." },
  },
];

// ─── Grammar ───

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
  {
    id: "g7",
    title: "Location particles -에 / -에서",
    korean: "-에 / -에서",
    explanation: "Use -에 for destinations ('go to') and static locations. Use -에서 for where an action takes place ('at').",
    examples: [
      { korean: "학교에 가요", romanization: "hakgyoe gayo", english: "I go to school" },
      { korean: "집에서 쉬어요", romanization: "jibeseo swieoyo", english: "I rest at home" },
      { korean: "카페에서 공부해요", romanization: "kapeeseo gongbuhaeyo", english: "I study at the café" },
    ],
    topicId: "daily-life",
  },
  {
    id: "g8",
    title: "Want to: -고 싶다",
    korean: "-고 싶다",
    explanation: "Attach -고 싶다 to a verb stem to say 'I want to [verb].' Conjugate 싶다 as 싶어요 for polite speech.",
    examples: [
      { korean: "먹고 싶어요", romanization: "meokgo sipeoyo", english: "I want to eat" },
      { korean: "가고 싶어요", romanization: "gago sipeoyo", english: "I want to go" },
      { korean: "보고 싶어요", romanization: "bogo sipeoyo", english: "I want to see / I miss (someone)" },
    ],
    topicId: "food",
  },
  {
    id: "g9",
    title: "Subject marker -이/가",
    korean: "-이/가",
    explanation: "Marks the subject (who/what does the action). Use -이 after consonants and -가 after vowels. Different from 은/는 which marks the topic.",
    examples: [
      { korean: "엄마가 요리해요", romanization: "eommaga yorihaeyo", english: "Mom cooks" },
      { korean: "날씨가 좋아요", romanization: "nalssiga joayo", english: "The weather is nice" },
    ],
    topicId: "family",
  },
];

// ─── Conversation Prompts (2 per topic for the speaking phase) ───

export const conversationPrompts: ConversationPrompt[] = [
  // ── Greetings ──
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
    title: "Greet and say goodbye",
    scenario: "You run into a friend on the street. Greet them, ask how they are, and say goodbye.",
    topicId: "greetings",
    suggestedPhrases: [
      { korean: "안녕하세요", romanization: "annyeonghaseyo", english: "Hello" },
      { korean: "잘 지내세요?", romanization: "jal jinaeseyo?", english: "How are you?" },
      { korean: "안녕히 가세요", romanization: "annyeonghi gaseyo", english: "Goodbye" },
    ],
    modelSentence: { korean: "안녕하세요! 잘 지내세요? 네, 저도 잘 지내요. 안녕히 가세요!", romanization: "Annyeonghaseyo! Jal jinaeseyo? Ne, jeodo jal jinaeyo. Annyeonghi gaseyo!", english: "Hello! How are you? Yes, I'm doing well too. Goodbye!" },
    grammarIds: ["g1", "g5"],
  },

  // ── Café ──
  {
    id: "c3",
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
    id: "c4",
    title: "Ask about the menu",
    scenario: "You're at a café and want to know what teas they have. Ask the staff and order one.",
    topicId: "cafe",
    suggestedPhrases: [
      { korean: "여기요", romanization: "yeogiyo", english: "Excuse me" },
      { korean: "차 있어요?", romanization: "cha isseoyo?", english: "Do you have tea?" },
      { korean: "뜨거운 차 주세요", romanization: "tteugeoun cha juseyo", english: "Hot tea please" },
    ],
    modelSentence: { korean: "여기요! 차 있어요? 뜨거운 녹차 하나 주세요.", romanization: "Yeogiyo! Cha isseoyo? Tteugeoun nokcha hana juseyo.", english: "Excuse me! Do you have tea? One hot green tea please." },
    grammarIds: ["g3", "g5"],
  },

  // ── Daily Life ──
  {
    id: "c5",
    title: "Talk about your weekend",
    scenario: "A friend asks what you did this weekend. Tell them you went somewhere and did something.",
    topicId: "daily-life",
    suggestedPhrases: [
      { korean: "주말에", romanization: "jumare", english: "On the weekend" },
      { korean: "갔어요", romanization: "gasseoyo", english: "I went" },
      { korean: "했어요", romanization: "haesseoyo", english: "I did" },
    ],
    modelSentence: { korean: "주말에 카페에 갔어요. 친구하고 공부했어요.", romanization: "Jumare kapee gasseoyo. Chinguhago gongbuhaesseoyo.", english: "I went to a café on the weekend. I studied with a friend." },
    grammarIds: ["g4", "g7"],
  },
  {
    id: "c6",
    title: "Describe your daily routine",
    scenario: "Tell someone about your typical day — what you do in the morning and evening.",
    topicId: "daily-life",
    suggestedPhrases: [
      { korean: "아침에", romanization: "achime", english: "In the morning" },
      { korean: "저녁에", romanization: "jeonyeoge", english: "In the evening" },
      { korean: "학교에 가요", romanization: "hakgyoe gayo", english: "I go to school" },
    ],
    modelSentence: { korean: "아침에 학교에 가요. 저녁에 집에서 공부해요.", romanization: "Achime hakgyoe gayo. Jeonyeoge jibeseo gongbuhaeyo.", english: "I go to school in the morning. I study at home in the evening." },
    grammarIds: ["g7", "g1"],
  },

  // ── Family ──
  {
    id: "c7",
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
    id: "c8",
    title: "Ask about someone's family",
    scenario: "You want to learn about a friend's family. Ask if they have siblings and how many people are in their family.",
    topicId: "family",
    suggestedPhrases: [
      { korean: "가족이 몇 명이에요?", romanization: "gajogi myeot myeongieyo?", english: "How many people in your family?" },
      { korean: "동생이 있어요?", romanization: "dongsaengi isseoyo?", english: "Do you have younger siblings?" },
      { korean: "할머니, 할아버지", romanization: "halmeoni, harabeoji", english: "Grandmother, grandfather" },
    ],
    modelSentence: { korean: "가족이 몇 명이에요? 동생이 있어요? 할머니, 할아버지도 같이 살아요?", romanization: "Gajogi myeot myeongieyo? Dongsaengi isseoyo? Halmeoni, harabeojido gachi sarayo?", english: "How many people in your family? Do you have younger siblings? Do your grandparents live with you too?" },
    grammarIds: ["g6", "g9"],
  },

  // ── Food ──
  {
    id: "c9",
    title: "Say you're hungry",
    scenario: "It's lunchtime. Tell your friend you're hungry and suggest eating together.",
    topicId: "food",
    suggestedPhrases: [
      { korean: "배고파요", romanization: "baegopayo", english: "I'm hungry" },
      { korean: "같이", romanization: "gachi", english: "Together" },
      { korean: "먹을까요?", romanization: "meogeulkkayo?", english: "Shall we eat?" },
    ],
    modelSentence: { korean: "배고파요! 같이 밥 먹을까요?", romanization: "Baegopayo! Gachi bap meogeulkkayo?", english: "I'm hungry! Shall we eat together?" },
    grammarIds: ["g1", "g8"],
  },
  {
    id: "c10",
    title: "Order food at a restaurant",
    scenario: "You're at a Korean restaurant. Order some dishes and ask if something is spicy.",
    topicId: "food",
    suggestedPhrases: [
      { korean: "주문할게요", romanization: "jumunhalgeyo", english: "I'd like to order" },
      { korean: "김치찌개 주세요", romanization: "gimchijjigae juseyo", english: "Kimchi stew please" },
      { korean: "매워요?", romanization: "maewoyo?", english: "Is it spicy?" },
    ],
    modelSentence: { korean: "여기요, 주문할게요. 김치찌개 하나 주세요. 많이 매워요?", romanization: "Yeogiyo, jumunhalgeyo. Gimchijjigae hana juseyo. Mani maewoyo?", english: "Excuse me, I'd like to order. One kimchi stew please. Is it very spicy?" },
    grammarIds: ["g3", "g8"],
  },
];

// ─── Helpers ───

export function getVocabForTopic(topicId: string): VocabItem[] {
  return vocabulary.filter((v) => v.topicId === topicId);
}

export function getGrammarForTopic(topicId: string): GrammarPoint[] {
  return grammar.filter((g) => g.topicId === topicId);
}

export function getPromptsForTopic(topicId: string): ConversationPrompt[] {
  return conversationPrompts.filter((p) => p.topicId === topicId);
}

export function getTopicByOrder(order: number): Topic | undefined {
  return topics.find((t) => t.order === order);
}

export function getNextTopic(currentTopicId: string): Topic | undefined {
  const current = topics.find((t) => t.id === currentTopicId);
  if (!current) return undefined;
  return topics.find((t) => t.order === current.order + 1);
}
