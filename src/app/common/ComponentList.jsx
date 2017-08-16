import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import  action from '../action/Index';
import {handleLogin, setSystemAnimating, loginUser, FollowOn, replyList,commonAction,companyAttention,commonNotify,updateNotify,commonEnterprise,setEnterprise,setNotify,setSysCode} from '../action/Action';
import {Tool, merged} from '../Tool';
import {RefreshControl, ListView, ActivityIndicator, SearchBar, Toast, Flex,Tabs} from 'antd-mobile';
import Util from '../common/Util';

/*import GetData from './GetData';
 import GetNextPage from './GetNextPage';
 
 export { GetData, GetNextPage }*/

/**
 * (加载动画)
 *
 * @class DataLoad
 * @extends {Component}
 */
export class DataLoad extends Component {
    render() {
        let {loadAnimation, loadMsg} = this.props;
        return (
            <div className={'data-load data-load-' + loadAnimation}>
                <div className="msg">{loadMsg}</div>
            </div>
        );
    }
}

DataLoad.defaultProps = {
    loadAnimation: true, //默认显示加载动画
    loadMsg: '正在加载中'
}

export class PageNullComm extends Component {
    constructor(props){
        super(props);
    }
    render() {
        let {tips,icon,className} = this.props;
        if(Util.IsNull(tips)){
            tips = "暂无数据"
        }
        if(Util.IsNull(icon)){
            icon = "wuneirong1"
        }
        return (
            <div className={className + " page_null"} data-flex="main:center cross:center">
                <div>
                    <div className="im_icon">
                        <i className={"iconfont icon-" + icon}></i>
                    </div>
                    <div className="info_tip">{tips}</div>
                </div>
            </div>
        );
    }
}

/**
 * 公共头部
 *
 * @export
 * @class Header
 * @extends {Component}
 * @param {string} title  头部标题
 * @param {string} leftTo 左侧按钮链接  leftIcon
 * @param {string} rightTo 右侧按钮  rightIcon   rightClick:右侧点击事件
 * @param {string} rightTo2 右侧按钮  rightIcon2   rightClick2:右侧第二个点击事件
 */

export class Header extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        let {title, leftTo,backTo,leftInfo, rightTo, rightInfo, rightClick, rightIcon} = this.props;
        let left = null;
        
        if (leftTo && leftInfo) {//左侧链接
            left = (
                <Link to={leftTo}>
                    {leftInfo}
                </Link>
            );
        } else if (leftInfo === 'back') { //返回上一页
            if(backTo&&backTo.length>0){
                left = (
                    <a href={backTo}>
                        <i className={'iconfont icon-' + leftInfo}></i><span>返回</span>
                    </a>
                );
            }else{
                left = (
                    <a onClick={browserHistory.goBack}>
                        <i className={'iconfont icon-' + leftInfo}></i><span>返回</span>
                    </a>
                );
            }
        }
        
        let right = null;
        if (rightTo && rightInfo) {//右侧点击链接
            right = (
                <Link to={rightTo}>
                    {rightInfo}
                </Link>
            );
        } else if (rightClick == "closeQuestion") {//右侧关闭问题
            right = (
                <a onClick={this.props.closeQuestion}>
                    {rightInfo}
                </a>
            );
        } else if (rightClick == "replyAdd") {//回复问题
            right = (
                <a onClick={this.props.replyAdd}>
                    <i className="iconfont icon-shangchuan"></i><span>发布</span>
                </a>
            );
        } else if (rightTo && rightIcon) {
            right = (
                <Link to={rightTo}>
                    <i className={"iconfont " + rightIcon}></i><span>{rightInfo}</span>
                </Link>
            )
        }
        
        /*if (rightTo2 && rightInfo2) {//右侧链接
         right = (
         <Link to={rightTo2}>
         {rightInfo2}
         </Link>
         );
         } else if (rightClick2 && rightInfo2) {//右侧点击
         right = (
         <div onClick={rightClick2}>
         {rightClick2}
         </div>
         );
         }*/
        
        
        return (
            <div className="header_height">
                <header className="common_header" data-flex>
                    <div className="icon lef" data-flex="main:left cross:center" data-flex-box="0">
                        {left}
                    </div>
                    <h2 className="title" data-flex-box="1">{title}</h2>
                    <div className="icon rig" data-flex="main:right cross:center" data-flex-box="0">
                        {right}
                    </div>
                </header>
            </div>
        );
    }
}
Header.contextTypes = {
    router: React.PropTypes.object.isRequired
}

/*export class Header extends Component {
 render() {
 let {title, leftTo, leftIcon, rightTo, rightIcon, rightClick } = this.props;
 let left = null;
 
 if (leftTo && leftIcon) {
 left = (
 <Link to={leftTo}>
 <i className={'iconfont icon-' + leftIcon}></i>
 </Link>
 );
 } else if (leftIcon === 'fanhui') { //返回上一页
 left = (
 <a onClick={this.context.router.goBack}>
 <i className={'iconfont icon-' + leftIcon}></i>
 </a>
 );
 }
 
 let right = null;
 if (rightTo && rightIcon) {
 right = (
 <Link to={rightTo}>
 <i className={'iconfont icon-' + rightIcon}></i>
 </Link>
 );
 } else if (rightClick && rightIcon) {
 right = (
 <div onClick={rightClick}>
 <i className={'iconfont icon-' + rightIcon}></i>
 </div>
 );
 }
 return (
 <header className="common-header" data-flex>
 <div className="icon" data-flex="main:center cross:center" data-flex-box="0">
 {left}
 </div>
 <h2 className="title" data-flex-box="1">{title}</h2>
 <div className="icon" data-flex="main:center cross:center" data-flex-box="0">
 {right}
 </div>
 </header>
 );
 }
 }
 Header.contextTypes = {
 router: React.PropTypes.object.isRequired
 }*/


/**
 * 暂无记录
 *
 * @export
 * @class DataNull
 * @extends {Component}
 */
export class DataNull extends Component {
    render() {
        return (
            <div>暂无记录</div>
        );
    }
}

/**
 * 底部导航菜单
 *
 * @export
 * @class Footer
 * @extends {Component}
 */
class FooterInit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messageCount: 0
        };
        this.getMessageCount = () => {
            /*判断是否登录状态*/
            if (Util.isLogin(this.props,1)) {
                /* 获取消息count */
                Tool.fetchGet(Util.getApi("messagesUnread"),"",{},'json','basic',
                    (res) => {
                        if(res.result){
                            this.setState({
                                messageCount: res.result
                            })
                        }else{
                        }
                    }, (err) => {
                        console.log(err);
                    });
            }
        }
    }
    render() {
        var myUrl = Util.getToken()? '/user': '/login';
        var arr = [];
        let {homeActive,attentionActive,notifyActive,myActive,className} = this.props;
        arr[this.props.index] = 'on';
        return (
            <div className={className+" footer_height"} id="footer_he">
                <footer className="common_footer">
                    <div className="jgs"></div>
                    <div className="menu">
                        <Link to="/" className={arr[0]}>
                            <span><i className={(homeActive!=null?"icon-home1":"icon-home2") + " iconfont " + {homeActive}}></i></span><br/>首页
                        </Link>
                        <Link to="/attention" className={arr[1]}>
                            <span><i className={(attentionActive!=null?"icon-guanzhu":"icon-guanzhu1") + " iconfont " + {attentionActive}}></i></span><br/>关注
                        </Link>
                        <Link to="/notify" className={arr[2]}>
                            <span><i className={(notifyActive!=null?"icon-tubiao07":"icon-xiaoxi1") + " iconfont " + {notifyActive}}></i>{this.state.messageCount > 0 ? <em>{this.state.messageCount>99?99:this.state.messageCount}</em> : ''}</span><br/>消息
                        </Link>
                        <Link to={myUrl} className={arr[3]}>
                            <span><i className={(myActive!=null?"icon-wode5":"icon-wode") + " iconfont " + {homeActive}}></i></span><br/>我的
                        </Link>
                    </div>
                </footer>
            </div>
        );
    }
    componentDidMount() {
        this.getMessageCount();
    }
    shouldComponentUpdate(np, ns) {
        return this.props.index !== np.index || this.state.messageCount !== ns.messageCount; //防止组件不必要的更新
    }
    componentDidUpdate() {
        this.getMessageCount();
    }
}
FooterInit.defaultProps = {
    index: 0
};

