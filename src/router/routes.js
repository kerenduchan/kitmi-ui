import HomeView from '../views/HomeView.vue'
import AccountsView from '../views/AccountsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import PayeesView from '../views/PayeesView.vue'
import TransactionsView from '../views/TransactionsView.vue'
import BalanceView from '../views/BalanceView.vue'
import ChartsView from '../views/ChartsView.vue'
import SettingsView from '../views/SettingsView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        title: 'Home',
        icon: 'mdi-home',
        component: HomeView
    },
    {
        path: '/accounts',
        name: 'accounts',
        title: 'Accounts',
        icon: 'mdi-bank-transfer',
        component: AccountsView
    },
    {
        path: '/categories',
        name: 'categories',
        title: 'Categories',
        icon: 'mdi-folder-multiple',
        component: CategoriesView
    },
    {
        path: '/payees',
        name: 'payees',
        title: 'Payees',
        icon: 'mdi-hand-coin',
        component: PayeesView
    },
    {
        path: '/transactions',
        name: 'transactions',
        title: 'Transactions',
        icon: 'mdi-currency-usd',
        component: TransactionsView
    },
    {
        path: '/balance',
        name: 'balance',
        title: 'Balance',
        icon: 'mdi-scale-balance',
        component: BalanceView
    },
    {
        path: '/charts',
        name: 'charts',
        title: 'Charts',
        icon: 'mdi-poll',
        component: ChartsView
    },
    {
        path: '/settings',
        name: 'settings',
        title: 'Settings',
        icon: 'mdi-cog',
        component: SettingsView
    }
]

export default routes