'use client'

import { useState, useEffect } from 'react'
import { Factory, RefreshCw } from 'lucide-react'
import { getFactoriesStatus } from '@/lib/api'
import { FactoryStatus as FactoryStatusType, LogEntry } from '@/lib/types'
import { formatRelativeTime } from '@/utils/format'

interface Props {
  addLog: (level: LogEntry['level'], message: string) => void
}

export default function FactoryStatus({ addLog }: Props) {
  const [factories, setFactories] = useState<FactoryStatusType[]>([])
  const [loading, setLoading] = useState(false)

  const loadFactories = async () => {
    setLoading(true)
    addLog('info', 'Fetching multi-factory status...')

    try {
      const data = await getFactoriesStatus()
      setFactories(data)
      addLog('success', `Loaded ${data.length} factory status`)
    } catch (err) {
      addLog('error', `Failed to load factories: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFactories()
  }, [])

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Factory className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Multi-Factory Coordination</h3>
        </div>
        <button onClick={loadFactories} disabled={loading} className="btn btn-secondary flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {factories.length === 0 && !loading && (
          <p className="text-gray-500 text-sm text-center py-8">
            No factories connected. Start supOS backend to see factory data.
          </p>
        )}

        {factories.map((factory) => (
          <div key={factory.factory_id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className={`status-dot ${factory.health_status === 'healthy' ? 'status-online' : 'status-offline'}`} />
                <span className="font-semibold text-gray-900">{factory.factory_id}</span>
              </div>
              <span className={`badge ${factory.health_status === 'healthy' ? 'badge-success' : 'badge-danger'}`}>
                {factory.health_status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Sensors:</span>
                <span className="ml-2 font-medium">{factory.sensor_count}</span>
              </div>
              <div>
                <span className="text-gray-600">Last Reading:</span>
                <span className="ml-2 font-medium">
                  {factory.latest_reading ? formatRelativeTime(factory.latest_reading) : 'N/A'}
                </span>
              </div>
            </div>

            {factory.supos_enhanced && (
              <div className="mt-2 text-xs text-green-600 font-medium">
                ✓ supOS Enhanced
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}