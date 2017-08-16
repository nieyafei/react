import {Toast} from 'antd-mobile';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import {Tool} from '../Tool';
import * as config from '../Config';
import {Api} from "../action/Api";
import defImage from '../../img/defo.jpg';
import defImage2 from '../../img/defo2.jpg';
const Util = {};
const {target,pathImage} = config;
import {countryJson} from '../../js/country';
/**
 * 基础验证
 * @param {object} mySetting 配置ajax的配置
 */
Util.showToast = function (content,time) {
    Toast.info(content,time);
};
/* 验证是否为空 */
Util.IsNull = function (obj) {
    var flag = false;
    if (obj == null || obj == undefined || typeof (obj) == 'undefined' || obj == '') {
        flag = true;
    } else if (typeof (obj) == 'string') {
        obj = obj.trim();
        if (obj == '') {//为空
            flag = true;
        } else {//不为空
            obj = obj.toUpperCase();
            if (obj == 'NULL' || obj == 'UNDEFINED' || obj == '{}') {
                flag = true;
            }
        }
    }
    else {
        flag = false;
    }
    return flag;
}

Util.Trim = function(str,is_global){
    var result = "";
    if(Util.IsNull(str)){
        result = str.replace(/(^\s+)|(\s+$)/g,"");
        if(is_global.toLowerCase()=="g"){
            result = result.replace(/\s/g,"");
        }
    }
    return result;
}

/*
 * 验证是否为手机号
 * */
Util.Phone= function (obj) {
    if(Util.IsNull(obj)){
        return false;
    }
    if(!(/^1(3|4|5|7|8)\d{9}$/.test(obj))){
        return false;
    }
    return true;
}
/*
 * 判断是否微信登录
 * */
Util.IsWeixin = function(){
    var ua = window.navigator.userAgent.toLowerCase();
    //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}
Util.FieldList = function(){
    const HomeTypes=[{
        name:"节能环保",
        type:1
    },{
        name:"化学化工",
        type:2
    },{
        name:"智能制造",
        type:3
    },{
        name:"电子信息",
        type:4
    },{
        name:"新材料",
        type:5
    },{
        name:"其他",
        type:6
    }];
    return HomeTypes;
}
Util.GetDomainById = function(id){
    var domainName="";
    Util.FieldList().map(function(item,key){
        if(item.type==id){
            domainName = item.name;
        }
    })
    return domainName;
}
/*
 * 首页判断是否有公司
 * */
Util.FilterIsStart = function () {
    /* 判断是否访问过，否则跳转到start引导页面 */
    if(!Tool.localItem("company")){
        /* 公司不存在去引导页 */
        browserHistory.push('/start');
        //this.props.router.push("/start");
        //hashHistory.push("/start");
    }else{
    }
}
var count = 1;
Util.WeiXinLogin = function () {
    var nowtimes = Date.parse(new Date())/1000;
    var oldtimes = Tool.localItem("oldtimes");
    console.log(nowtimes);
    count = Tool.localItem("count");
    if(Util.IsWeixin()){//判断是否微信登录
        if((nowtimes-oldtimes)<7200 && nowtimes>oldtimes && Tool.localItem("OpenId")){
            //openid不为空，且存在，没有过期(nowtimes-oldtimes)<7200 && nowtimes>oldtimes && Tool.localItem("OpenId")
            console.log("openId存在且不过期");
        }else{//重新获取
            if(!Tool.localItem("OpenId") && Tool.localItem("count") < 5){//OpenId不存在，去获取数据
                localStorage.setItem("count",count++);
                Tool.fetchPost("/api/wechat/openid","",{},'json','basic',
                    (res) => {
                        console.log("微信授权获取openid");
                        if(!res.serror){//成功
                            localStorage.setItem("OpenId",res.result.openid);
                        }
                        console.log(res);
                    }, (err) => {
                        console.log(err);
                    });
                Tool.fetchPost("/api/wechat",JSON.stringify({ result:"",backto:window.location.href, token: '',code:Util.GetQueryString("code") }),{'Accept': 'application/json','content-type': 'application/json'},'json','basic',
                    (res) => {
                        console.log("获取微信用户授权信息");
                        if(!res.serror){
                            if(res.result.status==100){
                                window.location.href=res.result.sendUrl;
                            }else if(res.result.status==200){//获取openid
                                localStorage.setItem("OpenId",res.result.openid);
                                Tool.localItem("weiChatUser",JSON.stringify(res.result));
                                if(res.result.suser){
                                    res.result.suser.token=res.result.token;
                                    Util.autoLogin(res.result.suser);
                                }
                                if(window.location.href.indexOf("/start")>-1){
                                    browserHistory.push("/");
                                }
                            }
                        }
                    }, (err) => {
                        console.log(err);
                    });
            }
        }
    }
}

Util.autoLogin=function(user){
    Tool.localItem("company", JSON.stringify(user.org_name));
    Tool.localItem('User', JSON.stringify(user));
}

Util.GetQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
}

