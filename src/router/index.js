import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IntegrantesView from '@/views/IntegrantesView.vue'
import JugadorView from '../views/jugador/JugadorView'
import CampeonatoView from '../views/campeonato/CampeonatoView.vue'
import EquipoView from '../views/equipo/EquipoView.vue'
import InscripcionView from '../views/inscripcion/InscripcionView'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/integrantes',
    name: 'integrantes',
    component: IntegrantesView
  },
  {
    path: '/campeonato',
    name: 'campeonato',
    component: CampeonatoView
  },
  {
    path: '/equipo',
    name: 'equipo',
    component: EquipoView
  },
  {
    path: '/jugador',
    name: 'jugador',
    component: JugadorView
  },
  {
    path: '/inscripcion',
    name: 'inscripcion',
    component: InscripcionView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
