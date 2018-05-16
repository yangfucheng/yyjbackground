<template>
  <div class="contain">
   	<div class="wrap">
      <div class="wrap-left">
        <div class="left">
          <div><label >标题</label></div>
          <div><span>#{{list.title}}# </span></div>
        </div>
        <div class="left">
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
        </div>
        <div class="left">
          <div><label >项目资金池</label></div>
          <div><span>19,234{{list.tradeCoin}}</span></div>
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
          <div><label >数据来源</label></div>
          <div><span>{{list.resultUrl}}</span></div>
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
          <div><span>2%</span></div>
        </div>
        <div class="right">
          <div><label >投票奖励</label></div>
          <div><span>2%</span></div>
        </div>
        <div class="right">
          <div><label >参与人数</label></div>
          <div><span>19,234</span></div>
        </div>
        <div class="right">
          <div><label >分享人数</label></div>
          <div><span>123</span></div>
        </div>
        <div class="right">
          <div><label >收藏数量</label></div>
          <div><span>123</span></div>
        </div>
        <div class="right">
          <div><label >评论数量</label></div>
          <div><span>123</span></div>
        </div>
      </div>
	   	
   	</div>
   	
   	<div class="footer">
   		<div class="title">操作记录</div>
   	</div>

  </div>
</template>
<script>
  import { detail } from '../../api/manager.js'
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
          tradeCoin:''
        }
      }
    },
    created() {
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
          projectId:1
        }
        detail(params).then(response=>{
          this.list = response.body;
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
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