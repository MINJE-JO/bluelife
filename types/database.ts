export type Plan = {
  id: string
  clerk_user_id: string
  year: number
  month: number
  content: string
  color: string
  start_date: string  // ISO 날짜 문자열
  end_date: string    // ISO 날짜 문자열
  created_at: string  // ISO 날짜 문자열
  updated_at: string  // ISO 날짜 문자열
}

// Supabase 테이블 타입 정의
export type Database = {
  public: {
    Tables: {
      plans: {
        Row: Plan                   // 반환되는 데이터 타입
        Insert: Omit<Plan, 'id' | 'created_at' | 'updated_at'>  // 삽입 시 필요한 데이터 타입
        Update: Partial<Omit<Plan, 'id' | 'created_at' | 'updated_at'>>  // 업데이트 시 필요한 데이터 타입
      }
    }
  }
} 