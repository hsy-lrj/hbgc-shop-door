/*
* 封装商品列表渲染
*
* 参数1 => list 是数组
* 参数2 => dom  是要渲染的区域
*
* */
function renderProductList ( list , dom ) {
    dom.innerHTML = ''
    list.forEach( item => {
        dom.innerHTML += `<li class="commodityItem">
                <a href="./page/productDetails/productDetails.html?id=${ item.goodsid }">
                <div class="productPicture">
                   <img src="${ item.imgurl }" alt="" >
               </div>
               <div class="productTitle">${ item.goodsname }</div>
               <div class="commodityPrice">
                   <i>￥</i>
                   <span class="price">${ item.price }.<span class="mantissa">00</span></span>
               </div>
            </a></li>`
    } )
}

// 当前页码
var currentPage = 1;
/*
* 封装获取商品列表
*
* 参数1 => page 页数
* 参数2 => pagination 是否从新渲染 分页 默认 true
* */

function getProductList ( page ,search, isPagination = true ) {
	currentPage = page;
    request( 'post' , '/door/goods/pager' , {
        page : page ,
        limit : 10 ,
        search:search
    } , function ( res ) {
        if (res.code === 200) {
            // 渲染商品
            renderProductList( res.data , $( '#commodity' ) )
            if (isPagination) {
                // 分页
                pagination( $( '#pageNumber' ) , res.count , 10 )
            }

        }
    } )
}


getProductList( 1 ,"", )

document.getElementById("searchBtn").onclick=function(){
    var search = document.getElementById("search").value;
	getProductList( 1 ,search, )
}

// 退出登录
if ($( '#signOut' )) {
    $( '#signOut' ).onclick = function () {
        localStorage.removeItem( 'userInfo' )
        alert('退出登录 成功')
        userInfo( './page/login/login.html' )
        jumpPage('./page/login/login.html')
    }
}


// 点击分页  切换
$( '#pageNumber' ).onclick = function ( e ) {
    for (let i of this.children) {
        i.className = 'floatLeft'
    }
    e.target.className = 'floatLeft active';
    currentPage =  e.target.innerText;
    var search = document.getElementById("search").value;
    getProductList( currentPage,search , false )
}


// 下一页
$( '#nextPage' ).onclick =function () {
    let doms = $( '#pageNumber' ).children ;
    for (let i = 0 ; i < doms.length ; i++) {
        if(doms[i].className === 'floatLeft active'){

            if(i < doms.length - 1){
                doms[i + 1].className = 'floatLeft active'
                doms[i].className = 'floatLeft'
                // 
                    var search = document.getElementById("search").value;
                 getProductList( ++currentPage ,search, false )
            }else {
                alert('到最后了')
            }
            return
        }

    }
}

// 上一页
$( '#previousPage' ).onclick =function () {
    let doms = $( '#pageNumber' ).children ;
    for (let i = doms.length -1 ; i >= 0 ; i--) {
        if(doms[i].className === 'floatLeft active'){
            if(i > 0){
                doms[i - 1].className = 'floatLeft active'
                doms[i].className = 'floatLeft'
                	 var search = document.getElementById("search").value;
                    getProductList( --currentPage,search , false )
            }else {
                alert('到第一页了')
            }
            return
        }

    }
}


