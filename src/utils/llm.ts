import { GoogleGenAI } from '@google/genai/web'
import type { LLMResponse } from '../types'
import { systemPromptTemplate } from '../data/systemPromptTemplate'

// OpenAI API를 사용하는 실제 함수 (환경변수 설정 필요)
export const analyzeWithOpenAI = async (content: string): Promise<LLMResponse> => {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  })
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    config: { systemInstruction: systemPromptTemplate, responseMimeType: 'application/json' },
    contents: content,
  })
  return JSON.parse(response.text || '{}')
}
