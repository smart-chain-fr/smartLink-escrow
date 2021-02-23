import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    alias: "/home",
    name: "home",
    component: () => import("../components/Home.vue")
  },
  {
    path: "/escrow",
    name: "tutorial-details",
    component: () => import("../components/Escrow.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
