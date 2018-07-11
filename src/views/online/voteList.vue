<template>
  <div class="contain">
   <el-form :inline="true" class="from-inline">
    <el-form-item>
      <el-select v-model="status" placeholder="请选择状态">
        <el-option label="全部" value=""></el-option>
        <el-option label="待审核" value="init"></el-option>
        <el-option label="待上线" value="check"></el-option>
        <el-option label="审核拒绝" value="refuse"></el-option>
        <el-option label="投票中" value="vote"></el-option>
        <el-option label="投票失败" value="failed"></el-option>
      </el-select>
    </el-form-item>
      <el-form-item>
        <el-input v-model="title" placeholder="请输入标题"></el-input>
      </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search()">查询</el-button>
    </el-form-item>
     </el-form> 
  <el-table :data="list" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" border @row-dblclick="dblclickOnRow">
    <!-- <el-table-column prop="initiatorRole" label="发起人" sortable >
    </el-table-column> -->
    <el-table-column prop="title" label="标题" sortable >
      <template slot-scope="scope" >
        {{scope.row.title}}
      </template>
    </el-table-column>
    <el-table-column prop="status" label="状态" sortable>
      <template slot-scope="scope">
        {{scope.row.status | changeStatus}}
      </template>
    </el-table-column>
    <el-table-column prop="voteEndTime" label="投票结束时间" sortable>
      <template slot-scope="scope">
        {{scope.row.voteEndTime | changeTime}}
      </template>
    </el-table-column> 
     <!-- <el-table-column prop="betStartTime" label="开始时间" sortable show-overflow-tooltip>
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
    </el-table-column>-->
    <el-table-column label="操作"  width="200">
      <template slot-scope="scope">
        <el-button @click.native.prevent="check(scope.row,'check')" type="text" size="small" v-show='scope.row.status=="init"'>
          审核通过
        </el-button>
        <el-button @click.native.prevent="check(scope.row,'refuse')" type="text" size="small" v-show='scope.row.status=="init"'>
          拒绝通过
        </el-button>
        <el-button @click.native.prevent="check(scope.row,'cancel')" type="text" size="small" v-show='scope.row.status=="vote"'>
          作废
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
  <el-dialog title="审核通过" :visible.sync="dialogFormVisible" @close='closeDialog'>
        <el-form :model="form" :rules="rules" ref="form" label-width="150px">
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
            <el-form-item label="立即上线" prop='startNow'>
              <el-radio v-model="form.startNow" label="true">是</el-radio>
              <el-radio v-model="form.startNow" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="交易代币" prop='tradeCoin'>
            <el-select v-model="form.tradeCoin" placeholder="请选择交易代币" @change='changeCoin'>
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
          <el-form-item label="投注上限份数" prop='maxBet'>
            <el-input v-model="form.maxBet" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="投注单价" prop='minBet'>
            <el-input v-model="form.minBet" auto-complete="off"></el-input>
          </el-form-item>
           <el-form-item label="初始资金比">
             <el-form-item
                v-for="(domain, index) in form.options"
                :label="'选项' + optionArray[index]"
                :key="index"
                :prop="'options.' + index + '.onlineInitial'"
              >
            <el-input v-model="domain.onlineInitial" style="margin-bottom:5px;width:226px;"></el-input>
            </el-form-item>
        </el-form-item>
          <el-form-item label="项目抽成">
            投票者:<el-input v-model="form.awardRatioVoter" auto-complete="off" style="width:100px"></el-input>
            开发者:<el-input v-model="form.awardRatioInitiator" auto-complete="off" style="width:100px"></el-input>
            平台者:<el-input v-model="form.awardRatioPlatfrom" auto-complete="off" style="width:100px"></el-input>
          </el-form-item>
          <el-form-item label="截止时间" prop='betEndTime'>
             <el-date-picker v-model="form.betEndTime" type="datetime" placeholder="选择日期时间">
             </el-date-picker>
          </el-form-item>
          <el-form-item label="项目总金额" prop='totalNum'>
            <el-input v-model="form.totalNum" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="个人总金额" prop='personNum'>
            <el-input v-model="form.personNum" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="disappear('check')">取 消</el-button>
            <el-button type="primary" @click="submitPass('check')">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="审核不通过" :visible.sync="dialogFormVisible1"  @close='closeDialog'>
       <el-form label-width="100px">
            <el-form-item label="未通过原因">
                <el-input v-model="failReason" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="memo" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="disappear('refuse')">取 消</el-button>
            <el-button type="primary" @click="submitPass('refuse')">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="项目作废" :visible.sync="dialogFormVisible2">
    <el-form label-width="100px">
      <el-form-item label="项目作废">
        <el-input v-model="reason" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="disappear('zuofei')">取 消</el-button>
      <el-button type="primary" @click="cancelPro">确 定</el-button>
    </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getManageList,checkVote,cancel,lockProject} from '../../api/manager.js'
  import { timestampToTime} from '../../utils/enum.js'
  var qs=require("qs");
  export default {
    props: {
      dataProp: {
        demo: String
      }
    },
    data() {
      return {
        status:'',
        title:'',
        pageNum:1,
        dialogFormVisible:false,
        dialogFormVisible1:false,
        dialogFormVisible2:false,
        list:[],
        per_page:1,
        total:1,
        type:'',
        projectId:'',
        title:'',
        reason:'',
        form:{
          targetQuantity:'',
          maxVote:'',
          voteStartTime:'',
          voteEndTime:'',
          startNow:'false',
          tradeCoin:'',
          maxBet:'1000',
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
          awardRatioPlatfrom:'8',
          awardRatioVoter:'2',
          betEndTime:'',
        },
        optionArray:["A","B","C","D","E","F","G","H","I","J","K"],
        optionsArray:[],
        failReason:'',
        memo:'',
        rules: {
          targetQuantity: [{ required: true, trigger: 'blur',message: '请输入目标投票数'}],
          maxVote: [{ required: true, trigger: 'blur',message: '请输入单人上限'}],
          voteStartTime: [{ required: true,message: '请输入开始时间'}],
          voteEndTime: [{ required: true,message: '请输入结束时间'}],
          tradeCoin:[{ required: true,message: '请选择币种'}],
          maxBet:[{ required: true, trigger: 'blur',message: '请输入投注上限份数'}],
          minBet:[{ required: true, trigger: 'blur',message: '请输入投注单价'}],
          totalNum:[{ required: true, trigger: 'blur',message: '请输入项目总金额'}],
          personNum:[{ required: true, trigger: 'blur',message: '请输入个人总金额'}],
          betEndTime:[{required: true,message: '请输入截止时间'}],
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
      changeStatus(value){
        if(value=='init'){
          return '待审核';
        }else if(value=='check'){
          return '待上线';
        }else if(value=='refuse'){
          return '审核拒绝';
        }else if(value=='vote'){
          return '投票中';
        }else if(value='failed'){
          return '投票失败';
        }
      }
    },
    methods: {
      fetch(){
        var params = {
          pageNo:this.pageNum,
          type:'vote',
          status:this.status,
          title:this.title,
        }
        getManageList(params).then(response =>{
          this.list = response.body.result;
          this.total =response.body.totalCount;
        })
      },
      isLock(id,status,type){
        lockProject(qs.stringify({projectId:id,status:status})).then(res=>{
          if(status){
            if(type=='check'){
              this.dialogFormVisible=true;
            }else{
              this.dialogFormVisible1=true;
            }
          }
        });
      },
      closeDialog(){
        this.isLock(this.projectId,false);
      },
      changeCoin(){
        if(this.form.tradeCoin=='GXS'){
          this.form.minBet=0.05;
        }else if(this.form.tradeCoin=='PPS'){
          this.form.minBet=1;
        }else if(this.form.tradeCoin=='CANDY'){
          this.form.minBet=500;
        }
      },
      search(){
        this.fetch();
      },
      disappear(status){
        if(status=='zuofei'){
          this.dialogFormVisible2=false;
          this.reason=''; 
        }else if(status=='refuse'){
          this.dialogFormVisible1=false;
          this.failReason='';
          this.memo='';
        }else{
          this.dialogFormVisible=false;
          this.form={
          targetQuantity:'',
          maxVote:'',
          voteStartTime:'',
          voteEndTime:'',
          startNow:'false',
          tradeCoin:'',
          maxBet:'1000',
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
          awardRatioPlatfrom:'8',
          awardRatioVoter:'2',
          betEndTime:'',
          };
          this.dialogForm={};
        }
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
              var startNow=this.form.startNow;
              var projectOnline={};
              projectOnline.tradeCoin=this.form.tradeCoin;
              projectOnline.maxBet=this.form.maxBet;
              projectOnline.minBet=this.form.minBet;
              projectOnline.totalNum=this.form.totalNum;
              projectOnline.personNum=this.form.personNum;
              projectOnline.options=this.form.options;
              projectOnline.awardRatioInitiator=this.form.awardRatioInitiator;
              projectOnline.awardRatioPlatfrom=this.form.awardRatioPlatfrom;
              projectOnline.awardRatioVoter=this.form.awardRatioVoter;
              projectOnline.betEndTime=this.form.betEndTime;
                params={projectId:this.projectId,checkStatus:status,startNow:startNow,voteEndTime:voteEndTime,voteStartTime:voteStartTime,maxVote:maxVote,targetQuantity:targetQuantity,projectOnline:projectOnline};
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
            this.fetch();
            this.dialogFormVisible=false;
            this.dialogFormVisible1=false;
            this.form={
              targetQuantity:'',
              maxVote:'',
              voteStartTime:'',
              voteEndTime:'',
              startNow:'false',
              tradeCoin:'',
              maxBet:'1000',
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
              awardRatioPlatfrom:'8',
              awardRatioVoter:'2',
              betEndTime:'',
            };
            this.failReason='';
            this.memo='';
        });
        }
      },
      check(row,status){
        this.projectId=row.id;
        if(status=='check'){
          this.optionsArray = row.options;
          this.form.options = [{
            onlineInitial:'',
            optionKey:'A'
          }];
          for(var i = 0;i<this.optionsArray.length-1;i++){
            this.addDomain();
          }
          this.form.awardRatioInitiator=row.ratio;
          this.form.awardRatioPlatfrom=8-row.ratio;
          this.isLock(this.projectId,true,'check');
        }else if(status=='refuse'){
          this.dialogFormVisible1=true;
          this.isLock(this.projectId,true,'refuse');
        }else{
          this.dialogFormVisible2=true;
        }
      },
      addDomain() {
        var length=this.form.options.length;
        this.form.options.push({
          onlineInitial:'' ,
          optionKey:this.optionArray[length],
        });
      },
      cancelPro(){
          var params ={
              projectId:this.projectId,
              reason:this.reason
          }
          cancel(qs.stringify(params)).then(response=>{
             this.$message({
              message: '作废成功',
              type: 'success'
            });
          })
          this.dialogFormVisible2=false;
          this.reason='';
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