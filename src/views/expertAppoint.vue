<!--专家问答-->
<template>
  <div class="expert-appoint-container">
    <div v-for="(item,index) in appointArray" :key="index" class="appoint-item">
      <div class="appoint-content">
        <div class="title">{{ item.plantName }}</div>
        <div class="content">{{ item.plantDetail }}</div>
        <div class="item-container">
          <div class="item-content marginR30">
            <div class="item-title">咨询者：</div>
            <div class="item-text">{{ item.questioner }}</div>
          </div>
          <div class="item-content marginR30">
            <div class="item-title">咨询者联系方式：</div>
            <div class="item-text">{{ item.phone }}</div>
          </div>
        </div>
        <div class="item-container">
          <div class="item-content marginR30">
            <div class="item-title">作物条件：</div>
            <span class="item-text">{{ item.plantCondition }}</span>
          </div>
          <div class="item-content marginR30">
            <div class="item-title">土壤条件：</div>
            <div class="item-text" :title="item.soilCondition">{{ item.soilCondition }}</div>
          </div>
          <div class="item-content marginR30">
            <div class="item-title">面积：</div>
            <div class="item-text">{{ item.area }}亩</div>
          </div>
          <el-tag style="position:relative;left:360px" :type="item.status === 0 ? 'danger':'success'" size="mini">
            {{ item.status === 0 ? '未回答' : '已回答' }}
          </el-tag>
        </div>
      </div>
      <div class="appoint-btn">
        <div class="btn-text" @click="handleDetail(item)">详情</div>
        <div class="btn-text" @click="handleEdit(item)">修改</div>
        <div class="btn-text" @click="delAppoint(item)">删除</div>
      </div>
    </div>
    <el-dialog title="详情" :visible.sync="showDetail" width="600px" :before-close="detailClose">
      <div class="detail-content">
        <div class="detail-item">
          <div class="item-title">种植作物：</div>
          <div class="item-content">{{ detailObj.plantCrop }}</div>
        </div>
        <div class="detail-item">
          <div class="item-title">作物详细信息：</div>
          <div class="item-content">{{ detailObj.cropDetail }}</div>
        </div>
        <div class="detail-item">
          <div class="item-title">地址：</div>
          <div class="item-content">{{ detailObj.address }}</div>
        </div>
        <div class="detail-item">
          <div class="item-title">土壤条件：</div>
          <div class="item-content">{{ detailObj.soilCondition }}</div>
        </div>
        <div class="detail-item">
          <div class="item-title">面积：</div>
          <div class="item-content">{{ detailObj.area }}</div>
        </div>
        <div class="detail-item">
          <div class="item-title">作物条件：</div>
          <div class="item-content">{{ detailObj.cropCondition }}</div>
        </div>
        <div class="detail-item">
          <div class="item-title">联系方式：</div>
          <div class="item-content">{{ detailObj.phone }}</div>
        </div>
        <div class="detail-item">
          <div class="item-title">问题状态：</div>
          <el-tag type="danger" size="mini">{{ detailObj.status === 0 ? '未回答' : '已回答' }}</el-tag>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDetail = false">取 消</el-button>
        <el-button type="primary" @click="showDetail = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="dialogVisible" width="650px" :before-close="closeRevise">
      <div class="detail-content">
        <div class="detail-item">
          <div class="item-title">种植作物：</div>
          <el-input v-model="detailObj.plantCrop" placeholder="请输入种植作物"></el-input>
        </div>
        <div class="detail-item">
          <div class="item-title">作物详细信息：</div>
          <el-input
              v-model="detailObj.cropDetail"
              placeholder="请输入作物详细信息"
              rows="3"
          ></el-input>
        </div>
        <div class="detail-item">
          <div class="item-title">地址：</div>
          <el-input v-model="detailObj.address" placeholder="请输入地址"></el-input>
        </div>
        <div class="detail-item">
          <div class="item-title">土壤条件：</div>
          <el-input
              v-model="detailObj.soilCondition"
              placeholder="请输入土壤条件"
              rows="2"
          ></el-input>
        </div>
        <div class="detail-item">
          <div class="item-title">面积（亩）：</div>
          <el-input
              v-model.number="detailObj.area"
              placeholder="请输入面积"
              type="number"
          ></el-input>
        </div>
        <div class="detail-item">
          <div class="item-title">作物条件：</div>
          <el-input
              v-model="detailObj.cropCondition"
              placeholder="请输入作物条件"
              rows="2"
          ></el-input>
        </div>
        <div class="detail-item">
          <div class="item-title">联系方式：</div>
          <el-input v-model="detailObj.phone" placeholder="请输入联系方式"></el-input>
        </div>
        <div class="detail-item">
          <div class="item-title">问题状态：</div>
          <el-select v-model="detailObj.status" placeholder="请选择状态">
            <el-option label="未回答" value="0"></el-option>
            <el-option label="已回答" value="1"></el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeRevise">取 消</el-button>
        <el-button type="primary" @click="submitRevise">确 定</el-button>
      </span>
    </el-dialog>
    <pagination @toParent="getFromChildren"
                :cTotal="total" :cPageSize="pageSize" :cTableType="'appointment'"></pagination>
  </div>
