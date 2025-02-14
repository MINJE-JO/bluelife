import { Plan } from './database'

export type ApiResponse<T> = {
  data: T | null
  error: string | null
}

export type PlansResponse = ApiResponse<Plan[]>
export type PlanResponse = ApiResponse<Plan>

// API 요청 타입들
export type CreatePlanInput = {
  start_year: number
  start_month: number
  end_year: number
  end_month: number
  content: string
  color: string
}

export type UpdatePlanInput = Partial<CreatePlanInput> 