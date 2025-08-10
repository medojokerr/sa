"use client"

import React from "react"

export function SimpleLineChart({ data, height = 120 }: { data: { t: string; v: number }[]; height?: number }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height }}>
        <span className="text-sm">No data available</span>
      </div>
    )
  }
  
  const max = Math.max(...data.map((d) => d.v), 1)
  const min = Math.min(...data.map((d) => d.v), 0)
  const range = max - min || 1
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((d.v - min) / range) * 80 - 10 // Add 10% padding
    return `${x},${y}`
  }).join(" ")
  
  const areaPoints = `0,100 ${points} 100,100`

  return (
    <div className="relative">
      <svg className="w-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <polygon points={areaPoints} fill="url(#areaGradient)" />
        
        {/* Line */}
        <polyline 
          points={points} 
          fill="none" 
          stroke="url(#lineGradient)" 
          strokeWidth="3" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - ((d.v - min) / range) * 80 - 10
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="url(#lineGradient)"
              className="hover:r-3 transition-all duration-200"
            />
          )
        })}
      </svg>
      
      {/* Data labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        {data.map((d, i) => (
          <span key={i} className="text-center">
            {d.t}
          </span>
        ))}
      </div>
    </div>
  )
}
