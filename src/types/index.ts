export type AchievementStatus = UnlockedAchievementStatus | LockedAchievementStatus
type BaseAchievementStatus = {
  id: string
  progress: number
}
type UnlockedAchievementStatus = {
  isUnlocked: true
  unlockedAt: Date
} & BaseAchievementStatus
type LockedAchievementStatus = {
  isUnlocked: false
} & BaseAchievementStatus

type BaseAchievementSpec = {
  id: string
  name: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  icon: string
  category: 'exercise' | 'reading' | 'lifestyle' | 'productivity' | 'health'
}
type SingleAchievementSpec = {
  type: 'single'
  target: 1
} & BaseAchievementSpec
type NonSingleAchievementSpec = {
  type: 'consecutive' | 'total'
  target: number
} & BaseAchievementSpec

export type AchievementSpec = SingleAchievementSpec | NonSingleAchievementSpec

export type Achievement = AchievementSpec & AchievementStatus

// 일기 엔트리 타입
export interface Diary {
  id: string
  date: string
  content: string
  activities: DiaryAnalyzeResult['activities']
  createdAt: Date
}

// 사용자 진행상황 타입
export interface UserProgress {
  totalAchievements: number
  unlockedAchievements: number
  currentStreak: Record<string, number>
  totalEntries: number
  lastEntryDate?: string
}

export interface DiaryAnalyzeResult {
  activities: {
    id: string
    name: string
    reason: string
  }[]
}
