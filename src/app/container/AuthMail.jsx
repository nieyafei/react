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
import {AuthMailForm} from '../common/form/AuthMailForm';

//import images
import registerCaption from '../../img/header-caption/register.png';

var dispatch;
class AuthMail extends Component {
  constructor(props, context) {
    super(props, context);
    dispatch = this.props.dispatch;
  }

  componentWillMount() {
  }

  submit() {
  }

  render() {
    return (
      <div className="page posr">
        <Header title="邮箱认证" leftInfo="back" customBackText=""/>
        <HeaderCaption captionText="为了向您提供更及时的服务，我们需要验证您的邮箱：" captionImg = {registerCaption}/>
        <AuthMailForm dispatch={dispatch} prevProps={this.props} from={this.props.location.query.from}/>
      </div>

    )
  }
}

AuthMail.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
  User: state.User
}))(AuthMail); //连接redux