var Footer = connect(state=>({
    User: state.User
}))(FooterInit);
export { Footer }

/**
 * 提示登录
 *
 * @export
 * @class TipMsgSignin
 * @extends {Component}
 */
export class TipMsgSignin extends Component {
    render() {
        return (
            <div className="tip-msg-signin">
                你还未登录，请先<Link to="/signin">登录</Link>
            </div>
        );
    }
}

/**
 * 用户头像
 *
 * @export
 * @class UserHeadImg
 * @extends {Component}
 */
export class UserHeadImg extends Component {
    render() {
        return (<div className="user-headimg" style={{backgroundImage: 'url(' + this.props.url + ')'}}></div>)
    }
}

/*
 * Login模块
 *
 * @export
 * @class LoginCom
 * @extends {Component}
 * */
var codeImg;
class LoginComInit extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            button: "登录",
            active1: "active",
            active2: "",
            loginType: 1,
            send: "发送验证码",
            activeSend: "",
            sendCodeFlag: true
        }
        let {dispatch} = this.props;
        this.loginPhoneEmail=(ep)=>{
            if(Util.IsNull(ep)){
                Toast.info("请输入手机号或邮箱", 3);
                return false;
            }else{
                if(ep.indexOf(".com")<0){
                    if (!Util.Phone(ep)) {
                        Toast.info("请输入正确格式手机号", 3);
                        return false;
                    }
                }else{
                    if (!Util.Mail(ep)) {
                        Toast.info("请输入正确格式邮箱", 3);
                        return false;
                    }
                }
            }
            return true;
        }
        /* 登录 */
        this.login = () => {
            var mobile = this.refs.mobile.value;
            var password = this.refs.password.value;
            var code = this.refs.code.value;
            if(!this.loginPhoneEmail(mobile)){
                return false;
            }
            if (this.state.loginType == 1) {
                /*this.props.setStateLayer(true);*/
                /*密码登录*/
                if (Util.IsNull(password)) {
                    Toast.info("请输入密码", 3);
                    return false;
                }
                dispatch(setSystemAnimating("正在登录", true));
                //this.props.User.loginSuccess();
                Tool.fetchPost("/api/login-password", JSON.stringify({
                        mobile: mobile,
                        password: password,
                        openId: Util.getOpenId()
                    }), {}, 'json', 'basic',
                    (res) => {
                        dispatch(setSystemAnimating("正在登录", false));
                        if (res.serror && res.serror.type === '1') {
                            Toast.info(res.serror.desc, 3);
                        } else {
                            /* 登录成功 */
                            if (res.result) {
                                this.closeLogin();
                                res.result.token = res.token;
                                //this.props.User.loginSuccess(res.result);//保存数据
                                dispatch(loginUser(res.result));
                                // var prePathName = Tool.localItem("prevPathName") ? Tool.localItem("prevPathName") : "";
                                // return this.context.router.push({pathname: prePathName}); //跳转到首页
                                var prePathName = Tool.localItem("prevPathName") ? Tool.localItem("prevPathName") : "";
                                if(prePathName == '/login'){
                                    prePathName = '/'
                                }
                                Tool.localItem("phoneUser",mobile);
                                if(res.result.verifyStatus==0){
                                    /* 认证邮箱 */
                                    browserHistory.push("/register/authmail?from=1");
                                }else if(Util.IsNull(res.result.domain)){
                                    browserHistory.push("/field/userfield?from=2");
                                }else{
                                    browserHistory.push(prePathName);
                                }
                            } else {
                                Toast.info(res.serror.desc, 3);
                            }
                        }
                    }, (err) => {
                        console.log(err);
                        dispatch(setSystemAnimating("正在登录", false));
                        Toast.info("登录失败", 3);
                        this.setState({button: '重新登录'});
                    });
            } else {
                /*验证码登录*/
                if (Util.IsNull(code)) {
                    Toast.info("请输入验证码", 3)
                    return false;
                }
                dispatch(setSystemAnimating("正在登录", true));
                Tool.fetchPost("/api/login-code", JSON.stringify({
                        mobile: mobile,
                        valid_code: code,
                        openId: Util.getOpenId()
                    }), {}, 'json', 'basic',
                    (res) => {
                        dispatch(setSystemAnimating("正在登录", false));
                        if (res.serror && res.serror.type === '1') {
                            Toast.info(res.serror.desc, 3);
                        } else {
                            /* 登录成功 */
                            if (res.result) {
                                this.closeLogin();
                                res.result.token = res.token;
                                dispatch(loginUser(res.result));
                                // var prePathName = Tool.localItem("prevPathName") ? Tool.localItem("prevPathName") : "";
                                // return this.context.router.push({pathname: prePathName}); //跳转到首页
                                var prePathName = Tool.localItem("prevPathName") ? Tool.localItem("prevPathName") : "";
                                Tool.localItem("phoneUser",mobile)
                                if(prePathName == '/login'){
                                    prePathName = '/'
                                }
                                if(res.result.verifyStatus==0){
                                    /* 认证邮箱 */
                                    browserHistory.push("/register/authmail?from=1");
                                }else if(Util.IsNull(res.result.domain)){
                                    browserHistory.push("/field/userfield?from=2");
                                }else{
                                    browserHistory.push(prePathName);
                                }
                            }
                        }
                    }, (err) => {
                        dispatch(setSystemAnimating("正在登录", false));
                        Toast.info("登录失败", 3);
                        this.setState({button: '重新登录'});
                    });
                
            }
        }
        /*切换分支*/
        this.tab_change = (index) => {
            if (index == 1) {
                this.setState({
                    active1: "active",
                    active2: "", loginType: 1
                });
            } else {
                this.setState({
                    active1: "",
                    active2: "active", loginType: 2
                });
            }
        }
        /*发送验证码*/
        this.sendCode = () => {
            if (this.state.sendCodeFlag) {
                var mobile = this.refs.mobile.value;//手机号
                var code = this.refs.code_s.refs.code.value;
                if(!this.loginPhoneEmail(mobile)){
                    return false;
                }
                if(Util.IsNull(code)){
                    Toast.info("请输入图片验证码",2);
                    return false;
                }
                Tool.fetchPost("/api/login/mobile-send-code", JSON.stringify({mobile: mobile,verifyCode:code}), {}, 'json', 'basic',
                    (res) => {
                        if (!res.serror) {
                            Toast.info("短信发送成功", 3);
                            var t = 61;
                            var tim = setInterval(function () {
                                t--;
                                if (t < 1) {
                                    window.clearInterval(tim);
                                    this.setState({
                                        send: "重新发送",
                                        activeSend: "",
                                        sendCodeFlag: true
                                    })
                                } else {
                                    this.setState({
                                        send: t + "s",
                                        activeSend: "active",
                                        sendCodeFlag: false
                                    })
                                }
                            }.bind(this), 1000);
                        }else{
                            this.refs.code_s.refCode();
                            Toast.info(res.serror.desc,3);
                        }
                    }, (err) => {
                        this.refs.code_s.refCode();
                        Toast.info("短信发送失败", 3);
                        console.log(err);
                    });
            }
        }
        this.closeLogin = () => {
            dispatch(handleLogin(false));
        }
    }
    componentWillMount(){
        codeImg = "";
        let {dispatch} = this.props;
        dispatch(setSysCode("",false));
    }
    render() {
        let {SysCommon} = this.props;
        return (
            <div className={this.props.isLogin + " layer_login"}>
                <div className="com_cos_login">
                    <div className="bgs_all" onClick={this.closeLogin}></div>
                    <div className="login_form">
                        <div className="login_form_li">
                            {/*<h1>欢迎来到科学家在线</h1>*/}
                            <ul className="tab_uls">
                                <li className={this.state.active1} onClick={this.tab_change.bind(this, 1)}>密码登录</li>
                                <li className={this.state.active2} onClick={this.tab_change.bind(this, 2)}>验证码登录</li>
                            </ul>
                            <input type="text" ref="mobile" placeholder="请输入手机号或邮箱" defaultValue=""/>
                            <div className={this.state.active1 + " ps_login"}>
                                <input ref="password" type="password" placeholder="请输入密码" defaultValue=""/>
                            </div>
                            {this.state.active2=="active" && !SysCommon.isShow?
                                <CodeCommon ref="code_s"/>:""
                            }
                            <div className={this.state.active2 + " ps_login"}>
                                <input ref="code" type="text" placeholder="请输入验证码"/>
                                <button className={this.state.activeSend + " send_yzm"}
                                        onClick={this.sendCode}>{this.state.send}</button>
                            </div>
                            <Link to="/register" className="to_register">没有账号，去注册</Link>
                            <button className="btn_def_expert" onClick={this.login}>{this.state.button}</button>
                            <div className="close_bgs" onClick={this.closeLogin}><i
                                className="iconfont icon-guanbi"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
LoginComInit.contextTypes = {
    router: React.PropTypes.object.isRequired
}
var LoginCom = connect((state) => ({
    User: state.User,
    Login: state.Login,
    SysCommon:state.SysCommon
}))(LoginComInit);
export {LoginCom}

/*
 * 图片验证码
 * */
export class CodeCommon extends Component {
    constructor(props){
        super(props);
        this.state={
            code:Util.getApi("code")
        }
        this.refCode=()=>{
            this.refs.code.value="";
            this.setState({
                code:Util.getApi("code")+"?t="+(new Date().getTime())
            })
        }
    }
    render() {
        let {codeImg} = this.props;
        return (
            <div className="ps_login active code_image">
                <input ref="code" type="text" placeholder="请输入图片验证码" className=""/>
                <img src={this.state.code} onClick={this.refCode} className="code_img"/>
            </div>
        );
    }
}


/*
 * register模块
 *
 * @export
 * @class LoginCom
 * @extends {Component}
 * */

/*
 * 获取领域列表组件
 * */
export class ListLiFeild extends Component {
    render() {
        var liList = "";
        let {dateActive} = this.props;
        return (
            <ul className="field_list">
                {
                    Util.FieldList().map((item, index) => {
                            return (
                                <li key={index} className={(dateActive.indexOf(item.type + ",") > -1 ? "active" : "")}
                                    onClick={this.props.change.bind(this, item.type)}>
                                    {item.name}
                                </li>
                            )
                        }
                    )
                }
            </ul>
        )
    }
}

/*
 * loading 加载中
 * animating:true(显示)false:不显示
 * title:显示标题（正在加载）
 * */
export class LoadingToast extends Component {
    render() {
        return (
            <div className="loading_toast">
                <ActivityIndicator
                    toast
                    text={this.props.text}
                    color="white"
                    animating={this.props.animating}
                />
            </div>
        )
    }
}
LoadingToast.defaultProps = {
    text: "正在加载",
    animating: false
}

/*
 * 展示信息
 * */
export class FollowCommon extends Component {
    constructor(props) {
        super(props);
        /*
         * 点击关注 点赞 1 关注  2取消关注  3点赞
         * */
        this.follow=(tabName,ty,uid,clickType,sourceFrom,actionType)=>{
            if(!(clickType == 1 || clickType == 2 || clickType == 3)){
                return ;
            }
            if(Util.isLogin(this.props.prevProps)){
                //ty 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                var token = Util.getToken(this.props.prevProps);
                let {dispatch} = this.props.prevProps;console.log(tabName);
                dispatch(FollowOn(tabName,ty,uid,token,clickType,sourceFrom,actionType));
            }
        }
    }
    
    render() {
        let {rowData,tabName,type,sourceFrom,htmlType,actionType} = this.props;
        var left_html="";
        if(htmlType=="home_question"){
            left_html=(
                <font>
                    <span>推送&nbsp;{Util.getCount(rowData.expertPushed)}&nbsp;专家</span><em>|</em>
                    <span>{Util.getCount(rowData.answerCount)}&nbsp;回答</span><em>|</em>
                </font>
            )
        }else{
            left_html=(
                <font>
                    <span>{Util.getCount(rowData.followAndLike.followCount)}&nbsp;关注</span><em>|</em>
                </font>
            )
        }
        var typeStr = "";
        if(type=="1"){typeStr="问题"}else if(type=="3"){typeStr="案例"}else if(type=="5"){typeStr="观点"}else if(type=="6"){typeStr="技术"}
        
        var likeText = 1;
        var userLikeText = 3;
        if (rowData.followAndLike && rowData.followAndLike.userFollow){
            likeText = 2;
            userLikeText = 0;
        }

        return (
            <div className="row_quet_bot">
                {left_html}
                <span onClick={this.follow.bind(this,tabName,type,rowData.id, likeText, sourceFrom,actionType)}>
                                    {rowData.followAndLike && rowData.followAndLike.userFollow ?
                                        <font className="ac"><i className="iconfont icon-guanzhu red"></i> 取消关注</font>:
                                        <font><i className="iconfont icon-guanzhu1"></i>关注{typeStr}</font>
                                    }
                                </span>
                <span className={rowData.followAndLike && rowData.followAndLike.userLike ? "active like" : "like"}
                      onClick={this.follow.bind(this,tabName,type,rowData.id,userLikeText,sourceFrom,actionType)}>
                                    {rowData.followAndLike && rowData.followAndLike.likeCount > 0 ? rowData.followAndLike.likeCount : ""}
                    <i className="iconfont icon-dianzan"></i>
                                </span>
            </div>
        );
    }
}
/*var FollowCommon = connect((state) => ({
 User: state.User
 }))(FollowAssembly);
 export { FollowCommon }*/



/*
 * 关注、点赞
 * */
export class ExpertFollowCommon extends Component {
    constructor(props) {
        super(props);
        /*
         * 点击关注 点赞 1 关注  2取消关注  3点赞
         * */
        this.follow = (tabName, ty, id, clickType, sourceFrom,actionType) => {
            console.log(clickType);
            if (!(clickType == 1 || clickType == 2 || clickType == 3)) {
                return;
            }
            if (Util.isLogin(this.props.prevProps)) {
                //ty 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                var token = Util.getToken(this.props.prevProps);
                let {dispatch} = this.props.prevProps;
                dispatch(FollowOn(tabName, ty, id, token, clickType, sourceFrom,actionType));
            }
        }
    }
    
    
    
    
    render() {
        let {rowData, tabName, type, sourceFrom, htmlType, id,actionType,all} = this.props;
        var left_html = [];
        
        //收集type是方便，如果后面有区分不同类型分别展示不同内容
        if (htmlType == "home_question" || htmlType == "home_issue") {
            left_html.push(
                <font key="">
                    {/*<span className="count">{Util.getCount(rowData.pushCount)}</span><span
                    className="label">推送</span>*/}
                    {htmlType == "home_question"?
                        <font><span className="count">{Util.getCount(rowData.answerCount)}</span><span className="label">回答</span></font>:""
                    }
                    <span className="count">{Util.getCount(rowData.followAndLike.followCount)}</span><span className="label">关注</span>
                    <span className="label">|</span>
                </font>
            )
        }else if ( htmlType == "home_case"  || htmlType == "home_opinion"  || htmlType == "home_tech" ){
            left_html.push(
                <font key="">
                    <span className="count">{Util.getCount(rowData.followAndLike.likeCount)}</span><span className="label">点赞</span>
                    <span className="count">{Util.getCount(rowData.followAndLike.followCount)}</span><span className="label">关注</span>
                    <span className="count">{Util.getCount(rowData.contactCount)}</span><span className="label">人联系您</span>
                </font>
            )
        }else if(htmlType == "home_enterprise"){
            left_html.push(
                <font key="">
                    <span className="count">{Util.getCount(rowData.issueCount)}</span><span className="label">需求</span>
                    <span className="count">{Util.getCount(rowData.questionCount)}</span><span className="label">问题</span>
                    <span className="count">{Util.getCount(rowData.followAndLike.followCount)}</span><span className="label">关注</span>
                    <span className="label">|</span>
                </font>
            )
        }
        var strty = "问题";
        if(htmlType == "home_issue"){strty = "需求"}else if(htmlType == "home_enterprise"){strty = "企业"}
        var followHtml = [];
        if (rowData.followAndLike && rowData.followAndLike.userFollow) {
            followHtml.push(<font key="">
                <i className="iconfont icon-guanzhu red"></i>
                <span className="label">
                  取消关注
              </span>
            </font>)
        } else {
            followHtml.push(<font key="">
                <i className="iconfont icon-guanzhu1"></i>
                <span className="label">
                  关注{strty}
              </span>
            </font>)
        }
        
        return (
            <div className="static-and-tags">
                {left_html}
                {(htmlType == "home_question" || htmlType == "home_issue" || htmlType== "home_enterprise")?
                    <font>
                    <span className={rowData.followAndLike && rowData.followAndLike.userFollow ? ' active attentioned' : ''}
                          onClick={this.follow.bind(this, all?"all":tabName, type, id, rowData.followAndLike && rowData.followAndLike.userFollow ? 2 : 1, sourceFrom,actionType)}>
                    {followHtml}
                </span>
                    <span className={rowData.followAndLike.userLike ? "active like" : "like"}
                    onClick={this.follow.bind(this,all?"all":tabName,type,rowData.id,rowData.followAndLike.userLike ? 0 : 3,sourceFrom,actionType)}>
                {rowData.followAndLike.likeCount > 0 ? rowData.followAndLike.likeCount : ""}
                    <i className="iconfont icon-dianzan"></i>
                    </span></font>:""
                }

            </div>
        );
    }
}

/*
 * 关注页面  关注、点赞
 * */
export class ExpertAttentionFollowCommon extends Component {
    constructor(props) {
        super(props);
        /*
         * 点击关注 点赞 1 关注  2取消关注  3点赞
         * */
        this.follow = (tabName, ty, id, clickType, sourceFrom,actionType) => {
            console.log(clickType);
            if (!(clickType == 1 || clickType == 2 || clickType == 3)) {
                return;
            }
            if (Util.isLogin(this.props.prevProps)) {
                //ty 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                var token = Util.getToken(this.props.prevProps);
                let {dispatch} = this.props.prevProps;
                dispatch(FollowOn(tabName, ty, id, token, clickType, sourceFrom,actionType));
            }
        }
    }




    render() {
        let {rowData, tabName, type, sourceFrom, htmlType, id,actionType} = this.props;
        var left_html = [];

        //收集type是方便，如果后面有区分不同类型分别展示不同内容
        if (htmlType == "atti_company") {
            left_html.push(
                <font key="">
                    <span className="count">{Util.getCount(rowData.question_count)}</span>
                    <span className="label">问题</span>
                    <span className="count">{Util.getCount(rowData.issue_count)}</span>
                    <span className="label">需求</span>
                    <span className="count">{Util.getCount(rowData.followCount)}</span>
                    <span className="label">关注</span>
                    <span className="label">|</span>
                </font>
            )
        }else if ( htmlType == "atti_question" || htmlType == "atti_issue"){
            left_html.push(
                <font key="">
                    <span className="count">{Util.getCount(rowData.expert_push_count)}</span><span className="label">推送</span><span className="label">|</span>
                    <span className="count">{Util.getCount(rowData.answer_count)}</span><span className="label">回答</span><span className="label">|</span>
                    <span className="count">{Util.getCount(rowData.followCount)}</span><span className="label">关注</span><span className="label">|</span>
                </font>
            )
        }


        var followHtml = [];
        if (rowData.is_follow==1) {
            followHtml.push(<font key="">
                <i className="iconfont icon-guanzhu red"></i>
                <span className="label">
                  取消关注
              </span>
            </font>)
        } else {
            followHtml.push(<font key="">
                <i className="iconfont icon-guanzhu1"></i>
                <span className="label">
                  关注{htmlType == "atti_company"?"企业":"需求"}
              </span>
            </font>)
        }

        return (
            <div className="static-and-tags">
                {left_html}
                    <font>
                    <span className={rowData.is_follow==1 ? ' active attentioned' : ''}
                          onClick={this.follow.bind(this, tabName, type, rowData.id, rowData.is_follow? 2 : 1, sourceFrom,actionType)}>
                        {followHtml}
                    </span>
                        {(htmlType == "atti_question" || htmlType == "atti_issue" || htmlType == "atti_company") ?
                            <span className={rowData.is_like==1 ? "active like" : "like"}
                                  onClick={this.follow.bind(this,tabName,type,rowData.id,rowData.is_like ? 0 : 3,sourceFrom,actionType)}>
                                {rowData.likeCount > 0 ? rowData.likeCount : ""}
                                <i className="iconfont icon-dianzan"></i>
                    </span>:""
                         }
                    </font>

            </div>
        );
    }
}


/* 回复列表 */
var mapReply = {};
class Reply extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
        }
        let {dispatch} = this.props;
        var page = -1, loadFlag = true, totalPages = 1;
        this.onEndReached = () => {
            if (this.state.isLoading || !loadFlag) {
                return;
            }
            this.dataInit();
        }
        this.dataInit = () => {
            if (loadFlag) {
                this.setState({isLoading: true});
                loadFlag = false;
                var pageNum = ++page;//页数
                if (totalPages <= pageNum) {
                    this.setState({isLoading: false});
                    return;
                }
                Tool.fetchGet("/api/" + this.props.type + "/reply/" + this.props.uri + "/" + pageNum + "/10", "", {}, 'json', 'basic',
                    (res) => {
                        if (!res.serror) {
                            // var res1 = res;
                            var res1 = res.result;
                            //dispatch();获取数据返回给state
                            let obj = {date: res1.content, page: pageNum};
                            totalPages = res1.totalPages;
                            dispatch(replyList(obj))
                        }
                        this.setState({
                            isLoading: false,
                        })
                        loadFlag = true;
                    }, (err) => {
                        this.setState({
                            isLoading: false,
                        })
                        loadFlag = true;
                        console.log(err);
                    });
            }
        }
        this.toLink=(url)=>{
            Tool.saveScroll("detailScroll",this.props.type);
            Util.bodyOver(true);
            setTimeout(function(){
                browserHistory.push(url);
            },100)
        }
    }
    
    componentWillMount() {
        /* 获取uri */
        let {Detail} = this.props;
        var fromReply = Tool.getSession("fromReply");
        if (!fromReply && Detail["detail"].id == this.props.uri) {
            Tool.setSession("fromReply", false);
            this.setState({
                isLoading: false,
            })
            return;
        }
        if (this.props.uri) {
            this.dataInit();
        }
    }
    
    render() {
        
        const row = (rowData, sectionID, rowID) => {
            // debugger;
            // console.log('------rowData', rowData.expertIndexStream);
            
            // if(Util.IsNullJson(rowData)){return <div></div>;}
            
            var _html = <div></div>;
            
            if (rowData) {
                _html = <div key={rowID} className="reply_list">
                    <div className="reply_cs">
                        <div data-flex className="reply_head">
                            <div className="le" data-flex="cross:center" data-flex-box="1">
                                {rowData && rowData.expertIndexStream ?
                                    <Link data-flex="cross:center"
                                        to={rowData.expertIndexStream.isExpert == "EXPERT" ? "/expert/info/" + rowData.expertIndexStream.uid : ("/enterprise/info/"+rowData.expertIndexStream.uid)}>
                                        <img src={Util.images(rowData.expertIndexStream.coverPic, 0)}/>
                                        <span className="over_hidden1">{rowData.expertIndexStream.name}&nbsp;&nbsp;{Util.initString(rowData.expertIndexStream.title)}<em>{Util.initString(rowData.expertIndexStream.org)}</em></span>
                                    </Link> : ""
                                }
                            </div>
                            <div className="ri" data-flex="cross:center" data-flex-box="0">
                                <Link to={"/info/reply/"+this.props.type+"/"+this.props.uri+"?pid="+rowData.pid}>
                                    <i className="iconfont icon-xiaoxi color1"></i>
                                </Link>
                            </div>
                        </div>
                        <Link onClick={this.toLink.bind(this,"/reply/info/"+this.props.type+"/"+rowData.pid)} className="reply_content over_hidden5" dangerouslySetInnerHTML={Util.createMarkup(rowData.content)}></Link>
                        {rowData.parent_pid?
                            <div className="reply_parent_cons">
                                <span className="ji_top"><i className="iconfont icon-sanjiaoxing1"></i></span>
                                <div className="over_hidden2">
                                    <Link to={mapReply[rowData.parent_pid].user.isExpert == "EXPERT" ? "/expert/info/" + mapReply[rowData.parent_pid].user.uid : ("/enterprise/info/"+mapReply[rowData.parent_pid].user.uid)}>@{mapReply[rowData.parent_pid].user.name}：</Link>
                                    <span onClick={this.toLink.bind(this,"/reply/info/"+this.props.type+"/"+rowData.parent_pid)}>{mapReply[rowData.parent_pid].content}</span>
                                </div>
                            </div>
                            :""
                        }
                        <div className="vote_count">赞同&nbsp;&nbsp;{rowData.agreeCount}
                            <span className="right">发布时间：{Tool.formatDateTime(rowData.create_time)}</span>
                        </div>
                    </div>
                </div>
            }
            
            return (
                _html
            )
        };
        
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let {Detail} = this.props;
        var data = [];
        
        if (Detail["replyList"] && Detail["replyList"].date) {
            data = Detail["replyList"].date;
        }
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        var dsNew = dataSource;
        if (data) {
            mapReply = Util.initDateMap(data);
            dsNew = dataSource.cloneWithRows(data)
        }
        return (
            <div>
                <div className="scroll_list">
                    <ListView
                        dataSource={dsNew}
                        renderFooter={() => <div className="false footerRender" style={{textAlign: 'center'}}>
                            {this.state.isLoading ? loadInfo : '暂无更多回复信息'}
                        </div>}
                        renderRow={row}
                        style={{
                            margin: '0',
                        }}
                        initialListSize={dataSource.length>10?(dataSource.length-2):dataSource.length}
                        pageSize={10}
                        scrollRenderAheadDistance={500}
                        scrollEventThrottle={20}
                        scrollerOptions={{scrollbars: true}}
                        onScroll={() => {
                        }}
                        useBodyScroll
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={100}
                    />
                </div>
                {/*<Link className="inf_fixed_reply" to={"/info/reply/"+this.props.type+"/"+this.props.uri}>*/}
                {/*<i className="iconfont icon-xiaoxi color1"></i>*/}
                {/*</Link>*/}
            </div>
        )
    }
}

