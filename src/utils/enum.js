export function timestampToTime(timestamp) {
	if(timestamp){
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D+h+m+s;
    }else{
    	return ''
    }
}

export function getTextById(obj,value){
  if(value === undefined ||  value === null || value === '' || !/^-?\d+$/.test(value)){
    return ''
  }
  for(let i in obj){
    if(obj[i].id == value){
      return obj[i].text
    }
  }
  return ''
}

export function getNameById(obj,value){
  for(let i in obj){
    if(obj[i].name == value){
      return obj[i].text || ''
    }
  }
  return ''
}


export const OrderStatus = {
  Online:{id:1,name:'online',text:'已上线'},
  Init:{id:2,name:'init',text:'待审核 '},
  WaitOnline:{id:3,name:'wait_online',text:'待上线'},
  WaitResult:{id:4,name:'wait_result',text:'等待结果 '},
  Check:{id:5,name:'check',text:'待投票 '},
  Cancel:{id:6,name:'cancel',text:'已作废 '},
  Complete:{id:7,name:'complete',text:'已结束 '},
}