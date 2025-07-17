<template>
<div class="front-page-container">
  <div class="front-page">
    <goods-sourse2 v-bind:cgoods="goods" @handleSearch="getOrderByLike"></goods-sourse2>
<!--    子组件传来的数据@toParent="getFromechildren"-->
    <pagination @toParent="getFromechildren"
      :cTotal="total" :cPageSize="pageSize"></pagination>
  </div>
  <div class="right-info">
    <div class="free-btn">
      <img src="../assets/img/fabuxinxi2.png" @click="toPublishgoods">
    </div>
    <div class="top-info">
      <div style="font-size:18px"><strong>近期热门信息</strong></div>
      <div class="item-info" v-for="(item,index) in hotGood" :key="index">{{index+1}}、{{item.content}}</div>
    </div>
  </div>
</div>

</template>
<script>
import {findAllOrder, findHotInformation,findOrdersByLikeName} from "@/apis/order";
import GoodsSourse2 from "../components/GoodsSource2.vue";
import Pagination from "../components/Pagination.vue";
export default {
  data() {
    return {
      hotGood:[],
      goods:[],
      total:0,//一共多少条
      pageSize:10//一页显示的条数
    };
  },
  //模版加载完毕后，执行mounted()
  mounted() {
    this.getHotOrderInfo();
    this.getAllOrders();
  },
  methods: {
    //跳转到发布页面
    toPublishgoods(){
      this.$router.push("/home/Publish")
    },
    //模糊查询
    getOrderByLike(searchVal){
      findOrdersByLikeName(searchVal).then(res=>{
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

    //获取子组件传递的数据
    getFromechildren(val){
      this.goods=val
    },
    //获取所有商品数据
    getAllOrders(){
      let params={
        currentPage:1,
        PageSize: this.pageSize
      }
      findAllOrder(params).then(res =>{
        this.goods = res.data;
        this.total = res.pageData.total;
      })
    },
    //获取近期热门信息
    getHotOrderInfo(){
      findHotInformation().then(res=>{
        console.log(res)
       this.hotGood=res.data
      })
    }
  },
  components: {
    Pagination,
    GoodsSourse2,
  },
};
</script>

<style lang="less" scoped>
.front-page-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 1100px;
  margin: 10px auto;
}
.front-page {
  width: 780px;
  margin: 0 auto;
}
.item-info{
  line-height: 25px;
  cursor: pointer;
  &:hover{
    color: #035D1C;
    text-decoration: underline;
  }
}
.right-info{
  padding: 10px 20px;
  height: 1000px;
  width: 300px;
  min-height: 360px;
  background-color: #fff;
  .free-btn{
    text-align: center;
    cursor: pointer;
  }
  .top-info{
    font-size: 12px;
    margin-top: 20px;
  }
}
</style>