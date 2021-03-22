import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/home/Home.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/originate',
    alias: '/',
    name: 'originate',
    component: Home,
    props: true
  },
  {
    path: '/offers/',
    name: 'offers',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/offers/Offers.vue'),
    props: true
  },
  {
    path: '/offer/:id',
    name: 'Offer',
    component: () => import(/* webpackChunkName: "about" */ '@/views/view-item/View-item.vue'), 
    props: true
  },
  {
    path: '/buy/:id',
    name: 'Buy item',
    // route level code-splittings
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/view-item/View-item.vue'), 
    props: true
  },
  {
    path: '/order/:id',
    name: 'Order',
    // route level code-splittings
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/view-item/View-item.vue'), 
    props: true
  },
  {
    path: '/admin',
    name: 'admin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/admin/Admin.vue'), 
    props: true
  },
  {
    path: '/orders',
    name: 'orders',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/tracking/Tracking.vue'), 
    props: true
  },
  {
    path: '/marketplace',
    name: 'marketplace',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/marketplace/Marketplace.vue'), 
    props: true
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if(to.name!=='originate') {
    if((typeof localStorage.getItem('vuex') === 'undefined') || (localStorage.getItem('vuex') === null))
        {
          next({ name: 'originate' })
        }
        else
        {
          const contract = JSON.parse(localStorage.getItem('vuex')!).contract;
          if((typeof contract === 'undefined') || (contract === null) || (typeof contract.contractAddress === 'undefined') || (contract.contractAddress === null) || (contract.contractAddress.length < 1))
          {
            next({ name: 'originate' })
          }
          else next () 
        }
      }
    else next()
})

export default router;
