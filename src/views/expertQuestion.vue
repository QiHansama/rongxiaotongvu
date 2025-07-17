<!--专家问答-->
<template>
  <div class="expert-question-container">
    <div v-for="(item,index) in questionArray" :key="index" class="question-item">
      <div class="question-content">
        <div class="title">{{item.title}}</div>
        <div class="content">{{item.question}}</div>
        <div class="item-container">
          <div class="item-content marginR30">提问者：<span class="item-text">{{user.id}}</span> </div>
          <div class="item-content marginR30">提问者联系方式：<span class="item-text">{{item.phone}}</span> </div>
          <el-tag :type="item.status === 0 ? 'danger':'success'" size="mini">{{item.status === 0 ? '未回答' :'已回答'}}</el-tag>
        </div>
      </div>
      <div class="question-btn">
        <div class="btn-text" @click="handleDetail(item)">详情</div>
        <div class="btn-text" @click="delQuestion(item)">删除</div>
      </div>
    </div>
    <el-dialog title="详情" :visible.sync="showDetail" width="600px" :before-close="detailClose">
      <div>
        <div class="detail-item">
          <div class="item-title">问题标题：</div>
          <div class="item-content">{{detailObj.title}}</div>
        </div>
        <div class="detail-item">
          <div class="item-title">问题内容：</div>
          <div class="item-content">{{detailObj.content}}</div>
        </div>
        <div class="detail-item">
          <div class="item-title">问题状态：</div>
          <el-tag type="danger" size="mini">{{detailObj.status === 0 ? '未回答' :'已回答'}}</el-tag>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDetail = false">确 定</el-button>
      </span>
    </el-dialog>
    <pagination @toParent="getFromChildren"
                :cTotal="total" :cPageSize="pageSize" :cTableType="'question'"></pagination>
  </div>
</template>
<script>
import {deleteById, findAllQuestion, findQuestionById} from "@/apis/question";
import Pagination from "@/components/Pagination1.vue";

export default {
  components: {Pagination},
  data(){
    return{
      user:{},
      questionArray:[],
      showDetail: false,
      dialogVisible: false,
      title:"",
      detailObj:{
        title:'',
        content:'',
        expertName:'',
        answer:'',
        address:'',
        area:'',
        plantCondition:'',
        plantDetail:'',
        plantName:'',
        questioner:'',
        soilCondition:'',
        status:1
      },
      total: 0,//一共多少条
      pageSize: 5//一页显示的条数
    }
  },
  methods:{
    //获取子组件传递过来的数据
    getFromChildren(val){
      this.questionArray=val;
    },
    getData(){
      let params={
        currentPage:1,//当前页
        pageSize:this.pageSize
      }
      findAllQuestion(params).then(res=>{
        if(res.code==200){
          this.questionArray=res.data
          this.total = res.pageData.total;
        }
      })
    },
    delQuestion(item){
    deleteById(item.id).then(res=>{
      if(res.code==200){
        this.$message({
          type:"success",
          message:res.message
        })
        this.getData()
      }else {
        this.$message({
          type:"success",
          message:res.message
        })
        this.getData()
      }
    })
    },
    handleDetail(item){
      this.showDetail = true
      findQuestionById(item.id).then(res=>{
        if(res.code==200){
          this.detailObj =res.data
          console.log("detailObj",res.data)
        }
      })
    },
    detailClose(){
      this.showDetail = false
    },

  },
  mounted(){
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.expert-question-container{
  width: 900px;
  min-height: 100%;
  // padding: 10px 20px;
  background: #fff;
  .question-item{
    border:1px solid #f2f2f2;
    border-radius: 6px;
    padding: 10px 20px;
    margin: 10px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .question-content{
      width: 650px;
      .title{
        font-weight: bold;
        font-size: 18px;
        line-height: 30px;
        height: 30px;
      }
      .content{
        line-height: 25px;
        height: auto;
        word-break: break-all;
      }
      .item-container{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        line-height: 20px;
      }
      .marginR30{
        margin-right: 30px;
      }
      .item-text{
        color: #666;
      }
    }
    .question-btn{
      display: flex;
      .btn-text{
        height: 25px;
        cursor: pointer;
        margin-right: 10px;
        color: #67C23A;
        &:hover{
          color: #035D1C;
          text-decoration: underline;
        }
      }
    }
  }
  .detail-item{
    display: flex;
    line-height: 30px;
    .item-content{
      line-height: 30px;
      height: auto;
      width: 480px;
    }
    .item-title{
      width: 80px;
      height: 30px;
      font-weight: bold;
      color: #333;
    }
  }
}
</style>