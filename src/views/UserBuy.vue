<template>
  <div class="user-buy">
    <div
      class="buy"
      v-for="(item, index) in userBuyList"
      :key="index"
      :style="(index + 1) % 2 === 0 ? 'margin-right:0' : 'margin-right:20px'"
    >
      <div class="right-content">
        <div class="right-item">
          姓名：<span class="item-text">{{ item.demandInitiator }}</span>
        </div>
        <div class="right-item">
          创建时间：<span class="item-text">{{
            item.createTime | formatTimer
          }}</span>
        </div>
        <div class="right-item">
          更新时间：<span class="item-text">{{
            item.updateTime | formatTimer
          }}</span>
        </div>
        <div class="right-item" :title="item.address">
          <div class="item-text">{{ item.address }}</div>
        </div>
        <div class="item-content">
          <span class="price">￥ {{ item.totalPrice }}</span>
          <el-tag :type="item.purchaseStatus === 0 ? 'danger' : 'success'" size="mini">{{
            item.purchaseStatus === 0 ? "未发货" : "已发货"
          }}</el-tag>
        </div>
      </div>
    </div>
    <pagination @toParent="getFromChildren"
                :cTotal="total" :cPageSize="pageSize" :cTableType="'buy'"></pagination>
  </div>
</template>

<script>
/*import {findAllPurchase} from "@/apis/purchase";*/
import Pagination from "@/components/Pagination1.vue";
import {findPurchaseBuy} from "@/apis/purchase";

export default {
  components: {Pagination},
  data() {
    return {
      userBuyList: [],
      user:{},
      total: 0,//一共多少条
      pageSize: 6,//一页显示的条数

    };
  },
  methods:{
    //获取子组件传递过来的数据
    getFromChildren(val){
      this.userBuyList=val;
    },
    getData(){
      let params={
        currentPage:1,//当前页
        pageSize:this.pageSize,
        uid:this.user.id
      }
      findPurchaseBuy(params).then(res=>{
        if(res.code==200){
          this.userBuyList=res.data
          this.total = res.pageData.total;
        }
      })
    }
  },
  filters: {
    formatTimer: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m;
    },
  },
  mounted() {
    // 从localStorage读取用户信息（含id）
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
    this.getData()
  }
};
</script>

<style lang="less" scoped>
.user-buy {
  margin: 0 auto;
  width: 900px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  background: #fff;
  padding: 0px 20px;
  .buy {
    box-sizing: border-box;
    width: 420px;
    margin: 20px 0 10px;
    height: 180px;
    border: 1px solid #f2f2f2;
    border-radius: 6px;
    display: flex;
    flex-direction: row;
    padding-right: 10px;
    justify-content: space-between;
    img {
      width: 200px;
      height: 180px;
      margin-right: 10px;
      border-radius: 6px;
    }
    .right-content {
      .right-item {
        line-height: 30px;
        height: 30px;
        .item-text {
          color: #666;
          width: 190px;
          height: 50px;
          /*超出的部分隐藏*/
          overflow: hidden;
          /*文字用省略号替代超出的部分*/
          text-overflow: ellipsis;
          word-break: break-all;
          white-space: nowrap;
        }
      }
      .price {
        font-size: 16px;
        color: red;
      }
      .item-content {
        display: flex;
        justify-content: space-between;
        align-content: center;
        margin-top: 5px;
      }
    }
  }
}
</style>