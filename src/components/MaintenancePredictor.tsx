'use client'

import { useState } from 'react'
import { Wrench, Calendar, Loader2 } from 'lucide-react'
import { predictMaintenance } from '@/lib/api'
import { MaintenancePredictionResponse, LogEntry } from '@/lib/types'
import { formatTimestamp } from '@/utils/format'

interface Props {
  addLog: (level: LogEntry['level'], message: string) => void
}

export default function MaintenancePredictor({ addLog }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MaintenancePredictionResponse | null>(null)
  const [equipmentId, setEquipmentId] = useState('pump_A1')

  const handlePredict = async () => {
    setLoading(true)
    addLog('info', `Predicting maintenance for ${equipmentId}...`)

    try {
      const data = await predictMaintenance(equipmentId)
      setResult(data)
      addLog('success', `Maintenance prediction completed for ${equipmentId}`)
    } catch (err) {
      addLog('error', `Prediction failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Predictive Maintenance (48h Window)</h3>
        </div>
        <span className="badge badge-info">AI-Powered</span>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Equipment ID"
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
          />
          <button onClick={handlePredict} disabled={loading} className="btn btn-primary flex items-center gap-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
            Predict
          </button>
        </div>

        {result && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Failure Probability:</span>
                <span className={`text-lg font-bold ${result.failure_probability > 0.7 ? 'text-red-600' : result.failure_probability > 0.4 ? 'text-yellow-600' : 'text-green-600'}`}>
                  {(result.failure_probability * 100).toFixed(1)}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${result.failure_probability > 0.7 ? 'bg-red-600' : result.failure_probability > 0.4 ? 'bg-yellow-600' : 'bg-green-600'}`}
                  style={{ width: `${result.failure_probability * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 block">Recommended Date:</span>
                  <span className="font-medium">
                    {formatTimestamp(result.recommended_maintenance_date)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 block">Failure Window:</span>
                  <span className="font-medium">{result.predicted_failure_window}</span>
                </div>
                <div>
                  <span className="text-gray-600 block">Confidence:</span>
                  <span className="font-medium">{(result.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              {result.factors && result.factors.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Contributing Factors:</p>
                  <div className="space-y-1">
                    {result.factors.map((factor, idx) => (
                      <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-2">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}