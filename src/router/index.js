import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AccountsView from '../views/AccountsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import PayeesView from '../views/PayeesView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import BalanceView from '../views/BalanceView.vue'
import ChartsView from '../views/ChartsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: AccountsView
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategoriesView
    },
    {
      path: '/payees',
      name: 'payees',
      component: PayeesView
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView
    },
    {
      path: '/balance',
      name: 'balance',
      component: BalanceView
    },
    {
      path: '/charts',
      name: 'charts',
      component: ChartsView
    }
  ]
})

export default router
