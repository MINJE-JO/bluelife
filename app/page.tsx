'use client'

import { useUser } from '@clerk/nextjs'
import PlanForm from '@/components/test/PlanInput'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const { user } = useUser()

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Plan 테스트</h1>
      
      {user ? (
        <div>
          <p className="mb-4">로그인된 사용자: {user.emailAddresses[0].emailAddress}</p>
          <div className="mt-4 flex justify-center">
            <Button asChild>
              <Link href="/10year">10년</Link>
            </Button>
          </div>
        </div>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  )
}
