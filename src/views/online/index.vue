<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="项目列表" name="first">
       <router-link to="/online/managelist">hahah </router-link>
       <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="项目发起" name="second">
        <router-link to="/online/launch"></router-link>
      </el-tab-pane>
      <el-tab-pane label="项目上线" name="third">
        <router-link to="/online/online"></router-link>
      </el-tab-pane>
      <el-tab-pane label="项目结果" name="fourth">
          <router-link to="/online/result"></router-link>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import manageList from "../online/manageList.vue";
import launch from "../online/launch.vue";
import online from "../online/online.vue";
import result from "../online/result.vue";
import { getManageList } from '../../api/manager.js'
export default {
    data() {
      return {
        activeName: 'first',
        // online:"aaa",
        tag:'',
        list:[]
      };
    },
    components: {
      manageList,
      launch,
      online,
      result
    },
    methods: {
       fetch(){
        var params = {
          type:this.tag,
        }
        getManageList(params).then(response =>{
          this.list = response.body.result;
        })
      },
      handleClick(tab, event) {
        alert(typeof tab.index);
        // switch (tab.index) {
        //   case "0":
        //     this.$router.push('/online/managelist')
        //     break;
        //   case "1":
        //     this.$router.push('/online/managelist')
        //     break;
        //   case "2":
        //     this.$router.push('/online/managelist')
        //     break;
        //   case "3":
        //     this.$router.push('/online/managelist')
        //   default:
        //     alert('请联系王力宏')
        //     break;
        //   }
        }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
