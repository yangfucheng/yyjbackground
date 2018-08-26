<template>
  <div class="contain">
       <el-form :inline="true" :model="formInline" class="from-inline">
          <el-form-item >
            <el-date-picker
            v-model="formInline.datePicker"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search()"  v-loading="fullscreenLoading">查询</el-button>
          </el-form-item>
        </el-form>
    <div class="yuce">
      <p>预测市场:</p>
      <ul>
        <li>
            <p>预测下注量(GXS)</p>
            <p>{{yuceObj.forecastGXS || '-'}}</p>
            <p>max:{{yuceObj.maxGXS || '-'}}</p>
        </li>
        <li>
            <p>预测下注量(PPS)</p>
            <p>{{yuceObj.forecastPPS || '-'}}</p>
             <p>max:{{yuceObj.maxPPS || '-'}}</p>
        </li>
        <li>
            <p>预测收益(GXS)</p>
            <p>{{yuceObj.profitGXS || '-'}}</p>
        </li>
        <li>
            <p>预测收益(PPS)</p>
            <p>{{yuceObj.profitPPS || '-'}}</p>
        </li>
        <li>
            <p>参与人次</p>
            <p>{{yuceObj.joinPeople || '-'}}</p>
        </li>
        <li>
            <p>预测话题数</p>
            <p>{{yuceObj.forecastTopic || '-'}}</p>
        </li>
        <li>
            <p>网红话题发起/上线</p>
            <p>{{yuceObj.redTopic || '-'}}</p>
        </li>
        <li>
            <p>网红数</p>
            <p>{{yuceObj.redNum || '-'}}</p>
        </li>
        <li>
            <p>网红累计收益(PPS)</p>
            <p>{{yuceObj.redProfitPPS || '-'}}</p>
            <p>max:{{yuceObj.redMaxProfit || '-'}}</p>
        </li><li>
            <p>用户投票收益(PPS)</p>
            <p>{{yuceObj.userProfitPPS || '-'}}</p>
        </li>
        <li>
            <p>参与人数</p>
            <p>{{yuceObj.joinPeopleNum || '-'}}</p>
        </li>
        <li>
            <p>预测准确率</p>
            <p>{{yuceObj.precision || '-'}}</p>
        </li>
      </ul>
    </div>
    <div class="pk">
      <p>预测PK:</p>
      <ul>
        <li>
            <p>预测PK下注量(GXS)</p>
            <p>{{pkObj.forecastPKGXS || '-'}}</p>
        </li>
        <li>
            <p>预测PK下注量(PPS)</p>
            <p>{{pkObj.forecastPKPPS || '-'}}</p>
        </li>
        <li>
            <p>预测收益(GXS)</p>
            <p>{{pkObj.pkForecastGXS || '-'}}</p>
        </li>
        <li>
            <p>预测收益(PPS)</p>
            <p>{{pkObj.pkForecastPPS || '-'}}</p>
        </li>
        <li>
            <p>参与人次</p>
            <p>{{pkObj.pkJoinPeople || '-'}}</p>
        </li>
        <li>
            <p>参与人数(GXS)</p>
            <p>{{pkObj.pkJoinPeopleNum}}</p>
        </li>
      </ul>
    </div>
    <div class="user">
       <p>用户模块:</p>
        <ul>
          <li>
              <p>登录用户</p>
              <p>{{userObj.loginUser}}</p>
          </li>
           <li>
              <p>新用户</p>
              <p>{{userObj.newUser}}</p>
          </li>
           <li>
              <p>用户数</p>
              <p>{{userObj.userNum}}</p>
          </li>
        </ul>
    </div>
  </div>
</template>
<script>
import {weekData} from '../../api/manager.js'
 export default {
    props: {
      dataProp: {
        demo: String
      }
    },
    data() {
      return {
        formInline:{
          datePicker:[],
        },
        yuceObj:{},
        pkObj:{},
        userObj:{},
        startTime:'',
        endTime:'',
         fullscreenLoading: false
      }
    },
    created () {
      this.fetch();
    },
    methods: {
      search(){
        this.fetch();
      },
      fetch(){
        this.fullscreenLoading = true;
        var myDate = new Date();
        this.startTime = this.formInline.datePicker[0];
        this.endTime = this.formInline.datePicker[1];
        this.startTime = this.timestampToTime(this.startTime);
        this.endTime = this.timestampToTime(this.endTime);
        var params = {
          startTime:this.startTime,
          endTime:this.endTime
        }
        weekData(params).then(res=>{
          this.fullscreenLoading = false;
          this.yuceObj = res.body.forecastBazaar;
          this.pkObj = res.body.forecastPK;
          this.userObj = res.body.userModel;
          
        })
      },
      timestampToTime(timestamp) {
        if(timestamp){
              var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
              var Y = date.getFullYear() + '-';
              var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
              var D = date.getDate() + ' ';
              var h = date.getHours() + ':';
              var m = date.getMinutes() + ':';
              var s = date.getSeconds();
              return Y+M+D+h+m+s;
          }else{
            return ''
          }
      }
    }
 }
</script>
<style lang="scss" scoped>
  .contain {
    position: fixed;
    top: 50px;
    height: 120%;
    width: 100%;
    overflow: auto;
    color: #FFF;
    background: rgb(52, 56, 73);
    .search{
      background: #FFF;
      margin-top: 20px;
    }
    ul{
      display: flex;
      flex-wrap: wrap;
      width: 1100px;
    }
    li{
      padding: 10px;
      background: rgb(41, 55, 48);
      display: inline-block;
      color: #FFF;
      margin-right: 5px;
      margin-top: 10px;
      text-align: center;
      min-width: 150px;
    }
  }

</style>