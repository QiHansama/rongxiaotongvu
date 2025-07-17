<template>
  <div class="goods-box5">
    <div v-if="loading" class="loading">加载中...</div>

    <div v-if="!loading && goods.length === 0" class="empty">暂无银行数据</div>

    <div
        class="goods"
        v-for="item in goods"
        :key="item.id"
        @click="DetailBtn(item)"
    >
      <!-- 图片路径拼接 + 错误处理 -->
      <img
          class="imgs"
          :src="getBankImg(item.id)"
      alt="银行图标"
      @error="handleImgError($event, item)"
      />
    </div>
  </div>
</template>

<script>
import {getBankList} from "@/apis/bank";

export default {
  data() {
    return {
      goods: [],
      loading: false,
      defaultImg: require('../assets/img/wutu.gif')  // 提前加载默认图
    };
  },
  mounted() {
    this.fetchBankData();
  },
  methods: {
    async fetchBankData() {
      this.loading = true;
      try {
        const res = await getBankList();
        if (res.code === 200) {
          this.goods = res.data;
        } else {
          this.$message.error(res.message || '获取银行数据失败');
        }
      } catch (err) {
        console.error('请求失败', err);
        this.$message.error('网络错误');
      } finally {
        this.loading = false;
      }
    },

    // 单独函数处理图片路径，便于调试
    getBankImg(bankId) {
      try {
        // 尝试加载对应id的图片（路径必须严格匹配）
        return require(`../assets/img/bank${bankId}.jpg`);
      } catch (err) {
        // 路径错误时直接返回默认图
        console.warn(`图片bank${bankId}.jpg不存在，使用默认图`);
        return this.defaultImg;
      }
    },

    // 图片加载失败时强制显示默认图
    handleImgError(event, item) {
      const img = event.target;
      // 替换为默认图（防止无限循环，需设置onerror=null）
      img.src = this.defaultImg;
      img.onerror = null;  // 避免默认图也加载失败时无限触发error事件
      console.log(`图片bank${item.id}.jpg加载失败，已替换为默认图`);
    },

    DetailBtn(item) {
      localStorage.setItem('financeObj', JSON.stringify(item));
      this.$router.push(`/home/financingDetails?bankId=${item.id}`);
    }
  }
};
</script>

<style lang="less" scoped>
/* 样式保持不变 */
.goods-box5 {
  background-color: #f9f9f9;
  width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  .goods {
    width: 200px;
    height: 180px;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);
    margin-top: 20px;
    margin-right: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .imgs {
      width: 150px;
      height: 140px;
      margin-right: 10px;
      border-radius: 6px;
      object-fit: contain; /* 确保图片完整显示，不变形 */
    }
  }
}
</style>