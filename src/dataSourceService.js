import {get} from './request'


export const pageDataSources = (params,respFunc) =>{
    get('http://localhost:8080/dataSource/pageDataSources',params,(status,data)=>{
         if(status===200 && data.resultCode===200){
            respFunc(data.data);
         }else{
             alert(data.resultMessage)
         }
    })
}