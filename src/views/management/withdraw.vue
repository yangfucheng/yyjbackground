<template>
	<div id="user" class="maincontent" v-cloak>
    <div id="content">
    <template>
        <el-row style="margin: 10px;">
            <el-col :span="22">
                <!-- <el-input placeholder="请输入商户名" v-model="name" style="width:200px;"></el-input>&nbsp;&nbsp; -->
                <el-select v-model="status" placeholder="请选择"> 
                    <el-option v-for="item in options" :key="item.status" :label="item.value" :value="item.status"></el-option>
                </el-select>
                <el-select v-model="typeB" placeholder="选择钱包"> 
                    <el-option label="布洛克城钱包" value="block_pay" ></el-option>
                    <el-option label="数字钱包" value="token_wallet" ></el-option>
                </el-select>
                <el-select v-model="tradeCoin" placeholder="请选择币种">
                    <el-option label="全部币种" value="" ></el-option>
                    <el-option label="PPS" value="PPS" ></el-option>
                    <el-option label="GXS" value="GXS" ></el-option>
                    <el-option label="BTC" value="BTC" ></el-option>
                    <el-option label="ETH" value="ETH" ></el-option>
                </el-select>
                <span><el-button type="primary" @click="search()">搜索</el-button></span>
            </el-form-item>
            </el-col>
            <!-- <el-col :span="2">
                <span><el-button type="primary" @click="search()">搜索</el-button></span>
            </el-col> -->
        </el-row>
        <el-table :data="tableData.result"   v-loading="loading2" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="发起时间">
                <template scope="scope">
                    <span style="margin-left: 10px">{{scope.row.createTime|changeTime}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="tel" label="手机号">
            </el-table-column>
            <el-table-column prop="amount" label="提现金额">
            </el-table-column>
            <el-table-column  prop="tradeCoin" label="币种">
            </el-table-column>
            <el-table-column label="状态">
                <template scope="scope">
                    <span style="margin-left: 10px">{{scope.row.status|changStatus}}</span>
                </template>
            </el-table-column>
            <el-table-column label="审核时间">
                <template scope="scope">
                    <span style="margin-left: 10px">{{scope.row.checkTime|changeTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140px">
                <template scope="scope">
                    <el-button size="small"  type="text" v-show="scope.row.status=='init'" @click="check('only',scope.row.id)">审核</el-button>
                    <el-button size="small"  type="text" v-show="scope.row.status=='init'" @click="refuseDraw(scope.row.id)">拒绝</el-button>
                </template>
            </el-table-column>
        </el-table>
    </template>
    <el-col :span="24" class="toolbar">
       <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableData.pageNo" :page-size="tableData.pageSize" layout=" prev, pager, next,jumper" :total="tableData.totalCount" style="float:right;">
       </el-pagination>
    </el-col>
    <div style="margin-top: 20px">
        <el-button @click="toggleSelection()">取消选择</el-button>
        <el-button type="primary" @click='check("list")'>批量审核</el-button>
        <!-- <el-button type="primary" @click='check("all")'>一键审核</el-button> -->
    </div>
    </div>
    <el-dialog title="确认审核" :visible.sync="dialogFormVisible">
    <el-form >
      <el-form-item label="操作密码" label-width="100">
        <el-input v-model="pwd" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible= false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
    </el-dialog>


    <el-dialog title="确认拒绝" :visible.sync="dialogFormVisible1">
    <el-form >
      <el-form-item label="拒绝原因" label-width="100">
        <el-input v-model="memo" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible1= false">取 消</el-button>
      <el-button type="primary" @click="refuseData">确 定</el-button>
    </div>
    </el-dialog>
</div>
</template>

<script>
import {withdrawList,allCheck,batchCheck,refuse} from '../../api/manager.js'
import { timestampToTime} from '../../utils/enum.js'
 var qs=require("qs");
export default {
        data() {
            return {
        	    tableData:[],
                loading2:true,
                options:[{status:'',value:'全部状态'},{status:'complete',value:'完成'},{status:'init',value:'待审核'}],
                tradeCoin:'',
                status:'init',
                multipleSelection: [],
                dialogFormVisible:false,
                pwd:'',
                coin:'',
                ids:[],
                type:'',
                memo:'',
                refuseId:'',
                typeB:'block_pay',
                dialogFormVisible1:false
            };
        },
        filters: {
            changeTime(value){
               return timestampToTime(value)
            },
            changStatus(value){
                if(value=='init'){
               	   return '待审核';
                }else if(value=='complete'){
                	return '完成';
                }
            }
        },
        methods:{
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
                var status=this.status;
                var tradeCoin=this.tradeCoin;
                var page=page==undefined?1:page;
                var type = this.typeB;
                var params={};
                if(tradeCoin!=''){
                    params.coin=tradeCoin;
                }
                if(status!=''){
                    params.status=status;
                }
                 if(type!=''){
                    params.type=type;
                }
                params.pageNo=page;
                this.getData(params);
            },
            check(type,id){ 
            	this.ids=[];
                this.pwd='';
            	this.type=type;
                if(type=='only'){
                    this.ids.push(id);
                    if(this.typeB == 'token_wallet'){
                        batchCheck({ids:this.ids}).then(response=>{
                            this.$message({
                            message: '审核成功',
                            type: 'success'
                            });
                            this.dialogFormVisible=false;
                            this.getData({pageNo:1});
                        }).catch(err=>{
                            this.dialogFormVisible=false;
                        });
                        this.getData({pageNo:1,status:'init',type:this.typeB});
                        return;
                    }
                    this.dialogFormVisible=true;
                }else if(type=='list'){
                	if(this.multipleSelection.length){
                		for(var i=0;i<this.multipleSelection.length;i++){
                			this.ids.push(this.multipleSelection[i].id);
                        }
                        if(this.typeB == 'token_wallet'){
                            batchCheck({ids:this.ids}).then(response=>{
                                this.$message({
                                message: '审核成功',
                                type: 'success'
                                });
                                this.dialogFormVisible=false;
                                this.getData({pageNo:1});
                            }).catch(err=>{
                                this.dialogFormVisible=false;
                            });
                            this.getData({pageNo:1,status:'init',type:this.typeB});
                            return;
                        }
                        this.dialogFormVisible=true;
                	}else{
                        alert('请先勾选');
                    }
                }else if(type=='all'){
                    this.dialogFormVisible=true;
                }
            },
            refuseDraw(id){
                this.dialogFormVisible1 = true;
                this.refuseId = id;
            },
            refuseData(){
                var params={
                    id:this.refuseId,
                    memo:this.memo
                }
                refuse(params).then(res=>{
                    this.$message({
                        message: '拒绝成功',
                        type: 'success'
                    });
                })
                this.dialogFormVisible1 = false;
                this.memo='';
                this.getData({pageNo:1,status:'init',type:this.typeB});
            },
            submit(){
                if(this.pwd.trim()==''){
                	this.$message({
                        message: '请输入密码',
                        type: 'warning'
                    });
                }else{
                	var pwd=this.pwd;
                	if(this.type=='all'){
                		allCheck(qs.stringify({pwd:pwd})).then(response=>{
                            this.$message({
                            message: '审核成功',
                            type: 'success'
                            });
                            this.dialogFormVisible=false;
                            this.getData({pageNo:1});
                        }).catch(err=>{
                            this.dialogFormVisible=false;
                        });
                	}else{
                		batchCheck({ids:this.ids,pwd:pwd}).then(response=>{
                            this.$message({
                            message: '审核成功',
                            type: 'success'
                            });
                            this.dialogFormVisible=false;
                            this.getData({pageNo:1});
                        }).catch(err=>{
                            this.dialogFormVisible=false;
                        });
                	}
                }
            },
            getData(params){
                var self=this;
                withdrawList(params).then(
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
            toggleSelection(rows) {
                if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            }
        },
         mounted:function(){
            this.getData({pageNo:1,status:'init',type:this.typeB});
        }
}
</script>

<style lang='scss' scoped>
.maincontent{
	margin: 20px;
}
</style>