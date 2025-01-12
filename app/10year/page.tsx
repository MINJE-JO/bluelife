'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function NYear() {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">10년 플랜</h1>
      </div>
      
      <div className="overflow-x-auto">
        <Table className="border-collapse">
          {/* 헤더 (연도) */}
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

          {/* 바디 (월) */}
          <TableBody>
            {months.map((month) => (
              <TableRow key={month}>
                <TableCell className="text-center font-medium">
                  {month}월
                </TableCell>
                {years.map((year) => (
                  <TableCell 
                    key={`${year}-${month}`} 
                    className="border hover:bg-muted/50 cursor-pointer min-h-[100px]"
                  >
                    {/* 여기에 프로젝트 카드가 들어갈 예정 */}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}