import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AccountsView from '../views/AccountsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import PayeesView from '../views/PayeesView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import YearlySummaryView from '../views/YearlySummaryView.vue'

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
      path: '/summary',
      name: 'summary',
      component: YearlySummaryView
    }
  ]
})

export default router
