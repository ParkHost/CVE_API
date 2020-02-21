import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Details from '../views/Detail.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/byId*',
    name: 'CVE Details',
    component: Details,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
