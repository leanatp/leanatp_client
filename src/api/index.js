import * as common from './modules/common'
import * as user from './modules/user'
import * as role from './modules/role'
import * as menu from './modules/menu'
import * as log from './modules/log'
import * as config from './modules/config'
import * as oss from './modules/oss'
import * as schedule from './modules/schedule'
import * as goods from './modules/goods'
import * as project from './modules/project'
import * as relprojectuser from './modules/relprojectuser'
import * as sysbizdata from './modules/sysbizdata'
import * as application from './modules/application'
import * as relapplicationuser from './modules/relapplicationuser'
import * as categorycomponent from './modules/categorycomponent'
import * as categorybizflow from './modules/categorybizflow'
import * as categorytestcase from './modules/categorytestcase'
import * as component from './modules/component'
import * as componentbizdata from './modules/componentbizdata'
import * as componentelement from './modules/componentelement'
import * as bizflow from './modules/bizflow'
import * as bizflowdetail from './modules/bizflowdetail'

export default {
    common, // 公共
    user, // 管理员管理
    role, // 角色管理
    menu, // 菜单管理
    log, // 系统日志
    config, // 参数管理
    oss, // 文件服务
    schedule, // 定时任务
    goods, //商品管理
    project, //项目基本信息
    relprojectuser, //项目和人员关系列表
    sysbizdata, //字典表维护
    application, //应用基本信息
    relapplicationuser, //应用程序和人员的关系列表
    categorycomponent, //组件目录
    categorytestcase, //测试案例目录
    categorybizflow, //业务流目录
    component, //业务组件
    componentbizdata, //业务组件字典表
    componentelement, //业务组件对象
    bizflow, //业务流
    bizflowdetail, //业务流明细
}