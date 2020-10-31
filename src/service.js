import qs from 'qs';

let href = window.location.href;
let host = href.substring(0,href.indexOf("/Postkid"));
//host = "http://localhost:8080"
let applications;
let currentApplicationKey;
var apiDocs 
export const getHost = () => {
     return host
}
export const  loadApplications = () =>{
    if(applications){
        return applications;
    }
    applications = [];
    try {
        var request = new XMLHttpRequest();
        request.open('GET', host+'/Postkid/loadApplications', false);
        request.send(null);
        if (request.status === 200) {
                applications = JSON.parse(request.responseText);
        }
        if(!applications || applications.length==0){
            applications=[];
        }else{
            let hash;
            if(href.indexOf("#")>-1){
               hash = href.substring(href.indexOf("#")+1);
            }
            if(hash && hash !=""){
                let hashArr = hash.split(":");
                let applicationKey =  hashArr[0];
                currentApplicationKey = applications.filter(e=>e.key === applicationKey).map(e=>e.key)[0];
            }
            if(!currentApplicationKey){
                currentApplicationKey=applications[0]["key"];
            }
        }
    } catch (error) {
            //alert("加载应用出错！")
    }
    return applications;
}
export const setCurrentApplicationKey = (applicationKey) => {
    currentApplicationKey = applicationKey;
}
export const getCurrentApplicationKey = () => {
    return currentApplicationKey
}
export  const loadApiDocs=()=>{
      try {
        var request = new XMLHttpRequest();
        request.open('GET', host+'/Postkid/loadApiDocs', false);
        setPostkidProxyApplicationKey(null,request)
        request.send(null);
        if (request.status === 200) {
            apiDocs = JSON.parse(request.responseText);
            return apiDocs;
        }else{
            alert("加载Postkid出错,请检查应用配置！")
        } 
      } catch (error) {
        alert("加载Postkid出错,请检查应用配置！")
      }
       
}
function setPostkidProxyApplicationKey(headers,request){
    if(headers){
        headers["postkid-application-key"] = currentApplicationKey;
    }
    if(request){
        request.setRequestHeader("postkid-application-key",currentApplicationKey)
    }
}
//module.exports = loadApiDocs;
export const get = (url,headers,params,setResp) =>{
    setPostkidProxyApplicationKey(headers)
    fetch(url+'?'+qs.stringify(params),
        {
            method: 'GET',
            headers:headers
        }).then(res => { 
            let status = res.status
            let resHeaders = []
            res.headers.forEach((v,k)=>{resHeaders.push({'headerName':k,'headerValue':v})})
            let resContentType = res.headers.get('content-type');
            if(resContentType.includes("application/json")){
                res.json().then(json=>setResp(JSON.stringify(json, undefined,4),status,resHeaders))
            }else{
                res.text().then(text=>setResp(text,status,resHeaders))
            }
        }).catch(e => {
            alert('请求出错')
            setResp("",null,[])
        })
}

export const postForm = (url,headers,params,setResp) =>{
    setPostkidProxyApplicationKey(headers)
    fetch(url,
        {
            method: 'POST',
            headers:headers,
            body:qs.stringify(params)
        }).then(res => { 
            let status = res.status
            let resHeaders = []
            res.headers.forEach((v,k)=>{resHeaders.push({'headerName':k,'headerValue':v})})
            let resContentType = res.headers.get('content-type');
            if(resContentType.includes("application/json")){
                res.json().then(json=>setResp(JSON.stringify(json, undefined,4),status,resHeaders))
            }else{
                res.text().then(text=>setResp(text,status,resHeaders))
            }
        }).catch(e => {
            alert('请求出错')
            setResp("",null,[])
        })
}

export const postRaw = (url,headers,data,setResp) =>{
    setPostkidProxyApplicationKey(headers)
    fetch(url,
    {
        method: 'POST',
        headers:headers,
        body:data
    }).then(res => { 
        let status = res.status
        let resHeaders = []
        res.headers.forEach((v,k)=>{resHeaders.push({'headerName':k,'headerValue':v})})
        let resContentType = res.headers.get('content-type');
        if(resContentType.includes("application/json")){
            res.json().then(json=>setResp(JSON.stringify(json, undefined,4),status,resHeaders))
        }else{
            res.text().then(text=>setResp(text,status,resHeaders))
        }
    }).catch(e => {
        alert('请求出错')
        setResp("",null,[])
    })
    //axios.post(url,data, {
   //     headers: headers
   //   }).then(res => {success(res)})
    //  .catch(function (e) {
    //    error(e);
     // });
}
var apiCaches = {}
export const getApiCache = (methodType,url) => {
    let apiCache = apiCaches[methodType+'_'+url]
    if(apiCache){
        return apiCache
    }
    if(apiDocs){
        let apiModules = apiDocs.apiModules
        for (let i=0;i<apiModules.length;i++)
         {
           let apiModule = apiModules[i]
           let apis =  apiModule.apiDocs
           for (var j=0;j<apis.length;j++){
            let api = apis[j]
            if(api.methodType ===  methodType && api.url ===  url){
                apiCache = api
            }
           }
          }
         if(apiCache){
            let reqType = apiCache["reqType"];
            
            apiCache["reqHeaderTableData"] = buildTableDataByProps(apiCache.reqHeaders,true)
            apiCache["reqParamTableData"] = buildTableDataByProps(apiCache.reqParams,true)
            apiCache["respParamTableData"] = buildTableDataByProps([apiCache.respParam],true)
            
            if(reqType==="raw"){
                if(apiCache.reqParams && apiCache.reqParams!=null){
                    apiCache["reqSampleJson"] = buildSampleJsonByProp({},apiCache.reqParams[0],null,true);
                }
            }
            var formParams = [];
            if(reqType === "form"){
               var formParamProp=[]
               for (var i=0;i<apiCache.reqParams.length;i++){
                          formParams.push.apply(formParams,getFormParam(apiCache.reqParams[i]));
                          formParamProp.push.apply(formParamProp,buildFormParamProp(apiCache.reqParams[i]));
               }
               apiCache["formParams"] = formParams;
            } 
            apiCache["respSampleJson"] = buildSampleJsonByProp({},apiCache.respParam);
            apiCaches[methodType+'_'+url] = apiCache;
         }
    }
    return apiCache;
}

