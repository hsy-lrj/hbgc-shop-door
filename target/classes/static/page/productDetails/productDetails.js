// 商品渲染
function productDetails ( obj ) {
    $( '#productImg' ).src = obj.imgUrl
    $( '#productTitle' ).innerHTML = obj.goodsName
    $( '#commodityPrice' ).innerHTML = obj.price
    $( '#productContent' ).innerHTML = obj.desc
}

// 商品的详细信息
let product = null;


// 退出登录
if ($( '#signOut' )) {
    $( '#signOut' ).onclick = function () {
        localStorage.removeItem( 'userInfo' )
        alert( '退出登录 成功' )
        userInfo( '../login/login.html' )
        jumpPage( '../login/login.html' )
    }
}

/* 商品数量的最大值和最小值 */
$( '#amountOfGoods' ).onchange = function () {
    if ($( '#amountOfGoods' ).value <= 1) {
        $( '#amountOfGoods' ).value = 1
        alert( '数值不能小于1' )
    } else if ($( '#amountOfGoods' ).value >= 100) {
        $( '#amountOfGoods' ).value = 100
        alert( '数值不能超过100' )
    }
}

// 添加购物车
$( '#addToCart' ).onclick = function () {
    // 判断用户是否登录
    if (localStorage.getItem( 'userInfo' )) {
        /* 商品详情 */
        request( 'post' , '/door/shoppingCart/add' , {
            goodsId : product.goodsId ,
            userId : JSON.parse( localStorage.getItem( 'userInfo' ) ).userId ,
            amount : $( '#amountOfGoods' ).value
        } , function ( res ) {
            if (res.code === 200) {
                alert( res.msg )
                request( 'post' , '/door//shoppingCart/list' , {
                    userId : JSON.parse( localStorage.getItem( 'userInfo' ) ).userId
                } , function ( res ) {
                    // 渲染页面
                    $( '#numberOfShoppingCarts' ).innerHTML = res.length
                } )
            }
        } )
    } else {
        /* 需要登录 */
        jumpPage( '../login/login.html' )
    }
}

/* 商品详情 */
request( 'post' , '/door/goods/show' , {
    goodsId : getQueryParams( window.location.href ).id
} , function ( res ) {
    if (res.code === 200) {
        product = res.obj
        productDetails( res.obj )

    }
} )
