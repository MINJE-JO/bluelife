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
import type { Plan } from "@/types/database"

interface EditPlanModalProps {
  isOpen: boolean
  onClose: () => void
  plan: Plan
}

export default function EditPlanModal({ 
  isOpen, 
  onClose, 
  plan 
}: EditPlanModalProps) {
  const { user } = useUser()
  const [planData, setPlanData] = useState({
    start_year: plan.start_year,
    start_month: plan.start_month,
    end_year: plan.end_year,
    end_month: plan.end_month,
    content: plan.content,
    color: plan.color,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase
        .from('plans')
        .update({
          ...planData
        })
        .eq('id', plan.id)
        .eq('clerk_user_id', user.id)

      if (error) throw error
      onClose()
    } catch (error) {
      console.error('Error:', error)
      alert('Plan 수정 중 오류가 발생했습니다.')
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user || !confirm('정말 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', plan.id)
        .eq('clerk_user_id', user.id)

      if (error) throw error
      onClose()
    } catch (error) {
      console.error('Error:', error)
      alert('Plan 삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>프로젝트 수정</DialogTitle>
          <DialogDescription>
            프로젝트의 정보를 수정하거나 삭제할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              autoFocus={false}
            >
              삭제
            </Button>
            <div className="flex-1" />
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit">수정</Button>
          </DialogFooter>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_year">시작 연도</label>
              <Input
                id="start_year"
                type="number"
                value={planData.start_year}
                onChange={(e) => setPlanData({...planData, start_year: parseInt(e.target.value)})}
                required
                autoFocus={false}
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
        </form>
      </DialogContent>
    </Dialog>
  )
} 