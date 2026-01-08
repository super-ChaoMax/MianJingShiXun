<template>
  <div class="jump-tip-mask" v-if="visible">
    <div class="jump-tip-box">
      <!-- 提示图标 -->
      <div class="jump-tip-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#1677FF"/>
        </svg>
      </div>
      <!-- 提示文本 -->
      <div class="jump-tip-text">{{ tipText }}</div>
      <!-- 倒计时 -->
      <div class="jump-tip-countdown">
        即将跳转，剩余 <span class="count-num">{{ countdown }}</span> 秒
      </div>
      <!-- 操作按钮 -->
      <div class="jump-tip-btns">
        <button class="cancel-btn" @click="handleCancel">取消跳转</button>
        <button class="confirm-btn" @click="handleImmediate">立即跳转</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  tipText: {
    type: String,
    default: '操作成功，即将为您跳转页面'
  },
  duration: {
    type: Number,
    default: 5
  },
  target: {
    type: [String, Object],
    required: true
  },
  isExternal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'jump' , 'mjxqzs'])

const countdown = ref(props.duration)
let timer = null

const startCountdown = () => {
  countdown.value = props.duration
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      handleImmediate()
    }
  }, 1000)
}

const handleImmediate = () => {
  clearInterval(timer)
  emit('jump', props.target)
  emit('close')
}

const handleCancel = () => {
  clearInterval(timer)
  emit('close')

  emit('mjxqzs')
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      startCountdown()
    } else {
      clearInterval(timer)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
/* 全屏遮罩层 - 半透明黑色 */
.jump-tip-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px); /* 背景模糊，提升层次感 */
}

/* 弹窗容器 - 白色背景+圆角+阴影 */
.jump-tip-box {
  width: 85%;
  max-width: 420px;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

/* 提示图标 */
.jump-tip-icon {
  margin-bottom: 16px;
}

/* 提示文本 - 深蓝色 */
.jump-tip-text {
  font-size: 18px;
  color: #1d2129;
  line-height: 1.5;
  margin-bottom: 20px;
  font-weight: 500;
}

/* 倒计时文本 - 灰色 */
.jump-tip-countdown {
  font-size: 15px;
  color: #4e5969;
  margin-bottom: 24px;
}

/* 倒计时数字 - 红色强调 */
.count-num {
  color: #f53f3f;
  font-size: 16px;
  font-weight: 600;
}

/* 按钮容器 - 弹性布局 */
.jump-tip-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 按钮通用样式 */
.jump-tip-btns button {
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 取消按钮 - 浅灰色边框 */
.cancel-btn {
  background-color: #ffffff;
  color: #4e5969;
  border: 1px solid #e5e6eb;
}
.cancel-btn:hover {
  background-color: #f7f8fa;
  border-color: #d0d3d9;
}

/* 立即跳转按钮 - 蓝色渐变 */
.confirm-btn {
  background-color: #1677ff;
  color: #ffffff;
  background-image: linear-gradient(to right, #1677ff, #0f62fe);
}
.confirm-btn:hover {
  background-color: #0f62fe;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
}

/* 移动端适配 */
@media (max-width: 375px) {
  .jump-tip-box {
    padding: 24px 16px;
  }
  .jump-tip-text {
    font-size: 16px;
  }
  .jump-tip-countdown {
    font-size: 14px;
  }
  .count-num {
    font-size: 15px;
  }
  .jump-tip-btns button {
    padding: 8px 20px;
    font-size: 14px;
  }
}
</style>