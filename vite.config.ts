import { defineConfig } from "vite";
import { visualizer } from 'rollup-plugin-visualizer'
import react from "@vitejs/plugin-react";
import wyw from '@wyw-in-js/vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          open: true,               // 构建完自动打开浏览器
          gzipSize: true,           // 显示 gzip 后的体积
          brotliSize: true,         // 显示 brotli 后的体积
          filename: 'dist/stats.html', // 输出路径
        })
      ],
    }
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    wyw({
      include: ["**/*.{ts,tsx}"],
      babelOptions: {
        presets: ["@babel/preset-typescript", "@babel/preset-react"],
      },
    }),
  ],
});
