import mockjs from 'mockjs';

// 加载mock文件夹下所有的js文件
if (process.env.MOCK) { // eslint-disable-line
  // 设置mock接口相应时间
  mockjs.setup({
    timeout: '1000'
  })
  const mockContext = require.context('../mock', true, /\.js$/);
  mockContext.keys().forEach(item => {
    mockContext(item);
  })
}