var ReplyList = connect((state) => ({
    Detail: state.Detail
}))(Reply);
export {ReplyList}


/*
 * 专家tags
 * */
export class ExpertTags extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        let {rowData, tabName, prevProps, htmlType, type} = this.props;
        var left_html = [];
        var tagHtml = [];
        var keyword = rowData.keyword;
        if (keyword) {
            keyword = keyword.replace(/(，)|(\s)/g, ",");
            keyword.split(',').map(function (name, i) {
                tagHtml.push(
                    <span className="tag" key={i}>{name}</span>
                )
            })
        }
        return (
            <div>
                {rowData.keyword?<div className="tags_list">
                        {tagHtml}
                    </div>:""
                }
            </div>
        );
    }
}


/*
 * 首页列表
 * */
class ProjectListComonent extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        
        let {rowData, tabName, prevProps, htmlType, type, linkTo, linkToID,isUser} = this.props;
        var left_html = [];
        return (
            <div>
                <div className="item_info item-commons">
                    
                    <Link to={linkTo+linkToID} data-flex>
                        <div className="item-detail-title bgcolor-cons text-ellipsis">
                        {!(type==1 || type==2)?
                            <span className="color2">[{Util.GetDomainById(rowData.domainId)}领域]&nbsp;</span>:""
                        }
                        {rowData.title}
                        </div>
                    </Link>

                    <div className="item-detail-cons">
                        {isUser!="false" && (type==1 || type==2)?
                            <div data-flex  className="user_in">
                                <div data-flex="main:center cross:center" data-flex-box="0" className="le">
                                    <Link to={"/enterprise/info/"+rowData.uid}>
                                    <img src={Util.images(rowData.portrait,0)} alt="" className="person fl"/>
                                    </Link>
                                </div>
                                <div data-flex="main:left cross:center" data-flex-box="1" className="mi">
                                    <div className="over_hidden1">
                                        <Link to={"/enterprise/info/"+rowData.uid}>
                                            <span>{rowData.userName}&nbsp;&nbsp;{rowData.positon}</span>
                                            {rowData.orgName?<span>（{rowData.orgName}）</span>:""}
                                        </Link>
                                    </div>
                                </div>
                                <div data-flex="main:center cross:center" data-flex-box="0" className="ri">
                                    <div>
                                        &nbsp;&nbsp;<i className="iconfont icon-shizhong"></i>
                                        <span>{Tool.formatDate(rowData.createTime*1000)}</span>
                                    </div>
                                </div>
                            </div>:""
                        }


                        <Link to={linkTo + linkToID} className="item_caption_info">
                            {type==3 && rowData.coverImg?
                                <div className="cover_image">
                                    <img src={Util.images(rowData.coverImg)}/>
                                </div>:""
                            }
                            {type==6?
                                <div className="tech_ls">
                                    <p>合作价格：{Util.FormateFance(rowData.finance)}</p>
                                    <p>合作方式：{Util.FormateCoop(rowData.cooperationName)}</p>
                                </div>:
                                <div className="over_hidden5">{rowData.content}</div>
                            }
                        </Link>

                        <ExpertTags prevProps={this.props} rowData={rowData} tabName={tabName} type={type}/>
                        
                        <Flex justify="between" className="static-infos">
                            <ExpertFollowCommon prevProps={this.props} rowData={rowData} tabName={this.props.tabName}
                                                type={type} sourceFrom="0" htmlType={"home_"+tabName}  id={linkToID} actionType={this.props.actionType?this.props.actionType:"set_home_follow"}/>
                        
                        </Flex>
                    
                    </div>
                </div>
            </div>
        );
    }
}

