// 允许 TS 直接导入任何 css 文件
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// 如果你不使用 CSS Modules，只需要空对象类型
// declare module '*.css';