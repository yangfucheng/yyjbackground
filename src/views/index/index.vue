<template>
  <div class="contain">
    <div class="title"><h2>平台整体情况</h2></div>
    <div class="wrap">
      <div>
        <icon-svg icon-class="choose"/>
          <span class="label">投票项目</span>
          <div class="num">267</div>
          <div class="dec-wrap">
            <div>12/234/21</div>
            <div>审核/进行中/已结束</div>
          </div>
      </div>
     <div>
      <icon-svg icon-class="yuce"/>
          <span class="label">投票项目</span>
          <div class="num">267</div>
          <div class="dec-wrap">
            <div>12/234/21</div>
            <div>审核/进行中/已结束</div>
          </div>
      </div>
      <div>
        <icon-svg icon-class="user2"/>
          <span class="label">投票项目</span>
          <div class="num">267</div>
          <div class="dec-wrap">
            <div>12/234/21</div>
            <div>审核/进行中/已结束</div>
          </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .contain {
    .title {
      border:1px solid #ccc;
    }
    .wrap{
      margin-top:10px;
      display:flex;
      text-align: center;
      justify-content:space-around;
      .num{
        margin:5px 0 10px 0;
        font-size:35px;
        font-weight:400;
      }
      .dec-wrap{
        color:#CCCCCC;
        div{
          font-size:25px;
        }
      }
    }
  }

</style>