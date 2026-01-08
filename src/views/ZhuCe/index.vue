<script setup>
import { zhuceapi } from '@/apis/user'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// 1. 导入Vant的Toast组件（解决未导入报错问题）
import { showSuccessToast, showFailToast } from 'vant'
// 2. 导入跳转提示组件
import JumpTip from '@/components/JumpTip.vue'

const router = useRouter()

// 前端保存用户密码
const username = ref('')
const password = ref('')

// 3. 新增：控制跳转提示组件显示/隐藏
const jumpTipVisible = ref(false)
// 4. 新增：跳转目标（登录页）
const jumpTarget = ref('/login')

// 5. 新增：处理跳转逻辑（组件点击「立即跳转」时触发）
const handleJump = (target) => {
  router.push(target)
  // 跳转后关闭提示组件
  jumpTipVisible.value = false
}


// 点击了注册的逻辑
const onSubmit = async () => {
  console.log("我点击了注册");
  try {
    // 传给后端（注意：如果接口要求对象传参，改为 {username: username.value, password: password.value}）
    await zhuceapi(username.value, password.value)
    // 注册成功提示
    await showSuccessToast('注册成功');
    // 6. 显示跳转提示组件（替代直接router.push）
    jumpTipVisible.value = true
  } catch (error) {
    // 捕获所有异常
    console.error('注册失败：', error);
    await showFailToast('注册失败');
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
      class="MJzhuce"
    />

    <van-form @submit="onSubmit">



 <!-- 核心修改：带严格验证规则的输入框 -->
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="请输入字母/数字组合（1-12位）"
          :rules="[
            { required: true, message: '请填写用户名' },
            { pattern: /^[a-zA-Z0-9]{1,12}$/, message: '用户名仅支持字母/数字，且长度为1-12位' }
          ]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入字母/数字组合（6-12位）"
          :rules="[
            { required: true, message: '请填写密码' },
            { pattern: /^[a-zA-Z0-9]{6,12}$/, message: '密码仅支持字母/数字，且长度为6-12位' }
          ]"
        />
      </van-cell-group>




      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          注册
        </van-button>
      </div>
    </van-form>

    <div class="fu">
      <div class="denglu" @click="router.push('/login')">已有账号,去登录</div>
    </div>

    <!-- 7. 引入跳转提示组件 -->
    <JumpTip
      :visible="jumpTipVisible"
      tip-text="注册成功！即将为您跳转到登录页"
      :duration="3"
      :target="jumpTarget"
      :is-external="false"
      @close="jumpTipVisible = false"
      @jump="handleJump"
    />
  </div>
</template>

<style scoped>
.fu {
  display: flex;
  align-items: center;
  width: 100%;
}

.denglu {
  margin-left: auto;
  color: #1989fa;
  font-size: 15px;
}

.MJzhuce{
    margin-bottom: 20px;
}
</style>