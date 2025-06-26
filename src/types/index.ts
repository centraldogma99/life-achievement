// 업적 타입 정의
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "exercise" | "reading" | "lifestyle" | "productivity" | "health";
  condition: {
    type: "consecutive" | "total" | "single";
    target: number;
    keywords: string[];
  };
  unlockedAt?: Date;
  isUnlocked: boolean;
  progress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

// 일기 엔트리 타입
export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  extractedActions: string[];
  achievementProgress: Record<string, number>;
  createdAt: Date;
}

// 사용자 진행상황 타입
export interface UserProgress {
  totalAchievements: number;
  unlockedAchievements: number;
  currentStreak: Record<string, number>;
  totalEntries: number;
  lastEntryDate?: string;
}

// LLM 응답 타입
export interface LLMResponse {
  actions: string[];
  keywords: string[];
  confidence: number;
}
