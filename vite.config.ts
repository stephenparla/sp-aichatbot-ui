import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const common = {
    plugins: [
      react(),
    ],
  };

  // when running `npm run dev` or `npm run preview` we want a normal
  // application build with an index.html; the library output is only
  // needed when packaging for embedding, e.g. in `npm run build:lib`.
  if (command === 'build' && mode === 'lib') {
    return {
      ...common,
      build: {
        lib: {
          entry: './src/main.tsx',
          name: 'MyLoginFormBundle',
          fileName: (format) => `my-login-form-bundle.${format}.js`,
        },
      },
    };
  }

  // default config (dev & normal build/preview)
  return common;
});