var ProjectList = connect((state) => ({
    Home: state.Home,
    User: state.User,
    Detail: state.Detail
}))(ProjectListComonent);
export {ProjectList}

/*
 * 首页列表
 * */
class ProjectSearchListComonent extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let {rowData, tabName, prevProps, htmlType, type, linkTo, linkToID,all} = this.props;
        var left_html = [];
        return (
            <div>
                <div className="search_res_li">
                    {type==1 || type==2?
                        <Link to={linkTo+linkToID} data-flex>
                            <div className="item-detail-title bgcolor-cons text-ellipsis">
                                {/*{type==1?
                                 <span className="color2">[{Util.GetDomainById(rowData.domainId)}领域]&nbsp;</span>:""
                                 }*/}
                                <font dangerouslySetInnerHTML={Util.createMarkup(rowData.title)}/>
                            </div>
                        </Link>:
                        <div className="item_detail pub-padding-lf-wrap">
                            <Flex alignContent="center " className="personal_info">
                                <div className="sc-bfc personal_icon">
                                    <img src={Util.images(rowData.pic)} alt="" className="person fl"/>
                                </div>
                                <Flex.Item className="sc-bfc personal_detail">
                                    <span className="name">{rowData.name} </span>
                                    <span className="co_title">{rowData.title} </span>
                                    <div className="co_name">{rowData.org} </div>
                                </Flex.Item>
                            </Flex>
                        </div>

                    }


                    <div className="item-detail-cons">
                        {type==1 || type==2 || type==0?
                            <div>
                                {type==1 || type==2?
                                <Link to={linkTo + linkToID} className="item_caption_info">
                            <div className="over_hidden5" dangerouslySetInnerHTML={Util.createMarkup(rowData.content)}></div>
                        </Link>:""}
                        <ExpertTags prevProps={this.props} rowData={rowData} tabName={tabName} type={type}/>
                                <Flex justify="between" className="static-infos">
                                    <ExpertFollowCommon prevProps={this.props} all={all} rowData={rowData} tabName={this.props.tabName}
                                                        type={type} sourceFrom="0" htmlType={"home_"+tabName}  id={linkToID} actionType={this.props.actionType}/>

                                </Flex>

                            </div>:""
                        }

                    </div>
                </div>
            </div>
        );
    }
}

