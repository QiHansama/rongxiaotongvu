<template>
  <div class="changemessage">
    <div class="modify-text" @click="dialogFormVisible = true">修改</div>
    <el-dialog title="商品信息" :visible.sync="dialogFormVisible" class="modify-message">
      <el-form label-width="100px">
        <el-form-item label="商品图片" :label-width="formLabelWidth">
          <!-- 显示当前图片（绑定form.picture） -->
          <img :src="cupdateGoodInfo.picture" alt="商品图片" class="order-img"/>
          <el-upload
              class="orders-img_el_upload"
              :action="upurl"
              :headers="upLoadToken"
              :limit="3"
              list-type="picture-card"
              :on-change="handleChange"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              ref="upload"
          >
            <span class="orders-img_el_upload_btn" @click.stop="submitUpload">上传图片</span>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-form :model="cupdateGoodInfo">
        <el-form-item label="商品标题" :label-width="formLabelWidth">
          <el-input v-model="cupdateGoodInfo.title" autocomplete="off" class="title"></el-input>
        </el-form-item>
        <el-form-item label="商品内容" :label-width="formLabelWidth">
          <textarea v-model="cupdateGoodInfo.content" autocomplete="off" class="content"></textarea>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="formLabelWidth">
          <el-input v-model="cupdateGoodInfo.price" autocomplete="off" class="price"></el-input>
          元
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="success" @click.stop="changeMessageClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateOrder } from "@/apis/order";

export default {
  inject: ["reload"],
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      showBtnImg: true,
      noneBtnImg: false,
      limitCountImg: 3,
      upurl: "http://localhost:9003/order/upload", // 图片上传接口
      upLoadToken: {
        "token": window.localStorage.getItem("token") // 携带token
      },
      fileList: [], // 上传文件列表
      dialogFormVisible: false, // 弹窗显示状态
      formLabelWidth: "120px"
    };
  },
  props: {
    // 从父组件接收的原有信息（包含title、content、picture等）
    cupdateGoodInfo: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
  },
  methods: {
    // 图片上传失败处理
    handleError(err) {
      this.$message.error("图片上传失败，请重试");
      console.error("上传错误：", err);
    },
    // 图片上传成功：同步新图片路径到表单
    handleSuccess(res) {
      this.cupdateGoodInfo.picture = res.data; // 关键：将新图片路径更新到form
    },
    // 上传文件变化时处理
    handleChange(file, fileList) {
      this.noneBtnImg = fileList.length >= this.limitCountImg;
    },
    // 移除上传文件
    handleRemove(file, fileList) {
      this.noneBtnImg = fileList.length >= this.limitCountImg;
      this.fileList = fileList; // 同步文件列表
    },
    // 预览图片
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 手动触发上传
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 点击确定提交修改
    changeMessageClick() {
      const orderId = this.$store.state.changedOrderId;
      if (!orderId) {
        this.$message.error("数据异常，无法修改");
        return;
      }
      const params = {
        orderId: orderId, // 要修改的记录ID
        title: this.cupdateGoodInfo.title,
        content: this.cupdateGoodInfo.content,
        price: this.cupdateGoodInfo.price,
        picture: this.cupdateGoodInfo.picture
      }
      console.log("params",params)
      updateOrder(params).then(res => {
        console.log("res",res)
        if (res.code === 200) {
          this.$message.success("修改成功");
          this.dialogFormVisible = false; // 关闭弹窗
          // 通知父组件刷新列表（显示最新数据）
          this.$emit("update-success");
        } else {
          this.$message.error(res.message);
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.changemessage {
  .modify-text {
    height: 25px;
    cursor: pointer;
    margin-right: 10px;
    color: #67c23a;
    &:hover {
      color: #035d1c;
    }
  }
  .el-dialog {
    width: 600px;
    .order-img {
      width: 148px;
      height: 148px;
      border-radius: 6px;
      margin-bottom: 10px;
    }
    .orders-img_el_upload {
      height: 148px;
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409eff;
        }
        .el-upload__input {
          position: absolute;
          left: -1000px;
        }
      }
    }
    .title {
      width: 400px;
    }
    .content {
      width: 400px;
      height: 150px;
      resize: none;
      outline: none;
      line-height: 1.5;
      border: 1px solid #dcdfe6;
      padding: 5px;
    }
    .price {
      width: 100px;
    }
  }
}
</style>