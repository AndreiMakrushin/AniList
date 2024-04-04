import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AnimePage from '@/views/AnimePage.vue'
import NoFound from '../views/NoFound.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/anime/:id',
            name: 'anime',
            component: AnimePage
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NoFound',
            component: NoFound
        },
        {
            path: '/profile',
            name: 'profile',
            component: ProfileView
        }

    ]
})

export default router