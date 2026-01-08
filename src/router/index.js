import { yzsfapi } from '@/apis/user';
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      redirect: '/ShoYe/zhuye'   //路由重定向
    },

    {
      path: '/login',
      component: () => import('../views/Login/index.vue'),
    },

    {
      path: '/zhuce',
      component: () => import('../views/ZhuCe/index.vue'),
    },

    {
      path: '/mjxianqing',
      component: () => import('../views/MJXianQing/index.vue'),
      meta:{
        isYanZhen:true
      }
    },


    //首页
    {
      path: '/ShoYe',
      component: () => import('../views/ShouYe/index.vue'),
      redirect: '/ShoYe/zhuye' ,  //路由重定向

        //二级路由
        children:[

          {
            path:'zhuye',
            component: ()=> import('@/views/ShouYe/zhuye.vue'),
            meta:{
                isYanZhen:true
            }
          },

          {
            path:'shoucang',
            component: ()=> import('@/views/ShouYe/shoucang.vue'),
            meta:{
                isYanZhen:true
            }

          },
          
          {
            path:'xihuan',
            component: ()=> import('@/views/ShouYe/xihuan.vue'),
            meta:{
                isYanZhen:true
            }
          },
          
          
          {
            path:'wode',
            component: ()=> import('@/views/ShouYe/wode.vue'),
            meta:{
                isYanZhen:true
            }
          },    
          
          
        ]

        
    },



    
  ],
})





//路由前置守卫

/*
  router.beforeEach(  async (to)=>{
    
    // ---------- 因为首页需要有token值————验证是否正确是后端的接口的事情  ----------
        //如果只是一些要验证，那么就在  路由参数里面挂载一个标识isyz

        if(to.meta.isYanZhen){

            const userstoreJSON = localStorage.getItem('MJSX-userstore'); // 从本地存储取 MJSX-userstore
            const userstore=JSON.parse(userstoreJSON)

            //再判断本地是否有token值
            if(userstore.token &&  to.path !== '/login' ){

              try {

               await yzsfapi(userstore.token)    
               console.log("验证登录成功");

                           
              } catch (error) {

                console.log(error);
                // 验证失败（token 过期/无效），清空本地存储并跳登录
                localStorage.removeItem('MJSX-userstore');
                  
                  return '/login'
              }

            }

        }
       
        return true
  })

*/



// 路由前置守卫
// 路由前置守卫
router.beforeEach(async (to) => {
  console.log("去的网页", to);
  // 只有路由需要验证时才执行校验逻辑
  if (to.meta.isYanZhen) {
    console.log("需要验证的网页");

    try {
      // 1. 从本地存储获取用户信息，做容错处理
      const userstoreJSON = localStorage.getItem('MJSX-userstore');

      // 若本地无存储，处理弹窗逻辑
      if (!userstoreJSON) {


        // 关键：用 await 接收弹窗的 Promise 结果，而非回调
        try {
          
          // 点击确认：Promise 解析（进入 then）
          await showConfirmDialog({
            title: '温馨提示',
            message: '身份验证失败，你还没有登录，请您选择已有账号去登录，没有账号免费去注册',
            confirmButtonText:"去登录",
            cancelButtonText: "去注册",
            // cancelButtonDisabled:true
          });
          console.log("点击了确认");
          // 确认后跳登录页
          return '/login';
        } catch (error) {
          return '/zhuce';
        }
      }





      const userstore = JSON.parse(userstoreJSON);
      // 2. 检查 token 是否存在
      if (!userstore?.token) {
        return '/login';
      }

      // 3. 调用验证接口
      await yzsfapi(userstore.token);
      console.log("验证登录成功");

      // 4. 验证通过，放行
      return true;

    } catch (error) {
      console.log("验证登录失败：", error);
      await showFailToast('身份验证失败');
      // 验证失败，清空存储并跳登录
      localStorage.removeItem('MJSX-userstore');
      return '/login';
    }
  }

  // 不需要验证的路由，放行
  return true;
});




export default router