Util.getApi = (key)=> {
    let obj=null;
    for(let i=0,len=Api.length;i<len;i++){
        if(Api[i].key==key){
            obj=Api[i];
            return obj.url ;
        }
    }
};

Util.getOpenId = () =>{
    return JSON.parse(Tool.localItem("weiChatUser"))?JSON.parse(Tool.localItem("weiChatUser")).openid:null;
}

Util.prevPathName=(props)=>{
    if(props && props.location) {
        Tool.localItem("prevPathName", props.location.pathname + props.location.search);
    }
}

Util.isLogin=(props,type)=>{
    Util.prevPathName(props);
    //实时判断是否登录状态
    var token = JSON.parse(Tool.localItem("User")) ? JSON.parse(Tool.localItem("User")).token : '';
    var flag=true;
    if(!(token && token.length>0)){//为空，去登录
        if(type==1){
            return false;
        }else{
            browserHistory.push("/login");
            return false;
        }
    }
    return flag;
}

Util.getToken=(props)=>{
    return JSON.parse(Tool.localItem("User")) ? JSON.parse(Tool.localItem("User")).token : ''
}

Util.images=(image,type)=>{
    var imageUtil="";
    if(image!=null && image.length>0){
        if(image.indexOf("http://")>-1){
            imageUtil = image;
        }else{
            imageUtil = pathImage+image
        }
    }else{
        imageUtil=(type==0?defImage2:defImage);
    }
    return imageUtil;
}

Util.getCount=(count)=>{
    if(count>=0 && count<=100){
        return count;
    }else{
        return "100+";
    }
}

Util.IsNullJson=(rowData)=>{
    if(!rowData || JSON.stringify(rowData) == "{}"){
        return true;
    }else{
        return false;
    }
}


Util.contactSession=(tabName,name,title,type,uid)=>{
    Tool.setSession("contactTitle",tabName+":\""+title+"\"");
    Tool.setSession("contactName",name);
    Tool.setSession("contactExpertUid",uid);
    browserHistory.push("/contact/expert/"+type+"/"+uid);
}

Util.addSearchHistory=(value)=>{
    if(Util.IsNull(value)){return;}
    var newHistoryList = JSON.parse(Tool.localItem("searchHistory"))||[];
    var historyList = [];
    if(newHistoryList&&newHistoryList.length>0){
        newHistoryList.map(function(val){
            if(val!=value){
                historyList.push(val);
            }
        })
    }
    if(historyList.length < 10){
        historyList.unshift(value);
    }else{
        historyList.unshift(value);
        historyList.pop();
    }
    console.log("最终数据");
    console.log(historyList);
    Tool.localItem("searchHistory",JSON.stringify(historyList));
}

Util.delSearchHistory=(value)=>{
    if(Util.IsNull(value)){return;}
    var historyList = JSON.parse(Tool.localItem("searchHistory"))||[];
    var newLis = [];
    historyList.map(function(item){
        if(item!=value){
            newLis.push(item);
        }
    })
    Tool.localItem("searchHistory",JSON.stringify(newLis));
}

Util.initString=(str)=>{
    if(Util.IsNull(str)){
        return "";
    }
    return str;
}

Util.TransferString=(content)=>{
    var string = content;
    try{
        string=string.replace(/\r\n/g,"<br/>");
        string=string.replace(/\n/g,"<br/>");
    }catch(e) {
        console.log(e.message);
    }
    return string;
}
Util.bodyScrollTop=(int)=>{
    document.body.scrollTop=document.documentElement.scrollTop=int;
}
Util.bodyOver=(flag)=>{
    Util.bodyScrollTop(0);
    if(flag){
        document.body.style.overflow="hidden";
    }else{
        document.body.style.overflow="initial";
    }
}

Util.loginOut = function(){
    Tool.removeLocalItem('company');
    Tool.removeLocalItem('User');
    Tool.removeLocalItem('fieldType');
    Tool.removeLocalItem('tagList');
    Tool.removeLocalItem("domainArray");
    Tool.removeLocalItem("phoneUser");
}

/*
 * 验证是否为手机号
 * */
Util.Mail= function (obj) {
    if(Util.IsNull(obj)){
        return false;
    }
    if(!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(obj))){
        return false;
    }
    return true;
}


