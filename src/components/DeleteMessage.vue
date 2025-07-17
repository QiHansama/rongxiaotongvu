<template>
  <div class="delete-message">
    <div class="delete-text" @click="dialogVisible = true">删除</div>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确认删除该商品？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="success" @click="deleteMessageClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {deleteOrder} from "@/apis/order";

export default {
  inject: ["reload"],
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    deleteMessageClick() {
      deleteOrder(this.$store.state.changedOrderId).then(res=>{
        if(res.code==200){
          this.$message({
            type:"success",
            message:res.message
          })
          this.$emit('delete-success');
        }else {

          this.$message({
            type:"success",
            message:res.message
          })
        }
        this.dialogVisible = false;
      })
    },
  },
};
</script>

<style lang="less" scoped>
.delete-message {
  .delete-text {
    height: 25px;
    cursor: pointer;
    color: #67C23A;
    &:hover{
      color: #035D1C;
    }
  }
}
</style>