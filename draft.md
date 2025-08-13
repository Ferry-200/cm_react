好，我帮你根据你提供的 **package.json** 和 **vite.config.ts**，
整理一份完整的 **从 Vite 转向 Webpack 的迁移方案**，做到功能一比一等价，
并保留所有你在 Vite 配置里使用的功能（React、TypeScript、Linaria、打包分析 gzip/brotli、HTML 模板、HMR）。

---

## 1. 对照表（Vite → Webpack）

| 功能 | Vite 方案 | Webpack 等价方案 |
| ---- | --------- | ---------------- |
| React JSX/TSX 支持 | `@vitejs/plugin-react` | `babel-loader` + `@babel/preset-react` + `@babel/preset-typescript` |
| 热更新（HMR） | 内置 | `react-refresh-webpack-plugin` |
| TypeScript 编译 | `vite build` 内置 `esbuild` | `babel-loader` 或 `ts-loader` + `fork-ts-checker-webpack-plugin` |
| CSS 处理 | 内置 | `style-loader` + `css-loader` / `MiniCssExtractPlugin` |
| Linaria 样式抽取 | `@wyw-in-js/vite` | `@wyw-in-js/webpack` |
| 打包分析 | `rollup-plugin-visualizer` | `webpack-bundle-analyzer` |
| gzip/brotli 体积显示 | `visualizer` 插件参数 | `compression-webpack-plugin` |
| HTML 模板注入 | Vite 自动注入 | `html-webpack-plugin` |
| SplitChunks 优化 | Rollup 自动 | Webpack `splitChunks` |

---

## 2. 迁移步骤

### 步骤 1：安装 Webpack 相关依赖

```bash
npm install --save-dev \
  webpack webpack-cli webpack-dev-server \
  babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript \
  react-refresh @pmmmwh/react-refresh-webpack-plugin \
  css-loader style-loader mini-css-extract-plugin \
  @wyw-in-js/webpack \
  html-webpack-plugin \
  webpack-bundle-analyzer \
  compression-webpack-plugin \
  typescript
```

---

### 步骤 2：新建 `webpack.config.js`

```js
import path from 'path';
import webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { WebpackLinariaLoader } from '@wyw-in-js/webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';

const isDev = process.env.NODE_ENV !== 'production';

export default {
  mode: isDev ? 'development' : 'production',
  entry: './src/main.tsx',
  output: {
    path: path.resolve('dist'),
    filename: isDev ? '[name].js' : '[name].[contenthash].js',
    clean: true,
  },
  devtool: isDev ? 'eval-source-map' : 'source-map',
  devServer: {
    hot: true,
    historyApiFallback: true,
    port: 5173, // 保持和 Vite 一致
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
              plugins: [
                isDev && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
          {
            loader: WebpackLinariaLoader,
            options: {
              include: ["**/*.{ts,tsx}"],
              babelOptions: {
                presets: ["@babel/preset-typescript", "@babel/preset-react"],
              },
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    isDev && new ReactRefreshWebpackPlugin(),
    !isDev && new MiniCssExtractPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    // 打包分析 + gzip/brotli 压缩
    !isDev && new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: true,
      reportFilename: 'stats.html',
    }),
    !isDev && new CompressionPlugin({
      algorithm: 'gzip',
    }),
    !isDev && new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: { level: 11 },
      threshold: 10240,
      minRatio: 0.8,
    }),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
```

---

### 步骤 3：修改 `package.json` 脚本

```json
"scripts": {
  "dev": "webpack serve --config webpack.config.js --env development",
  "build": "webpack --config webpack.config.js --env production",
  "lint": "eslint ."
}
```

---

### 步骤 4：移除 Vite 依赖

```bash
npm uninstall vite @vitejs/plugin-react @wyw-in-js/vite rollup-plugin-visualizer
```

---

## 3. 注意事项

1. **HMR 体验差异**
   Webpack + React Refresh 会比 Vite 慢一些，特别是大项目。
2. **gzip / brotli 输出**
   Webpack 默认不会内置，你已经用 `CompressionPlugin` 等价替换。
3. **Linaria 性能**
   Webpack 下建议开启 `cache: { type: 'filesystem' }` 提速。
4. **打包分析报告路径**
   已设为 `dist/stats.html`，和 Vite 版本一致。
5. **端口与历史路由**
   保留了 Vite 的 `5173` 端口和 `historyApiFallback` 配置。
