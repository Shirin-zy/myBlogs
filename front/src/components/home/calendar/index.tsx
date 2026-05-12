"use client"

import React, { useMemo } from "react"
import styles from "./index.module.less"
import { cn } from "@/lib/utils"

interface CalendarProps {
  width?: string | number
  bgImage?: string
}

const Calendar: React.FC<CalendarProps> = ({ width = 520, bgImage }) => {
  const now = new Date()
  const currentDay = now.getDate()
  const currentMonth = now.toLocaleString("en-US", { month: "long" })

  // 计算日历矩阵
  const calendarGrid = useMemo(() => {
    const year = now.getFullYear()
    const month = now.getMonth()

    // 本月第一天是周几 (0-6, 0是周日)
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    // 将周日(0)转换为周一(1)开始的逻辑：Mon=0, Tue=1, ..., Sun=6
    const firstDayIdx = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

    // 本月总天数
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    // 上月总天数
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const grid = []
    let dayCounter = 1
    let nextMonthDayCounter = 1

    // 6行 7列
    for (let i = 0; i < 6; i++) {
      const week = []
      for (let j = 0; j < 7; j++) {
        const cellIdx = i * 7 + j

        if (cellIdx < firstDayIdx) {
          // 上月天数
          week.push({
            day: daysInPrevMonth - (firstDayIdx - cellIdx - 1),
            type: "prev",
          })
        } else if (dayCounter <= daysInMonth) {
          // 本月天数
          week.push({
            day: dayCounter,
            type: "current",
            isToday: dayCounter === currentDay,
          })
          dayCounter++
        } else {
          // 下月天数
          week.push({
            day: nextMonthDayCounter,
            type: "next",
          })
          nextMonthDayCounter++
        }
      }
      grid.push(week)
      if (dayCounter > daysInMonth && i >= 4) break // 如果已经填满且至少5行，可停止
    }
    return grid
  }, [currentDay])

  const containerStyle = {
    width: typeof width === "number" ? `${width}px` : width,
  }

  const headerStyle = {
    backgroundImage: bgImage ? `url(${bgImage})` : undefined,
  }

  return (
    <div className={styles.shell} style={containerStyle}>
      <header style={headerStyle}>
        <div className={styles.day}>{currentDay}</div>
        <div className={styles.month}>{currentMonth}</div>
      </header>
      <table className={styles.calendar}>
        <thead>
          <tr>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Sun</th>
          </tr>
        </thead>
        <tbody>
          {calendarGrid.map((week, i) => (
            <tr key={i}>
              {week.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    cell.type === "prev" && styles.prevMonth,
                    cell.type === "next" && styles.nextMonth,
                    cell.isToday && styles.currentDay,
                  )}
                >
                  {cell.day}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.ringLeft}></div>
      <div className={styles.ringRight}></div>
    </div>
  )
}

export default Calendar
