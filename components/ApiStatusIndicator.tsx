import { useState, useEffect } from "react"
import { Badge } from "./ui/badge"
import { Wifi, WifiOff } from "lucide-react"
import { apiClient } from "../utils/api-client"

export function ApiStatusIndicator() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    checkApiStatus()
  }, [])

  const checkApiStatus = async () => {
    const isAvailable = await apiClient.isApiAvailable()
    setApiStatus(isAvailable ? 'online' : 'offline')
  }

  if (apiStatus === 'checking') {
    return null
  }

  return (
    <Badge 
      variant={apiStatus === 'online' ? 'default' : 'secondary'}
      className="flex items-center gap-1"
    >
      {apiStatus === 'online' ? (
        <>
          <Wifi className="h-3 w-3" />
          Live Data
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          Demo Mode
        </>
      )}
    </Badge>
  )
}