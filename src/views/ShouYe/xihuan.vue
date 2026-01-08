<script setup>
import { getscdzapi } from '@/apis/mianjing';
import SCXHGY from '@/components/SCXHGY.vue';
import {ref } from 'vue'

const mjlist=ref({})

  const xuanran= async ()=>{
      const res= await getscdzapi(1)
      console.log("喜欢的数据",res);
      
      mjlist.value=res.data.rows
  }  
xuanran()

</script>

<template>
    <SCXHGY title="我的喜欢"  :MJList="mjlist" HTURL="xihuan"></SCXHGY>
</template>