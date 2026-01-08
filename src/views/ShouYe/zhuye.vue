<script setup>
import { mianjingListapi } from '@/apis/mianjing'
import { ref, onMounted, nextTick } from 'vue'
import { Toast } from 'vant'
// 引入封装的回到底部组件
import BackToBottom from '@/components/BackToBottom.vue'
import { useRouter } from 'vue-router'


const activeTab = ref('推荐')
const value = ref('') 
const searchType = ref('题干') 

const currentPage = ref(1)    
const pageSize = ref(10)  
const router= useRouter()  

const MJList = ref([])        
const MJdata = ref({
  total: 0,    
  pageTotal: 0 
})
const loading = ref(false)    

// 回顶部逻辑（优化：确保DOM渲染后执行）
const scrollToTop = () => {
  return new Promise((resolve) => {
    nextTick(() => {
      const listContainer = document.getElementById('list-container');
      if (listContainer) {
        listContainer.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
      setTimeout(resolve, 100);
    });
  });
};

// 构建请求参数（统一封装，避免参数不一致）
const buildRequestParams = (page, tabType) => {
  const currentTab = tabType || activeTab.value
  return {
    current: page || 1,
    pageSize: pageSize.value,
    stem: searchType.value === '题干' ? (value.value || '') : '',
    keyWord: searchType.value === '关键字' ? (value.value || '') : '',
    sorter: currentTab === '最新' ? 'weight_desc' : 'weight_desc'
  }
};

// 获取总条数+计算最后一页（优化参数，增加空值处理）
const getLastPageNum = async (tabType) => {
  try {
    loading.value = true
    // 使用统一的参数构建方法
    const params = buildRequestParams(1, tabType)
    const res = await mianjingListapi(params)
    
    const total = res.data.total || 0
    const lastPage = Math.ceil(total / pageSize.value) || 1
    
    // 同步总条数和总页数
    MJdata.value.total = total
    MJdata.value.pageTotal = lastPage
    
    return lastPage
  } catch (error) {
    console.error('获取总条数失败：', error)
    Toast.fail('获取数据总数失败')
    return 1 // 失败时默认返回第1页
  } finally {
    loading.value = false
  }
};

// 渲染数据（核心优化：统一参数，确保分页同步）
const xuanranYM = async (targetPage = 1) => {
  try {
    loading.value = true
    // 构建统一参数
    const params = buildRequestParams(targetPage)
    const res = await mianjingListapi(params) 
    
    console.log(`第${targetPage}页返回的面经列表`, res);
    MJList.value = res.data.rows || []
    
    // 同步分页数据
    MJdata.value.total = res.data.total || 0
    MJdata.value.pageTotal = Math.ceil(MJdata.value.total / pageSize.value) || 1
    currentPage.value = targetPage // 强制同步当前页码
    
    // 数据加载完成后滚动到顶部
    await scrollToTop()
  } catch (error) {
    console.error('获取面经列表失败：', error);
    MJList.value = []
    Toast.fail('加载面经失败，请重试')
  } finally {
    loading.value = false
  }
};


//点击的逻辑
const dianjixianxi=(id)=>{
    router.push({
       path: '/mjxianqing',  
       query: { 
        MJID: id, 
        HTURL:'zhuye'
      } 
      })
}



// 分页变化逻辑
const fenyeChange = (newPage) => {
  currentPage.value = newPage
  xuanranYM(newPage)
};

// 选项卡切换逻辑（核心修复）
const switchTab = async (tab) => {
  activeTab.value = tab
  loading.value = true
  
  try {
    if (tab === "推荐") {
      // 推荐标签：加载第1页
      await xuanranYM(1)
      console.log("切换到推荐，加载第1页");
    } else if (tab === "最新") {
      // 最新标签：先获取最后一页，再加载
      const lastPage = await getLastPageNum(20)
      await xuanranYM(lastPage)
      console.log(`切换到最新，加载最后一页：${lastPage}`);
    }
  } catch (error) {
    console.error('切换标签失败：', error)
    Toast.fail('切换标签失败，请重试')
  } finally {
    loading.value = false
  }
};

// 搜索回调
const onSearch = async () => {
  console.log(`【${searchType.value}】搜索关键词：`, value.value)
  loading.value = true
  
  try {
    if (activeTab.value === '最新') {
      // 最新标签下搜索：加载最后一页
      const lastPage = await getLastPageNum()
      await xuanranYM(lastPage)
    } else {
      // 推荐标签下搜索：加载第1页
      await xuanranYM(1)
    }
  } catch (error) {
    Toast.fail('搜索失败，请重试')
  } finally {
    loading.value = false
  }
};

// 取消搜索
const onCancel = async () => {
  value.value = ''
  loading.value = true
  
  try {
    if (activeTab.value === '最新') {
      const lastPage = await getLastPageNum()
      await xuanranYM(lastPage)
    } else {
      await xuanranYM(1)
    }
  } catch (error) {
    Toast.fail('重置搜索失败，请重试')
  } finally {
    loading.value = false
  }
};

// 页面挂载初始化：默认加载推荐标签的第1页（核心修改）
onMounted(async () => {
  await xuanranYM(1)
});
</script>

<template>
  <div class="page-container">
    <!-- 顶部选项卡 -->
    <div class="fu">
      <div class="tab-wrapper">
        <div 
          class="tab-item" 
          :class="{ active: activeTab === '推荐' }"
          @click="switchTab('推荐')"
        >
          推荐
        </div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === '最新' }"
          @click="switchTab('最新')"
        >
          最新
        </div>
      </div>
    </div>

    <!-- 搜索行 -->
    <div class="search-header">
      <div class="title-text">面经</div>
      <select class="search-select" v-model="searchType">
        <option value="题干">题干搜索</option>
        <option value="关键字">关键字搜索</option>
      </select>
      <div class="search-form">
        <div class="native-search">
          <input 
            type="text" 
            v-model="value" 
            placeholder="请输入搜索关键词"
            class="search-input"
            @keyup.enter="onSearch"
          >
          <div class="search-actions">
            <button class="cancel-btn" @click="onCancel" v-if="value">取消</button>
            <button class="search-btn" @click="onSearch">搜索</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 面经列表 + 分页 -->
    <div class="card-list list-wrap" id="list-container">
      <div v-if="loading" class="loading-tip">加载中...</div>
      <div v-else-if="MJList.length === 0" class="empty-tip">暂无面经数据</div>
      <div 
        class="interview-card" 
        v-for="item in MJList" 
        :key="item.id"
        v-else
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

      <van-pagination
        v-model="currentPage"
        :total-items="MJdata.total"                   
        :page-size="pageSize"
        :show-page-size="3"
        force-ellipses
        class="dibu"
        @change="fenyeChange"
        v-if="MJdata.total > 0"
      />

    <!-- 2. 进阶用法：指定滚动容器 + 滚动阈值 + 自定义内容 -->
    <!-- 回到底部组件：默认滚动高度≤200px显示，>200px隐藏 -->
    <BackToBottom 
      right="10vw" 
      bottom="25vh"
      target="#list-container" 
      threshold="650"
    ></BackToBottom>



      <van-back-top right="10vw" bottom="20vh" />
    </div>
  </div>
