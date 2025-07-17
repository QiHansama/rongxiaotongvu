<!--商品货源-->
<template>
  <div class="home-goods">
    <goods-sourse :cgoods="goods" @handleSearch="getOrderByLike"></goods-sourse>
    <pagination  @toParent1="getFromechildren" :cUrl="url" :cTotal="total" :cPageSize="pageSize"></pagination>
  </div>
</template>

<script>

import GoodsSourse from "../components/GoodsSource.vue";
import Pagination from "../components/Pagination.vue";
import {findAllGoodsOrder,  findGoodsOrdersByLikeName, } from "@/apis/order";
export default {
  data() {
    return {
      goods: [],
      total: 0,
      pageSize: 10,
      searchValue:'',
      url: "",
      goodsCount: sessionStorage.getItem("/order/goods/pageCode")
        ? sessionStorage.getItem("/order/goods/pageCode")
        : 1,
    };
  },
  mounted() {
    this.$store.commit("updateActiveIndex", "2");
    this.getAllGoodsOrders()
  },
  methods: {
    //获取子组件传递的数据
    getFromechildren(val){
      this.goods=val
    },
    //获取所有供给商品数据
    getAllGoodsOrders(){
      let params={
        currentPage:1,
        PageSize: this.pageSize
      }
      findAllGoodsOrder(params).then(res =>{
        this.goods = res.data;
        this.total = res.pageData.total;

      })
    },
    //模糊查询
    getOrderByLike(searchVal){
      findGoodsOrdersByLikeName(searchVal).then(res=>{
        if (res.code ===200){
          this.goods=res.data;
          /* this.$message({
             type: "success",
             message: res.message
           })*/
        }else {
          this.$message({
            type:"error",
            message:res.message
          })
        }
      })
    },

  },
  components: {
    Pagination,
    GoodsSourse,
  },
};
</script>

<style lang="less" scoped>
.home-goods {
  width: 1100px;
  margin: 0 auto;
}
</style>