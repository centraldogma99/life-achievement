import type { Achievement, AchievementSpec, Diary, UserProgress } from '../types'
import { achievements } from '../data/achievements'

const STORAGE_KEYS = {
  ACHIEVEMENTS: 'life-achievements',
  DIARY_ENTRIES: 'diary-entries',
  USER_PROGRESS: 'user-progress',
} as const

// AchievementSpec을 Achievement로 변환
const convertSpecToAchievement = (spec: AchievementSpec): Achievement => {
  return {
    ...spec,
    progress: 0,
    isUnlocked: false,
  }
}

// 기본 업적들을 Achievement로 변환
const getDefaultAchievements = (): Achievement[] => {
  return achievements.map(convertSpecToAchievement)
}

// 업적 데이터 관리
export const saveAchievements = (achievements: Achievement[]): void => {
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements))
}

export const loadAchievements = (): Achievement[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)
  if (!stored) {
    // 처음 실행시 기본 업적으로 초기화
    const defaultAchievementsList = getDefaultAchievements()
    saveAchievements(defaultAchievementsList)
    return defaultAchievementsList
  }

  try {
    const parsed = JSON.parse(stored)
    // 새로운 업적이 추가되었을 경우 병합
    return mergeWithDefaultAchievements(parsed)
  } catch (error) {
    console.error('Failed to parse achievements from localStorage:', error)
    return getDefaultAchievements()
  }
}

// 기본 업적과 저장된 업적 병합 (새 업적 추가 대응)
const mergeWithDefaultAchievements = (storedAchievements: Achievement[]): Achievement[] => {
  const merged = getDefaultAchievements()

  // 저장된 진행상황을 기본 업적에 적용
  storedAchievements.forEach(stored => {
    const index = merged.findIndex(def => def.id === stored.id)
    if (index !== -1) {
      merged[index] = { ...merged[index], ...stored }
    }
  })

  return merged
}

// 일기 데이터 관리
export const saveDiaryEntries = (entries: Diary[]): void => {
  localStorage.setItem(STORAGE_KEYS.DIARY_ENTRIES, JSON.stringify(entries))
}

export const loadDiaryEntries = (): Diary[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.DIARY_ENTRIES)
  if (!stored) return []

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to parse diary entries from localStorage:', error)
    return []
  }
}

export const addDiaryEntry = (entry: Diary): void => {
  const entries = loadDiaryEntries()
  const updatedEntries = [entry, ...entries]
  saveDiaryEntries(updatedEntries)
}

export const updateDiaryEntry = (updatedEntry: Diary): void => {
  const entries = loadDiaryEntries()
  const index = entries.findIndex(entry => entry.id === updatedEntry.id)

  if (index !== -1) {
    entries[index] = updatedEntry
    saveDiaryEntries(entries)
  }
}

export const deleteDiaryEntry = (entryId: string): void => {
  const entries = loadDiaryEntries()
  const filteredEntries = entries.filter(entry => entry.id !== entryId)
  saveDiaryEntries(filteredEntries)
}

// 사용자 진행상황 관리
export const saveUserProgress = (progress: UserProgress): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress))
}

export const loadUserProgress = (): UserProgress => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)
  if (!stored) {
    const initialProgress: UserProgress = {
      totalAchievements: achievements.length,
      unlockedAchievements: 0,
      currentStreak: {},
      totalEntries: 0,
    }
    saveUserProgress(initialProgress)
    return initialProgress
  }

  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error('Failed to parse user progress from localStorage:', error)
    return {
      totalAchievements: achievements.length,
      unlockedAchievements: 0,
      currentStreak: {},
      totalEntries: 0,
    }
  }
}

export const updateUserProgress = (achievements: Achievement[], diaryEntries: Diary[]): void => {
  const unlockedCount = achievements.filter(a => a.isUnlocked).length

  // 카테고리별 연속 스트릭 계산
  const currentStreak: Record<string, number> = {}
  achievements.forEach(achievement => {
    if (achievement.type === 'consecutive') {
      currentStreak[achievement.id] = achievement.progress
    }
  })

  const progress: UserProgress = {
    totalAchievements: achievements.length,
    unlockedAchievements: unlockedCount,
    currentStreak,
    totalEntries: diaryEntries.length,
    lastEntryDate: diaryEntries.length > 0 ? diaryEntries[0].date : undefined,
  }

  saveUserProgress(progress)
}

// 데이터 초기화 (개발/테스트용)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}

// 데이터 내보내기/가져오기 (백업용)
export const exportData = () => {
  const data = {
    achievements: loadAchievements(),
    diaryEntries: loadDiaryEntries(),
    userProgress: loadUserProgress(),
    exportDate: new Date().toISOString(),
  }

  return JSON.stringify(data, null, 2)
}

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString)

    if (data.achievements) saveAchievements(data.achievements)
    if (data.diaryEntries) saveDiaryEntries(data.diaryEntries)
    if (data.userProgress) saveUserProgress(data.userProgress)

    return true
  } catch (error) {
    console.error('Failed to import data:', error)
    return false
  }
}
