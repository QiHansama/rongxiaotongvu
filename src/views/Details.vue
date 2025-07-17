<template>
  <div class="details-container">

    <!-- 原有商品详情部分 -->
    <div class="details-box">
      <img v-if="orderDetail.picture" :src="orderDetail.picture" alt="" />
      <img v-else src="../assets/img/wutu.gif" alt="" style="border:1px solid #f2f2f2;"/>
      <div class="info">
        <h4 class="title">{{ orderDetail.title }}</h4>
        <div class="content" :title="orderDetail.content">{{ orderDetail.content }}</div>
        <span class="price">￥{{ orderDetail.price }}</span>
        <div class="time">
          <span style="margin-right:30px;">发布时间：{{ orderDetail.createTime | changeTime }}</span>
          <span>最近修改时间：{{ orderDetail.updateTime | changeTime }}</span>
        </div>
        <div class="item-style">
          <div class="operation">
            <div class="operation-item" @click="addLikes" :title="`当前点赞量: ${like}`">
              <img src="../assets/img/good.png" class="operation-img" alt="" /> 点赞
            </div>
            <div class="operation-item" @click="addShocangs" :title="`当前收藏量: ${shocang}`">
              <img src="../assets/img/no-star.png" class="operation-img" alt="" /> 收藏
            </div>
            <div class="operation-item" @click="showCommentInput = true">
              <img src="../assets/img/fill-in.png" class="operation-img" alt="" />评论
            </div>
          </div>
          <div class="btn-content">
            <div class="quantity-control" v-if="orderDetail.type == 'goods'">
              <el-button
                  size="mini"
                  @click="count > 1 ? count-- : null"
                  :disabled="count <= 1"
                  icon="el-icon-minus"
                  circle
              />
              <el-input
                  v-model.number="count"
                  size="mini"
                  style="width: 60px;"
                  @change="handleCountChange"
              >
              </el-input>
              <el-button
                  size="mini"
                  @click="count < 100 ? count++ : null"
                  :disabled="count >= 100"
                  icon="el-icon-plus"
                  circle
              />
            </div>

            <el-button type="danger" v-if="orderDetail.type == 'goods'" @click="addShopcartClick">加入购物车</el-button>
            <el-popover placement="right" width="320" trigger="hover">
              <div>
                <div class="item-sales">卖家姓名：<span class="sales-text">{{userData.userName}}</span></div>
                <div class="item-sales">卖家地址：<span class="sales-text">{{userData.address}}</span></div>
                <div class="item-sales">卖家手机号码：<span class="sales-text">{{userData.phone}}</span></div>
                <div class="item-sales">更新时间：<span class="sales-text">{{userData.updateTime | formatTimer}}</span></div>
              </div>
              <el-button type="danger" slot="reference" v-show="orderDetail.type == 'needs'">联系买家</el-button>
            </el-popover>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增评论区域 -->
    <div class="comment-area">
      <div class="comment-header">
        <h3>评论({{ total }})</h3>
      </div>

      <div class="comment-list">
        <div v-if="comments.length === 0" class="no-comment">暂无评论，快来发表第一条评论吧~</div>
        <div v-for="(comment, index) in comments" :key="index" class="comment-item">
          <div class="comment-user">
            <img :src="comment.avatar || defaultAvatar" class="avatar" />
            <span class="username">{{ comment.poster }}</span>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
          <div class="comment-time">{{ comment.createTime | formatTimer }}</div>
        </div>
      </div>
      <pagination @toParent2="handlePageChange1"   :cTotal="total" :cPageSize="pageSize"></pagination>
      <div class="comment-input" v-if="showCommentInput">
        <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入您的评论..."
            v-model="newComment"
            maxlength="200"
            show-word-limit
        ></el-input>
        <div class="comment-buttons">
          <el-button size="small" @click="cancelComment">取消</el-button>
          <el-button type="primary" size="small" @click="submitComment" :disabled="!newComment.trim()">发表</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChangeMessage from "../components/ChangeMessage.vue";
