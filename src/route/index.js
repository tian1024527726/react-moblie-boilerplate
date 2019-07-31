module.exports = {
  path: '/',
  component: require('../app/index'),
  childRoutes: [
    {
      path: 'home',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          cb(null, require('../pages/home'));
        }, 'home')
      }
    }
  ],
  indexRoute: {
    getComponent(location, cb) {
      require.ensure([], (require) => {
        cb(null, require('../pages/home'));
      }, 'home')
    }
  }
}
