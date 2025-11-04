"use client"

import React from "react"
import "@/lib/amplify"

export default function AmplifyClientProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


