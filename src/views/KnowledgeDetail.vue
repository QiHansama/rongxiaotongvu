<!-- 农业知识详情 -->
<template>
  <div class="knowlege-detail-container">

    <div class="title">{{updateInfo.title}}</div>
    <div class="tips">
      <span>作者：</span>
      <span style="margin-right:20px;">{{updateInfo.ownName}}</span>
      <span>日期：</span>
      <span>{{updateInfo.updateTime | formatTimer}}</span>
    </div>
    <div class="detail-img">
      <video v-if="updateInfo.type==='mp4'||updateInfo.type==='MP4'" id="video" width="900" height="360" :src="updateInfo.picPath" controls> </video>
      <img v-else style="width:500px;height:300px;" :src="updateInfo.picPath" alt="" />
    </div>
    <div class="detail-content">
      <pre>{{updateInfo.content}}</pre>
    </div>
    <el-input type="textarea" v-model="content" :rows="5"></el-input>
    <div style="margin-top:20px;display: flex;flex-direction: row;justify-content: flex-end">
      <el-button type="success" @click="handleComment">添加评论</el-button>
    </div>
    <div class="comment-container">
      <div class="comment-num">评论共{{commentArray.length||0}}条</div>
      <div class="comment-item" v-for="(item,index) in commentArray" :key="index">
        <div>{{item.content}}</div>
        <div class="comment-tips">
          <div style="margin-right:40px;">评论人：<span class="color6">{{item.poster}}</span></div>
          <div>评论时间：<span class="color6">{{item.createTime|formatTimer2}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import { selectComment, selectKnowledgeById, addComment } from "@/apis/knowledge";


export default {
  data(){
    return{
      updateInfo:{},
      content:'',
      commentArray:[],

    }
  },
  filters: {
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
    },
    formatTimer2: function(value) {
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
      return y + "-" + MM + "-" + d + " "+h+":"+m;
    }
  },
  methods: {
    async getData() {
      const id = this.$route.params.id /*this.$route.params.knowledge_id*/; // 统一参数名
      const res = await selectKnowledgeById(id);
      this.updateInfo = res.data;
    },
    async getCommentData() {
      const i=this.$route.params.id;
      console.log("123213===",i)
      const id = this.$route.params.id/*this.$route.params.knowledge_id*/; // 统一参数名
      console.log("13213",id)
      const res = await selectComment(id);
      console.log("ewe===",res)
      this.commentArray = [...res.data]; // 强制响应式更新
    },
    async handleComment(){
      if(localStorage.getItem('token')){
        addComment({
          orderId: this.$route.params.id,
          content: this.content
        }).then(res=>{
          this.content=''
          this.$message.success('评论成功！')
          this.getCommentData()
        }).catch(err=>{
          console.log(err)
        })
      }else{
        this.$message.error('请先登录')
      }
    }
  },

  async mounted() {
    await this.getData();
    await this.getCommentData();
  }
}
</script>

<style lang="less" scoped>
.knowlege-detail-container{
  width: 1100px;
  margin: 0 auto;
  background: #fff;
  min-height: 100%;
  padding: 10px 20px;
  margin-top: 10px;
  .title{
    font-size: 18px;
    text-align: center;
  }
  .tips{
    color: #999;
    display: flex;
    justify-content: flex-end;
    height: 30px;
    align-items: center;
  }
  .detail-img{
    display: flex;
    justify-content: center;
    margin-top: 50px;
    video{
      border: 1px solid #f2f2f2;
    }
    img{
      border-radius: 6px;
    }
  }
  .detail-content{

  }
  .comment-container{
    clear: both;
    margin-top: 10px;
    .comment-num{
      font-weight: bold;
    }
    .comment-item{
      border-bottom: 1px solid #f2f2f2;
      padding: 10px 20px;
      margin: 20px 0;
      word-break: break-all;
      .comment-tips{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        .color6{
          color: #666;
        }
      }
    }
  }
}
</style>