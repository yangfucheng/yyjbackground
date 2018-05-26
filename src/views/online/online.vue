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
    <el-table :data="list" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" border>
      <el-table-column prop="title" label="标题" sortable width="180">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
       <el-table-column prop="voteEndTime" label="项目发起放" sortable width="180">
        <template slot-scope="scope">
          {{scope.row.initiatorRole}}
        </template>
      </el-table-column>
       </el-table-column>
       <el-table-column prop="voteEndTime" label="投票结束时间" sortable width="180">
        <template slot-scope="scope">
          {{scope.row.voteEndTime | changeTime}}
        </template>
      </el-table-column>
       <el-table-column prop="result" label="投票结果" sortable width="180">
        <template slot-scope="scope">
          {{scope.row.result }}
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="120">
      <template slot-scope="scope">
        <el-button @click.native.prevent="onlineCheck(scope.row)" type="text" size="small">
          上线审核
        </el-button>

        <el-button @click.native.prevent="" type="text" size="small">
          详情
        </el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page="pageNum"
      :page-sizes="[15]"
      :page-size="per_page"
      layout="total, sizes, prev, pager, next, jumper"
      :total='total'>
    </el-pagination>
    <div class="dialog">
      <el-dialog title="上线审核" :visible.sync="dialogFormVisible">
        <el-form :model="dialogForm">
          
          <el-form-item label="交易代币" :label-width="formLabelWidth">
            <el-select v-model="dialogForm.tradeCoin" placeholder="请选择交易代币">
              <el-option label="GXS" value="GXS"></el-option>
              <el-option label="PPS" value="PPS"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投注上限" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.maxBet" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="投注下限" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.minBet" auto-complete="off"></el-input>
          </el-form-item>
           <el-form-item label="初始资金比" :label-width="formLabelWidth">
            A:<el-input v-model="dialogForm.initialAmountA" auto-complete="off" style="width:100px"></el-input>
            B:<el-input v-model="dialogForm.initialAmountB" auto-complete="off" style="width:100px"></el-input>
            C:<el-input v-model="dialogForm.initialAmountC" auto-complete="off" style="width:100px"></el-input>
          </el-form-item>
           <el-form-item label="项目抽成" :label-width="formLabelWidth">
            投票者:<el-input v-model="dialogForm.awardRatioVoter" auto-complete="off" style="width:100px"></el-input>
            开发者:<el-input v-model="dialogForm.awardRatioInitiator" auto-complete="off" style="width:100px"></el-input>
            平台者:<el-input v-model="dialogForm.awardRatioPlatfrom" auto-complete="off" style="width:100px"></el-input>
          </el-form-item>
          <el-form-item label="截止时间" :label-width="formLabelWidth">
             <el-date-picker v-model="dialogForm.betEndTime" type="datetime" placeholder="选择日期时间">
             </el-date-picker>
          </el-form-item>
           <el-form-item label="评论区设置" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="dialogForm.notice"></el-input>
          </el-form-item>
          <el-form-item label="数据来源" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.resultUrl" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit" >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { getManageList,online } from '../../api/manager.js'
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
        form:{

        },
        id:'',
        dialogForm:{
          tradeCoin:'',
          maxBet:'',
          minBet:'',
          initialAmountA:'',
          initialAmountB:'',
          initialAmountC:'',
          awardRatioInitiator:'',
          awardRatioPlatfrom:'',
          awardRatioVoter:'',
          betEndTime:'',
          notice:'',
          resultUrl:''
        },
        dialogFormVisible:false,
        pageNum:1,
        list:[],
        per_page:1,
        total:1,
        formLabelWidth:'100px',
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
        return getNameById(OrderStatus)
      }
    },
    methods: {
      fetch(){
        var params = {
          tradeCoin:this.formInline.tradeCoin,
          title:this.formInline.title,
          page:this.pageNum,
          type:'wait_online',
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
      onlineCheck(row){
        this.id =row.id;
        this.dialogFormVisible=true;
      },
      onSubmit() {
        var params = this.dialogForm;
        params.projectId =this.id;
        online(params).then(response=>{
          this.fetch();
          this.$message({
          message: '审核通过',
          type: 'success'
        });
          this.dialogFormVisible = false;
        })
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
    .dialog{

    }
  }
</style>