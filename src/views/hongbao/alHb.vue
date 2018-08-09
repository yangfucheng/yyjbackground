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
        <el-option label="全部" value=""></el-option>
        <el-option label="待上线" value="wait_online"></el-option>
        <el-option label="已上线" value="online"></el-option>
        <el-option label="等待结果" value="wait_result"></el-option>
        <el-option label="已结束" value="complete"></el-option>
        <el-option label="已作废" value="cancel"></el-option>
        <el-option label="待投票上线" value="check"></el-option>
        <el-option label="审核拒绝" value="refuse"></el-option>
        <el-option label="投票中" value="vote"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="">
        <el-select v-model="formInline.currency" placeholder="请选择货币">
          <el-option label="BTC" value="BTC"></el-option>
          <el-option label="ETH" value="ETH"></el-option>
          <el-option label="GXS" value="GXS"></el-option>
          <el-option label="PPS" value="PPS"></el-option>
          <el-option label="ACT" value="ACT"></el-option>
          <el-option label="BCDN" value="BCDN"></el-option>
          <el-option label="CANDY" value="CANDY"></el-option>
          <el-option label="KCASH" value="KCASH"></el-option>
          <el-option label="MAG" value="MAG"></el-option>
          <el-option label="MDS" value="MDS"></el-option>
          <el-option label="NULS" value="NULS"></el-option>
          <el-option label="STC" value="STC"></el-option>
          <el-option label="UIP" value="UIP"></el-option>
          <el-option label="XAS" value="XAS"></el-option>
        </el-select>
    </el-form-item>
      <el-form-item label="">
        <el-input v-model="formInline.title" placeholder="请输入标题"></el-input>
      </el-form-item>
    <el-form-item>
    </el-form-item>
  </el-form>
  <el-table :data="list"   v-loading="loading2">
        <el-table-column prop="id" label="红包编号">
        </el-table-column>
        <el-table-column prop="title" label="话题标题">
        </el-table-column>
        <el-table-column prop="inUse" label="页面显示">
            <template slot-scope="scope">
                {{scope.row.inUse | changStatus}}
            </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间">
             <template slot-scope="scope">
                {{scope.row.startTime | changeTime}}
            </template>
        </el-table-column>
        <el-table-column prop="amount" label="红包奖励">
        </el-table-column>
        <el-table-column prop="inUse" label="是否上架">
                <template slot-scope="scope">
                {{scope.row.inUse | changStatus1}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
            <template scope="scope">
                <el-button size="small"  type="text" @click="edit(scope.row)">编辑</el-button>
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
  import { hbModelList} from '../../api/manager.js'
  import { timestampToTime,OrderStatus,getNameById } from '../../utils/enum.js'
  var qs=require("qs");
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
          state:"",
          title:'',
          currency:'',
        },
        pageNum:1,
        dialogFormVisible:false,
        dialogFormVisible1:false,
        update:0,
        list:[],
        per_page:1,
        total:1,
        type:'',
        projectId:'',
        title:'',
        beforeReson:'',
        formLabelWidth:"120",
        form:[]
      }
    },
    created() {
      this.fetch();
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
          tradeCoin:this.formInline.currency,
          title:this.formInline.title,
          pageNo:this.pageNum,
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

        hbModelList(params).then(response =>{
          this.list = response.body.result;
          this.total =response.body.totalCount;
        })
      },
      handleCurrentChange(val){ 
        this.pageNum = val;
        this.fetch();
      },
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