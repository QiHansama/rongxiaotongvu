<template>
  <div class="home-purchase">
    <purchase :cneeds="needList" @handleSearch="getOrderByLike"></purchase>
    <pagination @toParent="getFromChildren"
                :cTotal="total" :cPageSize="pageSize" :cTableType="'needs'"></pagination>
  </div>
</template>

<script>
import Purchase from "../components/Purchase.vue";
import Pagination from "../components/Pagination1.vue";
import {findAllNeeds1, findOrdersByLikeName1} from "@/apis/order";

export default {
  data() {
    return {
      needList: [],
      total: 0,//一共多少条
      pageSize: 10,//一页显示的条数
      searchValue:"",
    };
  },
  methods: {
    //获取子组件传递过来的数据
    getFromChildren(val){
      this.needList=val;
    },
    //模糊查询
    getOrderByLike(searchVal){
      findOrdersByLikeName1(searchVal).then(res=>{
        if(res.code===200){
          this.needList=res.data;
          this.$message({
            type:"success",
            message:res.message
          })
        }else{
          this.$message({
            type:"error",
            message:res.message
          })
        }
      })
    },
    getAllNeeds(){
      let params={
        currentPage:1,//当前页
        pageSize:this.pageSize
      }
      findAllNeeds1(params).then(res=>{
        this.needList = res.data;
        this.total = res.pageData.total;
        console.log("total",this.total)
        console.log("total",res)
      })
    }
  },
  mounted: function() {
    this.getAllNeeds()
  },
  created() {
    this.getAllNeeds()
  },
  components: {
    Purchase,
    Pagination,
  },
};
</script>

<style lang="less" scoped>
.home-purchase {
  width: 1500px;
  margin: 0 auto;
}
</style>;
