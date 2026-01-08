<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 1. 定义active（控制Tabbar样式）
const active = ref(0);
// 核心：映射路由路径与active索引的关系（需和Tabbar项一一对应）
const pathActiveMap = {
  "/ShoYe/zhuye": 0,
  "/ShoYe/shoucang": 1,
  "/ShoYe/xihuan": 2,
  "/ShoYe/wode": 3,
};

// 2. 初始化：页面加载时，根据当前路由同步active值（避免刷新样式错位）
const syncActiveWithRoute = () => {
  // 找到当前路由对应的active索引，找不到则默认0
  active.value = pathActiveMap[route.path] || 0;
};

// 3. 监听路由变化：路由跳转成功后，同步active值（比如手动输入URL、浏览器返回）
watch(
  () => route.path,
  () => {
    syncActiveWithRoute();
  },
  { immediate: true } // 立即执行一次（等同于初始化）
);

// 4. 自定义Tab点击事件：只触发路由跳转，不直接修改active
const handleTabClick = (targetPath) => {
  // 先记录点击前的active值（用于跳转失败时回滚）
  const preActive = active.value;
  // 触发路由跳转（拦截逻辑在路由守卫中执行）
  router.push(targetPath).catch((err) => {
    // 路由跳转失败/被拦截时（比如守卫返回false/其他路径），回滚active值
    console.log("路由跳转被拦截，回滚样式", err);
    active.value = preActive;
  });
};

// 页面挂载时初始化
onMounted(() => {
  syncActiveWithRoute();
});
</script>

<template>
  <router-view></router-view>

  <!-- 关键修改：
  1. 移除v-model，改用:model-value单向绑定active（避免Vant自动修改）
  2. 移除van-tabbar-item的to属性，改用自定义click事件
  3. 空的@change事件阻止Vant默认的active修改逻辑
  -->
  <van-tabbar
    :model-value="active"
    class="custom-tabbar"
    active-color="#1989fa"
    @change="() => {}"
  >
    <van-tabbar-item
      icon="description"
      @click="handleTabClick('/ShoYe/zhuye')"
    >面经</van-tabbar-item>
    <van-tabbar-item
      icon="star"
      @click="handleTabClick('/ShoYe/shoucang')"
    >收藏</van-tabbar-item>
    <van-tabbar-item
      icon="like"
      @click="handleTabClick('/ShoYe/xihuan')"
    >喜欢</van-tabbar-item>
    <van-tabbar-item
      icon="user"
      @click="handleTabClick('/ShoYe/wode')"
    >我的</van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>
.custom-tabbar {
  --van-tabbar-height: 100px;
  --van-tabbar-item-icon-size: 24px;
  --van-tabbar-item-font-size: 12px;
}
</style>