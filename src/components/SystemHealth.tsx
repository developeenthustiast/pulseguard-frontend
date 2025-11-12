'use client'

import { useState, useEffect } from 'react'
import { Activity, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { getSystemHealth } from '@/lib/api'
import { SystemHealth as SystemHealthType } from '@/lib/types'

export default function SystemHealth() {
  const [health, setHealth] = useState<SystemHealthType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await getSystemHealth()
        setHealth(data)
      } catch (err) {
        console.error('Health check failed:', err)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30s

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="card flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">System Health</h3>
        </div>
        {health?.status === 'healthy' && (
          <span className="badge badge-success flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Online
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <HealthIndicator
          label="API Server"
          status={health?.status === 'healthy'}
        />
        <HealthIndicator
          label="AI Models"
          status={health?.ai_models_ready ?? false}
        />
        <HealthIndicator
          label="supOS Integration"
          status={health?.supos_integrated ?? false}
        />
        <HealthIndicator
          label="Database"
          status={health?.database_connected ?? false}
        />
      </div>
    </div>
  )
}

function HealthIndicator({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {status ? (
        <CheckCircle className="w-5 h-5 text-green-600" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600" />
      )}
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  )
}