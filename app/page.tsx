'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { CreatePlanInput } from '@/types/api'

export default function Home() {
  const { user } = useUser()
  const [planData, setPlanData] = useState<CreatePlanInput>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    content: '',
    color: '#FF0000',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
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
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        content: '',
        color: '#FF0000',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Plan 추가 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Plan 테스트</h1>
      
      {user ? (
        <div>
          <p className="mb-4">로그인된 사용자: {user.emailAddresses[0].emailAddress}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="year" className="block mb-2">연도:</label>
              <input
                id="year"
                type="number"
                value={planData.year}
                onChange={(e) => setPlanData({...planData, year: parseInt(e.target.value)})}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            
            <div>
              <label htmlFor="month" className="block mb-2">월:</label>
              <input
                id="month"
                type="number"
                min="1"
                max="12"
                value={planData.month}
                onChange={(e) => setPlanData({...planData, month: parseInt(e.target.value)})}
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

            <div>
              <label htmlFor="start_date" className="block mb-2">시작일:</label>
              <input
                id="start_date"
                type="date"
                value={planData.start_date}
                onChange={(e) => setPlanData({...planData, start_date: e.target.value})}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block mb-2">종료일:</label>
              <input
                id="end_date"
                type="date"
                value={planData.end_date}
                onChange={(e) => setPlanData({...planData, end_date: e.target.value})}
                className="w-full p-2 border rounded text-black"
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
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  )
}
