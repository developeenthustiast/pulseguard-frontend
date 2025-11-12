'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { AnomalyDetectionResponse } from '@/lib/types'
import { formatTimestamp } from '@/utils/format'

interface Props {
  detections: AnomalyDetectionResponse[]
}

export default function AnomalyChart({ detections }: Props) {
  const chartData = detections
    .slice()
    .reverse()
    .map((d, idx) => ({
      index: idx + 1,
      score: d.confidence_score,
      timestamp: formatTimestamp(d.timestamp),
    }))

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Anomaly Score Trend</h3>
        </div>
        <span className="text-sm text-gray-500">Last {detections.length}</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}