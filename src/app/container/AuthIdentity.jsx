import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {loadMatchExpert} from '../action/Action';
import {setSystemAnimating, handleLogin, loginUser} from '../action/Action';
import Util from '../common/Util';
import {Tool} from "../Tool";
import {Header, LoadingToast} from '../common/ComponentList';
import {HeaderCaption} from '../common/HeaderCaption';
import {Toast} from 'antd-mobile';


//form validate
import {AuthIdentityList} from '../common/list/AuthIdentityList';

//import images
import registerIdentityImg from '../../img/header-caption/identity.png';

var dispatch;
class AuthIdentity extends Component {
  constructor(props, context) {
    super(props, context);
    dispatch = this.props.dispatch;
  }

  componentWillMount() {
    let {dispatch} = this.props;//加载匹配专家
    dispatch(loadMatchExpert());
  }

  submit() {
  }

  render() {
      let {CommonStr} = this.props;
      var dataList = CommonStr["list"];
      if(dataList && dataList.length>0){
        return (
          <div className="page expert_match">
            <Header title="请认领身份" leftInfo="back" rightTo="/field/userfield?from=1" rightInfo="跳过"/>
            <HeaderCaption captionText="以下在我们千万专家库中的人是您吗？" captionImg = {registerIdentityImg}/>
            <AuthIdentityList dispatch={dispatch} prevProps = {this.props}/>
          </div>
        )
      }else{
          return (
              <div className="page expert_match">
                <Header title="请认领身份" leftInfo="back" rightTo="/field/userfield?from=1" rightInfo="跳过"/>
              <div className="no_expert">
                <div className="info">
                  <i className="iconfont icon-wu"></i><br/><br/>
                  暂无可匹配的专家！
                </div>
                <Link className="btn_def_expert" to="/field/userfield?from=1">
                  下一步
                </Link>
              </div>
              </div>
          )
      }
  }
}

AuthIdentity.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
  User: state.User,
  CommonStr:state.CommonStr
}))(AuthIdentity); //连接redux