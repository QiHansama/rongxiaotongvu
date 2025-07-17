import {httpRequest} from "@/utils/http";


//获取购物车信息
export function getCartInfo(){
    return httpRequest({
        url:"/cart/getMyCartInfo",
        method:"get",
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}

//添加购物车
export function addShopcart(params){
    return httpRequest({
        url: "/cart/addShopcart",
        method: "post",
        data: params,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}
//修改商品数量
export function updateCart(params){
    return httpRequest({
        url: "/cart/updateCart",
        method: "post",
        data: params,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}
//删除订单
export function deleteCart(orderId){
    return httpRequest({
        url:"/cart/deleteCart/" + orderId,
        method:"get",
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}
//删除选中的所有订单allDeleteCart
export function allDeleteCart(params){
    return httpRequest({
        url:"/cart/allDeleteCart" ,
        method: "post",
        data: params,
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}