var ProjectSearchList = connect((state) => ({
    Home: state.Home,
    User: state.User,
    Detail: state.Detail
}))(ProjectSearchListComonent);
export {ProjectSearchList}


/*
 * 关注列表
 * */
class ProjectAttentionListCommont extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let {rowData, tabName, prevProps, htmlType, type, linkTo, linkToID} = this.props;
        var left_html = [];

        var xsInfo =(dataInfo,ts)=>{
            if(dataInfo.actionType==1){
                return (
                    <font>回复了这个{ts}</font>
                )
            }else if(dataInfo.actionType==2){
                return (
                    <font>关注了这个{ts}</font>
                )
            }else if(dataInfo.actionType==3){
                return (
                    <font>点赞了这个{ts}</font>
                )
            }else if(dataInfo.actionType==4){
                return (
                    <font>赞赏了这个回复</font>
                )
            }
        }

        return (
            <div>
                <div className="item_info item-commons row_question no_padd attion_co">

                    <Link to={linkTo} data-flex>
                        <div className="item-detail-title bgcolor-cons text-ellipsis">
                            {!(type==1 || type==2)?
                                <span className="color2">[{rowData.typeStr}领域]&nbsp;</span>:""
                            }
                            {rowData.question_title}
                        </div>
                    </Link>

                    <div className="item-detail-cons">
                        {rowData.userStream && rowData.userStream.message&&rowData.userStream.message.length>0?
                            <div className="row_quet_user" data-flex="cross:center">
                                <Link to={rowData.userStream.userMode==0?"/expert/info/"+rowData.userStream.uid:""}>
                                    <img src={Util.images(rowData.userStream.userImage,0)}/>
                                </Link>
                                <span>{rowData.userStream.userName}</span>
                                <span>{rowData.userStream.userOrg}</span>
                                <span>&nbsp;&nbsp;-&nbsp;&nbsp;{xsInfo(rowData.userStream,(type==1?"问题":"需求"))}</span>
                            </div>:""
                        }
                        {rowData.userStream && rowData.userStream.actionType==1?
                            <Link to={"/reply/info/question/"+rowData.userStream.rid} className="row_quet_info over_hidden5" dangerouslySetInnerHTML={Util.createMarkup(rowData.userStream.content)}></Link>
                            :<Link to={linkTo} className="row_quet_info over_hidden5" dangerouslySetInnerHTML={Util.createMarkup(rowData.content)}></Link>
                        }

                        <ExpertTags prevProps={this.props} rowData={rowData} tabName={tabName} type={type}/>

                        <Flex justify="between" className="static-infos">
                            <ExpertAttentionFollowCommon prevProps={this.props} rowData={rowData} tabName={this.props.tabName}
                                                type={type} sourceFrom="0" htmlType={"atti_"+tabName}  id={linkToID} actionType="set_attention_follow"/>

                        </Flex>

                    </div>
                </div>
            </div>
        );
    }
}

