import type { AchievementId } from './achievements'
import type { DailyActivityId } from './dailyActivities'

export const achievementsAndActivitiesMap: Record<AchievementId, DailyActivityId[]> = {
  exercise_streak_1: ['exercise'],
  exercise_streak_2: ['exercise'],
  reading_start: ['reading'],
} as const
