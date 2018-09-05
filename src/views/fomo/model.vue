<template>
	<div style="margin:30px;">
    <el-row style="margin: 10px;">
            <el-col :span="22">
                <!-- 筛选：
                <el-select v-model="isOpen" placeholer='全部状态'>
                    <el-option label="全部状态" value="" ></el-option>
                    <el-option label="已上架" value="1" ></el-option>
                    <el-option label="已下架" value="0" ></el-option>
                </el-select>
                <el-input placeholder="昵称" v-model="userName" style="width:200px;"></el-input>&nbsp;&nbsp;
                <el-input placeholder="手机号" v-model="telephone" style="width:200px;"></el-input>&nbsp;&nbsp;
                <span><el-button type="primary" @click="search()">搜索</el-button></span> -->
              
            </el-col>
            <el-col :span='2'>
                <el-button type="primary" @click="add">新增模板</el-button>
            </el-col>
    </el-row>
    <el-table :data="tableData.result"   v-loading="loading2">
           
            <el-table-column prop="id" label="序号">
            </el-table-column>
            <el-table-column prop="title" label="模板名">
            </el-table-column>
            <el-table-column prop="projectTag" label="话题类型">
                  <template slot-scope="scope">
                      {{scope.row.projectTag }}
                </template> 
            </el-table-column>
            <el-table-column prop="maxTime" label="总倒计时(分)">
            </el-table-column>
             <el-table-column prop="awardPoolRatio" label="奖池比例">
            </el-table-column>
             <el-table-column prop="keyPoolRatio" label="key奖励比例">
            </el-table-column>
             <el-table-column prop="bonusPoolRatio" label="PPS持有比例">
            </el-table-column>
             
             <!-- <el-table-column prop="options" label="选项" v-show="false">
            </el-table-column> -->
            <el-table-column prop="inUse" label="是否上架">
                 <template slot-scope="scope">
                    {{scope.row.inUse | changStatus}}
                </template>
            </el-table-column>
            <!-- <el-table-column prop="remarks" label="更新时间 ">
                 <template slot-scope="scope">
                     
                </template>
            </el-table-column> -->
            <el-table-column label="操作" width="140px">
                <template scope="scope">
                    <el-button size="small"  type="text" @click="edit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
       <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableData.pageNo" :page-size="tableData.pageSize" layout=" prev, pager, next,jumper" :total="tableData.totalCount" style="float:right;">
       </el-pagination>
    </el-col>
    <el-dialog title="新增网红" :visible.sync="dialogFormVisible">
       <el-form>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="模板名">
                    <el-input v-model="form.title" placeholder="请输入模板名"></el-input>
                </el-form-item>
                 <el-form-item label="参与币种">
                   <el-select v-model="form.tradeCoin" placeholder="参与币种">
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

                 <el-form-item label="话题场次">
                    <el-radio v-model="form.type" label="yuce">预测市场</el-radio>
                    <el-radio v-model="form.type" label="pk">预测PK</el-radio>
                </el-form-item>
                <el-form-item
                    v-for="(domain, index) in form.options"
                    :label="'话题类型：'"
                    :key="domain.key"
                    :prop="'options.' + index + '.optionValue'"
                    >
               
                <el-select v-model="domain.optionValue" placeholder="请选择话题归类">
                    <el-option label="金融" value="finance"></el-option>
                    <el-option label="体育" value="pe"></el-option>
                    <el-option label="电竞" value="dianjing"></el-option>
                    <el-option label="区块链" value="entertainment"></el-option>
                    <el-option label="其他" value="other"></el-option>
                    <el-option label="lol电竞" value="lol"></el-option>
                </el-select>
                    <el-button @click.prevent="removeDomain(domain,1)" style="display: inline-block">删除</el-button>
              
                <!-- <input v-model="domain.optionValue" style="border:1px solid #ccc;height: 40px;width:200px;margin-right:10px;"></input><el-button @click.prevent="removeDomain(domain)" style="display: inline-block">删除</el-button> -->
                </el-form-item>
                <el-button @click="addDomain(1)" style="margin-left:100px;margin-bottom:10px">新增选项</el-button>


                <el-form-item
                    v-for="(domain, index) in form.options2"
                    :label="'单次下注量：'"
                    :key="domain.key"
                    :prop="'options2.' + index + '.pool'"
                    >
               
                <input v-model="domain.pool" style="border:1px solid #ccc;height: 40px;width:200px;margin-right:10px;" placeholder="奖池/gxs">
                <input v-model="domain.rule" style="border:1px solid #ccc;height: 40px;width:200px;margin-right:10px;" placeholder=">>GXS">
                <el-button @click.prevent="removeDomain(domain,2)" style="display: inline-block">删除</el-button>
                </el-form-item>


                <el-button @click="addDomain(2)" style="margin-left:100px;margin-bottom:10px">新增选项</el-button>

                 <el-form-item
                    v-for="(domain, index) in form.options3"
                    :label="'KEY梯度'"
                    :key="domain.key"
                    :prop="'options3.' + index + '.pool'"
                    >
               
                 <input v-model="domain.pool" style="border:1px solid #ccc;height: 40px;width:200px;margin-right:10px;" placeholder="奖池">
                 <input v-model="domain.rule" style="border:1px solid #ccc;height: 40px;width:200px;margin-right:10px;" placeholder="xxkey">
                <el-button @click.prevent="removeDomain(domain,3)" style="display: inline-block">删除</el-button>
                </el-form-item>
                <el-button @click="addDomain(3)" style="margin-left:100px;margin-bottom:10px">新增选项</el-button>


                <el-form-item label="总倒计时">
                    <el-input v-model="form.maxTime" placeholder="总倒计时"></el-input>min
                </el-form-item>

                 <el-form-item label="参与一次增加倒计时:">
                    <el-input v-model="form.addTime" placeholder="参与一次增加倒计时"></el-input>s
                </el-form-item>

                 <el-form-item label="奖金池比例:">
                    <el-input v-model="form.awardPoolRatio" placeholder="奖金池比例"></el-input>%
                </el-form-item>

                <el-form-item label="PPS持有奖励比例:">
                    <el-input v-model="form.bonusPoolRatio" placeholder="PPS持有奖励比例"></el-input>%
                </el-form-item>

                 <el-form-item label="KEY奖金池比例:">
                    <el-input v-model="form.keyPoolRatio" placeholder="KEY奖金池比例"></el-input>%
                </el-form-item>

                 <el-form-item label="KEY持有奖励发放间隔周期:">
                    <el-input v-model="form.keyAwardTime" placeholder="KEY持有奖励发放间隔周期"></el-input>%
                </el-form-item>

                 <el-form-item label="场次间隔周期:">
                    <el-input v-model="form.intervalTime" placeholder="场次间隔周期"></el-input>min
                </el-form-item>

                 <el-form-item label="倒计时停止时间:">
                    <el-date-picker
                        v-model="time"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                </el-form-item>

                


                <!-- <el-form-item label="项目图片">
                    <el-upload class="avatar-uploader" :action='upload()' :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="form.pic" :src="form.pic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="话题类型">
                    <el-select v-model="form.type" placeholder="选择话题类型">
                    <el-option label="猜奇偶" value="猜奇偶"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="奖励数量">
                    <el-input v-model="form.awardAmount" auto-complete="off"></el-input>
                </el-form-item> -->
               
                 <!-- <el-form-item label="单项数量">
                     <el-input v-model="form.resultUrl" auto-complete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="是否上架">
                    <el-radio v-model="form.inUse" label="true">是</el-radio>
                    <el-radio v-model="form.inUse" label="false">否</el-radio>
                </el-form-item>
            </el-form>
        
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveTem" v-show="!form.id">确 定</el-button>
            <el-button type="primary" @click="updateTem" v-show="form.id">修改</el-button>
        </div>
    </el-dialog>
    </div>
