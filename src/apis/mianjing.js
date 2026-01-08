import myaxios from '@/utils/request.js'


//获取面经列表
export const mianjingListapi=(obj)=>{
// 1. 解构赋值+默认值：给每个参数设置基础默认值
  const {
    current = 1,        // current默认1
    pageSize = 10,      // pageSize默认10（可根据你的业务调整）
    stem = '',          // 题干默认空字符串
    keyWord = '',       // 关键字默认空字符串
    sorter = 'weight_desc' // 排序默认最新（按你的需求）
  } = obj;


    return myaxios({
        url:"/h5/interview/query",
        params:{
            current,
            pageSize,
            stem,           //筛选字段-题干
            keyWord,        //筛选字段-关键字
            sorter          //排序字段，以字段名加下划线组合，不能有特殊字符和不存在的字段。 推荐传 weight_desc 最新：可以不用传
        }
    })
}





//获取面经详情
export const getitemmjapi=(id)=>{
  return myaxios({
    url:"/h5/interview/show",
    params:{
        id
    }
  })
}




//收藏、点赞题目/取消收藏、点赞题目接口
export const  setscdzapi=(id,optType)=>{
   return myaxios({
    url:"/h5/interview/opt",
    method:"POST",
    data:{
      id,
      optType
    }
   })
}


//获取收藏,点赞的
export const getscdzapi=(optType)=>{
      return myaxios({
        url:"/h5/interview/opt/list",
        params:{
            optType
        }
      })
}