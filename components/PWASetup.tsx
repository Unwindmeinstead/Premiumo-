'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export default function PWASetup() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration)
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstalled(true)
      setShowInstallPrompt(false)
    }
    
    setDeferredPrompt(null)
  }

  if (isInstalled || !showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-dark-card border border-dark-border rounded-xl p-4 shadow-lg">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Install P+</h3>
            <p className="text-sm text-dark-muted">
              Install this app on your device for a better experience
            </p>
          </div>
          <button
            onClick={() => setShowInstallPrompt(false)}
            className="text-dark-muted hover:text-dark-text transition-colors ml-2"
          >
            <X size={20} />
          </button>
        </div>
        <button
          onClick={handleInstallClick}
          className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Download size={18} />
          Install App
        </button>
      </div>
    </div>
  )
}
