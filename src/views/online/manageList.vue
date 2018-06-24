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
      <el-button type="primary" @click="onSubmit()">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="list" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" border @row-dblclick="dblclickOnRow">
    <el-table-column prop="title" label="标题" sortable >
      <template slot-scope="scope" >
        {{scope.row.title}}
      </template>
    </el-table-column>
    <el-table-column prop="title" label="权重" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.weight}}
      </template>
    </el-table-column>
    <el-table-column prop="date" label="项目状态" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.status | changStatus}}
      </template>
    </el-table-column>
     <el-table-column prop="betStartTime" label="开始时间" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.betStartTime | changeTime}}
      </template>
    </el-table-column>
     <el-table-column prop="betEndTime" label="结束时间" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.betEndTime | changeTime}}
      </template>
    </el-table-column>
     <el-table-column prop="title" label="项目结果" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.result}}
      </template>
    </el-table-column>
     <el-table-column prop="ratio" label="收益倍数" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.ratio}}
      </template>
    </el-table-column>
     <el-table-column prop="capitalPool" label="项目资金池" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.capitalPool}}
      </template>
    </el-table-column>
     <el-table-column prop="tradeCoin" label="结算货币" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.tradeCoin}}
      </template>
    </el-table-column>
     <el-table-column  label="项目抽成" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        5%
      </template>
    </el-table-column>
    <el-table-column label="操作"  width="120">
      <template slot-scope="scope">
        <el-button @click.native.prevent="updateWei(scope.row,'1')" type="text" size="small" >
          权重设置
        </el-button>
        
        <el-button @click.native.prevent="befor(scope.row,'提前结束','2')" type="text" size="small" v-show="scope.row.status=='online'">
          提前结束
        </el-button>

        <el-button @click.native.prevent="befor(scope.row,'项目作废','3')" type="text" size="small" v-show="scope.row.status!='complete' && scope.row.status!='cancel'">
          项目作废
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
  <el-dialog title="修改项目权重" :visible.sync="dialogFormVisible">
    <el-form >
      <el-form-item label="修改项目权重" :label-width="formLabelWidth">
        <el-input v-model="update" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit1">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog :title="title" :visible.sync="dialogFormVisible1">
    <el-form >
      <el-form-item :label="title" :label-width="formLabelWidth">
        <el-input v-model="beforeReson" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible1 = false">取 消</el-button>
      <el-button type="primary" @click="submit1">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
  import { getManageList,updateWeight,cancel,breakShort } from '../../api/manager.js'
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

        getManageList(params).then(response =>{
          this.list = response.body.result;
          this.total =response.body.totalCount;
        })
      },
      handleCurrentChange(val){ 
        this.pageNum = val;
        this.fetch();
      },
      dblclickOnRow(row){
        this.$router.push({
          name:'detail',
          params:{
            id:row.id
          }
        })
      },
      updateWei(row,type){
       this.projectId =row.id;
       this.dialogFormVisible =true;
       this.type = type;
      },
      befor(row,title,type){
         this.projectId =row.id;
         this.dialogFormVisible1 =true;
         this.type = type;
         this.title =title;
      },
      onSubmit() {
        this.fetch();
      },
      submit1(){
        if(this.type =="1"){
            var params ={
              projectId:this.projectId,
              weight:this.update
          }
          updateWeight(qs.stringify(params)).then(response=>{
             this.$message({
              message: '审核通过',
              type: 'success'
            });
          })
        }else if(this.type=="2"){
          var params ={
              projectId:this.projectId,
              reason:this.beforeReson
          }
          breakShort(qs.stringify(params)).then(response=>{
             this.$message({
              message: '设置成功',
              type: 'success'
            });
          })
        }else if(this.type=="3"){
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
        this.dialogFormVisible1=false
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