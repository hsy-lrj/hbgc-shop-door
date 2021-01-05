
/*
* 登录和注册 tab 切换
* */
tabSwitch(
    $('.tabs'),
    $('.logInRegister'),
    'active',
    'active',
    'floatLeft tabs',
    'logInRegister'
    )

/*
* 请求登录接口
* */
$('#logIn').onclick=function(){
    let username = $('#loginUserName').value
    let password = $('#loginPassword').value
    if(username === ''){
        return alert('账号不能为空')
    }else if(password === ''){
        return alert('密码不能为空')
    }
    let data = {
        username,
        password
    }
    request( 'post','/door/login',data,function (res) {
        if(res.code === 200){
            window.localStorage.setItem('userInfo',JSON.stringify(res.obj))
            alert(res.msg)
            window.location.href= '../../index.html';
        }else {
            alert(res.msg)
        }
    })
}

$('#registered').onclick=function () {
    // $('.registeredData')
    let obj ={}
    for(let item of $('.registeredData')){
        if(item.value === ''){
            return alert('请填写信息')
        }
        if(item.name === 'sex'){
            if(item.checked){
                obj = {
                    ...obj,
                    [item.name]:item.value
                }
            }
        }else {
            obj = {
                ...obj,
                [item.name]:item.value
            }
        }
    }
    request('post','/register',obj,function (res) {
        if(res.code === 200){
            alert(res.msg)
            window.location.href= './login.html';
        }else {
            alert(res.msg)
        }
    })
}

