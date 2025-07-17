<template>
  <div class="details-nav">
    <el-menu :default-active="$store.state.publishActiveIndex"
      mode="horizontal" @select="handleSelect">
      <el-menu-item v-show="this.$route.path === '/home/addMessage/publishgoods'" index="1" @click="PublishGoodsClick">发布商品</el-menu-item>
      <el-menu-item v-show="this.$route.path === '/home/addMessage/publishneeds'" index="2" @click="PublishNeedsClick">发布需求</el-menu-item>
      <el-menu-item v-show="this.$route.path === '/home/addMessage/publishknowledges'" index="3" @click="PublishKnowledgesClick" v-if="$store.getters.isExpert">发布知识</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleSelect(key, keyPath) {},
    PublishGoodsClick() {
      this.$router.push("/home/addMessage/publishgoods").catch((err) => err);
    },
    PublishNeedsClick() {
      this.$router.push("/home/addMessage/publishneeds").catch((err) => err);
    },
    PublishKnowledgesClick() {
      this.$router
        .push("/home/addMessage/publishknowledges")
        .catch((err) => err);
    },
  },
  created() {
    this.$store.commit("updatePublishActiveIndex", "1");
    console.log('=== this.$route',this.$route)
  },
};
</script>

<style lang="less" scoped>
.details-nav {
  width: 1100px;
  margin: 0 auto;
  background: #fff;
  min-height: 100%;
  .el-menu-demo {
    height: 80px;

    .el-menu-item {
      line-height: 80px;
      height: 80px;
      font-size: 16px;
    }
  }
}
</style>