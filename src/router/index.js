import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Main from '@/components/pages/Main'
import Signin from '@/components/pages/Signin'
import Signup from '@/components/pages/Signup'
import View from '@/components/pages/View'
import Edit from '@/components/pages/Edit'
import UserEdit from '@/components/pages/UserEdit'
import PasswordEdit from '@/components/pages/PasswordEdit'

Vue.use(Router);

let router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Main',
            component: Main
        },
        {
            path: '/auth/signin',
            name: 'Signin',
            component: Signin
        },
        {
            path: '/auth/signup',
            name: 'Signup',
            component: Signup
        },
        {
            path: '/:id/view',
            name: 'View',
            component: View
        },
        {
            path: '/:id/edit',
            name: 'Edit',
            component: Edit,
            meta: { requiresAuth: true}
        },
        {
            path: '/auth/edit/:id',
            name: 'UserEdit',
            component: UserEdit,
            meta: { requiresAuth: true}
        },
        {
            path: '/auth/password/edit/:id',
            name: 'PasswordEdit',
            component: PasswordEdit,
            meta: { requiresAuth: true}
        }
    ]
})

router.beforeEach((to, from, next) => {
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if(requiresAuth){
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                next()
            }else{
                next({
                    path: '/'
                })
            }
        })
    }else{
        next()
    }
})
export default router