import { addLike, addShocang, findOrderById} from "@/apis/order";
import {addShopcart} from "@/apis/cart";
import {addComments, findComments} from "@/apis/comment";
import Pagination from "@/components/Pagination.vue";
export default {
  data() {
    return {
      order_id: 0,
      orderDetail:{},
      userData:{},
      count:1,
      like:0,
      shocang:0,
      total:0,
      currentPage:1,
      pageSize: 10,
      // 评论相关数据
      comments: [],
      url:"",
      newComment: '',
      showCommentInput: false,
      defaultAvatar: require('../assets/img/wutu.gif')
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
      return y + "-" + MM + "-" + d + " " + h + ":" + m;
    }
  },
  components: {Pagination, ChangeMessage },
  props: {
    ctype: {
      type: String,
    },
    cdesciibe: {
      type: String,
    },
  },
  methods: {
    getOrderByOrderId(){
      findOrderById(this.order_id).then(res=>{
        if (res.code===200){
          console.log(res)
          this.orderDetail = res.data
          console.log("orderDetail",this.orderDetail)
          // 获取评论
          this.getCommentsList();
        }
      })
    },
    //获取子组件传递的数据
    handlePageChange1(val) {
      console.log("val",val)
      this.comments = val;
      console.log("val",val)
    },
    // 获取评论列表
    getCommentsList() {
      let params={
        orderId: this.order_id,
        currentPage:this.currentPage,
        PageSize: this.pageSize
      }

      findComments(params).then(res => {
        if (res.code === 200) {
          this.comments = res.data.comments || [];
          this.total=res.pageData.total;
          console.log("res",res)
          console.log("123",this.comments)
        }
      })
    },
    //添加购物车
    addShopcartClick(){
      addShopcart({
        productId:this.order_id,
        count:this.count
      }).then(res=>{
        if (res.code ===200){
          this.$message({
            type: "success",
            message: res.message
          })
        }else {
          this.$message({
            type:"error",
            message:res.message
          })
        }
      })
    },
    //点赞
    addLikes(){
      addLike({
        productId:this.order_id,
      }).then(res=>{
        console.log(res)
        localStorage.setItem(`like_${this.order_id}`, res.data)
        this.like=res.data;
        if (res.code ===200){
          this.$message({
            type: "success",
            message: res.message
          })
        }else {
          this.$message({
            type:"error",
            message:res.message
          })
        }
      })
    },
    //收藏
    addShocangs(){
      addShocang({
        productId:this.order_id,
      }).then(res=>{
        console.log(res)
        localStorage.setItem(`shocang_${this.order_id}`, res.data)
        this.shocang=res.data;
        if (res.code ===200){
          this.$message({
            type: "success",
            message: res.message
          })
        }else {
          this.$message({
            type:"error",
            message:res.message
          })
        }
      })
    },
    // 评论
    submitComment() {
      if (!this.newComment.trim()) return;

      addComments({
        orderId: this.order_id,
        content: this.newComment
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: res.message
          });
          this.newComment = '';
          this.showCommentInput = false;
          // 刷新评论列表
          this.getCommentsList();
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      });
    },
    // 取消评论
    cancelComment() {
      this.newComment = '';
      this.showCommentInput = false;
    }
  },
  mounted() {
    //获取用户信息
    this.userData = JSON.parse(localStorage.getItem("user"));
    //获取传过来的商品id
    this.order_id=this.$route.query.orderId;
    console.log(this.order_id)
    this.getOrderByOrderId();
    this.getCommentsList();
    this.shocang = localStorage.getItem(`shocang_${this.order_id}`) || 0;
    this.like = localStorage.getItem(`like_${this.order_id}`) || 0;
  },
};
</script>

<style lang="less" scoped>
.details-container {
  width: 1100px;
  margin: 20px auto;
}

.details-box {
  padding: 20px;
  background: #fff;
  display: flex;
  gap: 20px;

  img {
    width: 360px;
    height: 300px;
    border-radius: 6px;
    object-fit: cover;
  }

  .info {
    flex: 1;
    min-width: 0;
    border: 1px solid #f2f2f2;
    border-radius: 6px;
    padding: 20px;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .content {
      flex: 1;
      min-height: 100px;
      border: 1px dashed #f2f2f2;
      padding: 10px;
      margin-bottom: 15px;
      line-height: 1.5;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
    }

    .price {
      color: #f56c6c;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .time {
      color: #999;
      font-size: 13px;
      display: flex;
      gap: 30px;
      margin-bottom: 15px;
    }

    .item-style {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;

      .operation {
        display: flex;
        gap: 15px;

        .operation-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
          }

          .operation-img {
            width: 20px;
            height: 20px;
            margin-bottom: 5px;
          }
        }
      }

      .btn-content {
        display: flex;
        align-items: center;
        gap: 10px;

        .quantity-control {
          display: flex;
          align-items: center;
          border-radius: 20px;
          padding: 4px;
          border: 1px solid #dcdfe6;

          .el-button {
            width: 20px;
            height: 20px;
            padding: 0;
            border-radius: 50%;
            background: #fff;

            &:hover {
              background: #f0f2f5;
            }

            &.is-disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }
          }

          .el-input {
            width: 40px;
            margin: 0 5px;

            /deep/ .el-input__inner {
              height: 28px;
              line-height: 28px;
              padding: 0;
              text-align: center;
              border: none;
              background: transparent;
              font-weight: bold;
            }
          }
        }

        .el-button {
          height: 32px;
          padding: 0 20px;
          font-weight: 500;

          &--danger {
            background: #f56c6c;
            border-color: #f56c6c;

            &:hover {
              background: #f78989;
              border-color: #f78989;
            }
          }
        }
      }
    }
  }

  .item-sales {
    color: #606266;
    line-height: 30px;
    font-size: 14px;

    .sales-text {
      color: #909399;
      margin-left: 8px;
    }
  }
}

/* 新增评论区域样式 */
.comment-area {
  margin-top: 20px;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);

  .comment-header h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }

  .no-comment {
    text-align: center;
    color: #999;
    padding: 30px 0;
  }

  .comment-item {
    padding: 15px 0;
    border-bottom: 1px solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }
  }

  .comment-user {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .username {
    font-weight: bold;
    color: #333;
  }

  .comment-content {
    margin: 8px 0;
    line-height: 1.6;
    color: #333;
  }

  .comment-time {
    font-size: 12px;
    color: #999;
  }

  .comment-input {
    margin-top: 20px;
  }

  .comment-buttons {
    margin-top: 10px;
    text-align: right;
  }
}
</style>