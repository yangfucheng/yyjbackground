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
        <el-table-column prop="id" label="红包编号">
        </el-table-column>
        <el-table-column prop="title" label="话题标题">
        </el-table-column>
        <el-table-column prop="inUse" label="页面显示">
            <template slot-scope="scope">
                {{scope.row.place | changStatus}}
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
    <el-col :span="24" class="toolbar">
       <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableData.pageNo" :page-size="tableData.pageSize" layout=" prev, pager, next,jumper" :total="tableData.totalCount" style="float:right;">
       </el-pagination>
    </el-col>
    <el-dialog title="新增模板" :visible.sync="dialogFormVisible">
       <el-form>
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="红包标题">
                    <el-input v-model="form.title" placeholder="请输入话题标题"></el-input>
                </el-form-item>
                  <el-form-item label="红包发起人">
                    <input v-model="queryString"  style="height:40px;width:200px;border:1px solid #ccc;padding:0 20px" placeholder="先输入号码,再去隔壁选择" >
                    <el-select v-model="form.initiatorId" placeholder="请选择">
                        <el-option
                        v-for="item in infoArray"
                        :key="item.initiatorId"
                        :label="item.userName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="显示页面">
                    <el-select v-model="form.place" placeholder="选择话题类型">
                        <el-option label="预测市场" value="index"></el-option>
                        <el-option label="预测PK" value="pk"></el-option>
                        <el-option label="网红" value="user"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="有效时间">
                    <el-input v-model="form.validTime" placeholder="请输入有效时间"></el-input> <span>分钟</span>
                </el-form-item>
                 <el-form-item label="奖励币种">
                   <el-select v-model="form.tradeCoin" placeholder="奖励币种">
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
                <el-form-item label="奖励数量">
                    <el-input v-model="form.amount" auto-complete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="抢到概率">
                    <el-input v-model="form.awardAmount" auto-complete="off"></el-input>
                </el-form-item> -->
                <el-form-item label="有效份数上限">
                    <el-input v-model="form.maxValidAmount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="有效份数下线">
                    <el-input v-model="form.minValidAmount" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="有效影响因子">
                    <el-input v-model="form.ratio" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="抢到概率">
                    <el-input v-model="form.probability" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否循环">
                    <el-radio v-model="form.circulate" label="true">是</el-radio>
                    <el-radio v-model="form.circulate" label="false">否</el-radio>
                </el-form-item>
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
    <!-- <el-dialog title="编辑" :visible.sync="dialogFormVisible2">
        <el-form label-width="100px">
            <el-form-item label="输入权重" prop='weight'>
                <el-input v-model="weight" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="输入抽成" prop='ratio'>
                <el-input v-model="ratio" auto-complete="off"></el-input>%
            </el-form-item>
            <el-form-item label="输入简介" prop='intro'>
                <el-input v-model="intro" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="输入备注" prop='remarks'>
                <el-input v-model="remarks" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="submit1">确 定</el-button>
        </div>
    </el-dialog> -->
    </div>
</template>

<script>
  import { hbModelList,updateHbModel,redSearch } from '../../api/manager.js'
  import { timestampToTime } from '../../utils/enum.js'
  export default {
    data(){
      return {
        isOpen:'',
        tableData:{},
        list:[],
        loading2:false,
        tel:'',
        queryString:'',
        dialogFormVisible:false,
        dialogFormVisible2:false,
        intro:'',
        ratio:'',
        remarks:'',
        weight:'',
        userId:'',
        userName:'',
        telephone:'',
        redMsg:'',
        loading:false,
        infoArray:[],
        form: {
          title:'',
          initiatorId:'',
          place:'',
          amount:'',//获得奖励
          maxValidAmount:'',//份数上限
          minValidAmount:'',//份数下限
          probability:'',//概率
          ratio:'',//有效因子
          resultUrl:'',
          betAmount:'',
          pic:'',
          betAmount:'',//下注金额
          inUse:false,//是否上架
          circulate:false
        },
      }
    },
    watch:{
        'queryString'(){
            this.remoteMethod(this.queryString);
        }
    },
    created() {
       this.getData({pageNo:1});
    },
    filters: {
      changeTime(value){
        return timestampToTime(value)
      },
      changStatus(value){
          if(value=='index'){
             return '预测市场';
          }else if(value == 'pk'){
              return '预测PK';
          }else{
             return '网红';
          }
      },
      changStatus1(value){
          if(value==1){
             return '已上架';
          }else{
             return '已下架';
          }
      }
    },
    methods: {
        add(){
          this.form = {};
          this.dialogFormVisible=true;
        },
        saveTem(){
            var params = this.form;
            // params.initiatorId = this.form.initiatorId[0];
             updateHbModel(params).then(response=>{
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
                this.dialogFormVisible=false;
                this.search(1);
            });
        },
        remoteMethod(queryString){
            var params = {
                telphone:queryString,
            }
            if(queryString!== ''){
                this.loading = true;
                redSearch(params).then(res=>{
                    this.infoArray = res.body;
                      this.loading = false;
                })
            }else{
                this.infoArray = [];
            }
           
        },
        handleSelect(){

        },
        updateTem(){
            var params = this.form;
            // params.initiatorId = this.form.initiatorId[0];
             updateHbModel(params).then(response=>{
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
           this.form = row;
           this.form.id = row.id;
           this.form.initiatorId =row.initiatorId;
           this.dialogFormVisible=true;
        },
        getData(params){
            var self=this;
            this.loading2=true;
            hbModelList(params).then(
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