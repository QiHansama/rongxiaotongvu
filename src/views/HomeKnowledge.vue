<template>
  <div class="home-konwledges">
    <knowledge :cknowledges="knowledges"></knowledge>
    <pagination
        @toParent="getFromchildren" :cPage="pages" :cTotal="total" :cPageSize="pageSize"
    ></pagination>
  </div>

</template>

<script>

import Knowledge from "../components/Knowledge.vue";
import Pagination from "../components/Pagination.vue";
import {findAll} from "@/apis/knowledge";
export default {
  data() {
    return {
      knowledges: [],
      total:0,// 一共多少条
      pageSize:10 ,// 一页显示的条数,
      pages :0
    };
  },

  methods: {
    getFromchildren(val){
      this.goods = val
    },
    getFindAll(){
      findAll().then(res=>{
        if(res.code===200){
          this.knowledges=res.data
        }else {
          this.$message({
            type:"error",
            message:res.message
          })
        }
      })
    }
  },
  mounted() {
    this.getFindAll()
  },
  components: { Knowledge, Pagination },
};
</script>

<style>
</style>
<script setup>
</script>
