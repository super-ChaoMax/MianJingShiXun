<template>
  <transition name="van-fade">
    <div
      v-show="isShow || !threshold"
      class="back-to-bottom"
      :style="{
        right: right,
        bottom: bottom,
        zIndex: zIndex
      }"
      @click="scrollToBottom"
    >
    <van-icon name="down"  class="xia"/>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  // 右侧距离，支持vw/vh/px，默认10vw
  right: {
    type: String,
    default: '10vw'
  },
  // 底部距离，支持vw/vh/px，默认20vh
  bottom: {
    type: String,
    default: '20vh'
  },
  // z-index，默认99
  zIndex: {
    type: Number,
    default: 99
  },
  // 滚动阈值：滚动高度 ≤ 该值时显示组件（px），默认200px
  // 比如threshold=200 → 滚动高度≤200px显示，>200px隐藏
  threshold: {
    type: Number,
    default: 200
  },
  // 滚动容器选择器，默认body（全局滚动）
  target: {
    type: String,
    default: 'body'
  }
})

const isShow = ref(false)
let scrollContainer = null

// 核心方法：平滑滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (!scrollContainer) return

  scrollContainer.scrollTo({
    top: scrollContainer.scrollHeight, // 滚动到容器底部
    behavior: 'smooth'
  })
}

// 监听滚动事件：滚动高度 ≤ threshold 时显示组件
const handleScroll = () => {
  if (!scrollContainer || !props.threshold) return
  // 核心修改：反转判断逻辑 → ≤ 阈值显示，> 阈值隐藏
  isShow.value = scrollContainer.scrollTop <= props.threshold
}

// 初始化
onMounted(() => {
  scrollContainer = props.target === 'body' 
    ? document.documentElement || document.body 
    : document.querySelector(props.target)
  
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll)
    handleScroll() // 初始化时判断显示状态
  }
})

// 销毁时移除事件监听
onUnmounted(() => {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
})

// 监听容器变化
watch(() => props.target, (newVal) => {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', handleScroll)
  }
  scrollContainer = newVal === 'body' 
    ? document.documentElement || document.body 
    : document.querySelector(newVal)
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', handleScroll)
    handleScroll()
  }
})
</script>

<style scoped>

.xia{
    font-size: 20px;
    position: absolute;
    top: 10px;
    left: 10px;
    color: red;
}

.back-to-bottom {
  position: relative;
  position: fixed;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 12px;
  color: #ff7d00;
  transition: all 0.3s ease;
}

.back-to-bottom:hover {
  background-color: #f5f5f5;
}

.default-text {
  display: inline-block;
  width: 100%;
  height: 100%;
  line-height: 40px;
}

/* 渐隐渐显过渡 */
.van-fade-enter-active,
.van-fade-leave-active {
  transition: opacity 0.3s ease;
}

.van-fade-enter-from,
.van-fade-leave-to {
  opacity: 0;
}
</style>