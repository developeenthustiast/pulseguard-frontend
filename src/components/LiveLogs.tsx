'use client'

import { useEffect, useRef } from 'react'
import { Terminal, Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react'
import { LogEntry } from '@/lib/types'
import { formatTimestamp } from '@/utils/format'

interface Props {
  logs: LogEntry[]
}

export default function LiveLogs({ logs }: Props) {
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'info': return <Info className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'error': return <XCircle className="w-4 h-4" />
      case 'success': return <CheckCircle className="w-4 h-4" />
    }
  }

  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'info': return 'text-blue-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      case 'success': return 'text-green-600'
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Live Activity Logs</h3>
        </div>
        <span className="badge badge-success">Real-time</span>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-xs">
        {logs.length === 0 && (
          <p className="text-gray-500 text-center py-8">Waiting for activity...</p>
        )}

        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 mb-2 text-gray-300">
            <span className="text-gray-500 whitespace-nowrap">
              {formatTimestamp(log.timestamp)}
            </span>
            <span className={getLogColor(log.level)}>
              {getLogIcon(log.level)}
            </span>
            <span className="flex-1">
              {log.message}
            </span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}