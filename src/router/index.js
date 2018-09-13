import Vue from 'vue'
import Router from 'vue-router'
import App from '@/App'

Vue.use(Router)
//嵌套路由见另一个项目
export default new Router({
  //mode: 'history', // 访问路径不带井号 
  routes: [{
    path: '/',
    name: 'index',
    component: r => require.ensure([], () => r(require('../page/index/index')), 'index'), // 使用懒加载 加快访问速度
  }]
})
