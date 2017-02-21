/**
 * @file FIS 配置
 * @author
 */

fis.config.set('namespace', 'main');
fis.set('project.fileType.text', 'vue');
// chrome下可以安装插件实现livereload功能
// https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei
fis.config.set('livereload.port', 35729);
fis.enableNPM({
    autoPack: false
});
fis.match('/client/page/**.vue', {
    isMod: true,
    rExt: 'js',
    useSameNameRequire: true,
    parser: fis.plugin('vue-component', {
        cssScopeFlag: 'vuec'
    })
});
fis.match('/client/page/**.vue:js', {
    parser: [
        fis.plugin('typescript', {
            module: 1,
            target: 0,
            sourceMap: true
        })
    ]
});
fis.match('/client/page/**.js', {
    parser: fis.plugin('typescript', {
        module: 1,
        target: 0,
        sourceMap: true
    }),
    isJsXLike: true,
    isMod: true
});


fis.media('debug').match('*', {
    optimizer: null,
    useHash: false,
    deploy: fis.plugin('http-push', {
        receiver: 'http://127.0.0.1:8085/yog/upload',
        to: '/'
    })
});
fis.media('debug-prod').match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://127.0.0.1:8085/yog/upload',
        to: '/'
    })
});