var ProjectAttentionList = connect((state) => ({
    Attention: state.Attention
}))(ProjectAttentionListCommont);
export {ProjectAttentionList}

// var ProjectList = connect((state) => ({
//     Home: state.Home,
//     User: state.User,
//     Detail:state.Detail
// }))(SingleItem);
// export { ProjectList }


/*
 * 通话需求
 * 不传content就不显示content
 * */
class ContectorInfoComonent extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        
        let {rowData} = this.props;
        
        var left_html = [];
        return (
            <div>
                <div className="item_info">
                    
                    <div className="item_detail pub-padding-lf-wrap">
                        <Flex alignContent="center " className="">
                            <Flex.Item className="sc-bfc item_personal">
                                <img src="../../src/img/person.png" alt="" className="person fl"/>
                                <span className="category">  </span>
                                
                                <span className="co_name auto_width text-ellipsis mr10">{rowData.org_name} </span>
                                <span className="name mr10">{rowData.full_name} </span> &nbsp;&nbsp;
                                <span className="co_title">{rowData.position} </span>
                            
                            </Flex.Item>
                        
                        </Flex>
                        
                        
                        {rowData.content ?
                            <div className={["item_caption "]}>
                                {rowData.content}
                            </div>
                            :
                            <div className={["item_caption "]}></div>
                        }
                        
                        <div className="time width100">
                            <i className="iconfont icon-shizhong"></i>
                            <span className="">X分钟前请求和您就以上问题进行对话</span>
                        </div>
                        
                        {rowData.questionTitle ?
                            <div className={["item_caption "]}>
                                {rowData.questionTitle}
                            </div>
                            :
                            <div className={["item_caption "]}></div>
                        }
                    
                    
                    </div>
                </div>
            </div>
        );
    }
}

var ContectorInfo = connect((state) => ({
    Home: state.Home,
    User: state.User,
    Detail: state.Detail
}))(ContectorInfoComonent);
export {ContectorInfo}

