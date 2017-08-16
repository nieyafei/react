import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import action from '../action/Index';
import {setSystemAnimating, handleLogin, loginUser} from '../action/Action';
import Util from '../common/Util';
import {Tool} from "../Tool";
import {Header, LoadingToast} from '../common/ComponentList';
import {HeaderCaption} from '../common/HeaderCaption';
import {Toast} from 'antd-mobile';



//form validate
import {RegisterForm} from '../common/form/RegisterForm';

//import images
import registerCaption from '../../img/header-caption/register.png';

/*
 * register页面
 * */
var dispatch;
class Main extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      button: "注册",
      submitting: true
    }
    dispatch = this.props.dispatch;
  }

  componentWillMount() {
    /* 判断是否登录状态 */
    let {dispatch} = this.props;
    dispatch(handleLogin(false));
    var token = this.props.User ? this.props.User.token : '';
    //返回地址
    var prePathName = Tool.localItem("prevPathName") ? Tool.localItem("prevPathName") : "";
    if (token) {
        prePathName = '/'
      return this.context.router.push({pathname: prePathName}); //跳转到首页
    }
  }
  render() {
    let {submitting} = this.state;
    return (
      <div className="page com_cos_login com_cos_confull white_bg register-page">
        <Header title="专家注册" leftInfo="back" customBackText=""/>
        <HeaderCaption captionText="欢迎来到科学家在线" captionImg = {registerCaption}/>
        <RegisterForm dispatch={dispatch}/>
      </div>

    )
  }
}

Main.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
  User: state.User,SysCommon:state.SysCommon
}))(Main); //连接redux