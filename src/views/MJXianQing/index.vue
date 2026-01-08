<template>
  <div id="app"  >

    <!-- 顶部导航栏 - 移除固定定位，改为流式布局 -->
    <header class="header" :class="{ scrolled: isScrolled }">
      <div class="header-wrap">
        <button class="header-btn" @click="handleBack">
          <span class="text-lg"><van-icon name="revoke" class="fanhui"/></span>
        </button>
        <h1 class="header-title">文章详情</h1>
        <button class="header-btn" @click="handleShare">
          <span class="text-lg"><van-icon name="share-o" class="fenxiang" /></span>
        </button>
      </div>
    </header>






    <!-- 主要内容区 - 移除顶部padding（因导航不再固定） -->
    <main class="main">


      <!-- 文章头部信息 -->
      <div class="article-header">
        <h1 class="article-title">{{ itemmj.stem }}</h1>
        <div class="article-meta">
          <img :src="itemmj.avatar" alt="作者头像" class="avatar">
          <span>{{ itemmj.creator }}</span>
          <span><van-icon name="underway-o"  class="shijian"/> {{ itemmj.createdAt }}</span>
          <span><van-icon name="eye-o"  class="guankan"/> {{ itemmj.views }} </span>
        </div>
        <div class="article-actions">
          <button class="action-btn" @click="toggleLike">
            <span :class="{ liked: isLiked }">
                 <van-icon name="good-job" v-show="isLiked"  class="likequer"/>
                 <van-icon name="good-job" v-show="!isLiked" class="likeqx" />
            </span>
            <span>{{ itemmj.likeCount }}</span>
          </button>

          <button class="action-btn" @click="toggleCollect">

            <span :class="{ collected: isCollected }">
                <!-- {{ isCollected ? '★' : '☆' }} -->
                <van-icon name="star"  v-show="isCollected" class="scquer"/>
                <van-icon name="star"  v-show="!isCollected" class="scqx"/>
            </span>

            <span>收藏</span>
          </button>


        <button class="action-btn">
            <span><van-icon name="share" class="fenxiang" /></span>
            <span>分享</span>
        </button>



        </div>
      </div>

      <!-- 文章封面图 -->
      <div class="article-cover-wrap">
        <img src="@/assets/wallhaven-wyzxvr.webp" alt="文章封面" class="article-cover">
      </div>

      <!-- 文章正文 -->
      <div class="article-content">
        <div v-html="itemmj.content"></div>
      </div>



      <!-- 点赞评论区 -->
      <div class="interactive">
        <div class="interactive-header">
          <h3 class="interactive-title">互动区</h3>
          <button class="view-all">查看全部</button>
        </div>
        <div class="interactive-actions">
          <button class="interactive-btn" @click="toggleLike">
            <span :class="{ liked: isLiked }">
                 <van-icon name="good-job" v-show="isLiked"  class="likequer"/>
                 <van-icon name="good-job" v-show="!isLiked" class="likeqx" />
            </span>
            <span>点赞 ({{  itemmj.likeCount }})</span>
          </button>


          <button class="interactive-btn" @click="toggleCollect">
            <span :class="{ collected: isCollected }">
                <van-icon name="star"  v-show="isCollected" class="scquer"/>
                <van-icon name="star"  v-show="!isCollected" class="scqx"/>
            </span>
            <span>收藏</span>
          </button>


          <button class="interactive-btn" @click="handleShare">
            <span><van-icon name="share" class="fenxiang" /></span>
            <span>分享</span>
          </button>


        </div>
        <div class="interactive-comment">
          <div class="comment-input-wrap">
            <img src="https://picsum.photos/id/91/32/32" alt="评论用户头像" class="comment-avatar">
            <input 
              type="text" 
              placeholder="写下你的想法..." 
              class="comment-input"
              v-model="commentInput"
            >
          </div>

          <div class="more-comments">
            查看更多精彩评论
          </div>

        </div>
      </div>
    </main>


    
  </div>

    <!-- 7. 引入跳转提示组件 -->
    <JumpTip
      :visible="jumpTipVisible"
      tip-text="您没有选中任意面经！即将为您跳转到面经首页"
      :duration="3"
      :target="jumpTarget"
      :is-external="false"
      @close="jumpTipVisible = false"
      @jump="handleJump"
      @mjxqzs="quxiaotancan"
    />

</template>

<script setup>
import { ref  } from 'vue'
import { useRoute,useRouter } from 'vue-router'
const route=useRoute()
const router=useRouter()
const isScrolled =ref()


console.log("当前路由的参数",route);



import { getitemmjapi, setscdzapi } from '@/apis/mianjing';

// 2. 导入跳转提示组件
import JumpTip from '@/components/JumpTip.vue'

// 3. 新增：控制跳转提示组件显示/隐藏
const jumpTipVisible = ref(false)
// 4. 新增：跳转目标（登录页）
const jumpTarget = ref('/shoye/zhuye')

