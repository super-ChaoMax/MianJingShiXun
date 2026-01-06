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