const buildTableDataByProps = (props,isInit) => {
    
    let data = []
    for (let i=0;i<props.length;i++){
        let prop = props[i];
        if(!prop || prop ==null){
            continue;
        }
        var paramTableData = {key:uuid(),name:prop.name!=null?prop.name:"",desc:prop.desc!=null?prop.desc:""
                         ,required:prop.required!=null?prop.required+"":"false",dataType:prop.type,defaultValue:prop.defaultValue!=null?prop.defaultValue:""}
        let isArray = false;             
        if(prop.type === "array"){
                paramTableData["dataType"] = prop.item.type + "[]"
                prop = prop.item
                isArray = true;
        }
        if(prop.type === "object"){
            paramTableData["ref"] = prop.ref
            paramTableData["children"]=[]
            if(isInit && props.length==1 && !isArray){
                //paramTableData["children"]=buildChildrenTableDataByRef(prop.ref)
                return buildChildrenTableDataByRef(prop.ref)
            }
        }
        data.push(paramTableData)
     }
     return data;
}
export const buildChildrenTableDataByRef = (ref) => {
      let model = apiDocs.paramModelDocs[ref];
      let properties = model.properties
      if(properties && properties!=null){
        return buildTableDataByProps(properties)
     }
     return null;
}



function buildSampleJsonByProp(json,prop,set,isStart){
    if(!prop){
      return json;
    }
    if( !isStart && prop && prop.name && prop.name!=null && prop.name!=""){
      json[prop.name] = getSampleJsonValueByProp(prop,set);
    }else{
      json = getSampleJsonValueByProp(prop,set);
    }
    return json
 }
 function getSampleJsonValueByProp(prop,set){
      var value;
      var type = prop.type;
      if(type == "undefined"){
         value = {}
      }
      if(type == "string"){
           value = ""
      }
      if(type == "number"){
           value = 0
      }
      if(type == "boolean"){
             value = false
      }
      if(type == "date"){
           value = Date.parse( new Date());
      }
      if(type == "enum"){
           value = ""
      }
      if(type == "object"){
           if(!set){
             set = {}
           }
           var newSet =  Object.assign({},set);
           if(newSet[prop.ref]){
              return {}
           }
           newSet[prop.ref] = true;
           var model = apiDocs.paramModelDocs[prop.ref];
           var modelJson = {};
           var properties = model.properties
           if(properties && properties!=null){
             for (var i=0;i<properties.length;i++){
                 modelJson = buildSampleJsonByProp(modelJson,properties[i],newSet)
             }
 
           }
           value = modelJson
      }
       if(type == "none"){
           value = {}
       }
      if(type == "array"){
         value = [getSampleJsonValueByProp(prop.item,set)]
      }
      return value
 }

 function getFormParam(prop){
    var formParams=[]
    if(prop.type == "object"){
              var model = apiDocs.paramModelDocs[prop.ref];
              var properties = model.properties
              for (var i=0;i<properties.length;i++){
                   formParams.push({"name":properties[i].name})
              }
    }else{
       formParams.push({"name":prop.name})
    }
    return formParams;
}
function buildFormParamProp(prop){
    var formParamProps=[]
    if(prop.type == "object"){
              var model = apiDocs.paramModelDocs[prop.ref];
              var properties = model.properties
              for (var i=0;i<properties.length;i++){
                  formParamProps.push(properties[i]);
              }
    }else{
       formParamProps.push(prop)
    }
    return formParamProps;
}


//=================历史===========================

