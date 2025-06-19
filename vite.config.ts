import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: ['react', 'react-dom', '@use-gesture/react'],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          '@use-gesture/react': 'UseGesture'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    }
  }
});

