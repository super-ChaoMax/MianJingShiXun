import { ref } from 'vue'
import { defineStore } from 'pinia'



export const userstore = defineStore('MJSX-userstore', () => {




  //存储token
  const token = ref({})

  const settoken=(value)=>{
      token.value=value
  }






  return { 
      token,
      settoken
  }
},{
    persist: true,
},)
