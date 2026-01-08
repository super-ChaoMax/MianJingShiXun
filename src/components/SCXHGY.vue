<script setup>
import { ref, onMounted, defineProps } from 'vue' // 补充defineProps导入
import { useRouter } from 'vue-router'

// 1. 正确定义Props（已修正）
const props = defineProps({
  title: {
    type: String,
    default: '校招面经汇总'
  },
  MJList: {
    type: Array,
    default: () => []
  },
  HTURL:{
    type: String,
  }
})

const loading = ref(false)
const router = useRouter()

// 2. 定义点击事件（已修正）
const dianjixianxi = (id) => {
  router.push({
    path:'/mjxianqing',
    query:{
        MJID:id,
        HTURL:props.HTURL
    }

  })
//   console.log('点击了面经ID：', id)
}

// 3. 新增空数据按钮点击方法（之前缺失）
const handleEmptyBtnClick = () => {
  loading.value = true
  // 模拟刷新数据（实际项目中替换为真实接口请求）
  setTimeout(() => {
    loading.value = false
  }, 800)
}

// 4. 暴露组件方法（需在方法定义后）
defineExpose({
  dianjixianxi,
  handleEmptyBtnClick
})

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 800)
})
</script>

<template>
  <div class="zhufu">
    <!-- 导航栏（标签名保持van-开头，和全局/局部注册一致） -->
    <van-nav-bar 
      :title="title"
      class="fixed-nav" 
    />
    
    <!-- 内容区 -->
    <div class="card-list list-wrap" id="list-container">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-tip">
        <van-loading type="spinner" color="#1989fa" />
        <p class="loading-text">加载中...</p>
      </div>
      
      <!-- 空数据UI -->
      <div v-else-if="MJList.length === 0" class="empty-container">
        <div class="empty-icon">
          <van-icon name="document-empty" size="80px" color="#ccc" />
        </div>
        <div class="empty-text">暂无面经数据</div>
        <div class="empty-desc">
          快去看看其他岗位的面经吧～
        </div>
        <van-button 
          type="primary" 
          size="small" 
          class="empty-btn"
          @click="handleEmptyBtnClick"
        >
          刷新试试
        </van-button>
      </div>
      
      <!-- 面经列表 -->
      <div 
        v-else
        class="interview-card" 
        v-for="item in MJList" 
        :key="item.id"
        @click="dianjixianxi(item.id)"
      >
        <div class="card-header">
          <img 
            class="avatar" 
            :src="item.avatar || 'https://picsum.photos/40/40'" 
            style="background: linear-gradient(45deg, #ff5252 0%, #4caf50 100%); border-radius: 50%;"
            alt="头像"
          >
          <div class="card-title">{{ item.stem }}</div>
        </div>
        <div class="card-meta">
          <span class="author">{{ item.author || item.stem }}</span>
          <span class="date">{{ item.createdAt }}</span>
        </div>
        <div class="card-content" v-html="item.content"></div>
        <div class="card-stats">
          <span>点赞 {{ item.likeCount || 0 }}</span>
          <span>浏览 {{ item.views || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- 回到顶部组件（标签名保持van-开头） -->
    <van-back-top right="10vw" bottom="20vh" />
  </div>
</template>

<style scoped>
/* 全局样式 */
* {
  margin: 0;
  padding: 8px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
}

/* 导航栏固定样式 */
.fixed-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
}

/* 内容区样式 */
.card-list {
  width: 100%;
  padding-top: 54px;
  padding-right: 8px;
  padding-bottom: 8px;
  padding-left: 8px;
  min-height: calc(100vh - 54px);
  display: flex;
  flex-direction: column;
}

/* 加载中样式优化 */
.loading-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px 0;
}
.loading-text {
  margin-top: 12px;
  color: #999;
  font-size: 14px;
}

/* 空数据UI样式 */
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 60px 20px;
  text-align: center;
}
.empty-icon {
  margin-bottom: 20px;
  opacity: 0.8;
}
.empty-text {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}
.empty-desc {
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
  line-height: 1.5;
}
.empty-btn {
  width: 120px;
  height: 36px;
  font-size: 14px;
  border-radius: 18px;
}

/* 列表卡片样式 */
.interview-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 7px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.interview-card:hover {
  transform: translateY(-2px);
}
.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}
.card-title {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}
.card-meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}
.card-content {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
  white-space: pre-line;
}
.card-stats {
  font-size: 13px;
  color: #999;
  display: flex;
  gap: 20px;
}

/* 移动端适配 */
@media (max-width: 375px) {
  .card-list {
    padding-top: 52px;
  }
  .empty-text {
    font-size: 16px;
  }
  .empty-desc {
    font-size: 13px;
  }
}
@media (max-width: 320px) {
  .empty-icon {
    font-size: 70px;
  }
  .empty-text {
    font-size: 15px;
  }
}
</style>

<script>
// 关键修复：Vant组件导入名称去掉Van前缀（和Vant实际导出一致）
import { NavBar, Loading, Icon, Button, BackTop } from 'vant'
export default {
  components: {
    // 注册时自定义标签名为van-开头（和模板中一致）
    vanNavBar: NavBar,
    vanLoading: Loading,
    vanIcon: Icon,
    vanButton: Button,
    vanBackTop: BackTop
  }
}
</script>