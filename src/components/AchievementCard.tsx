import { motion } from 'framer-motion'
import { Lock, Trophy, Star } from 'lucide-react'
import type { Achievement } from '../types'
import { getCategoryColor, getRarityColor, getRarityGradient } from '../utils/achievements'

interface AchievementCardProps {
  achievement: Achievement
  showProgress?: boolean
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, showProgress = true }) => {
  const progressPercentage =
    achievement.condition.target > 0 ? Math.min((achievement.progress / achievement.condition.target) * 100, 100) : 0

  const rarityIcon = {
    common: null,
    rare: <Star className="w-4 h-4 text-blue-500" />,
    epic: <Star className="w-4 h-4 text-purple-500" />,
    legendary: <Trophy className="w-4 h-4 text-yellow-500" />,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`
        relative rounded-xl p-6 border-2 transition-all duration-300
        ${achievement.isUnlocked ? 'shadow-lg' : 'opacity-75'}
        ${getRarityColor(achievement.rarity)}
        bg-gradient-to-br ${getRarityGradient(achievement.rarity)}
      `}
    >
      {/* 희귀도 표시 */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        {rarityIcon[achievement.rarity]}
        <span
          className={`text-xs font-medium capitalize
          ${
            achievement.rarity === 'legendary'
              ? 'text-yellow-600'
              : achievement.rarity === 'epic'
                ? 'text-purple-600'
                : achievement.rarity === 'rare'
                  ? 'text-blue-600'
                  : 'text-gray-600'
          }
        `}
        >
          {achievement.rarity}
        </span>
      </div>

      {/* 아이콘과 제목 */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`
          relative w-12 h-12 rounded-full flex items-center justify-center text-white text-xl
          ${getCategoryColor(achievement.category)}
        `}
        >
          {achievement.isUnlocked ? <span>{achievement.icon}</span> : <Lock className="w-6 h-6" />}

          {/* 달성 효과 */}
          {achievement.isUnlocked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-full bg-yellow-400 opacity-20"
            />
          )}
        </div>

        <div className="flex-1">
          <h3 className={`font-bold text-lg mb-1 ${achievement.isUnlocked ? 'text-gray-900' : 'text-gray-600'}`}>
            {achievement.name}
          </h3>
          <p className={`text-sm ${achievement.isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
            {achievement.description}
          </p>
        </div>
      </div>

      {/* 진행률 표시 */}
      {showProgress && !achievement.isUnlocked && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">진행률</span>
            <span className="text-sm font-medium text-gray-800">
              {achievement.progress} / {achievement.condition.target}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className={`h-2 rounded-full ${getCategoryColor(achievement.category)}`}
            />
          </div>
        </div>
      )}

      {/* 달성 일자 */}
      {achievement.isUnlocked && achievement.unlockedAt && (
        <div className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-200">
          달성일: {new Date(achievement.unlockedAt).toLocaleDateString('ko-KR')}
        </div>
      )}

      {/* 카테고리 태그 */}
      <div className="absolute bottom-3 left-3">
        <span
          className={`
          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white
          ${getCategoryColor(achievement.category)}
        `}
        >
          {achievement.category === 'exercise' && '운동'}
          {achievement.category === 'reading' && '독서'}
          {achievement.category === 'lifestyle' && '생활'}
          {achievement.category === 'productivity' && '생산성'}
          {achievement.category === 'health' && '건강'}
        </span>
      </div>
    </motion.div>
  )
}
