import type { Achievement, Diary } from '../types'
import { achievementsAndActivitiesMap } from '../data/asdf'

export const updateAchievementProgress = (
  achievements: Achievement[],
  newDiary: Diary,
): Achievement[] => {
  return achievements.map(achievement => {
    if (achievement.isUnlocked) return achievement

    const hasActivity =
      intersect(
        achievementsAndActivitiesMap[achievement.id],
        newDiary.activities.map(activity => activity.id),
      ).length > 0

    if (!hasActivity && achievement.type === 'consecutive') {
      return {
        ...achievement,
        progress: 0,
      }
    } else {
      const newProgress = achievement.progress + 1
      if (newProgress >= achievement.target) {
        return {
          ...achievement,
          progress: newProgress,
          isUnlocked: true,
          unlockedAt: new Date(),
        }
      } else {
        return {
          ...achievement,
          progress: newProgress,
        }
      }
    }
  })
}

// 업적 카테고리별 색상 매핑
export const getCategoryColor = (category: Achievement['category']): string => {
  const colors = {
    exercise: 'bg-red-500',
    reading: 'bg-blue-500',
    lifestyle: 'bg-green-500',
    productivity: 'bg-purple-500',
    health: 'bg-pink-500',
  }
  return colors[category]
}

// 업적 희귀도별 색상 매핑
export const getRarityColor = (rarity: Achievement['rarity']): string => {
  const colors = {
    common: 'border-gray-400',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-yellow-400',
  }
  return colors[rarity]
}

// 업적 희귀도별 배경 그라디언트
export const getRarityGradient = (rarity: Achievement['rarity']): string => {
  const gradients = {
    common: 'from-gray-50 to-gray-100',
    rare: 'from-blue-50 to-blue-100',
    epic: 'from-purple-50 to-purple-100',
    legendary: 'from-yellow-50 to-yellow-100',
  }
  return gradients[rarity]
}

// 새로 달성한 업적 찾기
export const getNewlyUnlockedAchievements = (
  oldAchievements: Achievement[],
  newAchievements: Achievement[],
): Achievement[] => {
  return newAchievements.filter((newAch, index) => {
    const oldAch = oldAchievements[index]
    return newAch.isUnlocked && !oldAch?.isUnlocked
  })
}

const intersect = <T>(a: T[], b: T[]): T[] => {
  return a.filter(item => b.includes(item))
}
