/**
 * 开发环境
 */
;
(function() {
    window.SITE_CONFIG = {};

    // api接口请求地址
    window.SITE_CONFIG['baseUrl'] = 'http://localhost:8080/latp';

    // 嵌套iframe地址
    window.SITE_CONFIG['nestIframeUrl'] = 'http://localhost:8080/latp';
    // 嵌套iframe路由名称列表
    window.SITE_CONFIG['nestIframeRouteNameList'] = ['sql'];

    // 静态资源文件夹名称
    window.SITE_CONFIG['staticFileName'] = '';
    // cdn地址
    window.SITE_CONFIG['cdnUrl'] = './' + window.SITE_CONFIG.staticFileName;
})();