</template>

<script>
import {deleteAppointmentById, findAllAppointment, findAppointmentById, updateAppointment} from "@/apis/appointment";
import Pagination from "@/components/Pagination1.vue";

export default {
  components: {Pagination},
  data() {
    return {
      appointArray: [],
      showDetail: false,
      dialogVisible: false,
      detailObj: {
        plantCrop: "",
        title: '',
        expertName: '',
        questioner: '',
        status: '',
        soilCondition: "",
        cropCondition: "",
        area: "",
        cropDetail: "",
        address: "",
        phone: "",
      },
      total: 0,//一共多少条
      pageSize: 5//一页显示的条数
    }
  },
  methods: {
    //获取子组件传递过来的数据
    getFromChildren(val){
      this.appointArray=val;
    },
    getData() {
      let params={
        currentPage:1,//当前页
        pageSize:this.pageSize
      }
      findAllAppointment(params).then(res => {
        if(res.code==200){
          this.appointArray=res.data
          this.total = res.pageData.total;
        }
      })
    },
    delAppoint(item) {
      deleteAppointmentById(item.id).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: res.message
          })
          this.getData()
        } else {
          this.$message({
            type: "success",
            message: res.message
          })
          this.getData()
        }
      })
    },
    handleDetail(item) {
      this.showDetail = true
      console.log("id", item.id)
      findAppointmentById(item.id).then(res => {
        if (res.code == 200) {
          this.detailObj = res.data
          console.log("this.detailObj", res.data)
        }
      })
    },
    detailClose() {
      this.showDetail = false
    },
    handleEdit(item) {
      this.dialogVisible = true
      this.detailObj = {...item}
    },
    closeRevise() {
      this.dialogVisible = false
    },
    submitRevise() {
      let params = {...this.detailObj}
      console.log("params", params)
      updateAppointment(params).then(res => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: res.message
          })
          this.dialogVisible = false
          this.getData()
        } else {
          this.$message({
            type: "error",
            message: res.message
          })
          this.dialogVisible = false
          this.getData()
        }
      })
    },
  },
  mounted() {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
.expert-appoint-container {
  width: 900px;
  min-height: 100%;
  // padding: 10px 20px;
  background: #fff;
  padding: 15px 0; /* 增加详情内容区上下边距，让整体更舒展 */

  .appoint-item {
    border: 1px solid #f2f2f2;
    border-radius: 6px;
    padding: 10px 20px;
    margin: 10px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .appoint-content {
      width: 650px;

      .title {
        font-weight: bold;
        font-size: 18px;
        line-height: 30px;
        height: 30px;
      }

      .content {
        line-height: 25px;
        height: auto;
        word-break: break-all;
      }

      .item-container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 12px;
        line-height: 20px;

        .item-content {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
        }

        .item-title {
          max-width: 100px;
        }
      }

      .marginR30 {
        margin-right: 30px;
      }

      .item-text {
        color: #666;
        max-width: 200px;
        /*超出的部分隐藏*/
        overflow: hidden;
        /*文字用省略号替代超出的部分*/
        text-overflow: ellipsis;
        /*弹性伸缩盒子模型显示*/
        display: -webkit-box;
        /*限制在一个块元素显示文本的行数*/
        -webkit-line-clamp: 1;
        /*设置或检索伸缩盒对象的子元素排列方式*/
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
    }

    .appoint-btn {
      display: flex;

      .btn-text {
        height: 25px;
        cursor: pointer;
        margin-right: 10px;
        color: #67C23A;

        &:hover {
          color: #035D1C;
          text-decoration: underline;
        }
      }
    }
  }

  .detail-content {
    max-height: 500px;
    height: auto;
    overflow-y: auto;
  }

  .detail-item {
    display: flex;
    line-height: 30px;
    margin-bottom: 20px; /* 增加行与行之间的间距（行间距） */
    align-items: center; /* 确保标签与输入框垂直居中对齐 */

    .item-content {
      line-height: 30px;
      height: auto;
      width: 480px;
      display: flex;
    }

    .item-title {
      width: 120px;
      height: 30px;
      font-weight: bold;
      color: #333;
      margin-right: 15px; /* 增加标签与输入框之间的距离 */
    }

    /* 调整输入框内边距，优化输入体验 */

    .el-input, .el-textarea, .el-select {
      .el-input__inner, .el-textarea__inner {
        padding: 8px 12px; /* 增加输入框内部留白 */
      }
    }
  }
}
</style>