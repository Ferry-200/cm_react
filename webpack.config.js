import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const isDev = process.env.NODE_ENV !== 'production';

// @ts-check
/**
 * @type {import('webpack').Configuration}
 */
export default {
  mode: isDev ? 'development' : 'production',
  entry: './src/main.tsx',
  output: {
    path: path.resolve('dist'),
    // 在 dev 模式下加上 contenthash 反而会让热更新（HMR）和增量编译变慢，而且调试体验会更糟。
    // 每次修改都会生成新的 contenthash，使浏览器加载整个文件、刷新整个页面
    filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
    clean: true,
  },
  // 生成源码映射（source map）。匹配原始代码和打包、压缩后的代码
  // - eval source map 生成速度最快，map 会集成在 bundle 中
  // - source map 会生成另外的 .map 文件，不会集成在 bundle 中
  //   会在 js css 文件最后一行添加 //# sourceMappingURL=app.js.map 指示映射文件
  // - hidden source map 与 source map 基本一致，但不会添加映射注释
  //   这样浏览器检查面板就不会加载对应 map，减少源码泄露可能性
  devtool: isDev ? 'eval-source-map' : 'hidden-source-map',
  devServer: {
    hot: true,
    // 当找不到请求的静态资源时，把请求重定向（fallback）到 index.html，让前端路由接管渲染。
    // 用于 spa 应用
    historyApiFallback: true,
    // 保持和 Vite 一致
    port: 5173,
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
            loader: '@wyw-in-js/webpack-loader',
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