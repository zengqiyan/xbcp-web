import qs from 'qs';
export const get = (url,params,respFunc) =>{
  debugger
  fetch(url+'?'+qs.stringify(params),
      {
          method: 'GET'
      }).then(res => { 
          let status = res.status
          res.json().then(json=>respFunc(status,json))
      }).catch(e => {
          alert(e)
      })
}

export const postForm = (url,params,respFunc) =>{
  fetch(url,
      {
          method: 'POST',
          body:qs.stringify(params)
      }).then(res => { 
        let status = res.status
        res.json().then(json=>respFunc(status,json))
      }).catch(e => {
          alert('请求出错')
      })
}

export const postRaw = (url,data,respFunc) =>{
  
  fetch(url,
  {
      method: 'POST',
      body:data
  }).then(res => { 
    let status = res.status
    res.json().then(json=>respFunc(status,json))
  }).catch(e => {
      alert('请求出错')
      
  })}