<template>
  <div class="contain">
   <!-- <el-form :inline="true" :model="formInline" class="from-inline">
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
     </el-form> -->
  <el-table :data="list" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" border @row-dblclick="dblclickOnRow">
    <el-table-column prop="title" label="标题" sortable >
      <template slot-scope="scope" >
        {{scope.row.title}}
      </template>
    </el-table-column>
     <el-table-column prop="betStartTime" label="开始时间" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.projectStartTime | changeTime}}
      </template>
    </el-table-column>
    <el-table-column prop="betEndTime" label="结束时间" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.projectEndTime | changeTime}}
      </template>
    </el-table-column>
    <el-table-column prop="tag" label="tag" sortable >
      <template slot-scope="scope" >
        {{scope.row.tag}}
      </template>
    </el-table-column>
    <el-table-column label="操作"  width="200">
      <template slot-scope="scope">
        <el-button @click.native.prevent="check(scope.row.id,'check')" type="text" size="small">
          审核通过
        </el-button>
        <el-button @click.native.prevent="check(scope.row.id,'refuse')" type="text" size="small">
          拒绝通过
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
  <el-dialog title="审核通过" :visible.sync="dialogFormVisible">
       <el-form :model="form" :rules="rules" ref="form" label-width="160px">
            <el-form-item label="项目准上线目标票数" prop='targetQuantity'>
                <el-input v-model="form.targetQuantity" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="单人投票上限" prop='maxVote'>
                <el-input v-model="form.maxVote" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="投票开始时间" prop='voteStartTime'>
              <el-date-picker v-model="form.voteStartTime" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="投票结束时间" prop='voteEndTime'>
              <el-date-picker v-model="form.voteEndTime" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitPass('check')">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="审核不通过" :visible.sync="dialogFormVisible1">
       <el-form label-width="100px">
            <el-form-item label="未通过原因">
                <el-input v-model="failReason" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="memo" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible1= false">取 消</el-button>
            <el-button type="primary" @click="submitPass('refuse')">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getManageList,checkVote} from '../../api/manager.js'
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
        pageNum:1,
        dialogFormVisible:false,
        dialogFormVisible1:false,
        list:[],
        per_page:1,
        total:1,
        type:'',
        projectId:'',
        title:'',
        beforeReson:'',
        form:{
          targetQuantity:'',
          maxVote:'',
          voteStartTime:'',
          voteEndTime:'',
        },
        failReason:'',
        memo:'',
        rules: {
          targetQuantity: [{ required: true, trigger: 'blur',message: '请输入目标投票数'}],
          maxVote: [{ required: true, trigger: 'blur',message: '请输入单人上限'}],
          voteStartTime: [{ required: true,message: '请输入开始时间'}],
          voteEndTime: [{ required: true,message: '请输入结束时间'}],
        },
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
          pageNo:this.pageNum,
          type:'init',
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
          name:'votedetail',
          params:{
            id:row.id
          }
        });
      },
      submitPass(status){
        var i=false;
        var params={};
        if(status=='check'){
          this.$refs['form'].validate((valid) => {
            if (valid) {
              var voteStartTime=this.form.voteStartTime;
              var voteEndTime=this.form.voteEndTime;
              var maxVote=this.form.maxVote;
              var targetQuantity=this.form.targetQuantity;
                params={projectId:this.projectId,checkStatus:status,voteEndTime:voteEndTime,voteStartTime:voteStartTime,maxVote:maxVote,targetQuantity:targetQuantity};
              i=true;
            }else{
              return false;
            }
          });
        }else{
          if(this.memo==''||this.failReason==''){
            alert("请输入完整");
            return false;
          }else{
            i=true;
            params={projectId:this.projectId,checkStatus:status,failReason:this.failReason,memo:this.memo};
          }
        };
        if(i){
          checkVote(params).then(response => {
            this.$message({
              message: '审核成功',
              type: 'success'
            });
            this.$router.push({
              name:'managelist',
            });
        });
        }
      },
      check(id,status){
        this.projectId=id;
        if(status=='check'){
          this.dialogFormVisible=true;
        }else{
          this.dialogFormVisible1=true;
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .contain{
     margin:30px;
  }
  .el-input{
    width: 80%;
  }
</style>