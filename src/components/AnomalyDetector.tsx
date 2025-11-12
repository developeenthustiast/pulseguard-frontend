'use client'

import { useState } from 'react'
import { AlertCircle, Play, Loader2 } from 'lucide-react'
import { detectAnomaly } from '@/lib/api'
import { AnomalyDetectionRequest, AnomalyDetectionResponse, LogEntry } from '@/lib/types'
import { formatTimestamp, getRiskLevel, getRiskColor } from '@/utils/format'

interface Props {
  onDetection: (result: AnomalyDetectionResponse) => void
  addLog: (level: LogEntry['level'], message: string) => void
}

export default function AnomalyDetector({ onDetection, addLog }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnomalyDetectionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<AnomalyDetectionRequest>({
    factory_id: 'factory_001',
    equipment_id: 'pump_A1',
    temperature: 75.5,
    pressure: 120.0,
    vibration: 0.8,
    value: 100.0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    addLog('info', `Running anomaly check for ${formData.equipment_id}...`)

    try {
      const data = await detectAnomaly(formData)
      setResult(data)
      onDetection(data)
      
      if (data.anomaly_detected) {
        addLog('warning', `⚠️ Anomaly detected in ${formData.equipment_id}!`)
      } else {
        addLog('success', `✓ ${formData.equipment_id} operating normally`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      addLog('error', `Failed: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof AnomalyDetectionRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: ['temperature', 'pressure', 'vibration', 'value'].includes(field)
        ? parseFloat(value) || 0
        : value
    }))
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">AI Anomaly Detection</h3>
        </div>
        <span className="badge badge-success">Real-time</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Factory ID
            </label>
            <input
              type="text"
              className="input"
              value={formData.factory_id}
              onChange={(e) => handleInputChange('factory_id', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment ID
            </label>
            <input
              type="text"
              className="input"
              value={formData.equipment_id}
              onChange={(e) => handleInputChange('equipment_id', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°C)
            </label>
            <input
              type="number"
              step="0.1"
              className="input"
              value={formData.temperature}
              onChange={(e) => handleInputChange('temperature', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pressure (bar)
            </label>
            <input
              type="number"
              step="0.1"
              className="input"
              value={formData.pressure}
              onChange={(e) => handleInputChange('pressure', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vibration (mm/s)
            </label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={formData.vibration}
              onChange={(e) => handleInputChange('vibration', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="number"
              step="0.1"
              className="input"
              value={formData.value}
              onChange={(e) => handleInputChange('value', e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Anomaly Check
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {result && !error && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-900">Detection Result</h4>
            <span className="text-xs text-gray-500">{formatTimestamp(result.timestamp)}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status:</span>
              <span className={`badge ${result.anomaly_detected ? 'badge-danger' : 'badge-success'}`}>
                {result.anomaly_detected ? 'Anomaly Detected' : 'Normal Operation'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Confidence Score:</span>
              <span className="font-mono text-sm">{result.confidence_score.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">supOS Enhanced:</span>
              <span className="text-green-600 text-sm font-medium">✓ Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}