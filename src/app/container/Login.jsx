import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {LoginCom,Header} from '../common/ComponentList';
import Util from '../common/Util';
import {Tool} from '../Tool';
/*
* Login
* */
class Main extends Component {
    constructor(props,context) {
        super(props,context);
    }
    componentWillMount(){
        /* 判断是否登录状态 */
        var prePathName = Tool.localItem("prevPathName")?Tool.localItem("prevPathName"):"";
    
        if(prePathName == '/login' || prePathName == '/start' || prePathName == '/register'){
            prePathName = '/';Tool.removeLocalItem("prevPathName");
        }
        
        if(Util.isLogin(this.props,1)){//已经登录
            browserHistory.push(prePathName); //跳转到上一页
        }
    }
    render() {
        return (
            <div className="page login_cons com_cos_confull white_bg pub-padding-lf-wrap login-page">
                <Header title="欢迎来到科学家在线" leftInfo="back"/>
                <LoginCom isLogin="true" closeLoginLayer={this.closeLoginLayer} setStateLayer={this.setStateLayer}/>
            </div>
        )
    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User
}))(Main); //连接redux