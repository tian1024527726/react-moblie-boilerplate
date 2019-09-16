/**
 * author yyb
 * date   2019/7/12
 * {
 * 		path: '/user' 路由名
 * 		name: '用户'  页面名称
 * 		icon: 'user'  菜单栏图标
 * 		routes: [{},{}]    子路由配置
 * 		Routes: ['src/pages/Authorized']  权限控制组件配置
 *    hideInMenu: false    菜单栏中隐藏当前项
 * 		hideChildrenInMenu: false    菜单栏中隐藏routes的
 * 		component: '../layouts/userLayout'（做代码分离）  以pages文件夹为根路径的相对路径
 *  或  `() => require('./layouts/userLayout').default`（不做代码分离）  以src文件夹为根路径的相对路径
 * require的路径需要用 '' 包裹
 * }
 */

export default [
  {
    path: '/',
    component: '../app/index',
    routes: [
      { path: '/', redirect: '/home' },
      {
        path: '/home',
        name: 'home',
        component: '../pages/home',
      },
    ]
  }
]
