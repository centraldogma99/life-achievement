import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, BookOpen, Sparkles } from "lucide-react";
import type { Achievement, DiaryEntry as DiaryEntryType } from "./types";
import { DiaryEntry } from "./components/DiaryEntry";
import { AchievementList } from "./components/AchievementList";
import { AchievementNotification } from "./components/AchievementNotification";
import {
  loadAchievements,
  loadDiaryEntries,
  saveAchievements,
  addDiaryEntry,
  updateUserProgress,
} from "./utils/storage";
import {
  updateAchievementProgress,
  getNewlyUnlockedAchievements,
} from "./utils/achievements";

type TabType = "diary" | "achievements";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("diary");
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntryType[]>([]);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<
    Achievement[]
  >([]);

  // 초기 데이터 로드
  useEffect(() => {
    const loadedAchievements = loadAchievements();
    const loadedEntries = loadDiaryEntries();

    setAchievements(loadedAchievements);
    setDiaryEntries(loadedEntries);
  }, []);

  // 일기 저장 핸들러
  const handleDiarySave = (newEntry: DiaryEntryType) => {
    // 로컬 스토리지에 일기 저장
    addDiaryEntry(newEntry);

    // 상태 업데이트
    const updatedEntries = [newEntry, ...diaryEntries];
    setDiaryEntries(updatedEntries);

    // 업적 진행상황 업데이트
    const oldAchievements = [...achievements];
    const updatedAchievements = updateAchievementProgress(
      achievements,
      diaryEntries,
      newEntry,
    );

    // 새로 달성한 업적 확인
    const newlyUnlocked = getNewlyUnlockedAchievements(
      oldAchievements,
      updatedAchievements,
    );

    if (newlyUnlocked.length > 0) {
      setNewlyUnlockedAchievements(newlyUnlocked);
    }

    // 업적과 사용자 진행상황 저장
    setAchievements(updatedAchievements);
    saveAchievements(updatedAchievements);
    updateUserProgress(updatedAchievements, updatedEntries);
  };

  // 알림 닫기 핸들러
  const handleNotificationClose = (achievementId: string) => {
    setNewlyUnlockedAchievements((prev) =>
      prev.filter((achievement) => achievement.id !== achievementId),
    );
  };

  const tabs = [
    {
      id: "diary" as const,
      label: "일기 작성",
      icon: BookOpen,
      description: "오늘 하루를 기록하고 업적을 달성해보세요",
    },
    {
      id: "achievements" as const,
      label: "업적 현황",
      icon: Trophy,
      description: "달성한 업적들을 확인하고 진행상황을 살펴보세요",
    },
  ];

  const stats = {
    totalAchievements: achievements.length,
    unlockedAchievements: achievements.filter((a) => a.isUnlocked).length,
    totalEntries: diaryEntries.length,
    completionRate:
      achievements.length > 0
        ? Math.round(
            (achievements.filter((a) => a.isUnlocked).length /
              achievements.length) *
              100,
          )
        : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 로고 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Life Achievement
                </h1>
                <p className="text-xs text-gray-600">일상 속 업적 시스템</p>
              </div>
            </div>

            {/* 통계 */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {stats.totalEntries}
                </div>
                <div className="text-xs text-gray-600">총 일기</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {stats.unlockedAchievements}
                </div>
                <div className="text-xs text-gray-600">달성 업적</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {stats.completionRate}%
                </div>
                <div className="text-xs text-gray-600">달성률</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-3 px-4 py-4 text-sm font-medium transition-colors
                    ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:block">{tab.label}</span>

                  {/* 활성 탭 표시 */}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 탭 설명 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">
              {tabs.find((tab) => tab.id === activeTab)?.description}
            </p>
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === "diary" && <DiaryEntry onSave={handleDiarySave} />}

          {activeTab === "achievements" && (
            <AchievementList achievements={achievements} />
          )}
        </motion.div>
      </main>

      {/* 업적 달성 알림 */}
      <AchievementNotification
        achievements={newlyUnlockedAchievements}
        onClose={handleNotificationClose}
      />

      {/* 푸터 */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              일상 속 작은 성취들이 모여 큰 변화를 만듭니다. 💪
            </p>
            <p>Life Achievement - 당신의 성장을 기록하고 인정받으세요.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
