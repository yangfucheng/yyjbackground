<template>
	<div style="margin:30px;">
    <el-row style="margin: 10px;">
            <el-col :span="22">
                筛选：
                <el-select v-model="isOpen" placeholer='全部状态'>
                    <el-option label="全部状态" value="" ></el-option>
                    <el-option label="已上架" value="1" ></el-option>
                    <el-option label="已下架" value="0" ></el-option>
                </el-select>
                <el-input placeholder="昵称" v-model="userName" style="width:200px;"></el-input>&nbsp;&nbsp;
                <el-input placeholder="手机号" v-model="telephone" style="width:200px;"></el-input>&nbsp;&nbsp;
                <span><el-button type="primary" @click="search()">搜索</el-button></span>
              
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
            <el-table-column prop="weight" label="权重">
            </el-table-column>
            <el-table-column prop="ratio" label="抽成(%)">
            </el-table-column>
            <el-table-column prop="description" label="简介">
            </el-table-column>
            <el-table-column prop="remarks" label="备注">
            </el-table-column>
            <el-table-column label="状态">
                <template scope="scope">
                    <span style="margin-left: 10px">{{scope.row.isOpen|changStatus}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="following" label="粉丝数">
            </el-table-column>
            <el-table-column label="操作" width="140px">
                <template scope="scope">
                    <el-button size="small"  type="text" @click="edit(scope.row.userId,scope.row.weight,scope.row.ratio,scope.row.remarks,scope.row.description)">编辑</el-button>
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
                <el-form-item label="种类名称">
                </el-form-item>
               
                <el-form-item label="自定义代码">
                    <el-input
                        type="textarea"
                        :rows="10"
                        placeholder="请输入内容"
                        v-model="form.title">
                    </el-input>
                </el-form-item>
                </el-form>
        
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="dialogFormVisible2">
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
    </el-dialog>
    </div>
</template>

<script>
  import { addNetred,getNetred,editNetred,uplisting} from '../../api/manager.js'
  import { timestampToTime } from '../../utils/enum.js'
  export default {
    data(){
      return {
        isOpen:'',
        tableData:{},
        loading2:false,
        tel:'',
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
          tag:'',
          notice:'',
          resultUrl:'',
          pic:'',
          resultShow:'false',
          resultSources:'点击查看数据来源',
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
                    this.search(this.pageNo);
                });
            }).catch(() => {
                return;          
            });
        },
        removeDomain(item) {
            var index = this.form.options.indexOf(item);1
            var length=this.form.options.length;4
            if (index !== -1){
                this.form.options.splice(index, 1);
                if(index!=length-1){
                for(var i=index;i<length-1;i++){
                    this.form.options[i].optionKey=this.optionArray[i];
                }
                }
            }
        },
        addDomain() {
            var length=this.form.options.length;
            this.form.options.push({
            optionValue:'' ,
            optionKey:this.optionArray[length],
            key: Date.now()
            });
        },
        upload(){
         return '/backend/image/save';
        },
        beforeAvatarUpload(file) {
            let type=file.type;
            const isJPG =(type === 'image/jpeg'||type==='image/png'||type==='image/jpg'||type==='image/bmp');
            const isLt2M = file.size / 1024 / 1024 < 1;
            if (!isJPG) {
            this.$message.error('上传图片只能是图片格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 1MB!');
            }
            return isJPG && isLt2M;
        },
        submit(){
            addNetred({tel:this.tel}).then(response=>{
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
                this.dialogFormVisible=false;
                this.search(this.pageNo);
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
        edit(id,weight,ratio,remarks,description){
            this.remarks=remarks;
            this.ratio=ratio;
            this.weight=weight;
            this.intro=description;
            this.userId=id;
            this.dialogFormVisible2=true;
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