/* 详情tabs列表 */
const TabPane = Tabs.TabPane;
class InfoTabs extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            isLoading:true,activeKey:"1"
        }
        this.onChangeBack=(key)=>{

        }

        this.makeTabPane=(key)=> {
            if(key==1){
                return (
                    <TabPane tab={`回复列表`} key={key}>
                        <div className="tab_cons_li no_top">
                            <ReplyList type={this.props.type} uri={this.props.uri}/>
                        </div>
                    </TabPane>
                )

            }else if(key==2){
                return (
                    <TabPane tab={`企业关注`} key={key}>
                        <div className="tab_cons_li">
                            <AttentionLikeList type={this.props.type} uri={this.props.uri} tabName="attentionList"/>
                        </div>
                    </TabPane>
                )
            }else if(key==3){
                return (
                    <TabPane tab={`企业点赞`} key={key}>
                        <div className="tab_cons_li">
                            <AttentionLikeList type={this.props.type} uri={this.props.uri} tabName="likeList"/>
                        </div>
                    </TabPane>
                )
            }else{
                return (
                    <TabPane tab={`相关问题`} key={key}>
                        <div className="tab_cons_li">
                            <AttentionLikeList type={this.props.type} uri={this.props.uri} tabName="questionList"/>
                        </div>
                    </TabPane>
                )
            }
        };
    }

    componentWillMount() {

    }

    render() {
        return (
            <div className="info_tabs_list">
                <Tabs defaultActiveKey={this.state.activeKey} pageSize={4} >
                    {this.makeTabPane(1)}
                    {this.makeTabPane(2)}
                    {this.makeTabPane(3)}
                    {this.makeTabPane(4)}
                </Tabs>
                <Link className="inf_fixed_reply" to={"/info/reply/"+this.props.type+"/"+this.props.uri}>
                    <i className="iconfont icon-xiaoxi color1"></i>
                </Link>
            </div>
        )
    }
}

var CommonInfoTabs = connect((state) => ({
    Detail: state.Detail
}))(InfoTabs);
export {CommonInfoTabs}

/* 企业关注和点赞列表 */
class AttentionLike extends Component {
    constructor(props, context) {
        super(props, context);
        this.onEndReached = () => {
            let {Detail} = this.props;
            if (Detail[this.props.tabName].isLoading) {
                return;
            }
            this.dataInit();
        }
        this.dataInit = () => {
            let {dispatch,Detail} = this.props;
            var page = Detail[this.props.tabName].page+1;
            dispatch(companyAttention(this.props.type,this.props.tabName,this.props.uri,page,Detail[this.props.tabName].totalPages));
        }
    }

    componentWillMount() {
        /* 获取uri */
        console.log(this.props.uri)
        if (this.props.uri) {
            this.dataInit();
        }
    }

    render() {
        var tabStrs = "案例";
        if(this.props.type=="opinion"){
            tabStrs = "观点";
        }else if(this.props.type=="tech"){
            tabStrs = "技术";
        }
        const row = (rowData, sectionID, rowID) => {
            var _html = <div></div>;
            if (rowData) {
                _html = <div key={rowID} className="company_atti_like">
                        <Link to={"/enterprise/info/"+rowData.uid} data-flex className="list_head">
                            <div className="le" data-flex="cross:center" data-flex-box="0">
                                <img src={Util.images(rowData.portrait, 0)}/>
                            </div>
                            {this.props.tabName!="questionList"?
                                <div className="ri" data-flex="cross:center" data-flex-box="1">
                                    <div>
                                        <span>{rowData.org_name}</span>
                                        <span>{rowData.position}</span>
                                        <span>{rowData.full_name}</span>
                                    </div>
                                </div>:
                                <div className="ri" data-flex="cross:center" data-flex-box="1">
                                    <div>
                                        <span>{rowData.orgName}</span>
                                        <span>{rowData.position}</span>
                                        <span>{rowData.userName}</span>
                                    </div>
                                </div>
                            }
                        </Link>
                        {this.props.tabName != "questionList" ?
                            <div className="time_info">
                                <i className="iconfont icon-shizhong"></i>
                                <span>{Tool.formatDate(rowData.create_time * 1000)}</span>
                                {this.props.tabName == "attentionList" ? "关注" : "点赞"}了您的{tabStrs}
                            </div>:
                            <div>
                                <div className="time_info">
                                    <i className="iconfont icon-shizhong"></i>
                                    <span>{Tool.formatDate(rowData.create_time * 1000)}</span>
                                    提问
                                </div>
                                <Link to={"/question/detail/"+rowData.qid} className="qu_link">
                                    {rowData.title}
                                </Link>
                            </div>
                        }
                </div>
            }
            return (
                _html
            )
        };
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let {Detail} = this.props;
        var data = [];
        if (Detail[this.props.tabName] && Detail[this.props.tabName].date) {
            data = Detail[this.props.tabName].date;
        }
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        var dsNew = dataSource;
        if (data) {
            dsNew = dataSource.cloneWithRows(data)
        }
        var str = "关注";
        if(this.props.tabName=='likeList'){
            str = "点赞";
        }else if(this.props.tabName=='questionList'){
            str="相关问题"
        }
        return (
            <div className="scroll_list">
                <ListView
                    dataSource={dsNew}
                    renderFooter={() => <div className="false footerRender" style={{textAlign: 'center'}}>
                        {Detail[this.props.tabName].isLoading ? loadInfo : ('暂无更多企业'+str+'信息')}
                    </div>}
                    renderRow={row}
                    style={{
                        margin:"0"
                    }}
                    initialListSize={dataSource.length - 8}
                    pageSize={10}
                    scrollRenderAheadDistance={500}
                    scrollEventThrottle={20}
                    scrollerOptions={{scrollbars: true}}
                    onScroll={() => {
                    }}
                    useBodyScroll
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={1000}
                />
            </div>
        )
    }
}

var AttentionLikeList = connect((state) => ({
    Detail: state.Detail
}))(AttentionLike);
export {AttentionLikeList}

/* 消息通知列表 */
class NotifyListCommon extends Component {
    constructor(props, context) {
        super(props, context);
        this.onEndReached = () => {
            let {dispatch,Notify} = this.props;
            if (Notify["isLoading"][this.props.tabName]) {
                return;
            }
            var page = Notify[this.props.tabName].page+1;
            this.dataInit(page);
        }
        this.dataInit =(page)=> {
            let {dispatch,Notify} = this.props;
            dispatch(commonNotify(this.props.tabName,page,Notify[this.props.tabName].totalPages));
        }

        this.cliRead=(type,_read,msgId,tabName,from)=>{
            let {dispatch,Notify} = this.props;
            if(!_read){//type==0 代表不是链接   ==1代表是链接
                dispatch(updateNotify(0,_read,msgId,tabName,from));
            }
        }

    }

