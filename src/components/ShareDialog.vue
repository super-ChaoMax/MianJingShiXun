<template>
  <teleport to="body">
    <!-- 主分享弹窗 -->
    <van-dialog
      :show="visible"
      title="分享到"
      show-cancel-button
      cancel-button-text="取消"
      @cancel="handleCancel"
      @update:show="handleDialogUpdate"
      class="share-dialog"
    >
      <div class="share-options">
        <div class="share-option" @click="handleShare('wechat')">
          <van-icon name="wechat" class="share-icon wechat-icon" />
          <span class="share-text">微信</span>
        </div>
        <div class="share-option" @click="handleShare('qq')">
          <van-icon name="qq" class="share-icon qq-icon" />
          <span class="share-text">QQ</span>
        </div>
        <div class="share-option" @click="handleCopyLink">
          <van-icon name="link-o" class="share-icon link-icon" />
          <span class="share-text">复制链接</span>
        </div>
      </div>
    </van-dialog>

    <!-- 二维码弹窗：绑定 qrcodeDialogVisible -->
    <van-dialog
      :show="qrcodeDialogVisible"
      :title="qrcodeTitle + '分享'"
      show-cancel-button
      cancel-button-text="关闭"
      @cancel="qrcodeDialogVisible = false"
     @confirm="handleQrcodeConfirm" 
      class="qrcode-dialog"
    >
      <div class="qrcode-wrap">
        <!-- 用可靠的占位图，避免加载失败 -->
        <img 
          :src="qrcodeSrc" 
          :alt="qrcodeTitle + '二维码'" 
          class="qrcode-img"
          @error="handleImgError"

        >
        <p class="qrcode-tip">扫码分享至 {{ qrcodeTitle }}</p>
      </div>
    </van-dialog>

    <van-toast 
      :show="copyToastShow" 
      type="success" 
      @update:show="copyToastShow = false"
    >
      链接复制成功
    </van-toast>
  </teleport>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  shareLink: {
    type: String,
    default: ''
  },
  wechatQrcode: {
    type: String,
    default: 'https://picsum.photos/200/200?random=1' // 可靠占位图
  },
  qqQrcode: {
    type: String,
    default: 'https://picsum.photos/200/200?random=2'
  }
})

const emit = defineEmits(['close', 'share-wechat', 'share-qq', 'copy-success'])

// 状态管理
const copyToastShow = ref(false)
const qrcodeDialogVisible = ref(false)
const qrcodeTitle = ref('')
const qrcodeSrc = ref('')

// 监听主弹窗关闭：只重置复制提示，不影响二维码弹窗
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    copyToastShow.value = false
    // 移除这行！之前的坑：主弹窗关闭时不会关掉二维码弹窗
    // qrcodeDialogVisible.value = false
  }
})

const handleDialogUpdate = (newVal) => {
  if (!newVal) {
    emit('close')
  }
}

const handleCancel = () => {
  emit('close')
}

// 核心修复：先设置二维码状态，再关闭主弹窗
const handleShare = (type) => {
  if (type === 'wechat') {
    qrcodeTitle.value = '微信'
    qrcodeSrc.value = props.wechatQrcode
    emit('share-wechat', props.shareLink || window.location.href)
  } else if (type === 'qq') {
    qrcodeTitle.value = 'QQ'
    qrcodeSrc.value = props.qqQrcode
    emit('share-qq', props.shareLink || window.location.href)
  }
  // 先打开二维码弹窗，再关闭主弹窗
  qrcodeDialogVisible.value = true
  emit('close')
}



// 二维码弹窗确认按钮逻辑
const handleQrcodeConfirm = () => {
  // 你想执行的确认操作（比如提示“分享成功”）
    showSuccessToast('分享成功');
  // 关闭二维码弹窗
  qrcodeDialogVisible.value = false
}


const handleCopyLink = async () => {
  try {
    const link = props.shareLink || window.location.href
    await navigator.clipboard.writeText(link)
    copyToastShow.value = true
    showSuccessToast('链接复制成功');
    setTimeout(() => copyToastShow.value = false, 2000)
    emit('close')
  } catch (err) {
    alert('复制失败，请手动复制：' + link)
  }
}

// 图片加载失败时的降级处理
const handleImgError = (e) => {
  e.target.src = 'https://picsum.photos/200/200?fallback'
}
</script>

<style scoped>
/* 主弹窗样式不变 */
.share-dialog {
  --van-dialog-width: 85%;
  --van-dialog-title-font-size: 16px;
}
.share-options {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
}
.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
.share-icon {
  font-size: 32px;
  margin-bottom: 8px;
}
.wechat-icon { color: #07c160; }
.qq-icon { color: #12b7f5; }
.link-icon { color: #909399; }
.share-text { font-size: 14px; color: #666; }

/* 二维码弹窗样式强化 */
.qrcode-dialog {
  --van-dialog-width: 80%;
}
.qrcode-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 限制容器宽度，防止图片撑破弹窗 */
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
}

.qrcode-img {
  /* 固定宽高，保证正方形 */
  width: 180px;
  height: 180px;
  /* 核心：自动裁剪，保持图片比例，不拉伸变形 */
  object-fit: cover;
  /* 裁剪时居中显示，保留二维码核心区域 */
  object-position: center;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px;
  /* 防止图片被挤压 */
  flex-shrink: 0;
}

/* 移动端适配：按比例缩小 */
@media (max-width: 375px) {
  .qrcode-img {
    width: 150px;
    height: 150px;
  }
}
</style>