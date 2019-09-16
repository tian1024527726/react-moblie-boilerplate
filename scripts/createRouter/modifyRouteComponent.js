export default (memo, args) => {
    const importPath = args.importPath, webpackChunkName = args.webpackChunkName;

    if (!webpackChunkName) {
        return memo;
    }

    let extendStr = '';
    extendStr = `/* webpackChunkName: ^${webpackChunkName}^ */`;

    let ret = `
dynamic({
component: () => import(${extendStr}'${importPath}')
})
`.trim();
    return ret;
}
