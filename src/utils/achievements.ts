import { differenceInDays } from "date-fns";
import type { Achievement, DiaryEntry } from "../types";

// 업적 진행상황 업데이트
export const updateAchievementProgress = (
  achievements: Achievement[],
  diaryEntries: DiaryEntry[],
  newEntry: DiaryEntry,
): Achievement[] => {
  const updatedAchievements = [...achievements];

  // 날짜순으로 정렬된 일기 목록 (새 엔트리 포함)
  const allEntries = [...diaryEntries, newEntry].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  updatedAchievements.forEach((achievement) => {
    if (achievement.isUnlocked) return; // 이미 달성한 업적은 건너뛰기

    const { condition } = achievement;

    if (condition.type === "consecutive") {
      // 연속 업적 처리
      const streak = calculateConsecutiveStreak(allEntries, condition.keywords);
      achievement.progress = streak;

      if (streak >= condition.target) {
        achievement.isUnlocked = true;
        achievement.unlockedAt = new Date();
      }
    } else if (condition.type === "total") {
      // 총합 업적 처리
      const total = calculateTotalCount(allEntries, condition.keywords);
      achievement.progress = total;

      if (total >= condition.target) {
        achievement.isUnlocked = true;
        achievement.unlockedAt = new Date();
      }
    } else if (condition.type === "single") {
      // 단일 업적 처리
      const hasAction = checkSingleAction(newEntry, condition.keywords);
      if (hasAction) {
        achievement.progress = 1;
        achievement.isUnlocked = true;
        achievement.unlockedAt = new Date();
      }
    }
  });

  return updatedAchievements;
};

// 연속 스트릭 계산
const calculateConsecutiveStreak = (
  entries: DiaryEntry[],
  keywords: string[],
): number => {
  if (entries.length === 0) return 0;

  // 최신 날짜부터 역순으로 확인
  const sortedEntries = entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  let streak = 0;
  let currentDate = new Date();

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    const daysDiff = differenceInDays(currentDate, entryDate);

    // 오늘이거나 어제까지는 연속으로 인정
    if (daysDiff <= 1 && hasMatchingKeywords(entry, keywords)) {
      streak++;
      currentDate = entryDate;
    } else if (daysDiff > 1) {
      // 하루 이상 건너뛴 경우 스트릭 중단
      break;
    }
  }

  return streak;
};

// 총 개수 계산
const calculateTotalCount = (
  entries: DiaryEntry[],
  keywords: string[],
): number => {
  if (keywords.length === 0) {
    // 키워드가 없으면 총 일기 개수 (일기장 마스터 업적용)
    return entries.length;
  }

  return entries.filter((entry) => hasMatchingKeywords(entry, keywords)).length;
};

// 단일 액션 확인
const checkSingleAction = (entry: DiaryEntry, keywords: string[]): boolean => {
  return hasMatchingKeywords(entry, keywords);
};

// 키워드 매칭 확인
const hasMatchingKeywords = (
  entry: DiaryEntry,
  keywords: string[],
): boolean => {
  if (keywords.length === 0) return true;

  const content = entry.content.toLowerCase();
  const extractedActions = entry.extractedActions.map((action) =>
    action.toLowerCase(),
  );

  return keywords.some(
    (keyword) =>
      content.includes(keyword.toLowerCase()) ||
      extractedActions.some((action) => action.includes(keyword.toLowerCase())),
  );
};

// 업적 카테고리별 색상 매핑
export const getCategoryColor = (category: Achievement["category"]): string => {
  const colors = {
    exercise: "bg-red-500",
    reading: "bg-blue-500",
    lifestyle: "bg-green-500",
    productivity: "bg-purple-500",
    health: "bg-pink-500",
  };
  return colors[category];
};

// 업적 희귀도별 색상 매핑
export const getRarityColor = (rarity: Achievement["rarity"]): string => {
  const colors = {
    common: "border-gray-400",
    rare: "border-blue-400",
    epic: "border-purple-400",
    legendary: "border-yellow-400",
  };
  return colors[rarity];
};

// 업적 희귀도별 배경 그라디언트
export const getRarityGradient = (rarity: Achievement["rarity"]): string => {
  const gradients = {
    common: "from-gray-50 to-gray-100",
    rare: "from-blue-50 to-blue-100",
    epic: "from-purple-50 to-purple-100",
    legendary: "from-yellow-50 to-yellow-100",
  };
  return gradients[rarity];
};

// 새로 달성한 업적 찾기
export const getNewlyUnlockedAchievements = (
  oldAchievements: Achievement[],
  newAchievements: Achievement[],
): Achievement[] => {
  return newAchievements.filter((newAch, index) => {
    const oldAch = oldAchievements[index];
    return newAch.isUnlocked && !oldAch?.isUnlocked;
  });
};