// 5. 新增：处理跳转逻辑（组件点击「立即跳转」时触发）
const handleJump = (target) => {
  router.push(target)
  // 跳转后关闭提示组件
  jumpTipVisible.value = false
}

const quxiaotancan=()=>{
    alert("您的操作会带来未知的危险请禁止！！！")
    // confirm("您的操作会带来未知的危险请禁止！！！")
    window.location.reload()
}

if(!route.query.MJID){
    // 当面经不存在时
    // 6. 显示跳转提示组件（替代直接router.push）
    jumpTipVisible.value = true
}


const itemmj=ref({})

const getitemmj= async()=>{
    const res= await getitemmjapi(route.query.MJID)
    itemmj.value=res.data
    console.log("详情页",itemmj.value);
    console.log(itemmj.value.collectFlag);

    console.log(itemmj.value.collectFlag===1?true:false);
    // 修复：异步获取数据后更新状态值
    isLiked.value = itemmj.value.likeFlag===1?true:false
    isCollected.value = itemmj.value.collectFlag===1?true:false
}

getitemmj()


// 交互状态（移除滚动监听相关，因导航不再固定）
const isLiked = ref(false)                                  //绑定是否点赞
const isCollected = ref(false)                              //是否收藏
const commentInput = ref('')                                //输入的评论


/*
// 移除滚动监听相关代码（无需再监听滚动改变导航样式）
onMounted(() => {
  // 清空滚动监听逻辑
})

onUnmounted(() => {
  // 清空滚动监听移除逻辑
})
*/


// 事件处理
const handleBack = () => {
//   console.log('返回上一页')
    router.go(-1) 
    if(route.query.HTURL){
           router.push(`/shoye/${route.query.HTURL}`)  
    }

}

const handleShare = () => {
  console.log('分享文章')
  const shareBtn = event.target.closest('button')
  if (shareBtn) {
    shareBtn.classList.add('scale-95')
    setTimeout(() => shareBtn.classList.remove('scale-95'), 100)
  }
}


//收藏、点赞题目/取消收藏、点赞题目接口
const setscxh=async (optType)=>{
      const res=await  setscdzapi(route.query.MJID,optType)
      console.log("点赞和收藏",res);
      
}


// 点击点赞执行的逻辑
const toggleLike = () => {
  isLiked.value = !isLiked.value
  itemmj.value.likeCount = isLiked.value ? (itemmj.value.likeCount*1) + 1 : (itemmj.value.likeCount*1) - 1
   setscxh(1)
  const likeBtn = event.target.closest('button')
  if (likeBtn) {
    likeBtn.classList.add('scale-95')
    setTimeout(() => likeBtn.classList.remove('scale-95'), 100)
  }
}



const toggleCollect = () => {
  isCollected.value = !isCollected.value
  const collectBtn = event.target.closest('button')
  setscxh(2)
  if (collectBtn) {
    collectBtn.classList.add('scale-95')
    setTimeout(() => collectBtn.classList.remove('scale-95'), 100)
  }
}

</script>

<style scoped>
/* 全局基础样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  overflow-x: hidden;
  width: 100vw;
  background-color: #f8fafc;
  font-family: 'PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif';
  color: #1e293b;
}

/* 颜色变量 */
:deep(:root) {
  --primary: #3b82f6;
  --secondary: #64748b;
  --dark: #1e293b;
  --red: #ef4444;
  --white: #ffffff;
  --gray-light: #e2e8f0;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.1);
}

/* 顶部导航 - 移除固定定位，改为普通流式布局 */
.header {
  background: var(--white);
  box-shadow: var(--shadow-sm);
  padding: 8px 12px;
  /* 移除固定定位相关属性 */
  /* position: fixed; top/left/right: 0; z-index: 40; */
}
/* 移除滚动阴影效果（因导航不再固定） */
.header.scrolled {
  box-shadow: var(--shadow-sm);
}
.header-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(30, 41, 59, 0.7);
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 18px;
}
.header-btn:hover {
  color: var(--primary);
}
.header-title {
  font-size: 14px;
  font-weight: 500;
}

/* 主内容区 - 移除顶部padding（因导航不再固定遮挡） */
.main {
  padding: 12px 12px 32px;
}

/* 文章头部 */
.article-header {
  margin-bottom: 16px;
  padding-top: 12px;
}
.article-title {
  font-size: clamp(1.1rem, 4vw, 1.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
}
.article-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-size: 12px;
  color: var(--secondary);
  margin-bottom: 12px;
  gap: 8px;
}
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

