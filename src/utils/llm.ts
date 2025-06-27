import { GoogleGenAI } from '@google/genai/web'
import type { DiaryAnalyzeResult } from '../types'
import { systemPromptTemplate } from '../data/systemPromptTemplate'
import { useState } from 'react'

// OpenAI API를 사용하는 실제 함수 (환경변수 설정 필요)
export const analyzeWithAI = async (content: string): Promise<DiaryAnalyzeResult> => {
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

export const useAnalyzeWithAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyze = async (content: string) => {
    setIsAnalyzing(true)
    try {
      const result = await analyzeWithAI(content)

      return result
    } finally {
      setIsAnalyzing(false)
    }
  }

  return { isAnalyzing, analyze }
}
