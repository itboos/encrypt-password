/* eslint-disable no-unused-vars */
export function getUrlParams () {
  let search = window.location.search.substring(1);
  // sure have quertyString
  if (!/^\w+=/.test(search)) {
    // console.log('no queyString,return')
    return {}
  }
  const paramsArr = search.split('&');
  let paramObj = {}
  paramsArr.forEach((item) => {
    let tempArr = item.split('=');
    paramObj[tempArr[0]] = tempArr[1];
  });
  return paramObj
}

export function decodeBase64(encodedData) {
  let decodedData = '{}'
  try {
    // decodedData = decodeURIComponent(escape(window.atob(encodedData)))
    decodedData = b64DecodeUnicode(encodedData)
  } catch(e) {
    console.log('window.atob error:', e)
  }
  return decodedData
}

// base64 decode
function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}