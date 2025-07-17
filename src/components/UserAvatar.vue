<template>
  <div class="user-avatar">
    <img v-if="currentAvatar" :src="currentAvatar" class="avatar" alt="用户头像"/>
    <el-form label-width="100px">
      <el-upload
          class="user-avatar_el_upload"
          :action="upLoadURL"
          :headers="upLoadToken"
          :limit="1"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="doSuccess"
          :on-error="handleError"
          :file-list="fileList"
          ref="upload">
        <i class="el-icon-plus"></i>
        <span class="orders-img_el_upload_btn" @click.stop="submitUpload">添加图片</span>
      </el-upload>
      <span class="user-avatar_el_upload_btn" @click.stop="submitUpload">上传头像</span>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],
      upLoadURL: "http://localhost:9003/order/upload",
      upLoadToken: {"token": localStorage.getItem("token")}
    };
  },
  props: {
    cUserAvatar: {
      type: String,
      default: ""
    },
    userId: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    currentAvatar() {
      return localStorage.getItem(`user_avatar_${this.userId}`) || this.cUserAvatar;
    }
  },
  methods: {
    handleError(err) {
      this.$message.error("上传失败！");
      console.log(err);
    },
    doSuccess(res) {
      if (res.code === 200) {
        const newAvatar = res.data;
        // 先更新本地缓存和通知父组件
        this.$emit("update-avatar", newAvatar);
        localStorage.setItem(`user_avatar_${this.userId}`, newAvatar);
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handlePictureCardPreview(file) {
      // 修改这一行，避免使用可选链操作符
      this.dialogImageUrl = file.url || (file.response && file.response.data);
      this.dialogVisible = true;
    },
    handleRemove(file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid);
      this.$emit("update-avatar", "");
      localStorage.removeItem(`user_avatar_${this.userId}`);
    }
  }
};
</script>

<style lang="less" scoped>
.user-avatar {
  width: 1200px;
  height: 150px;

  .avatar {
    float: left;
    width: 148px;
    height: 148px;
    border-radius: 50%;
  }

  .user-avatar_el_upload {
    width: 1000px;
    float: left;
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

      .image-container img {
        position: absolute;
        top: 0px;
        right: 688px;
        z-index: 10;
      }
    }
  }
}
</style>