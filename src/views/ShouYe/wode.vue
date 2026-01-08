<template>
  <div class="profile-page">
    <!-- 顶部用户信息栏 -->
    <div class="profile-header">
      <div class="avatar-wrap">
        <img 
          :src="touxiangimg" 
          alt="用户头像" 
          class="avatar"
        >
        <span class="username">chao</span>
      </div>
    </div>

    <!-- 功能快捷入口 -->
    <div class="profile-functions">
      <button class="function-btn" @click="goTo('zhuye')">
        <van-icon name="clock-o" class="function-icon" />
        <span class="function-text">历史记录</span>
      </button>
      <button class="function-btn" @click="goTo('shoucang')">
        <van-icon name="star-o" class="function-icon" />
        <span class="function-text">我的收藏</span>
      </button>
      <button class="function-btn" @click="goTo('xihuan')">
        <van-icon name="like-o" class="function-icon" />
        <span class="function-text">我的喜欢</span>
      </button>
    </div>

    <!-- 设置列表 -->
    <div class="profile-settings">
      <van-cell 
        title="推荐分享" 
        is-link 
        @click="openShareDialog"
        class="setting-item"
      />
      <van-cell 
        title="意见反馈" 
        is-link 
        @click="openQrPopup"
        class="setting-item"
      />
      <van-cell 
        title="关于我们" 
        is-link 
        @click="ongyuwm"
        class="setting-item"
      />
      <van-cell 
        title="退出登录" 
        is-link 
        @click="logout"
        class="setting-item logout-item"
      />
    </div>

    <!-- 分享弹窗组件 -->
    <ShareDialog 
      :visible="shareDialogVisible"
      :share-link="customShareLink"
      :wechatQrcode=wechatQrcodeImg
      :qqQrcode=qqQrcodeImg
      @close="shareDialogVisible = false"
      @share-wechat="handleWechatShare"
      @share-qq="handleQQShare"
      @copy-success="handleCopySuccess"
    />


        <!-- 二维码弹窗 -->
    <CommonPopup
      v-model:visible="popupVisible"
      title="有意见?"
      confirm-text="确认"
      cancel-text="关闭"
    >
      <!-- 弹窗内容：二维码 -->
      <div class="qr-content" style="text-align: center;">
        <img 
          :src="yijianimg" 
          alt="二维码" 
          style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px;"
        >
        <p style="margin-top: 12px; font-size: 14px; color: #666;">
          大胆！你还敢有意见
        </p>
      </div>
    </CommonPopup>


  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
// 确保路径正确！如果ShareDialog在src/components下
import ShareDialog from '@/components/ShareDialog.vue'

// 父组件先导入图片
import wechatQrcodeImg from '@/assets/20260108122808_27_685.jpg'
import qqQrcodeImg from '@/assets/20260108122831_29_685.jpg'
import { userstore } from '@/stores'

import touxiangimg from '@/assets/20260108134910_31_685.jpg'
import yijianimg from '@/assets/20260108140917_35_685.jpg'


const userST=userstore()


const router = useRouter()

// 分享弹窗控制
const shareDialogVisible = ref(false)
// 自定义分享链接
const customShareLink = ref('https://www.example.com/profile')

// 打开分享弹窗
const openShareDialog = () => {
  shareDialogVisible.value = true
}

// 页面跳转
const goTo = (path) => {
  router.push(`/shoye/${path}`)
}

// 退出登录
const logout =async () => {


  await  showConfirmDialog({
    title: '温馨提示',
    message:
        '您确定真的要退出登录吗？？？',
    })
    .then(() => {
        // on confirm
        userST.settoken({})
        showSuccessToast('退出成功');
    })

  router.push('/login')
}

// 微信分享回调
const handleWechatShare = (link) => {
  console.log('微信分享链接：', link)
}

// QQ分享回调
const handleQQShare = (link) => {
  console.log('QQ分享链接：', link)
}

// 复制成功回调
const handleCopySuccess = (link) => {
  console.log('复制链接成功：', link)
}




// 控制弹窗显示/隐藏
const popupVisible = ref(false)

// 打开二维码弹窗
const openQrPopup = () => {
  popupVisible.value = true
}


const ongyuwm=()=>{
  alert("链接：https://localhost/chao")
}
// 弹窗确认事件
const handleConfirm = () => {
  console.log('点击了确认按钮')
}

// 弹窗取消事件
const handleCancel = () => {
  console.log('点击了取消按钮')
}





</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: 'PingFang SC', 'Helvetica Neue', sans-serif;
}

.profile-header {
  background-color: #ffffff;
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f5f5f5;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.username {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.profile-functions {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  padding: 16px 0;
  margin: 12px 0;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  margin: 16px;
}

.function-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666666;
  padding: 8px;
  transition: all 0.2s ease;
}

.function-btn:hover {
  color: #3b82f6;
  transform: translateY(-2px);
}

.function-icon {
  font-size: 24px;
  margin-bottom: 6px;
}

.function-text {
  font-size: 14px;
}

.profile-settings {
  background-color: #ffffff;
  border-radius: 12px;
  margin: 0 16px 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  overflow: hidden;
}

.setting-item {
  --van-cell-line-height: 56px;
  --van-cell-font-size: 15px;
  --van-cell-text-color: #333333;
  border-bottom: 1px solid #f5f5f5;
}

.setting-item:last-child {
  border-bottom: none;
}

.logout-item {
  --van-cell-text-color: #ef4444;
}

/* 移动端适配 */
@media (max-width: 375px) {
  .function-icon {
    font-size: 22px;
  }
  .function-text {
    font-size: 13px;
  }
}
</style>