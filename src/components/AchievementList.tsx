import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Search, Trophy, Lock, Sparkles } from 'lucide-react'
import type { Achievement } from '../types'
import { AchievementCard } from './AchievementCard'

interface AchievementListProps {
  achievements: Achievement[]
}

type FilterType = 'all' | 'unlocked' | 'locked' | 'exercise' | 'reading' | 'lifestyle' | 'productivity' | 'health'

export const AchievementList = ({ achievements }: AchievementListProps) => {
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // 통계 계산
  const stats = useMemo(() => {
    const total = achievements.length
    const unlocked = achievements.filter(a => a.isUnlocked).length
    const completion = total > 0 ? Math.round((unlocked / total) * 100) : 0

    return { total, unlocked, completion }
  }, [achievements])

  // 필터링된 업적 목록
  const filteredAchievements = useMemo(() => {
    let filtered = achievements

    // 상태 필터
    if (filter === 'unlocked') {
      filtered = filtered.filter(a => a.isUnlocked)
    } else if (filter === 'locked') {
      filtered = filtered.filter(a => !a.isUnlocked)
    } else if (filter !== 'all') {
      filtered = filtered.filter(a => a.category === filter)
    }

    // 검색 필터
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(a => a.name.toLowerCase().includes(term) || a.description.toLowerCase().includes(term))
    }

    return filtered
  }, [achievements, filter, searchTerm])

  const filterOptions = [
    { value: 'all' as const, label: '전체', icon: Sparkles },
    { value: 'unlocked' as const, label: '달성됨', icon: Trophy },
    { value: 'locked' as const, label: '미달성', icon: Lock },
    { value: 'exercise' as const, label: '운동', icon: null },
    { value: 'reading' as const, label: '독서', icon: null },
    { value: 'lifestyle' as const, label: '생활', icon: null },
    { value: 'productivity' as const, label: '생산성', icon: null },
    { value: 'health' as const, label: '건강', icon: null },
  ]

  return (
    <div className="space-y-6">
      {/* 통계 섹션 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">업적 현황</h2>
          <div className="flex items-center gap-2 text-blue-600">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">
              {stats.unlocked} / {stats.total}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">전체 업적</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.unlocked}</div>
            <div className="text-sm text-gray-600">달성한 업적</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.completion}%</div>
            <div className="text-sm text-gray-600">달성률</div>
          </div>
        </div>

        {/* 전체 진행률 바 */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">전체 진행률</span>
            <span className="text-sm font-medium text-gray-900">{stats.completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.completion}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* 검색 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="업적 검색..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 필터 버튼들 */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      filter === option.value
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 결과 수 표시 */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Filter className="w-4 h-4" />
          <span>{filteredAchievements.length}개의 업적</span>
        </div>
      </div>

      {/* 업적 그리드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter + searchTerm}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} showProgress={!achievement.isUnlocked} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* 빈 결과 */}
      {filteredAchievements.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600">다른 검색어나 필터를 시도해보세요.</p>
        </motion.div>
      )}
    </div>
  )
}
