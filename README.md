# Life Achievement 🏆

일상 속 작은 성취들을 기록하고 추적하는 "스팀 업적" 스타일의 웹 애플리케이션입니다.

## ✨ 주요 기능

- 📝 **일기 작성**: 하루 일과를 자유롭게 기록
- 🤖 **AI 분석**: LLM을 통해 일기 내용에서 활동 자동 추출
- 🏅 **업적 시스템**: 다양한 카테고리의 업적 달성 및 진행 상황 추적
- 🎯 **실시간 알림**: 새로운 업적 달성 시 즉시 알림
- 📊 **진행률 추적**: 개인 성장과 습관 형성 현황 시각화
- 💾 **로컬 저장**: 브라우저 로컬 스토리지를 통한 데이터 보관

## 🎮 업적 카테고리

### 🏃‍♂️ 운동

- 일주일 운동러 (7일 연속)
- 철인 트라이애슬론 (20일 연속)
- 백일장 운동가 (총 100일)

### 📚 독서

- 책벌레 입문 (7일 연속)
- 진짜 책벌레 (30일 연속)

### 🌅 생활습관

- 얼리버드 (7일 연속 일찍 기상)
- 일찍 자는 사람 (7일 연속 일찍 취침)

### ⚡ 생산성

- 공부벌레 (7일 연속 공부)
- 생산성 킹 (5일 연속 생산적인 하루)

### 💧 건강

- 물 많이 마시기 (7일 연속 충분한 수분 섭취)
- 마음챙김 마스터 (7일 연속 명상)

### 🏆 특별 업적

- 일기장 마스터 (100개 일기 작성)

## 🚀 시작하기

### 필요 조건

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 환경 변수 설정 (선택사항)

OpenAI API를 사용하려면 `.env` 파일을 생성하고 API 키를 설정하세요:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

> **참고**: OpenAI API 키가 없어도 키워드 기반 분석으로 동작합니다.

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **스타일링**: Tailwind CSS
- **애니메이션**: Framer Motion
- **아이콘**: Lucide React
- **폼 관리**: React Hook Form
- **날짜 처리**: date-fns
- **AI 분석**: OpenAI GPT-3.5-turbo (선택사항)
- **저장소**: Browser LocalStorage

## 📖 사용법

### 1. 일기 작성

1. "일기 작성" 탭으로 이동
2. 날짜를 선택하고 하루 일과를 자유롭게 작성
3. "미리보기" 버튼으로 AI 분석 결과 확인
4. "일기 저장" 버튼으로 저장

### 2. 업적 확인

1. "업적 현황" 탭으로 이동
2. 달성한 업적과 진행 중인 업적 확인
3. 필터와 검색으로 원하는 업적 찾기

### 3. 효과적인 업적 달성 팁

- 구체적인 활동 명시 (예: "30분 조깅", "책 50페이지 읽음")
- 시간이나 양을 포함하여 작성
- 여러 활동을 한 경우 모두 기록

## 🔧 커스터마이징

### 새로운 업적 추가

`src/data/achievements.ts` 파일을 수정하여 새로운 업적을 추가할 수 있습니다:

```typescript
{
  id: 'new-achievement',
  name: '새로운 업적',
  description: '새로운 업적 설명',
  icon: '🎯',
  category: 'productivity',
  condition: {
    type: 'consecutive',
    target: 7,
    keywords: ['키워드1', '키워드2']
  },
  isUnlocked: false,
  progress: 0,
  rarity: 'common'
}
```

### 분석 키워드 수정

`src/utils/llm.ts` 파일에서 분석 키워드를 수정할 수 있습니다.

## 🎨 디자인 시스템

### 희귀도별 색상

- **Common**: 회색 (일반적인 업적)
- **Rare**: 파란색 (조금 어려운 업적)
- **Epic**: 보라색 (상당히 어려운 업적)
- **Legendary**: 황금색 (전설적인 업적)

### 카테고리별 색상

- **운동**: 빨간색
- **독서**: 파란색
- **생활**: 초록색
- **생산성**: 보라색
- **건강**: 분홍색

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 관한 문의사항이나 개선 제안이 있으시면 이슈를 열어주세요.

---

**Life Achievement** - 일상 속 작은 성취들이 모여 큰 변화를 만듭니다! 💪
