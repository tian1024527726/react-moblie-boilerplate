# react+yui-mobile+template

This is a Template for developing with React.js Production ready!

使用React.js开发的使用yui-mobileUI组件的移动端样板工程

------

# install dependencies
yarn install | npm install

# notice
如果使用npm安装，请使用淘宝镜像源，否则会安装失败
设置淘宝镜像源，在终端中执行 npm confit set registry=https://registry.npm.taobao.org

# build dll
yarn build:dll | npm run build:dll

# start development with hot-reload
yarn start | npm start

### 通过yarn start:mock启动项目, 首先对接口请求参数根据实际项目中后端接口进行修改
1、buildConfig/index.js  修改host，配置生产和测试的host
2、src/utils/Request.js  修改success函数返回的数据
3、mock/productDetail.json  修改数据结构

# create a page
yarn create:page | npm run create:page

1、 input a pageName
Example: helloWorld

2、 supplement router
Example:

```js
{
  path: 'helloWorld',
  getComponent(location, cb) {
    require.ensure([], (require) => {
      Promise.all([]).then(function () {
        cb(null, require('..pages/helloWorld'));
      })
    }, 'helloWorld')
  }
}
```

3、 supplement reducer/action
通过yarn create:page 创建页面，不需要手动在redux/index.js引入actin和reducer文件
页面通过inject函数动态添加action和store，
example:
```js
@inject('home')
class Home extend React.Component{
  return (
    <div></div>
  )
}
```


# build 
1、testing
yarn build:test | yarn build:prd
2、production
npm run build:prod | npm run build:prod

# compress the built project for deployment
yarn package | npm run package


------

## Functionalities

- [ ] Frontend hot-reload without refreshing webpage manually.
- [ ] Writing codes with ES6/ES7 and compile frontend for release.
- [x] Pack the whole built project and external modules for deployment.


------

## Directory Structure

### 1、buildConfig --- 打包时导入的全局配置参数
    Use Example:
    scss --- @import '~@site/var.scss'
    js   --- import { host, version, from  } from '@site'
### 2、config --- webpack运行时环境的配置参数
### 3、common --- 公共模块
    common/components --- react组件
    common/utils --- 工具类函数
### 4、mock --- 模拟数据，使用mockjs
### 5、scripts --- webpack运行js
### 6、src --- 前端项目代码

------

## VSCode Extension

### 1、EditorConfig for VS Code
配合.editorconfig文件的配置,格式化代码
注意：不要使用其他格式化插件,可能会有冲突

### 2、Beautify css/sass/scss/less
在VS Code中添加设置
```js
  "beautify.tabSize": 2,
  "beautify.options": {
    "end_with_newline": true
  }
```
配置stylelint格式化css/sass/scss/less文件







