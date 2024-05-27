import { createRouter, createWebHistory } from 'vue-router'
import AnimeCatalog from '@/views/AnimeCatalog.vue'
import AnimePage from '@/views/AnimePage.vue'
import NoFound from '../views/NoFound.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: '/',
            name: 'AnimeCatalog',
            component: AnimeCatalog
        },
        {
            path: '/anime/:id/:episode',
            name: 'anime',
            component: AnimePage
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NoFound',
            component: NoFound
        },
        {
            path: '/lk/:id',
            name: 'lk',
            component: ProfileView
        }

    ]
})

export default router