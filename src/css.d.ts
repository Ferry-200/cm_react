// 允许 TS 直接导入任何 css 文件
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}