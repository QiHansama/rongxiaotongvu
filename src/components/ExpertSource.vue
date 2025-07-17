<template>
  <div class="expert-container">
    <!-- 搜索框 -->
    <div class="search-bar">
      <el-input
          v-model="searchInput"
          placeholder="请输入专家姓名、专业或单位搜索"
          maxlength="50"
          clearable
          style="width: 300px"
          @keyup.enter.native="handleSearch"
      ></el-input>
      <img
          src="../assets/img/search.png"
          @click="handleSearch"
          class="search-icon"
          alt="搜索"
      >
    </div>

    <!-- 专家列表 -->
    <div
        class="expert-item"
        v-for="(expert, index) in cgoods"
        :key="expert.uid"
        :style="index < cgoods.length - 1 ? 'border-bottom: 1px solid #f5f5f5' : ''"
    >
      <div class="expert-info">
        <p class="info-row">
          <span class="label">姓名：</span>
          <span class="value">{{ expert.realName || '未填写' }}</span>
          <span class="label ml-20">职称：</span>
          <span class="value">{{ expert.position || '无' }}</span>
        </p>
        <p class="info-row">
          <span class="label">专业：</span>
          <span class="value">{{ expert.profession || '未填写' }}</span>
          <span class="label ml-20">电话：</span>
          <span class="value">{{ formatPhone(expert.phone) }}</span>
        </p>
        <p class="info-row">
          <span class="label">单位：</span>
          <span class="value">{{ expert.belong || '未填写' }}</span>
        </p>
      </div>

      <div class="action-buttons">
        <button class="btn question-btn" @click="handleQuestion(expert)">
          向我提问
        </button>
        <button class="btn appoint-btn" @click="handleAppoint(expert)">
          线下预约
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExpertSource",
  props: {
    cgoods: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchInput: ""
    };
  },
  methods: {
    handleSearch() {
      this.$emit("handleSearch", this.searchInput);
    },
    formatPhone(phone) {
      if (!phone) return "未填写";
      return phone.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1****$3");
    },
    handleQuestion(expert) {
      this.$router.push(`/home/question?id=${expert.userName}`).catch(err => err);
    },
    handleAppoint(expert) {
      this.$router.push(`/home/appointment?id=${expert.userName}`).catch(err => err);
    }
  }
};
</script>

<style lang="less" scoped>
.search-bar {
  text-align: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;

  .search-icon {
    width: 24px;
    height: 24px;
    margin-left: 8px;
    cursor: pointer;
    vertical-align: middle;
  }

  /deep/ .el-input__inner {
    height: 36px;
    padding: 0 15px;
  }
}

.expert-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  min-height: 100px;
}

.expert-info {
  flex: 1;

  .info-row {
    margin: 8px 0;
    line-height: 20px;
  }

  .label {
    color: #666;
    font-size: 14px;
  }

  .value {
    color: #333;
    font-size: 14px;
  }

  .ml-20 {
    margin-left: 20px;
  }
}

.action-buttons {
  margin-left: 20px;

  .btn {
    padding: 6px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &.question-btn {
      background: #f0f9ea;
      color: #67c23a;
      margin-right: 10px;
    }

    &.appoint-btn {
      background: #ecf5ff;
      color: #409eff;
    }
  }
}
</style>