<template>
  <div class="contain">
   <el-form :inline="true" :model="formInline" class="from-inline">
    <el-form-item label="项目时间">
      <el-date-picker
      v-model="formInline.datePicker"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="">
      <el-select v-model="formInline.state" placeholder="请选择状态">
        <el-option label="全部" value="0"></el-option>
        <el-option label="进行中" value="online"></el-option>
        <el-option label="停止下注" value="complete"></el-option>
        <el-option label="已下注" value=" wait_result "></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="">
        <el-select v-model="formInline.currency" placeholder="请选择货币">
          <el-option label="GXS" value="0"></el-option>
          <el-option label="ETH" value="1"></el-option>
          <el-option label="BTH" value="2"></el-option>
          <el-option label="WLH" value="3"></el-option>
        </el-select>
    </el-form-item>
      <el-form-item label="">
        <el-input v-model="formInline.title" placeholder="请输入标题"></el-input>
      </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit()">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="list" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" border @row-dblclick="dblclickOnRow">
    <el-table-column prop="title" label="标题" sortable width="180">
      <template slot-scope="scope">
        {{scope.row.title}}
      </template>
    </el-table-column>
    <el-table-column prop="date" label="项目状态" sortable width="180">
      <template slot-scope="scope">
        {{scope.row.status | changStatus}}
      </template>
    </el-table-column>
     <el-table-column prop="betStartTime" label="开始时间" sortable width="180">
      <template slot-scope="scope">
        {{scope.row.betStartTime | changeTime}}
      </template>
    </el-table-column>
     <el-table-column prop="betEndTime" label="结束时间" sortable width="180">
      <template slot-scope="scope">
        {{scope.row.betEndTime | changeTime}}
      </template>
    </el-table-column>
     <el-table-column prop="title" label="项目结果" sortable width="180">
      <template slot-scope="scope">
        {{scope.row.result}}
      </template>
    </el-table-column>
     <el-table-column prop="ratio" label="收益倍数" sortable width="180">
      <template slot-scope="scope">
        {{scope.row.ratio}}
      </template>
    </el-table-column>
     <el-table-column prop="capitalPool" label="项目资金池" sortable width="180">
      <template slot-scope="scope">
        {{scope.row.capitalPool}}
      </template>
    </el-table-column>
     <el-table-column prop="tradeCoin" label="结算货币" sortable width="180">
      <template slot-scope="scope">
        {{scope.row.tradeCoin}}
      </template>
    </el-table-column>
     <el-table-column  label="项目抽成" sortable width="180">
      <template slot-scope="scope">
        5%
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @current-change="handleCurrentChange" :current-page="pageNum"
    :page-sizes="[15]"
    :page-size="per_page"
    layout="total, sizes, prev, pager, next, jumper"
    :total='total'>
  </el-pagination>
  </div>
</template>
<script>
  import { getManageList } from '../../api/manager.js'
  import { timestampToTime,OrderStatus,getNameById } from '../../utils/enum.js'
  export default {
    props: {
      dataProp: {
        demo: String
      }
    },
    data() {
      return {
        formInline: {
          datePicker:'',
          status:"",
          title:'',
          currency:'',
        },
        pageNum:1,
        list:[],
        per_page:1,
        total:1
      }
    },
    created() {
      this.fetch();
      // alert(this.demo)
    },
    filters: {
      changeTime(value){
        return timestampToTime(value)
      },
      changStatus(value){
        return getNameById(OrderStatus,value)
      }
    },
    methods: {
      fetch(){
        var params = {
          tradeCoin:this.formInline.tradeCoin,
          title:this.formInline.title,
          page:this.pageNum,
          type:'index',
          // status:'online'
          status:this.formInline.state
        }
        if(this.formInline.datePicker != null && this.formInline.datePicker.length > 1){
          params.betStartTime = parseTime(this.searchObj.dateRange[0],'{y}-{m}-{d}')
          params.betEndTime = parseTime(this.searchObj.dateRange[1],'{y}-{m}-{d}')
        } else {
          params.betStartTime = ''
          params.betStartTime = ''
        }

        getManageList(params).then(response =>{
          this.list = response.body.result;

        })
      },
      handleCurrentChange(val){ 
        this.pageNum = val;
        this.fetchData();
      },
      dblclickOnRow(row){
        this.$router.push({
          name:'detail',
          params:{
            id:row.id
          }
        })
      },
      onSubmit() {
        this.fetch();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .contain{
     width:90%;
     margin:10px auto;
    .from-inline{
      margin:10px 0;
      border-bottom:1px solid #ccc;
    }
  }
</style>