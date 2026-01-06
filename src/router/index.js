import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      redirect: '/ShoYe'   //路由重定向
    },

    {
      path: '/Login',
      component: () => import('../views/Login/index.vue'),
    },

    {
      path: '/ZhuCe',
      component: () => import('../views/ZhuCe/index.vue'),
    },

    {
      path: '/MJXianQing',
      component: () => import('../views/MJXianQing/index.vue'),
    },


    //首页
    {
      path: '/ShoYe',
      component: () => import('../views/ShouYe/index.vue'),


        //二级路由
        children:[

          {
            path:'zhuye',
            component: ()=> import('@/views/ShouYe/zhuye.vue')
          },

          {
            path:'shoucang',
            component: ()=> import('@/views/ShouYe/shoucang.vue')
          },
          
          {
            path:'xihuan',
            component: ()=> import('@/views/ShouYe/xihuan.vue')
          },
          
          
          {
            path:'wode',
            component: ()=> import('@/views/ShouYe/wode.vue')
          },    
          
          
        ]

        
    },



    
  ],
})

export default router
