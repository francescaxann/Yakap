'use client'

import { setNonce } from 'get-nonce'
import { useEffect } from 'react'

export function DialogNonce() {
  useEffect(() => {
    // A router refresh receives a new nonce while the browser keeps the current document's policy.
    const nonce = document.querySelector<HTMLScriptElement>('script[nonce]')?.nonce
    if (nonce) setNonce(nonce)
  }, [])
  return null
}
