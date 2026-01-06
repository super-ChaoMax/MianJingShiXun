<script setup>
import { zhuceapi } from '@/apis/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'



const router=useRouter()


//前端保存用户密码
const username=ref('')
const password=ref('')




//点击了注册的逻辑
const onSubmit= async ()=>{
    console.log("我点击了注册");

    try {
        //传给后端
        await zhuceapi(username.value,password.value)
        // console.log(res);   
        await showSuccessToast('注册成功');                  // //因为是自动引入

        //跳转回登录页
        router.push("/login")

    } catch (error) {
        // 捕获所有异常，避免 Vue 上报警告
        console.error('注册失败：', error);
        await showFailToast('注册失败');                      //因为是自动引入
    }
    
    
}






</script>

<template>

    <div class="denglu">

        <van-nav-bar
            title="面经注册"
            left-text="返回" 
            left-arrow
            @click-left="router.go(-1)"
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
                注册
                </van-button>
            </div>


        </van-form>   


        <div class="fu">
            <!-- <span class="denglu">已有账号,去登录</span> -->
            <div class="denglu" @click="router.push('/login') ">已有账号,去登录</div>
        </div>


    </div>


</template>


<style scoped> 

    .fu{
        display: flex; /* 核心：开启 Flex */
        align-items: center; /* 可选：垂直居中，让内容对齐更美观 */
         width: 100%; /* 可选：占满父级宽度，确保右对齐生效 */
    }

    .denglu{
        margin-left: auto; /* 核心：自动填充左侧空间，实现右对齐 */
        color: #1989fa; /* 可选：Vant 主题色，适配移动端 */
        font-size: 15px; /* 可选：移动端常用字号 */
    }

</style>