import { defineConfig } from 'vite';
import vercel from 'vite-plugin-vercel';
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
export default defineConfig({
  server: {
    port: process.env.PORT as unknown as number,
  },
  plugins: [vercel(),react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});

// export default defineConfig(() => {
//   return {
//     define: {
//       __APP_ENV__: process.env.VITE_BACKEND_URL,
//     },
//   };
// });