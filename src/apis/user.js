import myaxios from '@/utils/request.js'


//注册接口
export const zhuceapi=(username,password)=>{
   return myaxios({
            url:"/h5/user/register",
            method:"POST",
            data:{
                username,
                password
            }

        })
}




//登录的接口
export const dengluapi=(username,password)=>{
    return myaxios({
        url:"/h5/user/login",
        method:"POST",
        data:{
            username,
            password
        }
    })
}



// 验证身份
export const yzsfapi = (token) => {
    // 初始化 headers 对象（可放公共的 header，比如 Content-Type）
    const headers = {};
    
    // 只有当 token 存在（非空/非undefined）时，才添加 Authorization
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return myaxios({
        url: "/h5/user/currentUser",
        headers: headers // 动态传入 headers，有 token 则带 Authorization，无则为空
    })
}