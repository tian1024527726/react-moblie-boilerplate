require('shelljs/global'); // shelljs 模块重新包装了 child_process，调用系统命令更加方便。

// 打包开发环境使用的dll文件
exec(`cross-env NODE_ENV=development BUILDING_DLL=true webpack --display-used-exports --display-chunks --color  --config scripts/webpack/webpack.dll.conf.js`);
// 打包生产环境使用的dll文件
exec(`cross-env NODE_ENV=production BUILDING_DLL=true webpack --display-used-exports --display-chunks --color -p --config scripts/webpack/webpack.dll.conf.js`);

