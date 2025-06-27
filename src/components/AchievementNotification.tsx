import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X, Star, Sparkles } from 'lucide-react'
import type { Achievement } from '../types'

interface AchievementNotificationProps {
  achievements: Achievement[]
  onClose: (achievementId: string) => void
}

export const AchievementNotification = ({ achievements, onClose }: AchievementNotificationProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievements.length > 0) {
      setIsVisible(true)
      setCurrentIndex(0)

      // 각 알림을 4초간 표시 후 자동 닫기
      const timer = setTimeout(() => {
        if (currentIndex < achievements.length - 1) {
          setCurrentIndex(prev => prev + 1)
        } else {
          setIsVisible(false)
          setTimeout(() => {
            achievements.forEach(achievement => onClose(achievement.id))
          }, 500)
        }
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [achievements, currentIndex, onClose])

  if (achievements.length === 0) return null

  const currentAchievement = achievements[currentIndex]

  const rarityConfig = {
    common: {
      bgColor: 'from-gray-100 to-gray-200',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-800',
      accentColor: 'text-gray-600',
    },
    rare: {
      bgColor: 'from-blue-100 to-blue-200',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-900',
      accentColor: 'text-blue-600',
    },
    epic: {
      bgColor: 'from-purple-100 to-purple-200',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-900',
      accentColor: 'text-purple-600',
    },
    legendary: {
      bgColor: 'from-yellow-100 to-yellow-200',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-900',
      accentColor: 'text-yellow-600',
    },
  }

  const config = rarityConfig[currentAchievement.rarity]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <motion.div
            className={`
              relative p-6 rounded-xl border-2 shadow-2xl backdrop-blur-sm
              bg-gradient-to-br ${config.bgColor} ${config.borderColor}
            `}
            initial={{ rotate: -5 }}
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 0.5, repeat: 1 }}
          >
            {/* 배경 애니메이션 효과 */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onClose(currentAchievement.id), 300)
              }}
              className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-white/50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 헤더 */}
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white relative"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
              >
                <Trophy className="w-6 h-6" />

                {/* 반짝이는 효과 */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(255, 215, 0, 0.7)',
                      '0 0 0 10px rgba(255, 215, 0, 0)',
                      '0 0 0 0 rgba(255, 215, 0, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-lg ${config.textColor}`}>업적 달성!</h3>
                  {currentAchievement.rarity !== 'common' && (
                    <div className="flex items-center gap-1">
                      {currentAchievement.rarity === 'legendary' ? (
                        <Star className={`w-4 h-4 ${config.accentColor}`} />
                      ) : (
                        <Sparkles className={`w-4 h-4 ${config.accentColor}`} />
                      )}
                      <span className={`text-xs font-medium uppercase ${config.accentColor}`}>
                        {currentAchievement.rarity}
                      </span>
                    </div>
                  )}
                </div>
                <p className={`text-sm ${config.accentColor}`}>새로운 업적을 획득했습니다!</p>
              </div>
            </div>

            {/* 업적 정보 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentAchievement.icon}</span>
                <div>
                  <h4 className={`font-bold ${config.textColor}`}>{currentAchievement.name}</h4>
                  <p className={`text-sm ${config.accentColor}`}>{currentAchievement.description}</p>
                </div>
              </div>

              {/* 달성 일시 */}
              {currentAchievement.isUnlocked && currentAchievement.unlockedAt && (
                <div className={`text-xs ${config.accentColor} pt-2 border-t border-current/20`}>
                  달성 시간: {new Date(currentAchievement.unlockedAt).toLocaleString('ko-KR')}
                </div>
              )}
            </div>

            {/* 진행 표시기 (여러 업적이 있을 때) */}
            {achievements.length > 1 && (
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-current/20">
                <span className={`text-xs ${config.accentColor}`}>
                  {currentIndex + 1} / {achievements.length}
                </span>
                <div className="flex-1 flex gap-1">
                  {achievements.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 rounded-full flex-1 ${
                        index === currentIndex ? 'bg-current opacity-80' : 'bg-current opacity-20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 축하 입자 효과 */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: 50,
                    y: 50,
                    scale: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
