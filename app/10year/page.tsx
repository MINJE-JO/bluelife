'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import type { Plan } from '@/types/database'
import { Skeleton } from "@/components/ui/skeleton"
import PlanCard from "@/components/PlanCard"
import CreatePlanModal from "@/components/modals/CreatePlanModal"

export default function TenYear() {
  const { user } = useUser()
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number } | null>(null)

  useEffect(() => {
    if (!user) return

    // 초기 데이터 로드
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .eq('clerk_user_id', user.id)

        if (error) throw error
        setPlans(data || [])
      } catch (err) {
        console.error('Error:', err)
        setError('데이터를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlans()

    // 실시간 구독 설정
    const channel = supabase
      .channel('plans-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'plans',
          filter: `clerk_user_id=eq.${user.id}`
        },
        (payload) => {
          setPlans(prev => [...prev, payload.new as Plan])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'plans'
        },
        (payload) => {
          setPlans(prev => prev.filter(plan => plan.id !== payload.old.id))
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'plans',
          filter: `clerk_user_id=eq.${user.id}`
        },
        (payload) => {
          setPlans(prev => prev.map(plan => 
            plan.id === payload.new.id ? payload.new as Plan : plan
          ))
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [user])

  // plans가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log('Plans updated:', plans)
  }, [plans])

  // 특정 셀에 해당하는 plans 필터링
  const getPlansForCell = (year: number, month: number) => {
    return plans.filter(plan => 
      (plan.start_year < year || (plan.start_year === year && plan.start_month <= month)) &&
      (plan.end_year > year || (plan.end_year === year && plan.end_month >= month))
    )
  }

  const handleCellClick = (year: number, month: number) => {
    setSelectedDate({ year, month })
    setIsModalOpen(true)
  }

  if (!user) {
    return <div className="p-8">로그인이 필요합니다.</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">10년 플랜</h1>
      </div>
      
      <div className="overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20 text-center">월/연도</TableHead>
              {years.map((year) => (
                <TableHead key={year} className="w-32 text-center">
                  {year}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {months.map((month) => (
              <TableRow key={month}>
                <TableCell className="text-center font-medium">
                  {month}월
                </TableCell>
                {years.map((year) => (
                  <TableCell 
                    key={`${year}-${month}`} 
                    className="border hover:bg-muted/50 cursor-pointer min-h-[100px] p-1"
                    onClick={() => handleCellClick(year, month)}
                  >
                    {isLoading ? (
                      <Skeleton className="w-full h-[100px]" />
                    ) : (
                      getPlansForCell(year, month).map(plan => (
                        <PlanCard 
                          key={plan.id} 
                          plan={plan}
                        />
                      ))
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedDate && (
        <CreatePlanModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedDate(null)
          }}
          defaultYear={selectedDate.year}
          defaultMonth={selectedDate.month}
        />
      )}
    </div>
  )
}