import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import store from './store'
import axios from "axios"

Vue.use(VueRouter)

const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true },
    children:[{
      path:'/account/profile',
      name:'account.profile',
      component:() => import('./views/abp/account/Profile.vue')
    },{
      path:'/identity/users',
      name:'identity.users',
      component:() => import('./views/abp/identity/Users.vue')
    },{
      path:'/identity/roles',
      name:'identity.roles',
      component:() => import('./views/abp/identity/Roles.vue')
    },{
      path:'/tenant/tenants',
      name:'tenant.tenants',
      component:() => import('./views/abp/tenant/Tenants.vue')
    },{
      path:'/table/tables',
      name:'table.tables',
      component:() => import('./views/Table.vue')
    },{
      path:'/menu/menus',
      name:'menu.menus',
      component:() => import('./views/Menu.vue')
    }]
  },{
    path:'/account/login',
    name:'account.login',
    component:() => import('./views/abp/account/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if(store.state.token){
      axios.defaults.headers.common["Authorization"] = store.state.token;
      next()
    }else{
      router.push("/account/login")
    }
  } else {
    next()
  }
})

export default router
