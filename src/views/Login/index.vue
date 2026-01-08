<script setup>
 import { dengluapi } from '@/apis/user';
import { userstore } from '@/stores';
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
// 新增：导入Toast和JumpTip组件
import { showSuccessToast, showFailToast } from 'vant'
import JumpTip from '@/components/JumpTip.vue'


// 1. 执行 useRoute() 获取当前路由信息实例
const route = useRoute();
const router=useRouter()


console.log("当前路由是否有携带参数",route);

   

//前端保存用户密码
const username=ref('')
const password=ref('')

//拿到user仓库
const userST=userstore()

// 新增：控制跳转提示组件显示/隐藏
const jumpTipVisible = ref(false)
// 新增：跳转目标（优先取回跳参数，无则跳首页）
const jumpTarget = ref(route.query.huitiaourl || '/')

//返回上一级
const onClickLeft=()=>{
    console.log("返回上一级");
    router.push(route.query.huitiaourl)
}

// 新增：处理跳转逻辑
const handleJump = (target) => {
  router.push(target)
  jumpTipVisible.value = false
}

//点击了登录的逻辑
const onSubmit= async ()=>{
    console.log("我点击了登录");

    try {
       const res= await dengluapi(username.value,password.value)
        // console.log("登录返回的值",res);
        userST.settoken(res.data.token)
        // 新增：登录成功提示+显示跳转组件
        await showSuccessToast('登录成功！');
        jumpTipVisible.value = true
    } catch (error) {
        // 捕获所有异常，避免 Vue 上报警告
        console.error('登录失败：', error);
        await showFailToast('登录失败：');                      //因为是自动引入
    }
    
}






</script>

<template>

    <div class="denglu">

        <van-nav-bar
            title="面经登录"
            :left-text="route.query.huitiaourl   ? '返回' : ''" 
            :left-arrow="route.query.huitiaourl   ? true : false "
            @click-left="onClickLeft"
            class="MJtite"
        />


        <van-form @submit="onSubmit">

            <van-cell-group inset>
                <van-field
                v-model="username"
                name="username"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
                />
                <van-field
                v-model="password"
                type="password"
                name="password"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
                />
            </van-cell-group>

            <div style="margin: 16px;">

                <van-button round block type="primary" native-type="submit">
                登录
                </van-button>
            </div>

            <div style="margin: 16px;">

                <van-button round block type="primary"
                to="/Zhuce"
                >
                去注册
                </van-button>
            </div>

        </van-form>
        
        <!-- 新增：跳转提示组件 -->
        <JumpTip
            :visible="jumpTipVisible"
            :tip-text="route.query.huitiaourl ? '登录成功！即将返回原页面' : '登录成功！即将跳转到首页'"
            :duration="3"
            :target="jumpTarget"
            :is-external="false"
            @close="jumpTipVisible = false"
            @jump="handleJump"
        />



    </div>


</template>


<style scoped> 

.MJtite{
    margin-bottom: 20px;
}

</style>