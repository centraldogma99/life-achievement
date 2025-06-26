import type { LLMResponse } from '../types'

// 실제 프로덕션에서는 OpenAI API를 사용하지만,
// 데모 목적으로 키워드 기반 분석 함수를 구현합니다.
export const analyzeJournalEntry = async (content: string): Promise<LLMResponse> => {
  // 실제 환경에서는 여기에 OpenAI API 호출을 구현합니다.
  // const response = await openai.chat.completions.create({...});

  // 데모를 위한 키워드 기반 분석
  const actions: string[] = []
  const keywords: string[] = []

  const exerciseKeywords = [
    '운동',
    '헬스',
    '달리기',
    '조깅',
    '웨이트',
    '요가',
    '필라테스',
    '수영',
    '사이클링',
    '농구',
    '축구',
    '테니스',
  ]
  const readingKeywords = ['책', '독서', '읽기', '소설', '에세이', '자기계발서', '전문서', '만화', '웹툰', '잡지']
  const lifestyleKeywords = [
    '일찍',
    '기상',
    '새벽',
    '아침',
    '6시',
    '7시',
    '일어났',
    '일어나기',
    '잠',
    '수면',
    '잠자리',
    '10시',
    '11시',
    '잤다',
    '자기',
  ]
  const productivityKeywords = [
    '공부',
    '학습',
    '강의',
    '코딩',
    '프로그래밍',
    '과제',
    '시험',
    '자격증',
    '생산적',
    '효율적',
    '집중',
    '업무',
    '프로젝트',
    '완료',
    '성취',
    '목표',
  ]
  const healthKeywords = ['물', '수분', '마셨', '마시기', '리터', '충분히', '명상', '마음챙김', '호흡', '평온']

  // 운동 관련 분석
  exerciseKeywords.forEach(keyword => {
    if (content.includes(keyword)) {
      if (!actions.includes('운동')) actions.push('운동')
      keywords.push(keyword)
    }
  })

  // 독서 관련 분석
  readingKeywords.forEach(keyword => {
    if (content.includes(keyword)) {
      if (!actions.includes('독서')) actions.push('독서')
      keywords.push(keyword)
    }
  })

  // 생활습관 관련 분석
  lifestyleKeywords.forEach(keyword => {
    if (content.includes(keyword)) {
      if (
        keyword.includes('일찍') ||
        keyword.includes('기상') ||
        keyword.includes('새벽') ||
        keyword.includes('아침') ||
        keyword.includes('일어')
      ) {
        if (!actions.includes('일찍기상')) actions.push('일찍기상')
      }
      if (keyword.includes('잠') || keyword.includes('수면') || keyword.includes('자')) {
        if (!actions.includes('일찍잠자리')) actions.push('일찍잠자리')
      }
      keywords.push(keyword)
    }
  })

  // 생산성 관련 분석
  productivityKeywords.forEach(keyword => {
    if (content.includes(keyword)) {
      if (['공부', '학습', '강의', '코딩', '프로그래밍', '과제', '시험', '자격증'].includes(keyword)) {
        if (!actions.includes('공부')) actions.push('공부')
      }
      if (['생산적', '효율적', '집중', '업무', '프로젝트', '완료', '성취', '목표'].includes(keyword)) {
        if (!actions.includes('생산적인하루')) actions.push('생산적인하루')
      }
      keywords.push(keyword)
    }
  })

  // 건강 관련 분석
  healthKeywords.forEach(keyword => {
    if (content.includes(keyword)) {
      if (['물', '수분', '마셨', '마시기', '리터', '충분히'].includes(keyword)) {
        if (!actions.includes('수분섭취')) actions.push('수분섭취')
      }
      if (['명상', '마음챙김', '호흡', '평온'].includes(keyword)) {
        if (!actions.includes('명상')) actions.push('명상')
      }
      keywords.push(keyword)
    }
  })

  // 신뢰도 계산 (키워드 개수 기반)
  const confidence = Math.min(keywords.length * 0.2, 0.95)

  return {
    actions,
    keywords,
    confidence,
  }
}

// OpenAI API를 사용하는 실제 함수 (환경변수 설정 필요)
export const analyzeWithOpenAI = async (content: string): Promise<LLMResponse> => {
  // 환경변수에서 API 키를 가져옵니다.
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    console.warn('OpenAI API key not found, using fallback analysis')
    return analyzeJournalEntry(content)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '',
          },
          {
            role: 'user',
            content: content,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const result = JSON.parse(data.choices[0].message.content)

    return {
      actions: result.actions || [],
      keywords: result.keywords || [],
      confidence: result.confidence || 0.5,
    }
  } catch (error) {
    console.error('OpenAI API call failed:', error)
    // API 호출 실패 시 폴백 분석 사용
    return analyzeJournalEntry(content)
  }
}
