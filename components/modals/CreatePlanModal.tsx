'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { supabase } from "@/utils/supabase/client"
import { useUser } from "@clerk/nextjs"
import type { CreatePlanInput } from "@/types/api"

interface CreatePlanModalProps {
  isOpen: boolean
  onClose: () => void
  defaultYear: number
  defaultMonth: number
}

export default function CreatePlanModal({ 
  isOpen, 
  onClose, 
  defaultYear, 
  defaultMonth 
}: CreatePlanModalProps) {
  const { user } = useUser()
  const [planData, setPlanData] = useState<CreatePlanInput>({
    start_year: defaultYear,
    start_month: defaultMonth,
    end_year: defaultYear,
    end_month: defaultMonth,
    content: '',
    color: '#FF0000',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase
        .from('plans')
        .insert([{
          clerk_user_id: user.id,
          ...planData
        }])

      if (error) throw error

      onClose()
      setPlanData({
        start_year: defaultYear,
        start_month: defaultMonth,
        end_year: defaultYear,
        end_month: defaultMonth,
        content: '',
        color: '#FF0000',
      })
    } catch (error) {
      console.error('Error:', error)
      alert('Plan 추가 중 오류가 발생했습니다.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 프로젝트 추가</DialogTitle>
          <DialogDescription>
            새로운 프로젝트의 기간과 내용을 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_year">시작 연도</label>
              <Input
                id="start_year"
                type="number"
                value={planData.start_year}
                onChange={(e) => setPlanData({...planData, start_year: parseInt(e.target.value)})}
                required
              />
            </div>
            <div>
              <label htmlFor="start_month">시작 월</label>
              <Input
                id="start_month"
                type="number"
                min="1"
                max="12"
                value={planData.start_month}
                onChange={(e) => setPlanData({...planData, start_month: parseInt(e.target.value)})}
                required
              />
            </div>
            <div>
              <label htmlFor="end_year">종료 연도</label>
              <Input
                id="end_year"
                type="number"
                value={planData.end_year}
                onChange={(e) => setPlanData({...planData, end_year: parseInt(e.target.value)})}
                required
              />
            </div>
            <div>
              <label htmlFor="end_month">종료 월</label>
              <Input
                id="end_month"
                type="number"
                min="1"
                max="12"
                value={planData.end_month}
                onChange={(e) => setPlanData({...planData, end_month: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="content">내용</label>
            <Input
              id="content"
              value={planData.content}
              onChange={(e) => setPlanData({...planData, content: e.target.value})}
              required
            />
          </div>
          <div>
            <label htmlFor="color">색상</label>
            <Input
              id="color"
              type="color"
              value={planData.color}
              onChange={(e) => setPlanData({...planData, color: e.target.value})}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">추가</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 