<script setup>
import { getscdzapi } from '@/apis/mianjing';
import SCXHGY from '@/components/SCXHGY.vue';
import {ref } from 'vue'

const mjlist=ref({})

  const xuanran= async ()=>{
      const res= await getscdzapi(2)
      console.log("收藏的数据",res);
      
      mjlist.value=res.data.rows
  }  
xuanran()

</script>

<template>
    <SCXHGY title="我的收藏"  :MJList="mjlist" HTURL="shoucang"></SCXHGY>
</template>