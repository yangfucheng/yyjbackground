<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
  <el-tab-pane label="项目详情" name="first">
  <div class="contain">
   	<div class="wrap">
      <div class="wrap-left">
        <div class="left">
          <div><label >标题</label></div>
          <div><span>#{{list.title}}# </span></div>
        </div>
        <!-- <div class="left">
          <div><label >项目选项</label></div>
          <div>
            <span>A选项:不会跌破</span>
            <ul>
              <li>当前收益/份:</li>
              <li>平均收益/份:</li>
              <li>参与人数/份:</li>
              <li>选项资金池/份:</li>
            </ul>
          </div>
        </div> -->
        <div class="left">
          <div><label >项目资金池</label></div>
          <div><span>{{list.tradeCoin}}</span></div>
        </div>
        <div class="left">
          <div><label >项目状态</label></div>
          <div><span>{{list.status}}</span></div>
        </div>
        <div class="left">
          <div><label >开始时间</label></div>
          <div><span>{{list.betStartTime | changeTime }}</span></div>
        </div>
        <div class="left">
          <div><label >结束时间</label></div>
          <div><span>{{list.betEndTime | changeTime}}</span></div>
        </div>
        <div class="left">
          <div><label >投注上线</label></div>
          <div><span>{{list.maxBet}}{{list.tradeCoin}}</span></div>
        </div>
         <div class="left">
          <div><label >投注下线</label></div>
          <div><span>{{list.mBet}}{{list.tradeCoin}}</span></div>
        </div>
              </div>
               <div class="wrap-right">
        <div class="right">
          <div><label >数据来源url</label></div>
          <div><span>{{list.resultUrl}}</span></div>
        </div>
        <div class="right">
          <div><label >数据来源</label></div>
          <div><span>{{list.resultSources}}</span></div>
        </div>
        <div class="right">
          <div><label >评论区设置</label></div>
          <div><span>{{list.notice}}</span></div>
        </div>
        <div class="right">
          <div><label >初始赔率</label></div>
          <div><span>{{list.awardRatioInitiator}}</span></div>
        </div>
         <div class="right">
          <div><label >开发者奖励</label></div>
          <div><span></span></div>
        </div>
        <div class="right">
          <div><label >投票奖励</label></div>
          <div><span></span></div>
        </div>
        <div class="right">
          <div><label >参与人数</label></div>
          <div><span></span></div>
        </div>
        <div class="right">
          <div><label >分享人数</label></div>
          <div><span></span></div>
        </div>
        <div class="right">
          <div><label >收藏数量</label></div>
          <div><span></span></div>
        </div>
        <div class="right">
          <div><label >评论数量</label></div>
          <div><span></span></div>
        </div>
      </div>
	   	
   	</div>
   	
   	<div class="footer">
   		<div class="title">操作记录</div>
   	</div>

  </div>
  </el-tab-pane>
  <el-tab-pane label="评论详情" name="second">
     <template>
        <el-row style="margin: 10px;">
            <el-col :span="22">
                <el-select v-model="type">
                    <el-option label="评论" value="comment" ></el-option>
                    <el-option label="回复" value="reply" ></el-option>
                </el-select>
                <el-input placeholder="请输入关键字" v-model="key" style="width:200px;"></el-input>&nbsp;&nbsp;
                <span><el-button type="primary" @click="search()">搜索</el-button></span>
            </el-col>
        </el-row>
        <el-table :data="tableData.result"   v-loading="loading2">
            <el-table-column prop="userName" label="用户名">
            </el-table-column>
            <el-table-column prop="content" label="评论内容">
            </el-table-column>
            <el-table-column label="创建时间">
                <template scope="scope">
                    <span style="margin-left: 10px">{{scope.row.createTime|changeTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="140px">
                <template scope="scope">
                    <el-button size="small"  type="text" @click="deleteC(scope.row.commentId)" v-show='type=="comment"'>删除</el-button>
                    <el-button size="small"  type="text" @click="deleteC(scope.row.replyId)" v-show="type=='reply'">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </template>
    <el-col :span="24" class="toolbar">
       <el-pagination  @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableData.pageNo" :page-size="tableData.pageSize" layout=" prev, pager, next,jumper" :total="tableData.totalCount" style="float:right;">
       </el-pagination>
    </el-col>
  </el-tab-pane>
  </el-tabs>
</template>
<script>
  import { detail,searchComment,deleteComment,deleteReply,searchReply} from '../../api/manager.js'
  import { timestampToTime } from '../../utils/enum.js'
  export default {
    data(){
      return {
        list: {
          title:'',
          betStartTime:'',
          betEndTime:'',
          awardRatioInitiator:'',
          status:'',
          maxBet:'',
          minBet:'',
          resultUrl:'',
          notice:'',
          tradeCoin:'',
        },
        activeName: 'first',
        key:'',
        type:'comment',
        tableData:{},
        loading2:false,
        projectId:'',
      }
    },
    created() {
      this.projectId=this.$route.params.id;
      this.fetch();
    },
    filters: {
      changeTime(value){
        return timestampToTime(value)
      }
    },
    methods: {
      fetch(){
        var params ={
          projectId:this.projectId
        };
        detail(params).then(response=>{
          this.list = response.body;
        })
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      deleteC(id){
        if(this.type=='comment'){
          var datafun=deleteComment;
        }else{
          var datafun=deleteReply;
        }
        datafun(id).then(response=>{
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.search(this.pageNo);
        });
      },
      getData(type,params){
        var self=this;
        if(type=='comment'){
          var datafun=searchComment;
        }else{
          var datafun=searchReply;
        }
        datafun(params).then(
          function(res){
            var json=res.body;
            self.tableData=json;
            self.loading2=false;
          }).catch(function(err){
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
        var keyword=this.key;
        var params={};
        params.pageNo=page;
        params.keyword=keyword;
        params.projectId=this.projectId;
        this.getData(type,params);
      },
    }
  }
</script>
<style lang="scss" scoped>
.el-tabs{
  margin:10px 30px;
}
	.contain{
		width:90%;
		margin:20px auto;
    .wrap{
      display:flex;
      justify-content:space-space;
      border-bottom:1px solid #CCC;
      .wrap-left{
        width:50%;
        .left{
          width:60%;
          display:flex;
          justify-content:space-between;
          min-height:50px;
          div:nth-child(1){
            width:120px;
            font-weight:600;
            align-self:center;
          }
          div:nth-child(2){
            font-size:12px;
            width:50%;
            align-self:center;
          }
        }
      }
      .wrap-right{
        width:50%;
        .right{
          width:60%;
          display:flex;
          justify-content:space-between;
          text-align: left;
          min-height:50px;
          div:nth-child(1){
            width:120px;
            font-weight:600;
            align-self:center;
          }
          div:nth-child(2){
            font-size:12px;
             width:50%;
             align-self:center;
          }
        }
      }
    }
		

	}
</style>