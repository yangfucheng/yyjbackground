<template>
	<div style="margin:30px;">
    <el-row style="margin: 10px;">
            <el-col>
                <el-button type="primary" @click="add">新增轮播图</el-button>
            </el-col>
    </el-row>
    <el-table :data="tableData"  v-loading="loading2">
            <el-table-column prop="categoryDes" label="页面">
            </el-table-column>
            <el-table-column prop="description" label="轮播图描述">
            </el-table-column>
            <el-table-column prop="banner" label="轮播图地址">
            </el-table-column>
            <el-table-column prop="directUrl" label="跳转链接">
            </el-table-column>
            <el-table-column prop="sort" label="排序值">
            </el-table-column>
            <el-table-column label="操作" width="140px">
                <template scope="scope">
                    <el-button size="small"  type="text" @click="edit(scope.row.id,scope.row.categoryId,scope.row.description,scope.row.banner,scope.row.directUrl,scope.row.sort)">编辑</el-button>
                    <el-button size="small"  type="text" @click='deleteB(scope.row.id)'>删除</el-button>
                </template>
            </el-table-column>
    </el-table>

    <el-dialog :title="msg" :visible.sync="dialogFormVisible">
       <el-form ref="form" :model="form" :rules='rules' label-width="100px">
            <el-form-item label="页面" prop='categoryId'>
                <el-select v-model="form.categoryId" placeholder="请选择页面">
                    <el-option :label="item.categoryDes" :value="item.id"  v-for='item in cateList' :key='item.id'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="轮播图描述" prop='description'>
                <el-input v-model="form.description" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="轮播图">
                <el-upload class="avatar-uploader" :action='upload()' :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                   <img v-if="banner" :src="banner" class="avatar">
                   <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span style="color:#888;font-size:12px;">上传图片大小不能超过2MB</span>
            </el-form-item>
            <el-form-item label="跳转地址" prop='directUrl'>
                <el-input v-model="form.directUrl" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序值" prop='sort'>
                <el-input v-model="form.sort" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
    </div>
</template>

<script>
  import { getClassifyList,getBannerList,saveBanner,updateBanner,deleteBanner} from '../../api/manager.js'
  import { timestampToTime } from '../../utils/enum.js'
  var qs=require("qs");
  export default {
    data(){
      return {
        msg:'新增轮播图',
        tableData:[],
        loading2:false,
        dialogFormVisible:false,
        form:{
            categoryId:'',
            description:'',
            directUrl:'',
            sort:'',
        },
        banner:'',
        cateList:[],
        rules:{
            categoryId: [
                { required: true, message: '请选择页面'}
            ],
            description: [
                { required: true, message: '请填写描述', trigger: 'blur'}
            ],
            directUrl: [
                { required: true, message: '请输入跳转链接', trigger: 'blur'}
            ],
            sort: [
                { required: true, message: '请输入排序值', trigger: 'blur'}
            ],
        },
        id:'',
      }
    },
    created() {
       this.getClassify();
       this.getData();
    },
    methods: {
        handleAvatarSuccess(res) {
            this.banner = res.body;
        },
        upload(){
           return '/backend/image/save';
        },
        beforeAvatarUpload(file) {
            let type=file.type;
            const isJPG =(type === 'image/jpeg'||type==='image/png'||type==='image/jpg'||type==='image/bmp');
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传图片只能是图片格式!');
            }
            if (!isLt2M) {
               this.$message.error('上传图片大小不能超过2MB!');
            }
            return isJPG && isLt2M;
        },
        getClassify(){
            getClassifyList().then(res=>{
                this.cateList=res.body;
            });
        },
        add(){
            this.msg='新增轮播图';
            this.form={};
            this.banner='';
            this.dialogFormVisible=true;
        },
        deleteB(id){
            this.$confirm('是否删除?', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                deleteBanner(qs.stringify({bannerId:id})).then(response=>{
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getData();
                });
            }).catch(() => {
                return;          
            });
        },
        submit(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let datafun=saveBanner;
                    let banner=this.banner;
                    let description=this.form.description;
                    let directUrl=this.form.directUrl;
                    let categoryId=this.form.categoryId;
                    let sort=this.form.sort;
                    let params={banner:banner,description:description,directUrl:directUrl,categoryId:categoryId,sort:sort};
                    if(this.msg!='新增轮播图'){
                        params.id=this.id;
                        datafun=updateBanner;
                    };
                    datafun(qs.stringify(params)).then(response => {
                        this.$message({
                            message: '保存成功!',
                            type: 'success'
                        });
                        this.dialogFormVisible=false;
                        this.getData();
                    })
                } else {
                    return false;
                }
            });
        },
        edit(id,categoryId,description,banner,directUrl,sort){
            this.msg='编辑轮播图';
            this.form.categoryId=categoryId;
            this.form.description=description;
            this.id=id;
            this.banner=banner;
            this.form.directUrl=directUrl;
            this.form.sort=sort;
            this.dialogFormVisible=true;
        },
        getData(){
            var self=this;
            this.loading2=true;
            getBannerList().then(
                function(res){
                    var json=res.body;
                    self.tableData=json;
                    self.loading2=false;
                }
            ).catch(function(err){
                self.loading2=false;
            });
        },
    }
  }
</script>

<style lang="scss" scoped>
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width:400px;
    height:200px;
    line-height: 180px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    max-width: 400px;
    max-height:200px;
    display: block;
    border: 1px dashed #d9d9d9;
  }
  .el-input{
    width:400px;
  }
</style>