/*
* 封装获取dom元素
*
* 参数1 => dom 页面元素
*   $('#dom元素id')     $('#app')
*   $('.dom元素class')  $('.app')
*   $('dom元素')        $('div')
*
* */
function $ ( dom ) {
    let selector = dom.substr( 0 , 1 )
    if (selector === '#') {
        return document.getElementById( dom.substr( 1 ) )
    } else if (selector === '.') {
        return document.getElementsByClassName( dom.substr( 1 ) )
    } else {
        return document.getElementsByTagName( dom )
    }
}



/*
* 封装分页
*
* 参数1 => dom  是要渲染的区域
*
* 参数2 => quantity 商品总数
*
* 参数3 => count 每页条数
* */
function pagination ( dom , quantity ,count) {
    dom.innerHTML = ''
    for (let i = 0 ; i < Math.ceil( quantity / count ) ; i++) {
        dom.innerHTML += `<li class="floatLeft ${ i === 0 ? 'active' : '' }">${ i + 1 }</li>`
    }
}

/*
* 封装请求
* 参数
* 参数1 => requestMethod  请求方式 get post
*
* 参数2 => requestUrl  请求地址
*
* 参数3 => requestBody 请求传参 格式 对象 {} 如果不传值 就穿 false
*
* 参数4 => func 接口请求成功的回调函数
*
* 状态码
*   200 成功
*   0 失败
*
* */

function request ( requestMethod,requestUrl,requestBody,func ) {
    //  (1) 获取 XMLHttpRequest对象
    let xmlHttp = new XMLHttpRequest();
    //  (2) 连接服务器
    xmlHttp.open( requestMethod , "http://127.0.0.1:8081"+requestUrl , true );
    let formData = new FormData();
    if(requestBody){
        for (let key in requestBody) {
            formData.append( key , requestBody[key] )
        }
    }
    //  (3) 发送数据
    xmlHttp.send( formData );   // 请求体数据
    // （4） 回调函数  success
    xmlHttp.onreadystatechange = function () {
        if(xmlHttp.readyState === 4 && xmlHttp.status===200){
            func(JSON.parse(xmlHttp.responseText))
        }
    };
}



/*
* 获取地址栏参数
* 参数1 => queryStr 网址 window.location.href
* */
function getQueryParams(queryStr) {
    queryStr = queryStr.substring(queryStr.indexOf('?')+1);
    //  提取里面的key和value
    const queryList = queryStr.split("&");
    let obj = {}
    queryList.forEach(item=>{
        let arr = item.split("=");
        obj[arr[0]] = decodeURI(arr[1]);
    })
    return obj;
}

/*
*
* 封装tab切换
*
*   参数1 => tabs 点击的标签 是数组，数组的每一项是对象 建议传 $('.tabs')
*   参数2 => 内容  切换的内容 是数组，数组的每一项是对象 建议传 $('.')
*   参数3 => tabs 选中的类名
*   参数4 => 内容  显示的类名 默认设置为 active
*   参数5 => tabs 类名 默认 ''
*   参数6 => 内容  类名 默认 ''
*
* */
function tabSwitch (
    tabs,
    content,
    tabsActive='active',
    contentActive='active',
    tabsClass='',
    contentClass='',
) {
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].onclick = function () {
            change(this)
        }
    }
    function change(obj) {
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i] === obj) {
                tabs[i].className = `${tabsClass} ${tabsActive}`;
                content[i].className = `${contentClass} ${contentActive}` ;
            } else {
                tabs[i].className = tabsClass;
                content[i].className = contentClass;
            }
        }
    }
}


// 渲染个人信息
function userInfo (url) {
    // 判断个人信息展示
    if (localStorage.getItem( 'userInfo' )) {
        $( '#logInShow' ).innerHTML = `<div class="userNickname">
        ${ JSON.parse( localStorage.getItem( 'userInfo' ) ).nickname }
        <div class="signOut" id="signOut">退出登录</div>
        </div>`
    }else {
        $( '#logInShow' ).innerHTML = `<span>
                    欢迎光临当当，请 <a href="/page/login/login.html" class="logInbtn1"> 登录</a>
                </span>`
    }
}

/* 判断有$( '#logInShow' ) dom 元素 就调用渲染个人信息函数 */
if($( '#logInShow' )){
    userInfo()
}


/*
* 封装跳转页面
*   参数1 => url 要跳转的地址
* */
function jumpPage (url) {
    window.location.href = url
}


/*
* 购物车商品数量
* */
if($('#numberOfShoppingCarts')){
    request( 'post','/door//shoppingCart/list',{
        userId:JSON.parse(localStorage.getItem('userInfo')).userId
    },function (res) {
        // 渲染页面
        $('#numberOfShoppingCarts').innerHTML = res.length
    })
}

