<template>
  <div class="launch-contain">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="选项A">
        <el-input v-model="form.optionA" placeholder="请输A选项"></el-input>
      </el-form-item>
      <el-form-item label="选项B">
        <el-input v-model="form.optionB" placeholder="请输B选项"></el-input>
      </el-form-item>
      <el-form-item label="选项C">
        <el-input v-model="form.optionC" placeholder="请输C选项"></el-input>
      </el-form-item>
     <!--  <el-form-item label="最大下注值">
        <el-input v-model="form.maxBet" placeholder="请输C选项"></el-input>
      </el-form-item>
      <el-form-item label="最小下注值">
        <el-input v-model="form.minBet" placeholder="请输C选项"></el-input>
      </el-form-item>
      <el-form-item label="货币">
        <el-input v-model="form.tradeCoin" placeholder="请输C选项"></el-input>
      </el-form-item> -->
       <el-form-item label="结束时间" >
             <el-date-picker v-model="form.projectEndTime" type="datetime" placeholder="选择日期时间">
             </el-date-picker>
          </el-form-item>
      <el-form-item label="关键词">
        <el-select v-model="form.tag" placeholder="请选择关键词">
          <el-option label="金融" value="finance"></el-option>
          <el-option label="体育" value="pe"></el-option>
          <el-option label="区块链" value="entertainment"></el-option>
          <el-option label="其他" value="other"></el-option>
          <el-option label="最强大脑" value="brain"></el-option>
          <el-option label="最强大脑已结束" value="overbrain"></el-option>
          <el-option label="胜负平" value="sfp"></el-option>
          <el-option label="比分" value="bifen"></el-option>
          <el-option label="进球数" value="jqs"></el-option>
          <el-option label="半全场" value="bqc"></el-option>
          <el-option label="世界杯已结束" value="over"></el-option>
          <el-option label="世界杯其他" value="otherworld"></el-option>
          <el-option label="世界杯热门" value="remenworld"></el-option>
           <!--  <el-option label="我的" value="mine"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="buttonLoading">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { savePro } from '../../api/manager.js'
var qs=require("qs");
export default {
  data() {
      return {
        form: {
          title:'',
          optionA:'',
          optionB:'',
          optionC:'',
          tag:'',
          projectEndTime:''
        },
        buttonLoading:false
      }
   },
   methods: {
     onSubmit() {
      this.buttonLoading = true;
      var params = this.form;
      // params.projectEndTime="2018-05-11T11:12:14.409Z";
       savePro(params).then(response => {
         this.form.title = '';
         this.form.optionA = '';
         this.form.optionB = '';
         this.form.optionC = '';
         this.form.tag = '';
         this.form.projectEndTime = '';
         this.buttonLoading = false;
         this.$message({
          message: '提交成功',
          type: 'success'
        });
       })
     }
   }
  }
</script>
<style lang="scss">
  .launch-contain{
    .el-input__inner{
      width:500px;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.from-inline{
  width:80%;
  .el-input__inner{
    width:200px;
  }
}
</style>