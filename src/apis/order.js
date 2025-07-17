import {httpRequest} from "@/utils/http";

//查询近期热门信息
export function findHotInformation(){
    return httpRequest({
        method:"get",
        url:"/order/findHot",
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}

//查询所有
export function findAllOrder(param){
    return httpRequest({
        method:"get",
        url:"/order/findAll",
        params:param,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}
//根据id查询商品数据
export function  findOrderById(paramId){
    return httpRequest({
        url:"/order/findOrderById?orderId="+paramId,
        method:"get",
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}

//模糊查询
export function  findOrdersByLikeName(searchName){
    return httpRequest({
        url:"/order/byLikeName?searchName="+searchName,
        method:"get",
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}
//发布信息
export function updateOrderInfo(params){
    return httpRequest({
        url: "/order/updateByName",
        method: "post",
        data: params,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}



//查询所有
export function findAllGoodsOrder(param){
    return httpRequest({
        method:"get",
        url:"/order/getGoods",
        params:param,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}


//供给商品模糊查询
export function  findGoodsOrdersByLikeName(searchName){
    return httpRequest({
        url:"/order/GoodsByLikeName?searchName="+searchName,
        method:"get",
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}
/*//添加购物车
export function addShopcart(params){
    return httpRequest({
        url: "/cart/addShopcart",
        method: "post",
        data: params,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}*/

//点赞
export function addLike(params){
    return httpRequest({
        url: "/order/addLike",
        method: "post",
        data: params,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}



//收藏
export function addShocang(params){
    return httpRequest({
        url: "/order/addShocang",
        method: "post",
        data: params,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}

/*

//评论
export function addComments(params){
    return httpRequest({
        url: "/com/addComments",
        method: "post",
        data: params,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}*/
//高昌锐
//查询求购需求全部商品
export function findAllNeeds1(param) {
    return httpRequest({
        method: "get",
        url: "/order/needs1",
        params: param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}

//模糊查询
export function findOrdersByLikeName1(searchName) {
    return httpRequest({
        url: "/order/byLikeName1?searchName=" + searchName,
        method: "get",
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}

//查询所有商品
export function findAllOrders1(param) {
    return httpRequest({
        method: "get",
        url: "/order/findAll1",
        params: param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//根据id查询[需]商品数据
export function findNeedsById(paramId) {
    return httpRequest({
        url: "/order/findNeedsById?orderId=" + paramId,
        method: "get",
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//根据Order_id修改商品信息
export function updateOrder(params){
    return httpRequest({
        method:"post",
        url:"/order/updateOrderById",
        data:params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}



//模糊查询[needs]
export function findOrdersByLikeByNeeds(param) {
    return httpRequest({
        url: "/order/byLikeByNeeds",
        params:param,
        method: "get",
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//模糊查询[goods]
export function findOrdersByLikeByGoods(param) {
    return httpRequest({
        url: "/order/byLikeByGoods",
        params:param,
        method: "get",
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })

}



//删除信息
export function deleteOrder(params){
    return httpRequest({
        method:"get",
        url:"/order/deleteById?id="+params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}




//（添加）发布信息[需]
export function updateOrderInfoByNeeds(params) {
    return httpRequest({
        url: "/order/updateByNeeds",
        method: "post",
        data:params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}

//发布信息[供]
export function updateOrderInfo1(params) {
    return httpRequest({
        url: "/order/updateByName1",
        method: "post",
        data:params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}

//根据user_id查询type为goods的商品全部信息
export function findOrderByUserIdAndGoods(params){
    return httpRequest({
        method:"get",
        url:"/order/findOrderByUserIdAndGoods?userId="+params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//根据user_id查询type为needs的商品全部信息
export function findOrderByUserIdAndNeeds(params){
    return httpRequest({
        method:"get",
        url:"/order/findOrderByUserIdAndNeeds?userId="+params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}