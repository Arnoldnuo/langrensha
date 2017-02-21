import * as Vue from 'vue/dist/vue.js';
import * as VueRouter from 'vue-router'

import * as App from './App.vue';
Vue.use(VueRouter);

const router = new VueRouter({
    routes: [{
        path: '/',
        component: App
    }]
});

new Vue({
    router: router
}).$mount('#app');
