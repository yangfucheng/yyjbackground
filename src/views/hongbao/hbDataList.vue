<template>
  <div class="contain">
   <el-form :inline="true" :model="formInline" class="from-inline">
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
      <el-select v-model="formInline.inUse" placeholder="请选择状态">
        <el-option label="上架" value="true"></el-option>
        <el-option label="下架" value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="">
        <el-select v-model="formInline.place" placeholder="红包存放地点">
          <el-option label="预测市场" value="index"></el-option>
          <el-option label="智慧网红" value="user"></el-option>
          <el-option label="预测pk" value="pk"></el-option>
         
        </el-select>
    </el-form-item>
      <el-form-item label="">
        <el-input v-model="formInline.title" placeholder="请输入标题"></el-input>
      </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit()">查询</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="list" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" border @row-dblclick="dblclickOnRow">
    <el-table-column prop="title" label="标题" sortable >
      <template slot-scope="scope" >
        {{scope.row.title}}
      </template>
    </el-table-column>
    <el-table-column prop="place" label="位置" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.place}}
      </template>
    </el-table-column>
    <el-table-column prop="date" label="项目状态" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.inUse | isInuser}}
      </template>
    </el-table-column>
     <el-table-column prop="betStartTime" label="开始时间" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.startTime}}
      </template>
    </el-table-column>
     <el-table-column prop="betEndTime" label="已抢人数" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.receiveAmount}}
      </template>
    </el-table-column>
     <el-table-column prop="title" label="未抢人数" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.notSnatchNumber}}
      </template>
    </el-table-column>
     <el-table-column prop="ratio" label="参与人数" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.joinNumber}}
      </template>
    </el-table-column>
     <el-table-column prop="capitalPool" label="抢到人数" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.luckyNumber}}
      </template>
    </el-table-column>
     <el-table-column prop="tradeCoin" label="有效时间" sortable show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.validTime}}min
      </template>
    </el-table-column>
     <el-table-column  label="总红包" sortable show-overflow-tooltip>
      <template slot-scope="scope">
         {{scope.row.amount}}
      </template>
    </el-table-column>
    <el-table-column label="操作"  width="120">
      <template slot-scope="scope">
        <el-button @click.native.prevent="befor(scope.row)" type="text" size="small" >
          详情
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination @current-change="handleCurrentChange" :current-page="pageNum"
    :page-sizes="[15]"
    :page-size="per_page"
    layout="total, sizes, prev, pager, next, jumper"
    :total='total'>
  </el-pagination>
  <el-dialog title="修改项目权重" :visible.sync="dialogFormVisible">
    <el-form >
      <el-form-item label="修改项目权重" :label-width="formLabelWidth">
        <el-input v-model="update" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit1">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog :title="title" :visible.sync="dialogFormVisible1">
    <el-form >
      <el-form-item :label="title" :label-width="formLabelWidth">
        <el-input v-model="beforeReson" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible1 = false">取 消</el-button>
      <el-button type="primary" @click="submit1">确 定</el-button>
    </div>
  </el-dialog>
  </div>
</template>
<script>
  import { hbData,hbDetail } from '../../api/manager.js'
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
        formInline: {
          title	:'',
          place:"",
          inUse:'',
       
        },
        pageNum:1,
        dialogFormVisible:false,
        dialogFormVisible1:false,
        update:0,
        list:[],
        per_page:1,
        total:1,
        type:'',
        projectId:'',
        title:'',
        beforeReson:'',
        formLabelWidth:"120",
        form:[]
      }
    },
    created() {
      this.fetch();
      // alert(this.demo)
    },
    filters: {
      changeTime(value){
        return timestampToTime(value)
      },
      changStatus(value){
        return getNameById(OrderStatus,value)
      },
      isInuser(value){
          if(value==true){
              return '上架中';
          }else{
              return '下架'
          }
      }
    },
    methods: {
      fetch(){
        var params = {
          title:this.formInline.title,
          place	:this.formInline.place,
          inUse	:this.formInline.tradeCoin,
        }
        // if(this.formInline.datePicker != null && this.formInline.datePicker.length > 1){
        //   params.betStartTime = parseTime(this.searchObj.dateRange[0],'{y}-{m}-{d}')
        //   params.betEndTime = parseTime(this.searchObj.dateRange[1],'{y}-{m}-{d}')
        // } else {
        //   params.betStartTime = ''
        //   params.betStartTime = ''
        // }

        hbData(params).then(response =>{
          this.list = response.body;
          this.total =response.body.totalCount;
        })
      },
      handleCurrentChange(val){ 
        this.pageNum = val;
        this.fetch();
      },
      dblclickOnRow(row){
        this.$router.push({
          name:'detail',
          params:{
            id:row.id
          }
        })
      },
      updateWei(row,type){
       this.projectId =row.id;
       this.dialogFormVisible =true;
       this.type = type;
      },
      befor(row,title,type){
         this.projectId =row.id;
         this.dialogFormVisible1 =true;
         this.type = type;
         this.title =title;
      },
      onSubmit() {
        this.fetch();
      },
      submit1(){
        if(this.type =="1"){
            var params ={
              projectId:this.projectId,
              weight:this.update
          }
          updateWeight(qs.stringify(params)).then(response=>{
             this.$message({
              message: '审核通过',
              type: 'success'
            });
          })
        }else if(this.type=="2"){
          var params ={
              projectId:this.projectId,
              reason:this.beforeReson
          }
          breakShort(qs.stringify(params)).then(response=>{
             this.$message({
              message: '设置成功',
              type: 'success'
            });
          })
        }else if(this.type=="3"){
          var params ={
              projectId:this.projectId,
              reason:this.beforeReson
          }
          cancel(qs.stringify(params)).then(response=>{
             this.$message({
              message: '设置成功',
              type: 'success'
            });
          })
        }
        this.fetch();
        this.beforeReson='';
        this.dialogFormVisible=false
        this.dialogFormVisible1=false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .contain{
     width:90%;
     margin:10px auto;
    .from-inline{
      margin:10px 0;
      border-bottom:1px solid #ccc;
    }
  }
</style>