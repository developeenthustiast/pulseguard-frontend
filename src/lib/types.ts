export interface AnomalyDetectionRequest {
  factory_id: string
  equipment_id: string
  temperature: number
  pressure: number
  vibration: number
  value: number
}

export interface AnomalyDetectionResponse {
  anomaly_detected: boolean
  confidence_score: number
  sensor_data: AnomalyDetectionRequest
  timestamp: string
  supos_enhanced: boolean
  module: string
}

export interface MaintenancePredictionResponse {
  equipment_id: string
  failure_probability: number
  recommended_maintenance_date: string
  predicted_failure_window: string
  confidence: number
  factors: string[]
  supos_enhanced: boolean
}

export interface FactoryStatus {
  factory_id: string
  sensor_count: number
  latest_reading: string | null
  health_status: string
  supos_enhanced: boolean
}

export interface SystemHealth {
  status: string
  supos_integrated: boolean
  ai_models_ready: boolean
  mqtt_connected?: boolean
  database_connected?: boolean
}

export interface LogEntry {
  id: string
  timestamp: Date
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
}
```

---

### 11. `src/lib/api.ts`
```typescript
import {
  AnomalyDetectionRequest,
  AnomalyDetectionResponse,
  MaintenancePredictionResponse,
  FactoryStatus,
  SystemHealth
} from './types'

const API_BASE = process.env.NEXT_PUBLIC_PULSEGUARD_API || 'http://localhost:8002'

export async function detectAnomaly(data: AnomalyDetectionRequest): Promise {
  const response = await fetch(`${API_BASE}/api/supos/anomaly/detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }
  
  return response.json()
}

export async function predictMaintenance(equipmentId: string): Promise {
  const response = await fetch(`${API_BASE}/api/supos/predict/maintenance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ equipment_id: equipmentId }),
  })
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }
  
  return response.json()
}

export async function getFactoriesStatus(): Promise {
  const response = await fetch(`${API_BASE}/api/supos/factories/status`)
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }
  
  return response.json()
}

export async function getSystemHealth(): Promise {
  const response = await fetch(`${API_BASE}/health`)
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }
  
  return response.json()
}