</template>

<style scoped>
/* 原有样式全部保留，仅优化滚动容器 */
* {
  margin: 0;
  padding: 8px;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
}
.page-container {
  min-height: 100vh;
  background-color: #fafafa;
  padding: 12px 16px;
}
.tab-wrapper {
  display: flex;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
}
.tab-item {
  flex: 1;
  padding: 10px 0;
  text-align: center;
  font-size: 20px;
  color: #333;
  cursor: pointer;
  border-radius: 8px;
}
.tab-item.active {
  background-color: #e9e9e9;
  color: #ff7d00;
  font-weight: 600;
}
.search-header {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  padding: 0 !important;
  margin-bottom: 16px;
  box-sizing: border-box;
}
.title-text {
  font-size: 22px;
  font-weight: bold;
  color: #ff7d00;
  white-space: nowrap;
  flex-shrink: 0;
  width: 60px !important;
  padding: 0 !important;
  margin-left: 8px;
}
.search-select {
  height: 38px;
  padding: 0 10px !important;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background-color: #fff;
  font-size: 14px;
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
  flex-shrink: 0;
  min-width: 100px !important;
}
.search-form {
  flex: 1;
  height: 38px;
  padding: 0 !important;
  margin-right: 8px;
}
.native-search {
  display: flex;
  align-items: center;
  height: 100%;
  background-color: #fff;
  border-radius: 6px;
  padding: 0 10px !important;
}
.search-input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
  padding: 0 !important;
}
.search-input::placeholder {
  color: #999;
}
.search-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 !important;
}
.cancel-btn, .search-btn {
  border: none;
  background: none;
  font-size: 14px;
  color: #ff7d00;
  cursor: pointer;
  padding: 0 !important;
}
.search-btn {
  font-weight: 500;
}
.list-wrap {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding: 10px;
  -webkit-overflow-scrolling: touch;
}
.card-list {
  width: 100%;
}
.loading-tip, .empty-tip {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
.interview-card {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 7px;
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
}
.card-stats {
  font-size: 13px;
  color: #999;
  display: flex;
  gap: 20px;
}
.dibu {
  margin-bottom: 85px;
  margin-top: 20px;
}
@media (max-width: 375px) {
  .title-text {
    font-size: 20px;
    width: 55px !important;
  }
  .search-select {
    font-size: 13px;
    min-width: 90px !important;
    height: 36px;
  }
  .search-form {
    height: 36px;
  }
  .native-search {
    height: 36px;
  }
  .tab-item {
    font-size: 18px;
  }
}
@media (max-width: 320px) {
  .search-header {
    gap: 10px;
  }
  .search-select {
    min-width: 85px !important;
    padding: 0 8px !important;
  }
  .title-text {
    font-size: 18px;
    width: 50px !important;
  }
  .tab-item {
    font-size: 15px;
  }
}
</style>