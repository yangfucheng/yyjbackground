<template>
  <div class="launch-contain">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="项目图片">
      <el-upload class="avatar-uploader" :action='upload()' :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="form.pic" :src="form.pic" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      </el-form-item>
      <el-form-item label="话题描述">
        <el-input type="textarea" v-model="form.notice" style='width:500px;'></el-input>
      </el-form-item>
       <el-form-item
          v-for="(domain, index) in form.options"
          :label="'选项' + optionArray[index]"
          :key="optionArray[index]"
          :prop="'options.' + index + '.optionValue'"
        >
          <input v-model="domain.optionValue" style="border:1px solid #ccc;height: 40px;width:200px;margin-right:10px;"></input><el-button @click.prevent="removeDomain(domain)" style="display: inline-block">删除</el-button>
        </el-form-item>
          <el-button @click="addDomain" style="margin-left:100px;margin-bottom:10px">新增选项</el-button>
     <!--  <el-form-item label="最大下注值">
        <el-input v-model="form.maxBet" placeholder="请输C选项"></el-input>
      </el-form-item>
      <el-form-item label="最小下注值">
        <el-input v-model="form.minBet" placeholder="请输C选项"></el-input>
      </el-form-item>
      <el-form-item label="货币">
        <el-input v-model="form.tradeCoin" placeholder="请输C选项"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="开始时间" >
        <el-date-picker v-model="form.projectStartTime" type="datetime" placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
       <el-form-item label="结束时间" >
             <el-date-picker v-model="form.projectEndTime" type="datetime" placeholder="选择日期时间">
             </el-date-picker>
          </el-form-item> -->
      <el-form-item label="话题归类">
        <el-select v-model="form.tag" placeholder="请选择话题归类">
          <el-option label="金融" value="finance"></el-option>
          <el-option label="体育" value="pe"></el-option>
          <el-option label="区块链" value="entertainment"></el-option>
          <el-option label="其他" value="other"></el-option>
          <el-option label="最强大脑" value="brain"></el-option>
          <el-option label="最强大脑已结束" value="overbrain"></el-option>
          <el-option label="胜负平" value="sfp"></el-option>
          <el-option label="比分" value="bifen"></el-option>
          <el-option label="进球数" value="jqs"></el-option>
          <el-option label="半全场" value="bqc"></el-option>
          <el-option label="世界杯已结束" value="over"></el-option>
          <el-option label="世界杯其他" value="otherworld"></el-option>
          <el-option label="世界杯热门" value="remenworld"></el-option>
           <!--  <el-option label="我的" value="mine"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="数据来源">
        <el-input v-model="form.resultSources" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="数据来源url">
        <el-input v-model="form.resultUrl" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="来源显示">
        <el-radio v-model="form.resultShow" label="true">是</el-radio>
        <el-radio v-model="form.resultShow" label="false">否</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="buttonLoading">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { savePro} from '../../api/manager.js'
var qs=require("qs");
export default {
  data() {
      return {
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
        loading:false,
        buttonLoading:false,
        optionArray:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
      }
   },
   methods: {
      handleAvatarSuccess(res, file) {
        this.loading=false;
        this.form.pic = res.body;
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
     onSubmit() {
      this.buttonLoading = true;
      var params = this.form;

      // params.projectEndTime="2018-05-11T11:12:14.409Z";
       savePro(params).then(response => {
          this.form.title = '';
          this.form.options =[{
            optionValue: '',
            optionKey:'A'
          }];
         this.form.tag = '';
         this.form.pic='';
         this.form.resultUrl='';
         this.form.notice='';
         this.buttonLoading = false;
         this.$message({
          message: '提交成功',
          type: 'success'
        });
        this.form.resultSources='';
        this.form.resultShow='false';
       })
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
      }
   }
  }
</script>
<style lang="scss">
  .launch-contain{
    .el-input__inner{
      width:500px;
    }
  }
</style>
<style lang="scss" scoped>
.launch-contain{
  margin:30px;
}
.from-inline{
  width:80%;
  .el-input__inner{
    width:200px;
  }
}
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 360px;
    height: 180px;
    line-height: 180px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    max-width: 360px;
    max-height: 180px;
    display: block;
  }
</style>