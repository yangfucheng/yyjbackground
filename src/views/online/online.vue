<template>
  <div class="contain">
     <el-form :inline="true" :model="formInline" class="from-inline">
      <!-- <el-form-item label="项目时间">
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
          <el-option label="进行中" value="online"></el-option>
          <el-option label="停止下注" value="complete"></el-option>
          <el-option label="已下注" value=" wait_result "></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="">
          <el-select v-model="formInline.currency" placeholder="请选择货币">
            <el-option label="GXS" value="GXS"></el-option>
            <el-option label="ETH" value="ETH"></el-option>
            <el-option label="BTH" value="BTH"></el-option>
            <el-option label="BTC" value="BTC"></el-option>
          </el-select>
      </el-form-item> -->
        <el-form-item label="">
          <el-input v-model="formInline.title" placeholder="请输入标题"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" border @row-dblclick="dblclickOnRow">
      <el-table-column prop="title" label="标题" sortable width="180">
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
       <el-table-column prop="initiatorRole" label="项目发起方" sortable width="180">
        <template slot-scope="scope">
          {{scope.row.initiatorRole}}
        </template>
      </el-table-column>
        <el-table-column prop="options" label="选项"  >
           <template slot-scope="scope" >
          <div v-for="x in scope.row.options">{{x.optionKey}}:{{x.optionValue}}</div>
          </template>
       </el-table-column>
       <el-table-column prop="voteEndTime" label="投票结束时间" sortable width="180">
        <template slot-scope="scope">
          {{scope.row.voteEndTime | changeTime}}
        </template>
      </el-table-column>
       <!-- <el-table-column prop="result" label="投票结果" sortable width="180">
        <template slot-scope="scope">
          {{scope.row.result }}
        </template>
             </el-table-column> -->
      <el-table-column label="操作"  width="120">
      <template slot-scope="scope">
        <el-button @click.native.prevent="onlineCheck(scope.row)" type="text" size="small">
          上线审核
        </el-button>

        <!-- <el-button @click.native.prevent="" type="text" size="small">
          详情
        </el-button> -->
         <el-button @click.native.prevent="befor(scope.row,'项目作废','3')" type="text" size="small" v-show="scope.row.status!='complete' && scope.row.status!='cancel'">
          项目作废
        </el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page="pageNum"
      :page-sizes="[20]"
      :page-size="per_page"
      layout="total, sizes, prev, pager, next, jumper"
      :total='total'>
    </el-pagination>
    <div class="dialog">
      <el-dialog title="上线审核" :visible.sync="dialogFormVisible">
        <el-form :model="dialogForm"  ref='form'>
          <el-form-item label="交易代币" :label-width="formLabelWidth">
            <el-select v-model="dialogForm.tradeCoin" placeholder="请选择交易代币" @change='changeCoin'>
              <el-option label="BTC" value="BTC"></el-option>
              <el-option label="GXS" value="GXS"></el-option>
              <el-option label="PPS" value="PPS"></el-option>
              <el-option label="ACT" value="ACT"></el-option>
              <el-option label="ATM" value="ATM"></el-option>
              <el-option label="BCDN" value="BCDN"></el-option>
              <el-option label="BIG" value="BIG"></el-option>
              <el-option label="CANDY" value="CANDY"></el-option>
              <el-option label="CRE" value="CRE"></el-option>
              <el-option label="EKT" value="EKT"></el-option>
              <el-option label="KCASH" value="KCASH"></el-option>
              <el-option label="MAG" value="MAG"></el-option>
              <el-option label="MDS" value="MDS"></el-option>
              <el-option label="NULS" value="NULS"></el-option>
              <el-option label="STC" value="STC"></el-option>
              <el-option label="SWTC" value="SWTC"></el-option>
              <el-option label="UIP" value="UIP"></el-option>
              <el-option label="XAS" value="XAS"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投注上限份数" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.maxBet" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="投注单价" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.minBet" auto-complete="off"></el-input>
          </el-form-item>
           <el-form-item label="初始资金比" :label-width="formLabelWidth">
             <el-form-item
                v-for="(domain, index) in dialogForm.options"
                :label="'选项' + optionArray[index]"
                :key="index"
                :prop="'options.' + index + '.onlineInitial'"
              >
            <el-input v-model="domain.onlineInitial"></el-input>
            </el-form-item>
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
          <el-form-item label="项目总金额" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.totalNum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="个人总金额" :label-width="formLabelWidth">
            <el-input v-model="dialogForm.personNum" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="onSubmit" >确 定</el-button>
        </div>

      </el-dialog>
    </div>

     <el-dialog title="项目作废" :visible.sync="dialogFormVisible2">
    <el-form >
      <el-form-item label="项目作废原因" :label-width="formLabelWidth">
        <el-input v-model="beforeReson" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible2 = false">取 消</el-button>
      <el-button type="primary" @click="submit1">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
  import { getManageList,online,updateWeight,cancel,breakShort } from '../../api/manager.js'
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
          status:"",
          title:'',
          currency:'',
        },
        form:{

        },
        id:'',
        dialogForm:{
          tradeCoin:'',
          maxBet:'1000000',
          minBet:'',
          totalNum:'0',
          personNum:'0',
          options:[
            {
              onlineInitial:'',
              optionKey:'A'
            }
          ],
          awardRatioInitiator:'0',
          awardRatioPlatfrom:'10',
          awardRatioVoter:'0',
          betEndTime:'',
        },
        optionArray:["A","B","C","D","E","F","G","H","I","J","K"],
        optionsArray:[],
        dialogFormVisible:false,
        dialogFormVisible2:false,
        type:'',
        pageNum:1,
        list:[],
        per_page:1,
        total:1,
        formLabelWidth:'100px',
        beforeReson:'',
        index:0
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
      dblclickOnRow(row){
        this.$router.push({
          name:'detail',
          params:{
            id:row.id
          }
        })
      },
      cancel(){
        this.dialogFormVisible=false;
        this.index=0;
      },
      changeCoin(){
        if(this.dialogForm.tradeCoin=='GXS'){
          this.dialogForm.maxBet=100;
          this.dialogForm.minBet=0.05;
        }else if(this.dialogForm.tradeCoin=='PPS'){
          this.dialogForm.maxBet=100;
          this.dialogForm.minBet=1;
        }else if(this.dialogForm.tradeCoin=='CANDY'){
          this.dialogForm.maxBet=100;
          this.dialogForm.minBet=500;
        }
      },
      addDomain() {
        this.index++;
        this.dialogForm.options.push({
          onlineInitial:'' ,
          optionKey:this.optionArray[this.index],
          key: Date.now()
        });
      },
      search(){
        this.fetch();
      },
      fetch(){
        var params = {
          title:this.formInline.title,
          pageNo:this.pageNum,
          type:'wait_online',
          // status:'online'
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
          this.total =response.body.totalCount;
        })
      },
      handleCurrentChange(val){ 
        this.pageNum = val;
        this.fetch();
      },
      onlineCheck(row){
        this.id =row.id;
        this.optionsArray = row.options;
        this.dialogForm.options = [{
              onlineInitial:'',
              optionKey:'A'
            }];
        for(var i = 0;i<this.optionsArray.length-1;i++){
          this.addDomain();
        }
        this.dialogFormVisible=true;
      },
      befor(row,title,type){
         this.projectId =row.id;
         this.dialogFormVisible2 =true;
         this.type = type;
      },
      submit1(){
        if(this.type=="3"){
          if(!this.beforeReson){
             this.$message('请输入作废原因');
             return;
          }
          var params ={
              projectId:this.projectId,
              reason:this.beforeReson
          }
          cancel(qs.stringify(params)).then(response=>{
             this.$message({
              message: '设置成功',
              type: 'success'
            });
          })
        }
        this.fetch();
        this.beforeReson='';
        this.dialogFormVisible=false
        this.dialogFormVisible2=false
      },
      onSubmit() {
        var params = this.dialogForm;
        // alert(JSON.stringify(params))
        params.projectId =this.id;
        online(params).then(response=>{
          this.fetch();
          
          this.$message({
          message: '审核通过',
          type: 'success'
        });
          this.index=0;
          this.dialogFormVisible = false;
          this.dialogForm={
          tradeCoin:'',
          maxBet:'1000000',
          minBet:'',
          totalNum:'0',
          personNum:'0',
          options:[
            {
              onlineInitial:'',
              optionKey:'A'
            }
          ],
          awardRatioInitiator:'0',
          awardRatioPlatfrom:'10',
          awardRatioVoter:'0',
          betEndTime:'',
        };
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