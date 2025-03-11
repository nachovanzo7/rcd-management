import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración correcta
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: 'react',
    },
  },
});
