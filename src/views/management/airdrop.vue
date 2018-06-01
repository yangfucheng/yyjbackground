<template>
	<div class='contain'>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
		    <el-form-item label="手机号" prop="tel">
		        <el-input v-model="ruleForm.tel"></el-input>
	        </el-form-item>
	        <el-form-item label="交易币种" prop="tradeCoin">
                <el-select v-model="ruleForm.tradeCoin" placeholder="请选择交易币种">
                    <!-- <el-option :label="item.coin" :value="item.coin" v-for='item in coinData' :key='item.coin'></el-option> -->
                    <el-option label="PPS" value="PPS" ></el-option>
                    <el-option label="GXS" value="GXS" ></el-option>
                </el-select>
            </el-form-item>
	        <el-form-item label="类型" prop="type">
                <el-select v-model="ruleForm.type" placeholder="请选择类型">
                    <el-option label="下注结算奖励" value="award"></el-option>
                    <el-option label="空投" value="air_drop"></el-option>
                    <el-option label="下注返还" value="bet_back"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="金额" prop="amount">
                <el-input v-model="ruleForm.amount"></el-input>
            </el-form-item>
            <el-form-item label="操作原因" prop="operateMemo">
                <el-input v-model="ruleForm.operateMemo"></el-input>
            </el-form-item>
            <el-form-item label="用户流水备注" prop="memo">
                <el-input v-model="ruleForm.memo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">空投</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getCoin,airdrop} from '@/api/manager'
var qs=require("qs");
export default {
  data() {
  	const checkTel =function(rule, value, callback){
  		let reg = /^1[0-9]{10}$/;
        if(!reg.test(value)){
          callback(new Error('请输入正确的手机号'));
        }
        callback();
    };
    const checkMoney =function(rule, value, callback){
    	let reg=/^\d+(\.\d+)?$/;
    	if(!reg.test(value)||value==0){
           callback(new Error('请输入大于0的金额'));
    	}else{
        if(value.indexOf(".")>=0){
    		let arr=value.split(".");
    		if(arr[1].length>8){
          callback(new Error('最多八位小数'));
        }
        callback();
        }
        callback();
    	}
      callback();
    };
    return {
    	coinData:[],
        ruleForm: {
            tel:'',
            tradeCoin:'',
            type:'',
            amount:'',
            operateMemo:'',
            memo:'',
        },
        rules:{
        	tel: [
                { required: true,validator: checkTel,trigger: 'blur'}
            ],
        	type: [
                { required: true, message: '请选择类型', trigger: 'change'}
            ],
            tradeCoin: [
                { required: true, message: '请选择交易币种', trigger: 'change'}
            ],
            amount: [
                { required: true,validator:checkMoney, trigger: 'blur'}
            ],
            operateMemo: [
                { required: true, message: '请填写操作原因', trigger: 'blur'}
            ],
            memo: [
                { required: true, message: '请填写用户流水备注', trigger: 'blur'}
            ]
        },
    }
  },
  created() {
    /*this.fetchData();*/
  },
  methods: {
   /* fetchData() {
      getCoin().then(response => {
        this.coinData=response.body;
      })
    },*/
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	let tel=this.ruleForm.tel;
          	let type=this.ruleForm.type;
          	let amount=this.ruleForm.amount;
          	let tradeCoin=this.ruleForm.tradeCoin;
          	let memo=this.ruleForm.memo;
          	let operateMemo=this.ruleForm.operateMemo;
          	let params={tel:tel,type:type,amount:amount,tradeCoin:tradeCoin,memo:memo,operateMemo:operateMemo}; 
            airdrop(qs.stringify(params)).then(response => {
              this.$message({
                message: '成功!',
                type: 'success'
              });
              this.ruleForm.tel='';
            })
          } else {
            return false;
          }
        });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    }
    }
}
</script>

<style lang='scss' scoped>
.el-select{
	width: 280px;
}
.demo-ruleForm{
	width:400px;
	margin:80px 40px;
}
</style>