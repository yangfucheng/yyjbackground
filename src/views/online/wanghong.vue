<template>
	<div style="margin:30px;">
    <el-row style="margin: 10px;">
            <el-col :span="22">
                <!-- 筛选：
                <el-select v-model="isOpen" placeholer='全部状态'>
                    <el-option label="全部状态" value="" ></el-option>
                    <el-option label="上架" value="1" ></el-option>
                    <el-option label="下架" value="0" ></el-option>
                </el-select>
                <el-input placeholder="请输入手机号/昵称" v-model="key" style="width:200px;"></el-input>&nbsp;&nbsp;
                <span><el-button type="primary" @click="search()">搜索</el-button></span> -->
            </el-col>
            <el-col :span='2'>
                <el-button type="primary" @click="add">新增网红</el-button>
            </el-col>
    </el-row>
    <el-table :data="tableData.result"   v-loading="loading2">
            <el-table-column label="发起时间">
                <template scope="scope">
                    <span style="margin-left: 10px">{{scope.row.createTime|changeTime}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="用户名">
            </el-table-column>
            <el-table-column prop="telephone" label="手机号">
            </el-table-column>
            <el-table-column prop="description" label="简介">
            </el-table-column>
            <el-table-column label="状态">
                <template scope="scope">
                    <span style="margin-left: 10px">{{scope.row.isOpen|changStatus}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="follower" label="粉丝数">
            </el-table-column>
            <el-table-column label="操作" width="140px">
                <template scope="scope">
                    <el-button size="small"  type="text" @click="edit(scope.row.userId,scope.row.description)">编辑简介</el-button>
                    <el-button size="small"  type="text" @click="uplist('on',scope.row.userId)" v-show='scope.row.isOpen!=1'>上架</el-button>
                    <el-button size="small"  type="text" @click="uplist('off',scope.row.userId)" v-show='scope.row.isOpen==1'>下架</el-button>
                </template>
            </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar">
       <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableData.pageNo" :page-size="tableData.pageSize" layout=" prev, pager, next,jumper" :total="tableData.totalCount" style="float:right;">
       </el-pagination>
    </el-col>
    <el-dialog title="新增网红" :visible.sync="dialogFormVisible">
       <el-form>
            <el-form-item label="输入手机号" label-width="100">
                <el-input v-model="tel" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="编辑简介" :visible.sync="dialogFormVisible2">
       <el-form >
            <el-form-item label="输入简介" label-width="100">
                <el-input v-model="intro" auto-complete="off"></el-input>
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
  import { addNetred,getNetred,editNetred,uplisting} from '../../api/manager.js'
  import { timestampToTime } from '../../utils/enum.js'
  export default {
    data(){
      return {
        key:'',
        isOpen:'',
        tableData:{},
        loading2:false,
        tel:'',
        dialogFormVisible:false,
        dialogFormVisible2:false,
        intro:'',
        userId:'',
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
                    this.getData({pageNo:1});
                });
            }).catch(() => {
                return;          
            });
        },
        submit(){
            addNetred({tel:this.tel}).then(response=>{
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
                this.dialogFormVisible=false;
                this.getData({pageNo:1});
            });
        },
        submit1(){
            var params={userId:this.userId,description:this.intro};
            editNetred(params).then(response=>{
                this.$message({
                    message: '编辑成功',
                    type: 'success'
                });
                this.intro='';
                this.dialogFormVisible2=false;
                this.getData({pageNo:1});
            });
        },
        edit(id,intro){
            this.intro=intro;
            this.dialogFormVisible2=true;
            this.userId=id;
        },
        getData(params){
            var self=this;
            this.loading2=true;
            getNetred(params).then(
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
        var type=this.type;
        var page=page==undefined?1:page;
        var params={};
        params.pageNo=page;
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