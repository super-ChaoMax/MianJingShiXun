<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: { type: String, default: '' },
  showClose: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: true },
  confirmText: { type: String, default: '确认' },
  cancelText: { type: String, default: '取消' },
  closeOnMaskClick: { type: Boolean, default: true },
  width: { type: String, default: '80%' }
})

// 关键：定义update:visible事件，实现双向绑定
const emit = defineEmits(['close', 'confirm', 'cancel', 'update:visible'])

const isVisible = ref(props.visible)

// 监听外部visible变化
watch(
  () => props.visible,
  (val) => {
    isVisible.value = val
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
  { immediate: true }
)

// 关闭弹窗时，通知父组件更新visible状态
const closePopup = () => {
  isVisible.value = false
  // 核心修复：触发update:visible事件，同步父组件状态
  emit('update:visible', false)
  emit('close')
  document.body.style.overflow = ''
}

const handleConfirm = () => {
  emit('confirm')
  closePopup()
}

const handleCancel = () => {
  emit('cancel')
  closePopup()
}

const handleMaskClick = (e) => {
  if (props.closeOnMaskClick && e.target === e.currentTarget) {
    closePopup()
  }
}
</script>


<template>
  <!-- 弹窗遮罩层 -->
  <div 
    class="popup-mask" 
    v-if="isVisible"
    @click="handleMaskClick"
  >
    <div class="popup-content" :style="{ width: width }">
      <div class="popup-header" v-if="title || showClose">
        <h3 class="popup-title" v-if="title">{{ title }}</h3>
        <van-icon 
          v-if="showClose"
          name="cross" 
          class="popup-close"
          @click="closePopup"
        />
      </div>
      <div class="popup-body">
        <slot />
      </div>
      <div class="popup-footer" v-if="showFooter">
        <van-button 
          type="default" 
          class="popup-cancel-btn"
          @click="handleCancel"
        >
          {{ cancelText }}
        </van-button>
        <van-button 
          type="primary" 
          class="popup-confirm-btn"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </van-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 遮罩层 */
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

/* 弹窗主体 */
.popup-content {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  max-width: 90vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

/* 弹窗头部 */
.popup-header {
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.popup-close {
  font-size: 20px;
  color: #999;
  cursor: pointer;
  transition: color 0.2s;
}

.popup-close:hover {
  color: #333;
}

/* 弹窗内容区 */
.popup-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

/* 弹窗底部 */
.popup-footer {
  padding: 12px 16px;
  border-top: 1px solid #f5f5f5;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.popup-cancel-btn {
  width: 80px;
}

.popup-confirm-btn {
  width: 80px;
}

/* 适配小屏幕 */
@media (max-width: 375px) {
  .popup-header {
    padding: 12px 16px;
  }
  
  .popup-title {
    font-size: 16px;
  }
  
  .popup-body {
    padding: 16px;
  }
  
  .popup-footer {
    padding: 8px 16px;
  }
}
</style>

<script>
// 注册Vant组件
import { Icon, Button } from 'vant'
export default {
  components: {
    vanIcon: Icon,
    vanButton: Button
  }
}
</script>