import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import crypto from 'crypto'

// Polyfill para crypto
globalThis.crypto = crypto

export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api':'http://localhost:5000',
    }
  }
  
})