export const storeHistory = (originalUrl,debuggerUrl,originalMethodType,debuggerMethodType,querys,bodyParams,headers,bodyFormRadio,reqSampleValue) =>{

    let historyId = uuid();
    let apiHistory = Object.assign({}, getApiCache(originalMethodType,originalUrl));
  	apiHistory["debuggerUrl"] = debuggerUrl;
  	if(querys){
  	  let formParams = [];
  	  for(var i in querys){
        let formParam = {"name":i,"defaultValue":querys[i]}
  	     formParams.push(formParam);
  	  }
      apiHistory["formParams"] = formParams;
  	}

  	if (headers) {
        let headerParams = []
      for(let i in headers){
          let headerParam = {"name":i,"defaultValue":headers[i]}
          if(i !== "postkid-application-key"){
            headerParams.push(headerParam);
          }
      }
      apiHistory["reqHeaders"] = headerParams;
  	}
      apiHistory["debuggerMethodType"] = debuggerMethodType;
      if(debuggerMethodType!="GET"){
          apiHistory["bodyFormRadio"] = bodyFormRadio;
          if(apiHistory["reqType"]=="raw"){
            apiHistory["reqSampleJson"] = JSON.parse(reqSampleValue);
          }
          if(apiHistory["reqType"]=="form"){
              if(bodyParams){
                  let formParams = [];
                  for(let i in bodyParams){
                         let formParam = {"name":i,"defaultValue":bodyParams[i]}
                  	     formParams.push(formParam);
                  }
                  apiHistory["formParams"] = formParams;
              }
          }
      }
      localStorage.setItem("Postkid-history_"+historyId,JSON.stringify(apiHistory));
      let historyList = JSON.parse(localStorage.getItem("Postkid-historyList"));
      if(!historyList){
          historyList = [];
      }
      let historyItem = {"historyId":historyId,"url":originalUrl,"desc":apiHistory.desc,"methodType":apiHistory.methodType};
      historyList.unshift(historyItem);
      if(historyList.length>200){
         let expireHistory = historyList.pop();
         if(expireHistory){
           localStorage.removeItem("Postkid-history_"+expireHistory.historyId);
         }
      }
      localStorage.setItem("Postkid-historyList",JSON.stringify(historyList));
      localStorage.setItem("Postkid-lastHistory_"+originalMethodType+"_"+originalUrl,historyId);
      return historyItem;
}
export const getApiHistory = (historyId) => {
    return _getApiHistory(historyId);
}
function  _getApiHistory(historyId){
    return JSON.parse(localStorage.getItem("Postkid-history_"+historyId));
}
//function toHistoryDoc(obj){
  //historyId = $(obj).attr("historyId");
  //apiHistory = getApiHistory(historyId);
  //buildDoc(apiHistory);
  //buildDebugger(apiHistory);
  //location.hash = ""
//}
export const loadLastHistoryDebugger = (methodType,url)=>{
  let historyId = localStorage.getItem("Postkid-lastHistory_"+methodType+"_"+url);
  let apiHistory = _getApiHistory(historyId);
  return apiHistory;
}
export const loadLastHistoryId = (methodType,url)=>{
    
    let historyId = localStorage.getItem("Postkid-lastHistory_"+methodType+"_"+url);
    return historyId;
  }
export const getHistoryList = () => {
  let  historyList = JSON.parse(localStorage.getItem("Postkid-historyList"));
  if(!historyList){
      historyList = [];
   }
   return historyList;
}

export const  delHistory = (historyId)=>{
    
   let apiHistory = _getApiHistory(historyId);
   localStorage.removeItem("Postkid-history_"+historyId);
   var historyList = JSON.parse(localStorage.getItem("Postkid-historyList"));
   if(!historyList){
     return;
   }
   let newHistoryList = [];
   let lastHistoryId;
   for(var i=0;i<historyList.length;i++){
        let historyItem = historyList[i];
        if(historyItem.historyId!=historyId){
           newHistoryList.push(historyItem);
        }
        if(!lastHistoryId && historyItem.url==apiHistory.url){
            lastHistoryId =  historyItem.historyId;
        }
   }
   localStorage.setItem("Postkid-historyList",JSON.stringify(newHistoryList));
   localStorage.setItem("Postkid-lastHistory_"+apiHistory.methodType+"_"+apiHistory.url,lastHistoryId);
}


function uuid(){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}

export const genUuid = () =>{
    return uuid();
}


export const saveGlobalParams = (globalParams) =>{
    if(!globalParams){
        return;
    }
    globalParams = globalParams.filter(item=>item.name && item.value && item.type).map(item=>({name:item.name,value:item.value,type:item.type}))
    let newGlobalParams = []
    for(let i=0;i<globalParams.length;i++){
        if(newGlobalParams.filter(item=>item.name == globalParams[i].name && item.value == globalParams[i].value).length==0){
            newGlobalParams.push(globalParams[i]);
        }
    }
    localStorage.setItem("Postkid-globalParams",JSON.stringify(newGlobalParams))
}

export const getGlobalParams = () =>{
    let globalParams = JSON.parse(localStorage.getItem("Postkid-globalParams"));
    if(!globalParams){
        globalParams = []
    }
     return globalParams
}