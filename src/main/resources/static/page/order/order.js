// 退出登录
if ($( '#signOut' )) {
    $( '#signOut' ).onclick = function () {
        localStorage.removeItem( 'userInfo' )
        alert( '退出登录 成功' )
        userInfo( '../login/login.html' )
        jumpPage('../login/login.html')
    }
}



/*
* 封装订单列表渲染
*
* 参数1 => list 是数组
* 参数2 => dom  是要渲染的区域
*
* */
function renderProductList ( list , dom ) {
    list.forEach( item => {
        dom.innerHTML += `<li>
        <div class="itemHeader">
            <span class="itemHeaderTime">下单日期：<span>${ item.orderDate.substr( 0 , 10 ) }</span></span>
            <span>订单号：<span>${ item.orderid }</span></span>
        </div>
        <div class="itemMin">
            <div class="productPicture floatLeft">
                <img src="${ item.imgurl }" alt="">
            </div>
            <div class="productTitle floatLeft">
                ${ item.goodsname }
            </div>
            <div class="purchaseQuantity floatLeft">
                购买数量：<span>${ item.amount }</span>
            </div>
            <div class="purchaseQuantity addr floatLeft">
                送货地址：<span>${ item.addr }</span>
            </div>
            <div class="purchaseQuantity addr floatLeft">
                商品描述：<span>${ item.desc }</span>
            </div>
        </div>
    </li>`
    } )
}


if (localStorage.getItem( 'userInfo' )) {
    request( 'post' , '/door/order/listByUserId' , {
        userId : JSON.parse( localStorage.getItem( 'userInfo' ) ).userId
    } , function ( res ) {
        renderProductList( res , $( '#orderList' ) )
    } )

} else {
    jumpPage( '../login/login.html' )
}

