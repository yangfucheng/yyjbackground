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
              <el-option label="全部" value=""></el-option>
              <el-option label="待上线" value="wait_online"></el-option>
              <el-option label="已上线" value="online"></el-option>
              <el-option label="等待结果" value="wait_result"></el-option>
              <el-option label="已结束" value="complete"></el-option>
              <el-option label="已作废" value="cancel"></el-option>
          </el-select>
      </el-form-item>
        <el-form-item label="">
          <el-input v-model="formInline.title" placeholder="请输入标题"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit1()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" border>
      <el-table-column prop="title" label="标题" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.title}}
        </template>
      </el-table-column>
       </el-table-column>
      <el-table-column prop="date" label="项目状态" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.status | changStatus}}
        </template>
      </el-table-column>
       <el-table-column prop="options" label="选项"  >
           <template slot-scope="scope" >
          <div v-for="x in scope.row.options" >{{x.optionKey}}:{{x.optionValue}}</div>
          </template>
       </el-table-column>
       <el-table-column prop="voteEndTime" label="结束时间" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.betEndTime | changeTime}}
        </template>
      </el-table-column>
      <el-table-column prop="voteEndTime" label="开始时间" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.betStartTime | changeTime}}
        </template>
      </el-table-column>
       <el-table-column prop="result" label="数据来源" sortable show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.resultUrl }}
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="120" >
      <template slot-scope="scope">
        <el-button @click.native.prevent="resulte(scope.row)" type="text" size="small" v-show="scope.row.result==null">
          输入结果
            <!-- {{scope.row.resultUrl }} -->
        </el-button>
        <el-button @click.native.prevent="check(scope.row)" type="text" size="small" v-show="scope.row.status!='complete'">
          审核
        </el-button>
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
      <el-dialog title="结果输入/审核" :visible.sync="dialogFormVisible">
        <el-form >
          <el-form-item label="正确选项" :label-width="formLabelWidth">
            <el-select v-model="option" placeholder="请选择结果">
              <el-option v-for='x in optionsArray'  :label="x.optionKey+':'+x.optionValue" :value="x.optionKey" ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="dialog">
      <el-dialog title="结果输入/审核" :visible.sync="dialogFormVisible1">
        <el-form >
            <el-form-item label="" :label-width="formLabelWidth">
             <b>上个管理员选择了</b> <span>:{{optionCheck}}</span>
            </el-form-item>
          <el-form-item label="正确选项" :label-width="formLabelWidth">
            <el-select v-model="optionCh" placeholder="请选择结果">
              <el-option v-for='x in optionsArray'  :label="x.optionKey+':'+x.optionValue" :value="x.optionKey" ></el-option>
            </el-select>
          </el-form-item>

        
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
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
  
  import { timestampToTime,getNameById,OrderStatus } from '../../utils/enum.js'
  import { getManageList,updateWeight,cancel,breakShort,check,result } from '../../api/manager.js'
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
        dialogFormVisible:false,
        dialogFormVisible1:false,
        dialogFormVisible2:false,
        pageNum:1,
        list:[],
        per_page:1,
        total:1,
        option:'',
        optionC:'',
        optionCh:'',
        disable:false,
        projectId:'',
        formLabelWidth:'100px',
        optionCheck:'',
        beforeReson:'',
        optionsArray:[],
        type:''
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
          tradeCoin:this.formInline.tradeCoin,
          title:this.formInline.title,
          pageNo:this.pageNum,
          type:'wait_result',
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
          this.total =response.body.totalCount;
          // alert(this.list[0].optionC);
        })
      },
      check(row){
        this.dialogFormVisible1 =true;
        this.optionCheck = row.result;
        this.projectId = row.id;
        this.optionsArray = row.options;
        if(row.optionC){
          this.disable = true;
        }
      },
      resulte(row){
        this.dialogFormVisible =true;
        this.projectId = row.id;
        this.optionsArray = row.options;
      },
      handleCurrentChange(val){ 
        this.pageNum = val;
        this.fetch();
      },
      onSubmit() {
        console.log('submit!');
        var params ={
          projectId:this.projectId,
          result:this.optionCh
        }
        check(params).then(response=>{
            this.$message({
              message: 'Ye,输入结果成功了哟',
              type: 'success'
            });
            this.fetch();
            this.optionCh ='';
            this.option ='';
        })
      },
      onSubmit1(){
        this.fetch();
      },
      submit(){
        var params ={
          projectId:this.projectId,
          result:this.option
        }
        result(params).then(response=>{
            this.$message({
              message: 'Yep,审核成功了哟',
              type: 'success'
            });
            this.fetch();
            this.optionCh ='';
            this.option ='';
        })
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