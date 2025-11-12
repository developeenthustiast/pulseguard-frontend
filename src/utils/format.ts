import { format, formatDistanceToNow } from 'date-fns'

export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM dd, HH:mm:ss')
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function getRiskLevel(score: number): 'normal' | 'warning' | 'critical' {
  if (score < -0.3) return 'critical'
  if (score < -0.1) return 'warning'
  return 'normal'
}

export function getRiskColor(level: 'normal' | 'warning' | 'critical'): string {
  switch (level) {
    case 'critical': return 'text-red-600'
    case 'warning': return 'text-yellow-600'
    default: return 'text-green-600'
  }
}

export function getRiskBadge(level: 'normal' | 'warning' | 'critical'): string {
  switch (level) {
    case 'critical': return 'badge-danger'
    case 'warning': return 'badge-warning'
    default: return 'badge-success'
  }
}
```

---

### 13. `src/components/Dashboard.tsx`
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Activity, Zap, Factory, TrendingUp } from 'lucide-react'
import AnomalyDetector from './AnomalyDetector'
import FactoryStatus from './FactoryStatus'
import MaintenancePredictor from './MaintenancePredictor'
import RecentDetections from './RecentDetections'
import SystemHealth from './SystemHealth'
import LiveLogs from './LiveLogs'
import AnomalyChart from './AnomalyChart'
import { AnomalyDetectionResponse, LogEntry } from '@/lib/types'

export default function Dashboard() {
  const [detections, setDetections] = useState([])
  const [logs, setLogs] = useState([])

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
    
      {/* Header */}
      
        
          
            
              
                
              
              
                PulseGuard AI
                supOS Global Hackathon 2025 - Theme B
              
            
            
              
                
                AI Enhanced
              
              
                
                supOS Native
              
            
          
        
      

      {/* Main Content */}
      
        {/* Stats Cards */}
        
          
            
              
                Downtime Reduction
                30%
              
              
            
          
          
            
              
                Energy Optimization
                15%
              
              
            
          
          
            
              
                Total Detections
                {detections.length}
              
              
            
          
        

        {/* System Health */}
        
          
        

        {/* Main Grid */}
        
          {/* Left Column - Main Operations */}
          
            
            
            
            {detections.length > 0 && }
          

          {/* Right Column - Results & Logs */}
          
            
            
          
        
      

      {/* Footer */}
      
        
          
            PulseGuard AI © 2025 - Native supOS-CE Enhancement | Theme B Submission
          
        
      
    
  )
}