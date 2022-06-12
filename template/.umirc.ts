import { defineConfig } from 'dumi';

export default defineConfig({
  title: '{{componentTitle}}',
  outputPath: 'docs',
  exportStatic: { 
    htmlSuffix: true 
  },
  webpack5: {},
  menus: {},
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  base: '{{projectName}}'
  // more config: https://d.umijs.org/config
});
