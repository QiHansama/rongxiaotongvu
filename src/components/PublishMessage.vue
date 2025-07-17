<template>
  <div class="publish-message">
    <el-form ref="form" :model="form" label-width="70px" style="margin-top:50px;">
      <el-form-item label="添加图片">
        <el-upload
            :action="upLoadURL"
            :headers="upLoadToken"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="doSuccess"
            :file-list="fileList"
        >
          <i class="el-icon-plus"></i>
          <span class="orders-img_el_upload_btn" @click.stop="submitUpload">添加图片</span>
          <hr/>
          <div class="image-container">
            <img :src="imageURL" style="width: 150px;height: 150px;">
          </div>

        </el-upload>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.title"  style="width:800px;" placeholder="添加标题"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input type="textarea"  style="width:800px;" v-model="form.content" placeholder="添加内容"></el-input>
      </el-form-item>
      <el-form-item label="定价">
        <el-input v-model="form.price" style="width:100px;"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="success"  @click="publishClick">发布信息</el-button>
  </div>
</template>

<script>
import { updateOrderInfo1, updateOrderInfoByNeeds} from "@/apis/order";
import UserAvatar from "@/components/UserAvatar.vue";

export default {
  name: "PublishMessage",
  components: {UserAvatar},
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      showBtnImg: true,
      noneBtnImg: false,
      limitCountImg: 3,
      fileList: [],
      upLoadURL:"http://localhost:9003/order/upload",
      imageURL:"",
      upLoadToken:{
        "token":window.localStorage.getItem("token")
      },
      form:{
        title: "",
        content: "",
        price: "",
        picture: this.imageURL,
      },
      user:{},
    };
  },
  props: {
    ctype: {
      type: String,
    },
  },
  computed: {

  },
  mounted() {
    //读取图片的路径 获取之前保存的图片路径
    let item = sessionStorage.getItem("url");
    this.imageURL =item;
    this.form.picture=item;
    // 从localStorage读取用户信息（含id）
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  },
  methods: {
    //发布
    publishClick() {
      if(this.ctype==="goods"){
        //点击按钮 发送请求
        //获取数据
        let params =this.form
        updateOrderInfo1(params).then(res=>{
          if (res.code==200){
            this.$message({
              type:"success",
              message:res.message
            })
            this.$router.push("/home/user/published" + this.ctype);
          }else {
            this.$message({
              type:"error",
              message:res.message
            })
          }
        })
      }else{
        let params =this.form
        updateOrderInfoByNeeds(params).then(res=>{
          if (res.code==200){
            this.$message({
              type:"success",
              message:res.message
            })
            this.$router.push("/home/user/published" + this.ctype);
          }else {
            this.$message({
              type:"error",
              message:res.message
            })
          }
        })
      }
    },
    //成功
    doSuccess(res,file,fileList){
      this.imageURL=res.data;
      console.log("imageURL",res.data)
      console.log("res",res)
     sessionStorage.setItem("picture",res.data)
      this.form.picture = res.data;
    },
    //选择图片
    submitUpload(){

    },
    //点击文件列表中已上传的文件的函数
    handlePictureCardPreview(file){
      //获取文件路径
    }
  }
};
</script>

<style lang="less" scoped>
.disUoloadSty .el-upload--picture-card {
  display: none; /* 上传按钮隐藏 */
}
.publish-message {
  width: 1100px;
  margin: 20px auto;
  padding: 10px 20px;
  position: relative; // 新增：设置相对定位，作为子元素绝对定位的参考
  // 图片容器样式
  .image-container {
    position: absolute; // 新增：绝对定位
    top: 0px;
    right: 690px;
    z-index: 10; // 确保在其他内容上方
  }
  .orders-img_el_upload {
    width: 1000px;
    float: left;
    height: 148px;
    .el-upload {
         //width: 50px;
         //height: 20px;
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
    width: 1100px;
    height: 60px;
    margin-top: 50px;
    font-size: 22px;
    outline: none;
    border: none;
    border-bottom: 1px solid black;
  }
  .content {
    font-size: 18px;
    width: 1200px;
    resize: none;
    outline: none;
    border: none;
    border-bottom: 1px solid black;
  }
  .price {
    font-size: 20px;
    .price-input {
      width: 100px;
      outline: none;
      border: none;
      margin: 0 20px;
    }
  }
  .el-button {
    width: 120px;
    height: 50px;
    margin-top: 20px;
    margin-left: 540px;
    font-size: 20px;
  }
}
</style>