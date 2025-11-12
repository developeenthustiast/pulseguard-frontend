'use client'

import { useState, useEffect } from 'react'
import { Activity, Zap, Factory, TrendingUp } from 'lucide-react'
import AnomalyDetector from './AnomalyDetector'
import FactoryStatus from './FactoryStatus'
import MaintenancePredictor from './MaintenancePredictor'
import SystemHealth from './SystemHealth'
import LiveLogs from './LiveLogs'
import AnomalyChart from './AnomalyChart'
import { AnomalyDetectionResponse, LogEntry } from '@/lib/types'

export default function Dashboard() {
  const [detections, setDetections] = useState<AnomalyDetectionResponse[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = (level: LogEntry['level'], message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
    }
    setLogs(prev => [newLog, ...prev].slice(0, 50))
  }

  const handleDetection = (result: AnomalyDetectionResponse) => {
    setDetections(prev => [result, ...prev].slice(0, 10))
    addLog('success', 'Anomaly detection completed')
  }

  useEffect(() => {
    addLog('info', 'PulseGuard AI Dashboard initialized')
    addLog('info', 'Connected to supOS-CE platform')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">PulseGuard AI</h1>
                  <p className="text-sm text-gray-500">supOS Global Hackathon 2025 - Theme B</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="badge badge-success flex items-center gap-1">
                <Zap className="w-4 h-4" />
                AI Enhanced
              </span>
              <span className="badge badge-info flex items-center gap-1">
                <Factory className="w-4 h-4" />
                supOS Native
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Downtime Reduction</p>
                <p className="text-3xl font-bold text-green-600">30%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Energy Optimization</p>
                <p className="text-3xl font-bold text-blue-600">15%</p>
              </div>
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Detections</p>
                <p className="text-3xl font-bold text-purple-600">{detections.length}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="mb-8">
          <SystemHealth />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Main Operations */}
          <div className="space-y-8">
            <AnomalyDetector onDetection={handleDetection} addLog={addLog} />
            <FactoryStatus addLog={addLog} />
            <MaintenancePredictor addLog={addLog} />
            {detections.length > 0 && <AnomalyChart detections={detections} />}
          </div>

          {/* Right Column - Results & Logs */}
          <div className="space-y-8">
            <LiveLogs logs={logs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            PulseGuard AI © 2025 - Native supOS-CE Enhancement | Theme B Submission
          </p>
        </div>
      </footer>
    </div>
  )
}