</template>

<script>
  import { fomoModel,fomoSave} from '../../api/manager.js'
  import { timestampToTime } from '../../utils/enum.js'
  export default {
    data(){
      return {
        isOpen:'',
        tableData:{},
        loading2:false,
        tel:'',
        time:[],
        dialogFormVisible:false,
        dialogFormVisible2:false,
        intro:'',
        ratio:'',
        remarks:'',
        weight:'',
        userId:'',
        userName:'',
        telephone:'',
        optionArray:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
        form: {
          title:'',
          options:[{
            optionValue: '',
            optionKey:'A'
          }],

          options2:[{
            pool: '',
            rule:'',
            optionKey:'A'
          }],

          options3:[{
            pool: '',
            rule:'',
            optionKey:'A'
          }],

          projectTags:[],

          awardAmount:'',//获得奖励
          awardTradeCoin:'',//获得币种
          betTradeCoin:'',//参与币种
          resultUrl:'',
          betAmount:'',
          pic:'',
          id:'',
          betAmount:'',//下注金额
          inUse:false,//是否上架
          type:'猜奇偶',
          index:1
        },
      }
    },
    created() {
       this.getData({pageNo:1});
    },
    filters: {
      changeTime(value){
        return timestampToTime(value)
      },
    // changStatus(value){
    //     return getNameById(OrderStatus)
    //   },
      changStatus(value){
          if(value==1){
             return '已上架';
          }else{
             return '已下架';
          }
      }
    },
    methods: {
        add(){
          this.dialogFormVisible=true;
        },
        saveTem(){
            this.form.projectTags = [];
            for (const key in this.form.options) {
                this.form.projectTags.push(this.form.options[key].optionValue);
            }
            
             var params = this.form;
             params.stopStartTime=this.time[0];
             params.stopEndTime=this.time[1];
             params.betRules = this.form.options2;
             params.keyRules = this.form.options3;
             fomoSave(params).then(response=>{
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
                this.dialogFormVisible=false;
                this.search(1);
            });
        },
        updateTem(){
        //     this.form.projectTags = [];
        //    for (const key in this.form.options) {
        //         this.form.projectTags.push(this.form.options[key].optionValue);
        //     }
            
             var params = this.form;
            params.stopStartTime=this.time[0];
             params.stopEndTime=this.time[1];
            //  params.stopStartTime=this.time[0];
            //  params.stopEndTime=this.time[1];
            //  params.betRules = this.form.options2;
            //  params.keyRules = this.form.options3;
             fomoSave(params).then(response=>{
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
                this.dialogFormVisible=false;
                this.search(1);
            });
        },
        uplist(status,id){
            this.$confirm('是否继续?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                uplisting(status,{userId:id}).then(response=>{
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.search(this.pageNo);
                });
            }).catch(() => {
                return;          
            });
        },
        removeDomain(item,type) {
            if(type == 1){
                var index = this.form.options.indexOf(item);
                var length=this.form.options.length;
                if (index !== -1){
                    this.form.options.splice(index, 1);
                    if(index!=length-1){
                        for(var i=index;i<length-1;i++){
                            this.form.options[i].optionKey=this.optionArray[i];
                        }
                    }
                }
            }else if(type == 2){
                var index = this.form.options2.indexOf(item);
                var length=this.form.options2.length;
                if (index !== -1){
                    this.form.options2.splice(index, 1);
                    if(index!=length-1){
                        for(var i=index;i<length-1;i++){
                            this.form.options2[i].optionKey=this.optionArray[i];
                        }
                    }
                }
            }else if(type == 3){
                var index = this.form.options3.indexOf(item);
                var length=this.form.options3.length;
                if (index !== -1){
                    this.form.options3.splice(index, 1);
                    if(index!=length-1){
                        for(var i=index;i<length-1;i++){
                            this.form.options3[i].optionKey=this.optionArray[i];
                        }
                    }
                }
            }
            
        },
        addDomain(type) {
        
            if(type == 1){
                var length=this.form.options.length;
                this.form.options.push({
                    optionValue:'' ,
                    optionKey:this.optionArray[length],
                    key: Date.now()
                });
            }else if(type == 2){
                var length=this.form.options2.length;
                this.form.options2.push({
                    pool:'' ,
                    rule:'',
                    optionKey:this.optionArray[length],
                    key: Date.now()
                });
            }else if(type == 3){
                var length=this.form.options3.length;
                this.form.options3.push({
                    pool:'' ,
                    rule:'',
                     optionKey:this.optionArray[length],
                    key: Date.now()
                });
               
            }
            
            
            // alert(this.form.projectTags)
          
        },
        
        submit1(){
            var params={userId:this.userId,description:this.intro,ratio:this.ratio,remarks:this.remarks,weight:this.weight};
            editNetred(params).then(response=>{
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                });
                this.intro='';
                this.dialogFormVisible2=false;
                this.search(this.pageNo);
            });
        },
        edit(row){
           
           this.dialogFormVisible=true;
           this.form = row;
           this.form.id = row.id;
        },
        getData(params){
            var self=this;
            this.loading2=true;
            fomoModel(params).then(
                function(res){
                    var json=res.body;
                    self.tableData=json;
                    self.loading2=false;
                }
            ).catch(function(err){
                alert("系统异常！");
                self.loading2=false;
            });
        },
        handleSizeChange:function(val) {
            this.search(val);
        },
        handleCurrentChange:function(val) {
        var pageNo=this.tableData.pageNo==undefined?0:this.tableData.pageNo;
        if(pageNo>0){
          this.currentPage = val;
          this.search(val);
        }
      },
      search:function(page) {
        var page=page==undefined?1:page;
        var params={};
        params.pageNo=page;
        params.isOpen=this.isOpen;
        params.userName=this.userName;
        params.telephone=this.telephone;
        this.getData(params);
      },
    }
  }
</script>
<style lang="scss" scoped>
.el-input{
	width:80%;
}

</style>