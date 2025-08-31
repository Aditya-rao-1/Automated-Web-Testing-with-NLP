import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
=======
>>>>>>> 924bd47bb92d50694c2e5d84c1eb9b279d77295f
})
