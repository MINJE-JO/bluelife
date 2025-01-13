'use client'

import { Plan } from "@/types/database"
import { cn } from "@/lib/utils"
import { useState } from "react"
import EditPlanModal from "./modals/EditPlanModal"

interface PlanCardProps {
  plan: Plan
  className?: string
}

export default function PlanCard({ plan, className }: PlanCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditModalOpen(true)
  }

  return (
    <>
      <div
        className={cn(
          "mb-1 p-2 rounded text-sm transition-all cursor-pointer",
          "hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-primary",
          className
        )}
        style={{ 
          backgroundColor: plan.color,
          opacity: 0.8
        }}
        onClick={handleClick}
      >
        {plan.content}
      </div>

      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        plan={plan}
      />
    </>
  )
} 