/* 核心修改：适配25px点赞图标，调整操作栏高度和垂直居中 */
.article-actions {
  display: flex;
  align-items: center; /* 垂直居中 */
  font-size: 16px; /* 文字大小适配25px图标 */
  height: 32px; /* 整体行高适配25px图标，预留少量间距 */
  gap: 16px; /* 按钮之间的间距更合理 */
}
.action-btn {
  display: flex;
  align-items: center; /* 按钮内元素垂直居中 */
  color: var(--secondary);
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 16px; /* 文字大小适配图标 */
  height: 100%; /* 撑满父容器高度 */
  padding: 0 4px;
}
.action-btn:hover {
  color: var(--primary);
}
/* 调整图标和文字的间距，适配25px图标 */
.action-btn span:first-child {
  margin-right: 6px; /* 图标右侧间距 */
  line-height: 1; /* 消除行高影响 */
}
.action-btn span:last-child {
  margin-left: 0; /* 移除原有左边距，统一用右边距 */
  font-size: 16px; /* 数字/文字大小适配25px图标 */
}

/* 状态样式保留 */
.liked {
  color: var(--red) !important;
}
.collected {
  color: var(--primary) !important;
  font-size: 22px; /* 收藏星星适配25px点赞图标 */
}

/* 文章封面 */
.article-cover-wrap {
  margin-bottom: 16px;
}
.article-cover {
  width: 100%;
  height: auto;
  border-radius: 6px;
}

/* 文章正文 */
.article-content {
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 1.6;
}
.article-content p {
  margin: 12px 0;
  color: rgba(30, 41, 59, 0.85);
}
.article-content h2 {
  font-size: 16px;
  font-weight: 700;
  margin: 16px 0;
  color: var(--dark);
}
.article-content blockquote {
  padding-left: 12px;
  border-left: 4px solid rgba(59, 130, 246, 0.3);
  font-style: italic;
  color: var(--secondary);
  margin: 12px 0;
  font-size: 14px;
}
.article-content ul {
  list-style-type: disc;
  padding-left: 20px;
  margin: 12px 0;
  color: rgba(30, 41, 59, 0.85);
}
.article-content li {
  margin: 4px 0;
}
.content-img {
  width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 16px 0;
}
.pre-line {
  white-space: pre-line;
}

/* 互动区 */
.interactive {
  background: var(--white);
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  padding: 12px;
  margin-bottom: 24px;
}
.interactive-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.interactive-title {
  font-size: 14px;
  font-weight: 500;
}
.view-all {
  font-size: 12px;
  color: var(--primary);
  cursor: pointer;
  border: none;
  background: transparent;
}
.interactive-actions {
  display: flex;
  justify-content: space-around;
  margin-bottom: 12px;
}
.interactive-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33.33%;
  color: var(--secondary);
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 16px;
}
.interactive-btn:hover {
  color: var(--primary);
}
.interactive-btn span:last-child {
  font-size: 12px;
  margin-top: 4px;
}
.interactive-comment {
  border-top: 1px solid var(--gray-light);
  padding-top: 12px;
}
.comment-input-wrap {
  display: flex;
  margin-bottom: 8px;
}
.comment-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}
.comment-input {
  flex: 1;
  border: 1px solid var(--gray-light);
  border-radius: 999px;
  padding: 6px 8px;
  font-size: 12px;
  outline: none;
}
.comment-input:focus {
  border-color: var(--primary);
}
.more-comments {
  font-size: 12px;
  color: var(--secondary);
  text-align: center;
  padding: 8px 0;
}

/* 点击动画 */
.scale-95 {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

/* 500px 窄屏适配 */
@media (max-width: 500px) {
  html {
    font-size: 13px;
  }
  .article-content {
    line-height: 1.6;
  }
}

/* 点赞图标样式（25px） */
.likequer{
  color: #ef4444 !important;
  font-size: 25px;
  line-height: 1; /* 消除行高影响，保证垂直居中 */
}
.likeqx{
  color: #c0c4cc; /* 浅灰色，接近中性色 */
  font-size: 25px;
  line-height: 1; /* 消除行高影响，保证垂直居中 */
}

/* 评论、收藏图标适配25px点赞图标 */
.action-btn span:contains('💬'),
.action-btn span:contains('★'),
.action-btn span:contains('☆') {
  font-size: 22px; /* 略小于点赞图标，视觉更协调 */
  line-height: 1;
}



.scquer{
  color: #3b82f6 !important;
  font-size: 25px;
  line-height: 1; /* 消除行高影响，保证垂直居中 */
}

.scqx{
  color: #c0c4cc; /* 浅灰色，接近中性色 */
  font-size: 25px;
  line-height: 1; /* 消除行高影响，保证垂直居中 */
}

.fenxiang{
  color: #c0c4cc; /* 浅灰色，接近中性色 */
  font-size: 25px;
  line-height: 1; /* 消除行高影响，保证垂直居中 */
}

.fanhui{
  color: #c0c4cc; /* 浅灰色，接近中性色 */
  font-size: 25px;
  line-height: 1; /* 消除行高影响，保证垂直居中 */
}

.shijian{
  font-size: 14px;
  line-height: 1; /* 消除行高影响，保证垂直居中 */
}


.guankan{
  font-size: 14px;
  line-height: 1; /* 消除行高影响，保证垂直居中 */
}

</style>