    componentWillMount() {
        /* 获取uri */
        let {dispatch} = this.props;
        var obj = {date:[],number:-1,totalPages:1}
        dispatch(setNotify(obj,this.props.tabName));
        this.dataInit(0);
    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            var _html = <div></div>;
            if (rowData) {
                if(this.props.dateStr=="pushList"){
                    if (rowData.type == "1") {//问题
                        _html = <div key={rowID} className="row home_list_row  type_question">
                                <ProjectList {...this.props} rowData={rowData} tabName="question" type="1" linkTo={"/question/detail/"} linkToID={rowData.id} actionType="set_notify_follow"/>
                            </div>
                    }else if (rowData.type == "2") {//需求
                        _html = <div key={rowID} className="row home_list_row  type_issue">
                                <ProjectList {...this.props} rowData={rowData} tabName="issue" type="2" linkTo={"/issue/info/"} linkToID={rowData.id} actionType="set_notify_follow"/>
                            </div>
                    }else if(rowData.type == "0"){
                        _html = <div key={rowID} className="row home_list_row  type_issue">
                            <div className="item_info item-commons">
                                <div className="item-detail-cons">
                                    <div data-flex  className="user_in">
                                        <div data-flex="main:center cross:center" data-flex-box="0" className="le">
                                            <img src={Util.images(rowData.userStreamProfile.pic,0)} alt="" className="person fl"/>
                                        </div>
                                        <div data-flex="main:left cross:center" data-flex-box="1" className="mi">
                                            <div className="">
                                                <Link to={"/enterprise/info/"+rowData.uid}>
                                                    <span>{rowData.userStreamProfile.username}&nbsp;&nbsp;{rowData.userStreamProfile.positon}</span>
                                                    {rowData.userStreamProfile.orgname?<span>（{rowData.userStreamProfile.orgname}）</span>:""}
                                                </Link>
                                            </div>
                                        </div>
                                        <div data-flex="main:center cross:center" data-flex-box="0" className="ri">
                                            <div>
                                                <i className="iconfont icon-shizhong"></i>
                                                <span>{Tool.formatDate(rowData.createTime*1000)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="item_caption_info">
                                        <div className="over_hidden5">{rowData.question}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                }else{
                    _html = <div key={rowID} className={rowData._read + " notify_lists"} onClick={this.cliRead.bind(0,this,rowData._read,rowData.msgid,this.props.tabName,this.props.type-1)}>
                        <Link to={this.props.type==1?Util.NotifyUrl(rowData):Util.NotifyUrlSysm(rowData)} className={" lis_div"}>
                            <div className="title" data-flex>
                                <div className="le" data-flex="main:left cross:center" data-flex-box="1">
                                    {rowData.title}
                                </div>
                                <div className="ri" data-flex="cross:center" data-flex-box="0">
                                    <div>
                                        <i className="iconfont icon-shizhong"></i>
                                        {Tool.formatDateTime(rowData.create_time)}
                                    </div>
                                </div>
                            </div>
                            <div className="info">
                                {rowData.content}
                            </div>
                        </Link>
                        {!rowData._read?
                            <span className="notify_bj"><i className="iconfont icon-rno"></i></span>:""
                        }
                    </div>
                }
            }
            return (
                _html
            )
        };
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let {Notify} = this.props;
        var data = [];
        if (Notify[this.props.tabName] && Notify[this.props.tabName].date) {
            data = Notify[this.props.tabName].date;
        }
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        var dsNew = dataSource;
        if (data) {
            dsNew = dataSource.cloneWithRows(data)
        }
        return (
            <div className="scroll_list">
                <ListView
                    dataSource={dsNew}
                    renderFooter={() => <div className="false footerRender" style={{textAlign: 'center'}}>
                        {Notify["isLoading"][this.props.tabName] ? loadInfo : ('暂无更多消息')}
                    </div>}
                    renderRow={row}
                    style={{
                        margin:"0"
                    }}
                    initialListSize={(data.length>10?(data.length-2):data.length)}
                    pageSize={10}
                    scrollRenderAheadDistance={500}
                    scrollEventThrottle={20}
                    scrollerOptions={{scrollbars: true}}
                    onScroll={() => {
                    }}
                    useBodyScroll
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={20}
                />
            </div>
        )
    }
}

var NotifyList = connect((state) => ({
    Notify: state.Notify
}))(NotifyListCommon);
export {NotifyList}

/* 企业信息展示 */
/* 消息通知列表 */
class EnterpriseListCommon extends Component {
    constructor(props, context) {
        super(props, context);
        this.onEndReached = () => {
            let {dispatch,Enterprise} = this.props;
            if (Enterprise["isLoading"][this.props.tabName]) {
                return;
            }
            var page = Enterprise[this.props.tabName].page+1;
            this.dataInit(page);
        }
        this.dataInit =(page)=> {
            let {dispatch,Enterprise} = this.props;
            dispatch(commonEnterprise(this.props.tabName,page,Enterprise[this.props.tabName].totalPages,this.props.uid));
        }
    }

    componentWillMount() {
        /* 获取uri */
        let {dispatch,Enterprise} = this.props;
        /*if(Enterprise["info"].user && (this.props.uid == Enterprise["info"].user.uid) && Enterprise[this.props.tabName].page>-1){
            return ;
        }
        var obj = {date:[],number:-1,totalPages:1}
        dispatch(setEnterprise(obj,this.props.tabName));*/
        this.dataInit(0);
    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            var _html = <div></div>;
            if (rowData) {
                if (rowData.type == "1") {//问题
                    _html = <div key={rowID} className="row home_list_row  type_question">
                        <ProjectList {...this.props} rowData={rowData} tabName="question" type="1" isUser="false" linkTo={"/question/detail/"} linkToID={rowData.id} actionType="set_enterprise_follow"/>
                    </div>
                }else if (rowData.type == "2") {//需求
                    _html = <div key={rowID} className="row home_list_row  type_issue">
                        <ProjectList {...this.props} rowData={rowData} tabName="issue" type="2" isUser="false" linkTo={"/issue/info/"} linkToID={rowData.id} actionType="set_enterprise_follow"/>
                    </div>
                }
            }
            return (
                _html
            )
        };
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let {Enterprise} = this.props;
        var data = [];

        if (Enterprise[this.props.tabName] && Enterprise[this.props.tabName].date) {
            data = Enterprise[this.props.tabName].date;
        }
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        var dsNew = dataSource;
        if (data) {
            dsNew = dataSource.cloneWithRows(data)
        }
        return (
            <div className="scroll_list">
                <ListView
                    dataSource={dsNew}
                    renderFooter={() => <div className="false footerRender" style={{textAlign: 'center'}}>
                        {Enterprise["isLoading"][this.props.tabName] ? loadInfo : ('暂无更多消息信息')}
                    </div>}
                    renderRow={row}
                    style={{
                        margin:"0"
                    }}
                    initialListSize={(data.length>10?(data.length-2):data.length)}
                    pageSize={10}
                    scrollRenderAheadDistance={500}
                    scrollEventThrottle={20}
                    scrollerOptions={{scrollbars: true}}
                    onScroll={() => {
                    }}
                    useBodyScroll
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={20}
                />
            </div>
        )
    }
}

var EnterpriseList = connect((state) => ({
    Enterprise: state.Enterprise
}))(EnterpriseListCommon);
export {EnterpriseList}

/*
 * 学术common组件
 * */
export class ScienceCommon extends Component {
    constructor(props){
        super(props);

    }
    render() {
        let {rowData,typeStr} = this.props;
        return (
            <div className="row home_list_row border_bot">
                <div className="row_question">
                    <div className="row_title p_top">{rowData.title}</div>
                    <div className="row_quet_info">
                        {typeStr==3?
                            <div className="sci_content">{rowData.paperAbstract}</div>:""
                        }
                        {typeStr==2?
                            <div className="sci_content">
                                {/*{rowData.content}*/}
                                专利号：{rowData.public_num}
                            </div>:""
                        }
                        {typeStr==1?
                            <div className="sci_content">
                                时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间：{rowData.approval_year}<br/>
                                资助金额：{rowData.funding}万
                            </div>:""
                        }
                    </div>
                    {typeStr == 3 ?
                        <div className="row_quet_bot">
                            <span>引用数 {rowData.cited}</span>
                        </div>:""
                    }
                </div>
            </div>
        );
    }
}

/*
 * 学术common组件
 * */
export class ShowHideCommon extends Component {
    constructor(props){
        super(props);
        this.state={
            class:"",
            title:"展开",
            iconArea:"iconfont icon-arrowDown"
        }
        this.toggleDetails=()=>{
            if(this.state.class==""){
                this.setState({
                    class:"folding-down",
                    title:"收起",
                    iconArea:"iconfont icon-top"
                })
            }else{
                this.setState({
                    class:"",
                    title:"展开",
                    iconArea:"iconfont icon-arrowDown"
                })
            }

        }
    }
    render() {
        let {info,className} = this.props;
        return (
            <div className={className}>
                <div className={this.state.class+" more_content"}>
                    <div className='folding-detail'>
                        <div className="item_detail_nav_li">
                            <span className="color1">简介</span>：
                            {info}
                        </div>
                    </div>
                    <div className="folding-area" onClick={this.toggleDetails.bind(this)}>
                        <i className={this.state.iconArea}></i> {this.state.class=="folding-down"?"收起":"展开"}
                    </div>
                </div>

            </div>
        );
    }
}