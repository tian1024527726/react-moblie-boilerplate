const slash = require('slash2');

const styleLoader = {
  loader: 'style-loader'
}

const cssLoader = (cssModule = false, minimize = false) => {
  const res = {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
    },
  };
  if (cssModule) {
    res.options = {
      ...res.options,
      modules: {
        mode: 'local',
        localIdentName: '[path][name]__[local]--[hash:base64:5]',
        getLocalIdent: (context, localIdentName, localName) => {
          if (
            context.resourcePath.includes('node_modules')
          ) {
            return localName;
          }
          const match = context.resourcePath.match(/src(.*)/);
          if (match && match[1]) {
            const reactAntdPath = match[1].replace('.scss', '').replace('.module', '');
            const arr = slash(reactAntdPath)
              .split('/')
              .map(a => a.replace(/([A-Z])/g, '-$1'))
              .map(a => a.toLowerCase());
            return `react-template${arr.join('-')}-${localName}`.replace(/--/g, '-');
          }
          return localName;
        }
      },
    };
  }
  return res;
}

const px2remLoader = {
  loader: 'px2rem-loader',
  options: {
    remUnit: 16,
    remPrecision: 8
  }
}

const postCssLoader = {
  loader: 'postcss-loader',
}

const sassLoader = {
  loader: 'sass-loader',
  options: {
    sourceMap: true,
    outputStyle: 'compact',
    javascriptEnabled: true,
  },
}

const lessLoader = {
  loader: 'less-loader',
}

exports.loadersConfig = {
  styleLoader,
  cssLoader,
  px2remLoader,
  postCssLoader,
  sassLoader,
  lessLoader,
};
