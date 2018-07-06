<template>
  <div class="launch-contain">
    <el-form ref="ruleform" :model="ruleform" label-width="100px">
      <el-form-item label="发起者" disabled='disabled'>
        <el-input v-model="ruleform.userName" placeholder="请输入发起者" disabled='disabled'></el-input>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="ruleform.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item
          v-for="(domain, index) in ruleform.options"
          :label="'选项' + optionArray[index]"
          :key="optionArray[index]"
          :prop="'options.' + index + '.optionValue'"
        >
          <input v-model="domain.optionValue" class="inline"/>
          <input v-model="domain.predictOdds" class='inline'/>%(预计发生概率)<el-button @click.prevent="removeDomain(domain)" style="margin-left: 10px">删除</el-button>
        </el-form-item>
          <el-button @click="addDomain()" style="margin:0 0 20px 100px;">新增选项</el-button>
      <el-form-item label="开始时间" >
        <el-date-picker v-model="ruleform.projectStartTime" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" >
        <el-date-picker v-model="ruleform.projectEndTime" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="数据来源">
        <el-input v-model="ruleform.resultSources" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="数据来源url">
        <el-input v-model="ruleform.resultUrl"></el-input>
      </el-form-item>
      <el-form-item label="来源显示">
        <el-radio v-model="ruleform.resultShow" label="true">是</el-radio>
        <el-radio v-model="ruleform.resultShow" label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="评论区设置">
        <el-input v-model="ruleform.notice"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="update">提交</el-button>
        <el-button type="primary" @click="check('check')">审核通过</el-button>
        <el-button type="default" @click="check('refuse')">拒绝通过</el-button>
      </el-form-item>
    </el-form>
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
import {checkVote,detail,eidtVote} from '../../api/manager.js'
var qs=require("qs");
export default {
  data() {
      return {
        ruleform: {
          userName:'',
          title:'',
          options:[],
          tag:'',
          projectStartTime:'',
          projectEndTime:'',
          resultUrl:'',
          notice:'',
          resultSources:'',
          resultShow:'false',
        },
        buttonLoading:false,
        dialogFormVisible1:false,
        dialogFormVisible:false,
        form:{
          targetQuantity:'',
          maxVote:'',
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
        projectId:'',
        optionArray:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
      }
   },
    created() {
      this.projectId=this.$route.params.id;
      this.fetch();
    },
   methods: {
      fetch(){
        var params ={projectId:this.projectId};
        detail(params).then(response=>{
          this.ruleform = response.body;
          this.ruleform.resultShow=''+response.body.resultShow;
        })
      },
      removeDomain(item) {
        var index = this.ruleform.options.indexOf(item);
        var length=this.ruleform.options.length;
        if (index !== -1) {
          this.ruleform.options.splice(index, 1);
          if(index!=length-1){
            for(var i=index;i<length-1;i++){
              this.ruleform.options[i].optionKey=this.optionArray[i];
            }
          }
        }
      },
      addDomain() {
        var length=this.ruleform.options.length;
        this.ruleform.options.push({
          optionValue:'' ,
          optionKey:this.optionArray[length],
          predictOdds:'',
          projectId:this.projectId,
        });
      },
      update(){
        var params={id:this.projectId,projectStartTime:this.ruleform.projectStartTime,title:this.ruleform.title,projectEndTime:this.ruleform.projectEndTime,notice:this.ruleform.notice,options:this.ruleform.options,resultUrl:this.ruleform.resultUrl,resultShow:this.ruleform.resultShow,resultSources:this.ruleform.resultSources};
        eidtVote(params).then(response => {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.$router.push({
              name:'voteList',
            });
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
      check(status){
        if(status=='check'){
          this.dialogFormVisible=true;
        }else{
          this.dialogFormVisible1=true;
        }
      }
   }
  }
</script>
<style lang="scss">
  .launch-contain{
    .el-input__inner{
      width:400px;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.launch-contain{
   margin:50px 20px;
}
.inline{
    width:150px;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    margin-left:10px;
    margin-bottom:5px;
}
</style>