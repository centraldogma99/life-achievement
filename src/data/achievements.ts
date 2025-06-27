import type { AchievementSpec } from '../types'

export const achievements: readonly AchievementSpec[] = [
  // {
  //   id: 'first_diary',
  //   name: '위대한 시작',
  //   rarity: 'common',
  //   description: '첫 번째 일기를 작성했습니다.',
  //   icon: '🎉',
  //   category: 'lifestyle',
  //   type: 'single',
  //   target: 1,
  // },
  {
    id: 'exercise_streak_1',
    name: '일주일 연속 운동',
    rarity: 'common',
    description: '일주일 연속 운동을 달성했습니다.',
    icon: '🏆',
    category: 'exercise',
    type: 'consecutive',
    target: 2,
  },
  {
    id: 'exercise_streak_2',
    name: '한 달 연속 운동',
    rarity: 'common',
    description: '한 달 연속 운동을 달성했습니다.',
    icon: '🏆',
    category: 'exercise',
    type: 'consecutive',
    target: 30,
  },
  {
    id: 'reading_start',
    name: '독서 시작',
    rarity: 'common',
    description: '첫 번째 독서를 시작했습니다.',
    icon: '🏆',
    category: 'reading',
    type: 'single',
    target: 1,
  },
] as const

export type AchievementId = (typeof achievements)[number]['id']
