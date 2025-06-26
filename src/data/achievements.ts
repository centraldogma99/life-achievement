import type { Achievement } from '../types';

export const defaultAchievements: Achievement[] = [
  // 운동 관련 업적
  {
    id: 'exercise-streak-7',
    name: '일주일 운동러',
    description: '7일 연속 운동하기',
    icon: '🏃‍♂️',
    category: 'exercise',
    condition: {
      type: 'consecutive',
      target: 7,
      keywords: ['운동', '헬스', '달리기', '조깅', '웨이트', '요가', '필라테스', '수영', '사이클링', '농구', '축구', '테니스']
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'common'
  },
  {
    id: 'exercise-streak-20',
    name: '철인 트라이애슬론',
    description: '20일 연속 운동하기',
    icon: '💪',
    category: 'exercise',
    condition: {
      type: 'consecutive',
      target: 20,
      keywords: ['운동', '헬스', '달리기', '조깅', '웨이트', '요가', '필라테스', '수영', '사이클링', '농구', '축구', '테니스']
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'rare'
  },
  {
    id: 'exercise-total-100',
    name: '백일장 운동가',
    description: '총 100일 운동하기',
    icon: '🏆',
    category: 'exercise',
    condition: {
      type: 'total',
      target: 100,
      keywords: ['운동', '헬스', '달리기', '조깅', '웨이트', '요가', '필라테스', '수영', '사이클링', '농구', '축구', '테니스']
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'epic'
  },

  // 독서 관련 업적
  {
    id: 'reading-streak-7',
    name: '책벌레 입문',
    description: '7일 연속 독서하기',
    icon: '📚',
    category: 'reading',
    condition: {
      type: 'consecutive',
      target: 7,
      keywords: ['책', '독서', '읽기', '소설', '에세이', '자기계발서', '전문서', '만화', '웹툰', '잡지']
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'common'
  },
  {
    id: 'reading-streak-30',
    name: '진짜 책벌레',
    description: '30일 연속 독서하기',
    icon: '🤓',
    category: 'reading',
    condition: {
      type: 'consecutive',
      target: 30,
      keywords: ['책', '독서', '읽기', '소설', '에세이', '자기계발서', '전문서', '만화', '웹툰', '잡지']
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'rare'
  },

  // 생활 습관 관련 업적
  {
    id: 'early-bird-streak-7',
    name: '얼리버드',
    description: '7일 연속 일찍 기상하기',
    icon: '🌅',
    category: 'lifestyle',
    condition: {
      type: 'consecutive',
      target: 7,
      keywords: ['일찍', '기상', '새벽', '아침', '6시', '7시', '일어났', '일어나기']
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'common'
  },
  {
    id: 'sleep-early-streak-7',
    name: '일찍 자는 사람',
    description: '7일 연속 일찍 잠자리에 들기',
    icon: '😴',
    category: 'lifestyle',
    condition: {
      type: 'consecutive',
      target: 7,
      keywords: ['일찍', '잠', '수면', '잠자리', '10시', '11시', '잤다', '자기']
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'common'
  },

  // 생산성 관련 업적
  {
    id: 'study-streak-7',
    name: '공부벌레',
    description: '7일 연속 공부하기',
    icon: '📖',
    category: 'productivity',
    condition: {
      type: 'consecutive',
      target: 7,
      keywords: ['공부', '학습', '강의', '코딩', '프로그래밍', '과제', '시험', '자격증']
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'common'
  },
  {
    id: 'work-productive-streak-5',
    name: '생산성 킹',
    description: '5일 연속 생산적인 하루 보내기',
    icon: '⚡',
    category: 'productivity',
    condition: {
      type: 'consecutive',
      target: 5,
      keywords: ['생산적', '효율적', '집중', '업무', '프로젝트', '완료', '성취', '목표']
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'rare'
  },

  // 건강 관련 업적
  {
    id: 'water-intake-streak-7',
    name: '물 많이 마시기',
    description: '7일 연속 충분한 수분 섭취',
    icon: '💧',
    category: 'health',
    condition: {
      type: 'consecutive',
      target: 7,
      keywords: ['물', '수분', '마셨', '마시기', '리터', '충분히']
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'common'
  },
  {
    id: 'meditation-streak-7',
    name: '마음챙김 마스터',
    description: '7일 연속 명상하기',
    icon: '🧘‍♂️',
    category: 'health',
    condition: {
      type: 'consecutive',
      target: 7,
      keywords: ['명상', '마음챙김', '요가', '호흡', '평온', '집중']
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'rare'
  },

  // 특별 업적
  {
    id: 'diary-master',
    name: '일기장 마스터',
    description: '100개의 일기 작성하기',
    icon: '📝',
    category: 'productivity',
    condition: {
      type: 'total',
      target: 100,
      keywords: []
    },
    isUnlocked: false,
    progress: 0,
    rarity: 'legendary'
  }
]; 