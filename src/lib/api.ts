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