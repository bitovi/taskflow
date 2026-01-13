"use client"

import { useEffect } from "react"

export function DebugLogger() {
  useEffect(() => {
    console.log("🔧 TaskFlow Debug Logger Active")
    console.log("📅 Timestamp:", new Date().toISOString())
    console.log("🌐 User Agent:", navigator.userAgent)
    console.log("📍 Current URL:", window.location.href)
    
    // Log navigation changes
    const logNavigation = () => {
      console.log("🔄 Navigation change:", window.location.pathname)
    }
    
    window.addEventListener("popstate", logNavigation)
    
    return () => {
      window.removeEventListener("popstate", logNavigation)
    }
  }, [])

  return null
}
