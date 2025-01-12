import { Plan } from './database'

export type ApiResponse<T> = {
  data: T | null
  error: string | null
}

export type PlansResponse = ApiResponse<Plan[]>
export type PlanResponse = ApiResponse<Plan>

// API 요청 타입들
export type CreatePlanInput = {
  year: number
  month: number
  content: string
  color: string
  start_date: string
  end_date: string
}

export type UpdatePlanInput = Partial<CreatePlanInput> 