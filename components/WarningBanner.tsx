"use client"

import { AlertTriangle } from "lucide-react"
import { useState } from "react"

export function WarningBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-bold">Development Version: </span>
              This dashboard is currently under active development. All numbers shown are for demonstration purposes only and do not reflect actual blockchain data.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 flex-shrink-0"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-4 w-4 text-yellow-400 hover:text-yellow-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}