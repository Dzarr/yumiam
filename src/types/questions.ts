export interface Question {
  id: number
  question: string
  left_label: string
  right_label: string
  left_icon: string
  right_icon: string
  order: number
  created_at?: string
}

export interface QuestionResponse {
  data: Question[]
  error: any
} 