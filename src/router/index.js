import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from '../components/recommend/recommend.vue'
// import Singer from '../components/singer/singer.vue'
// import Rank from '../components/rank/rank.vue'
// import Search from '../components/search/search.vue'
// import SingerDetail from '../components/singer-detail/singer-detail.vue'
// import Disc from '../components/disc/disc.vue'
// import TopList from '../components/top-list/top-list.vue'
// import UserCenter from '../components/user-center/user-center.vue'

Vue.use(Router)

const Recommend = () =>
  import(
    /* webpackChunkName: "Recommend" */ '../components/recommend/recommend.vue'
  )

const Singer = () =>
  import(/* webpackChunkName: "Singer" */ '../components/singer/singer.vue')

const Rank = () =>
  import(/* webpackChunkName: "Rank" */ '../components/rank/rank.vue')

const Search = () =>
  import(/* webpackChunkName: "Search" */ '../components/search/search.vue')

const SingerDetail = () =>
  import(
    /* webpackChunkName: "SingerDetail" */ '../components/singer-detail/singer-detail.vue'
  )

const Disc = () =>
  import(/* webpackChunkName: "Disc" */ '../components/disc/disc.vue')

const TopList = () =>
  import(
    /* webpackChunkName: "TopList" */ '../components/top-list/top-list.vue'
  )

const UserCenter = () =>
  import(
    /* webpackChunkName: "UserCenter" */ '../components/user-center/user-center.vue'
  )

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