// 判断是否是手机端浏览器
Util.GetBrowser = function(){
    var ua = navigator.userAgent.toLowerCase();
    var btypeInfo = (ua.match( /firefox|chrome|safari|opera/g ) || "other")[ 0 ];
    if( (ua.match( /msie|trident/g ) || [] )[ 0 ] )
    {
        btypeInfo = "msie";
    }
    var pc = "";
    var prefix = "";
    var plat = "";
    //如果没有触摸事件 判定为PC
    var isTocuh = ("ontouchstart" in window) || (ua.indexOf( "touch" ) !== -1) || (ua.indexOf( "mobile" ) !== -1);
    if( isTocuh )
    {
        if( ua.indexOf( "ipad" ) !== -1 )
        {
            pc = "pad";
        } else if( ua.indexOf( "mobile" ) !== -1 )
        {
            pc = "mobile";
        } else if( ua.indexOf( "android" ) !== -1 )
        {
            pc = "androidPad";
        } else
        {
            pc = "pc";
        }
    } else
    {
        pc = "pc";
    }
    switch( btypeInfo )
    {
        case "chrome":
        case "safari":
        case "mobile":
            prefix = "webkit";
            break;
        case "msie":
            prefix = "ms";
            break;
        case "firefox":
            prefix = "Moz";
            break;
        case "opera":
            prefix = "O";
            break;
        default:
            prefix = "webkit";
            break
    }
    plat = (ua.indexOf( "android" ) > 0) ? "android" : navigator.platform.toLowerCase();
    return {
        version: (ua.match( /[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[ 1 ],     //版本
        plat: plat,                   //系统
        type: btypeInfo,              //浏览器
        pc: pc,
        prefix: prefix,                //前缀
        isMobile: (pc == "pc") ? false : true              //是否是移动端
    };
};

Util.isNumber = function(n) {
    if(Util.IsNull(n)){
        return false;
    }
    return !isNaN(parseFloat(n)) && isFinite(n);
}

Util.countryDate = function(){
    var date = [];

    countryJson.data.forEach(function(item){
        let obj = {label:(item.name+item.code),value:item.code};
        date.push(obj);
    })
    return date;
}

Util.isTags=(str)=>{
    var tags = JSON.parse(Tool.localItem("tagList"));
    var flg = false;
    if(tags==null || tags.length < 1){
        return flg;
    }
    tags.map(function(item,key){
        if(item.text==str){
            flg=true;
        }
    })
    return flg;
}

Util.createMarkup=(val)=>{
    return {__html: val};
}

Util.NotifyUrl=(rowData)=>{
    var url="";
    if(rowData.type==1){//问题
        url="/question/detail/"+rowData.item_id;
    }else if(rowData.type==2){
        url="/issue/info/"+rowData.item_id;
    }else if(rowData.type==3){
        url="/case/info/"+rowData.item_id;
    }else if(rowData.type==4){
        url="/expert/info/"+rowData.sender_id;
    }else if(rowData.type==5){
        url="/opinion/info/"+rowData.item_id;
    }else if(rowData.type==6){
        url="/tech/info/"+rowData.item_id;
    }else if(rowData.type==7){
        url="/reply/info/question/"+rowData.item_id;
    }else if(rowData.type==0){
        url="/enterprise/info/"+rowData.item_id;
    }
    return url;
}

Util.NotifyUrlSysm=(rowData)=>{
    var url="";
    if(rowData.type==1){//问题
        url="/question/detail/"+rowData.data;
    }else if(rowData.type==2){
        url="/issue/info/"+rowData.data;
    }else if(rowData.type==3){
        url="/case/info/"+rowData.data;
    }else if(rowData.type==4){
        url="/expert/info/"+rowData.data;
    }else if(rowData.type==5){
        url="/opinion/info/"+rowData.data;
    }else if(rowData.type==6){
        url="/tech/info/"+rowData.data;
    }else if(rowData.type==7){
        url="/reply/info/question/"+rowData.data;
    }else if(rowData.type==0){
        url="/enterprise/info/"+rowData.data;
    }
    return url;
}

Util.updateDomain=(domain)=>{
    var arr = domain.split(",");
    var dom = "";var User;
    if(!Util.IsNull(domain) && arr.length>0){
        arr.forEach(function(item,key){
            dom +=(dom.length>0?" ":"")+Util.GetDomainById(item);
        })
        User = JSON.parse(Tool.localItem("User"));
        User.domain = dom;
    }
    return User;
}

/*
* 验证用户是否认证和是否存在领域
* */
Util.verifyUser=()=>{
    var User = JSON.parse(Tool.localItem("User"));
    var href = window.location.href;
    if(User && !(href.indexOf("register/authmail")>-1 || href.indexOf("/field/userfield")>-1)){
        if(User.verifyStatus==0){
            /* 认证邮箱 */
            browserHistory.push("/register/authmail?from=1");
        }else if(Util.IsNull(User.domain)){
            browserHistory.push("/field/userfield?from=2");
        }
    }
}

Util.FormateFance = (fan) =>{
    if(fan>0){
        return fan+"万";
    }else{
        return "面议";
    }
}

Util.FormateCoop = (str) =>{
    if(!Util.IsNull(str)){
        return str;
    }else{
        return "面议";
    }
}

Util.initDateMap=(data)=>{
    var map = {};
    if(data && data.length>0){
        data.map(function(item,key){
            var obj = {user:item.expertIndexStream,content:item.content}
            map[item.pid] = obj;
        })
    }
    return map;
}

export default Util;