import Vue from 'vue'
import Router from 'vue-router'

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有开发环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

Vue.use(Router)

// 路由定义
export default new Router({
    mode: 'hash',
    routes: [
        { path: '/404', component: _import('error/404'), name: '404', desc: '404未找到' },
        { path: '/login', component: _import('login/index'), name: 'login', desc: '登录' },
        {
            path: '/',
            component: _import('layout/index'),
            name: 'layout',
            redirect: { name: 'home' },
            desc: '上左右整体布局',
            children: [
                // 通过isTab属性, 设定是否通过tab标签页展示内容
                { path: '/home', component: _import('home/index'), name: 'home', desc: '首页' },
                { path: '/layout-setting', component: _import('layout/setting'), name: 'setting', desc: '布局设置' },
                { path: '/user', component: _import('user/index'), name: 'user', desc: '管理员管理', meta: { isTab: true } },
                { path: '/role', component: _import('role/index'), name: 'role', desc: '角色管理', meta: { isTab: true } },
                { path: '/menu', component: _import('menu/index'), name: 'menu', desc: '菜单管理', meta: { isTab: true } },
                { path: '/sql', component: _import('sql/index'), name: 'sql', desc: 'DemoPage', meta: { isTab: true } },
                { path: '/schedule', component: _import('schedule/index'), name: 'schedule', desc: '定时任务', meta: { isTab: true } },
                { path: '/config', component: _import('config/index'), name: 'config', desc: '参数管理', meta: { isTab: true } },
                { path: '/oss', component: _import('oss/index'), name: 'oss', desc: '文件上传', meta: { isTab: true } },
                { path: '/log', component: _import('log/index'), name: 'log', desc: '系统日志', meta: { isTab: true } },
                { path: '/goods', component: _import('goods/index'), name: 'goods', desc: '商品管理', meta: { isTab: true } },
                { path: '/project', component: _import('project/index'), name: 'project', desc: '项目基本信息', meta: { isTab: true } },
                { path: '/sysbizdata', component: _import('sysbizdata/index'), name: 'sysbizdata', desc: '业务字段管理', meta: { isTab: true } },
                { path: '/application', component: _import('application/index'), name: 'application', desc: '应用基本信息', meta: { isTab: true } },
                { path: '/categorycomponent', component: _import('categorycomponent/index'), name: 'categorycomponent', desc: '业务组件目录信息', meta: { isTab: true } },
                { path: '/categorybizflow', component: _import('categorybizflow/index'), name: 'categorybizflow', desc: '业务流目录信息', meta: { isTab: true } },
                { path: '/categorytestcase', component: _import('categorytestcase/index'), name: 'categorytestcase', desc: '测试案例目录信息', meta: { isTab: true } },
                { path: '/component', component: _import('component/index'), name: 'component', desc: '业务组件管理', meta: { isTab: true } },
                { path: '/componentbizdata', component: _import('componentbizdata/index'), name: 'componentbizdata', desc: '业务组件字典表', meta: { isTab: true } },
                { path: '/componentelement', component: _import('componentelement/index'), name: 'componentelement', desc: '业务组件对象库', meta: { isTab: true } },
                { path: '/bizflow', component: _import('bizflow/index'), name: 'bizflow', desc: '业务流管理', meta: { isTab: true } },
                { path: '/bizflowdetail', component: _import('bizflowdetail/index'), name: 'bizflowdetail', desc: '业务流明细', meta: { isTab: true } },

            ],
            beforeEnter(to, from, next) {
                let token = Vue.cookie.get('token')
                if (!token || !/\S/.test(token)) {
                    next({ name: 'login' })
                }
                next()
            }
        },
        { path: '*', redirect: { name: '404' } }
    ]
})