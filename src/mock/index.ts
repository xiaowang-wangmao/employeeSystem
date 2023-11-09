import { MockMethod } from "vite-plugin-mock"
 
const mock: Array<MockMethod> = [
    {
        // 接口路径
        url: '/login',
        
        // 接口方法
        method: 'post',
 
        // 返回数据
        response: () => {
            return {
                status: 401,
                message: 'success',
                data: 'Hello World'
            }
        }
    },
    {
        // 接口路径
        url: '/register',
        
        // 接口方法
        method: 'post',
 
        // 返回数据
        response: () => {
            return {
                status: 200,
                message: 'success',
                data: '注册成功'
            }
        }
    }
]
 
export default mock