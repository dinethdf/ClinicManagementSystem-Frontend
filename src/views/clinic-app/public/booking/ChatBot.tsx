'use client'

import { useEffect } from 'react'

const ChatBot = () => {
  useEffect(() => {
    // Prevent duplicate loading
    if (document.getElementById('botpress-v35')) return

    const injectScript = document.createElement('script')

    injectScript.id = 'botpress-v35'
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v3.5/inject.js'
    injectScript.async = true

    injectScript.onload = () => {
      const botScript = document.createElement('script')

      botScript.src = 'https://files.bpcontent.cloud/2026/01/04/02/20260104021719-45IIPBLG.js'
      botScript.defer = true
      document.body.appendChild(botScript)
    }

    document.body.appendChild(injectScript)
  }, [])

  return null
}

export default ChatBot
