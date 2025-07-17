<template>
  <div class="details-box">
    <h4 class="title">{{ orderDetail.title }}</h4>
    <div class="time">
      <span>发布时间：{{ orderDetail.createTime | changeTime }}</span>
      <span style="margin-left: 50px;">最近修改时间：{{ orderDetail.updateTime | changeTime }}</span>
      <div class="item-style">
        <el-popover placement="right" width="320" trigger="hover">
          <div>
            <div class="item-sales">买家姓名：<span class="sales-text">{{orderDetail.ownName}}</span></div>
            <div class="item-sales">买家地址：<span class="sales-text">{{orderDetail.address}}</span></div>
            <div class="item-sales">更新时间：<span class="sales-text">{{orderDetail.updateTime | formatTimer}}</span></div>
          </div>
          <div style="color:#fc7373;margin-left:50px;cursor:pointer;display: flex;" slot="reference">
            <div style="margin-right:10px;color:#fff;font-weight:bold;background: #fc7373;width: 20px;height: 20px;border-radius: 10px;line-height: 20px;text-align: center;">!</div>
            买家信息
          </div>
        </el-popover>
      </div>
    </div>
    <img :src="orderDetail.picture" v-show="orderDetail.picture" alt="" />
    <div class="info">
      <div class="content" :title="orderDetail.content">{{ orderDetail.content }}</div>
    </div>
  </div>
</template>

<script>
import {findNeedsById} from "@/apis/order";

export default {
  data() {
    return {
      orderId: 0,
      orderDetail:{},
    };
  },
  filters: {
    changeTime(time) {
      return time.slice(0, 10);
    },
    formatTimer: function(value) {
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
      return y + "-" + MM + "-" + d + " ";
    }
  },
  methods: {
  findNeedById(){
    findNeedsById(this.orderId).then(res=>{
      if(res.code===200){
        this.orderDetail=res.data
        this.$message({
          type:"success",
          message:res.message
        })
      }else {
        this.$message({
          type:"error",
          message:res.message
        })
      }
    })
  }
  },
  mounted() {
    //获取传过来的商品id
    this.orderId = this.$route.query.orderId//获取id
    this.findNeedById()
  },
};
</script>

<style lang="less" scoped>
.details-box {
  width: 1100px;
  min-height: 100%;
  height: auto;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  // align-items: center;
  img {
    width: 360px;
    height: 300px;
    margin: 50px auto 20px;
    border-radius: 6px;
  }
  .title {
    font-size: 24px;
    font-weight: bold;
    line-height: 35px;
    max-height: 70px;
    text-align: center;
    margin-bottom: 20px;
  }
  .time {
    margin-top: 5px;
    color: #999;
    display: flex;
    justify-content: flex-end;
  }
  .info {
    width: 100%;
    min-height: 300px;
    border-radius: 6px;
    padding: 10px 20px;
    margin: 0 auto;
    display: flex;
    align-content: center;
    justify-content: center;
    .content {
      min-height: 100px;
      // border: 1px dashed #f2f2f2;
      line-height: 25px;
      padding: 5px 10px;
      /*超出的部分隐藏*/
      overflow: hidden;
      /*文字用省略号替代超出的部分*/
      text-overflow: ellipsis;
      /*弹性伸缩盒子模型显示*/
      display: -webkit-box;
      /*限制在一个块元素显示文本的行数*/
      -webkit-line-clamp: 4;
      /*设置或检索伸缩盒对象的子元素排列方式*/
      -webkit-box-orient: vertical;
    }
    .item-style{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
  .item-sales{
    color: #333 !important;
    line-height: 30px;
    max-height: 30px;
    .sales-text{
      color: #666;
    }
  }
}
</style>
