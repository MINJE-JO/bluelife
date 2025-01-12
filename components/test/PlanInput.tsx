'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import type { CreatePlanInput } from '@/types/api'

export default function PlanInput() {
  const { user } = useUser()
  const [planData, setPlanData] = useState<CreatePlanInput>({
    start_year: new Date().getFullYear(),
    start_month: new Date().getMonth() + 1,
    end_year: new Date().getFullYear(),
    end_month: new Date().getMonth() + 1,
    content: '',
    color: '#FF0000',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('로그인이 필요합니다!')
      return
    }

    try {
      const { data, error } = await supabase
        .from('plans')
        .insert({
          clerk_user_id: user.id,
          ...planData
        })
        .select()

      if (error) throw error

      alert('Plan이 성공적으로 추가되었습니다!')
      setPlanData({
        start_year: new Date().getFullYear(),
        start_month: new Date().getMonth() + 1,
        end_year: new Date().getFullYear(),
        end_month: new Date().getMonth() + 1,
        content: '',
        color: '#FF0000',
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Plan 추가 중 오류가 발생했습니다.')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="start_year" className="block mb-2">시작 연도:</label>
          <input
            id="start_year"
            type="number"
            value={planData.start_year}
            onChange={(e) => setPlanData({...planData, start_year: parseInt(e.target.value)})}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        
        <div>
          <label htmlFor="start_month" className="block mb-2">시작 월:</label>
          <input
            id="start_month"
            type="number"
            min="1"
            max="12"
            value={planData.start_month}
            onChange={(e) => setPlanData({...planData, start_month: parseInt(e.target.value)})}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="end_year" className="block mb-2">종료 연도:</label>
          <input
            id="end_year"
            type="number"
            value={planData.end_year}
            onChange={(e) => setPlanData({...planData, end_year: parseInt(e.target.value)})}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="end_month" className="block mb-2">종료 월:</label>
          <input
            id="end_month"
            type="number"
            min="1"
            max="12"
            value={planData.end_month}
            onChange={(e) => setPlanData({...planData, end_month: parseInt(e.target.value)})}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block mb-2">내용:</label>
          <input
            id="content"
            type="text"
            value={planData.content}
            onChange={(e) => setPlanData({...planData, content: e.target.value})}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>

        <div>
          <label htmlFor="color" className="block mb-2">색상:</label>
          <input
            id="color"
            type="color"
            value={planData.color}
            onChange={(e) => setPlanData({...planData, color: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Plan 추가
        </button>
      </form>
    </div>
  )
} 