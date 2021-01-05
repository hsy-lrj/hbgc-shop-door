// 退出登录
if ($( '#signOut' )) {
    $( '#signOut' ).onclick = function () {
                localStorage.removeItem( 'userInfo' )
                alert('退出登录 成功')
                userInfo('../login/login.html')
        jumpPage('../login/login.html')
    }
}



/*
* 渲染购物车列表
*   参数1 => 购物车列表
* */
function shoppingCartListFun ( data ) {
    $( '#productListBox' ).innerHTML = ''
    data.forEach( item => {
        $( '#productListBox' ).innerHTML += `
        <ul class="productList">
            <li class="select">
<!--                <input name="${item.goodsid}" ${ item.checked ? 'checked' : '' } class="commoditySelection" type="checkbox">-->
                <input name="${item.shoppingCartId}" class="commoditySelection" type="checkbox">
            </li>
            <li class="commodity productTitle">
                <img class="floatLeft" src="${ item.imgurl }" alt="">
                <p class="floatLeft">${ item.goodsname }</p>
            </li>
            <li class="unitPrice">
                ￥${ item.price }
            </li>
            <li class="number">
                <input class="changeQuantity" name="${item.shoppingCartId}" type="Number" value="${ item.amount }">
            </li>
            <li class="totalPrice">
                ¥<span class="totalPriceNum">${ item.amount * item.price }</span>
            </li>
            <li class="operating">
                <span id="deleteShoppingCart" name="${item.shoppingCartId}">删除</span>
            </li>
        </ul>`
    } )
}

/*
* 计算选中的价格
*   参数1 => 小计的数组
*   参数2 => 计算后渲染的dom
* */
function allPrice ( commodityList , dom ) {
    dom.innerText = 0;
    for (let item of commodityList) {
        let unitPrice = item.innerText.replace( /[^\d]/g , '' )
        dom.innerText = Number( dom.innerText ) + Number( unitPrice )
    }
}



// 点击全选
$( '#allSelect' ).onclick = function () {
    for (let item of $( '.commoditySelection' )) {
        item.checked = this.checked
    }
    // 判读是不是全选， 是全选 计算总价  不是 清零
    if (this.checked) {
        // 计算总价
        allPrice( $( '.totalPrice' ) , $( '#allPrice' ) )
    } else {
        $( '#allPrice' ).innerText = 0
    }
}


// 算总价格
function priceCalculation () {
    let arr = []; //checked 的值
    let domArr = []; // 选中的dom 元素
    /*
    * 第一层 吧 商品列表的checked值push到arr数组
    *
    * 第二层 吧 当前选中的小计dom 元素push到domArr数组
    * */
    for (let item of $( '.commoditySelection' )) {
        arr.push( item.checked )
        if (item.checked) {
            for (let i of item.parentNode.parentNode.children) {
                if (i.className === 'totalPrice') {
                    domArr.push( i )
                }
            }
        }
    }

    // 修改全选的 checked 值
    if (arr.length > 0){
        $( '#allSelect' ).checked = arr.every( i => i )
    }


    // 修改选中的价格
    if (domArr.length > 0) {
        allPrice( domArr , $( '#allPrice' ) )
    } else {
        allPrice( domArr , $( '#allPrice' ) )
    }

}

priceCalculation()


function changeTheNumberOfGoods (item){

    if(item.value <= 1){
        item.value = 1
        alert('数值不能小于1')
    }else if(item.value >= 100){
        item.value = 100
        alert('数值不能超过100')
    }
    // 渲染购物车列表列表
    request( 'post','/door/shoppingCart/update',{
        amount:item.value,
        shoppingCartId:item.name
    },function (res) {
        // 渲染页面
        console.log(res.code)
    })
    // 改变后选中
    item.parentNode.parentElement.firstElementChild.firstElementChild.checked = true

    let unitPrice = Number(item.parentNode.previousElementSibling.innerText.replace( /[^\d]/g , '' ))
    let totalPrice = item.parentNode.nextElementSibling.firstElementChild
    totalPrice.innerText = unitPrice * item.value
    priceCalculation()
}

// 去结算
$('#toSettle').onclick=function () {

    if(localStorage.getItem('userInfo')){
        let selected = [];
        for (let item of $( '.commoditySelection' )) {
            selected.push(item.checked)
        }
        // 判断 是否有 勾选
        if(selected.some(i=>i)){
            let selectedList = []
            for (let item of $( '.commoditySelection' )){
                // 判断哪个是 选中的
                if(item.checked){
                    selectedList.push(item.name)
                }
            }
            console.log(selectedList)
            // 添加订单
            request( 'post','/door/shoppingCart/accounts ',{
                shoppingCartIds:selectedList
            },function (res) {
                if(res.code === 200){
                    alert(res.msg)
                    // 渲染购物车列表列表
                    request( 'post','/door/shoppingCart/list',{
                        userId:JSON.parse(localStorage.getItem('userInfo')).userId
                    },function (res) {
                        // 渲染页面
                        shoppingCartListFun( res )
                    })
                }
            })
        }else{
            alert('没有选中商品')
        }

    }else {
        /* 需要登录 */
        jumpPage('../login/login.html')
    }
}


// 渲染购物车列表列表
request( 'post','/door/shoppingCart/list',{
    userId:JSON.parse(localStorage.getItem('userInfo')).userId
},function (res) {
    // 渲染页面
    shoppingCartListFun( res )
})

$('#productListBox').onclick=function (e) {
    // 删除 购物车列表 项
    if (e.target.id === 'deleteShoppingCart'){
        request( 'post','/door/shoppingCart/delete ',{
            shoppingCartId:e.target.getAttribute('name')
        },function (res) {
            if(res.code === 200){
                alert(res.msg)
            }
        })
    }else if(e.target.className === 'commoditySelection'){
        // 购物车列表 项 选中
        e.target.onclick = priceCalculation()
    }else if(e.target.className === 'changeQuantity'){
        e.target.onchange= changeTheNumberOfGoods(e.target)
    }
}


