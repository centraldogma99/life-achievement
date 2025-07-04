import { useState, type ComponentProps } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Calendar, Save, Sparkles, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import type { Activity, DiaryAnalyzeResult } from '../types'
import { useAnalyzeWithAI } from '../utils/llm'

export interface DiaryFormData {
  content: string
  date: string
}

export const WriteDiaryPage = ({
  onSave,
}: {
  onSave: (diaryAndAnalyzeResult: DiaryFormData & DiaryAnalyzeResult) => void
}) => {
  const { isAnalyzing, analyze } = useAnalyzeWithAI()
  const [showSuccess, setShowSuccess] = useState(false)
  const [hasContentChangedAfterAnalyze, setHasContentChangedAfterAnalyze] = useState(false)
  const [lastAnalysisResult, setLastAnalysisResult] = useState<Activity[] | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DiaryFormData>({
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      content: '',
    },
  })

  const content = watch('content')

  const analyzeDiary = async (text: string) => {
    const analysis = await analyze(text)
    setHasContentChangedAfterAnalyze(false)

    return analysis
  }

  const onSubmit = async (data: DiaryFormData) => {
    if (!data.content.trim()) return

    try {
      if (hasContentChangedAfterAnalyze) {
        const analysis = await analyzeDiary(data.content)

        onSave({
          ...data,
          activities: analysis.activities,
        })
      } else {
        onSave({
          ...data,
          activities: lastAnalysisResult || [],
        })
      }

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        reset({
          date: format(new Date(), 'yyyy-MM-dd'),
          content: '',
        })
        setLastAnalysisResult(null)
      }, 2000)
    } catch (error) {
      console.error('일기 분석 중 오류 발생:', error)
    }
  }

  const previewAnalysis = async () => {
    if (!content?.trim()) return

    try {
      const analysis = await analyze(content)
      setHasContentChangedAfterAnalyze(false)
      setLastAnalysisResult(analysis.activities)
    } catch (error) {
      console.error('미리보기 분석 중 오류 발생:', error)
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">오늘의 일기</h2>
          <p className="text-sm text-gray-600">하루를 기록하고 업적을 달성해보세요!</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 날짜 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
          <input
            type="date"
            {...register('date', { required: '날짜를 선택해주세요.' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        {/* 내용 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            오늘 하루는 어떠셨나요?
          </label>
          <textarea
            {...register('content', {
              required: '일기 내용을 입력해주세요.',
              minLength: { value: 10, message: '10자 이상 입력해주세요.' },
              onChange: () => {
                setHasContentChangedAfterAnalyze(true)
              },
            })}
            rows={8}
            placeholder="오늘 한 일, 느낀 점, 운동, 독서, 공부 등 무엇이든 자유롭게 적어보세요...&#10;&#10;예시:&#10;- 오늘 아침 7시에 일어나서 30분 동안 조깅을 했다.&#10;- 점심 후에 자기계발서를 1시간 정도 읽었다.&#10;- 저녁에는 친구와 함께 헬스장에서 운동했다.&#10;- 물을 2리터 이상 마셨고, 일찍 잠자리에 들 예정이다."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}

          {/* 글자 수 표시 */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">{content?.length || 0}자</span>

            {/* 미리보기 버튼 */}
            {content && content.length > 10 && (
              <button
                type="button"
                onClick={previewAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                {isAnalyzing ? '분석 중...' : '미리보기'}
              </button>
            )}
          </div>
        </div>

        {/* 분석 결과 미리보기 */}
        <AnimatePresence>
          {lastAnalysisResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 rounded-lg p-4 border border-blue-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">AI 분석 결과</h3>
              </div>

              {lastAnalysisResult.length > 0 ? (
                <div className="space-y-3">
                  {lastAnalysisResult.map((analysis, index) => (
                    <div className="flex flex-wrap gap-2" key={index}>
                      <Tag>{analysis.name}</Tag> {analysis.reason}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-blue-700">
                  업적과 관련된 활동이 감지되지 않았습니다. 운동, 독서, 공부 등의 활동을 더
                  구체적으로 작성해보세요!
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 저장 버튼 */}
        <div className="flex gap-3">
          <motion.button
            type="submit"
            disabled={isAnalyzing || !content?.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                분석 중...
              </>
            ) : showSuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                저장 완료!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                일기 저장
              </>
            )}
          </motion.button>

          <button
            type="button"
            onClick={() => {
              reset()
              setLastAnalysisResult(null)
            }}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
        </div>
      </form>

      {/* 팁 섹션 */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">💡 업적 달성 팁</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • 구체적인 활동을 명시하세요 (예: &quot;30분 조깅&quot;, &quot;책 50페이지
                읽음&quot;)
              </li>
              <li>• 시간이나 양을 포함하면 더 정확하게 분석됩니다</li>
              <li>• 여러 활동을 한 경우 모두 작성해주세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

const Tag = ({ children, ...props }: ComponentProps<'span'>) => {
  return (
    <span
      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      {...props}
    >
      {children}
    </span>
  )
}
