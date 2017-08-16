/**
 * Created by Lichong on 24/03/2017.
 */
import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {setSystemAnimating, handleLogin, loginUser,setSysCode} from '../../action/Action';
import Util from '../../common/Util';
import {Tool} from "../../Tool";
import {Header, LoadingToast,CodeCommon} from '../../common/ComponentList';
import {Toast} from 'antd-mobile';
import  "../../../style/form/form.less"
import { Scrollbars } from 'react-custom-scrollbars';
import {Picker,List} from 'antd-mobile';

var countryDate = [],areacode="+86";
export class RegisterForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      button:"注册",
      active1:"active",
      active2:"",
      loginType:1,
      send:"发送验证码",
      activeSend:"",
      sendCodeFlag: true, //发送验证码
      text:"正在注册",
      animating:false,
      asyncValue:["+86"],
      codeActive:true
    }
    let {dispatch} = this.props;

    this.register = () => {
      var enterpriseName = this.refs.enterpriseName.value;
      var lastName = this.refs.lastname.value;
      var firstName = this.refs.firstname.value;
      //var areacode = this.refs.areacode.value;
      var mobile = this.refs.mobile.value;
      var validCode = "";
      var password = this.refs.password.value;

      if(Util.IsNull(enterpriseName)){
        Toast.info("请输入机构/高校名称",3);
        return false;
      }
      if(Util.IsNull(lastName)){
        Toast.info("请输入您的姓",3);
        return false;
      }
      if(Util.IsNull(firstName)){
        Toast.info("请输入您的名",3);
        return false;
      }
      if(areacode=="+86"){
          if(!Util.Phone(mobile)){
              Toast.info("请输入正确格式手机号",3);
              return false;
          }
      }else{
          if(Util.IsNull(mobile)){
              Toast.info("请输入正确格式手机号",3);
              return false;
          }
      }
      if(this.state.codeActive){
      validCode = this.refs.smscode.value
      if(Util.IsNull(validCode)){
        Toast.info("请输入手机验证码",3);
        return false;
      }}
      /*密码登录*/
      if(Util.IsNull(password)){
        Toast.info("请输入密码",3);
        return false;
      }

      dispatch(setSystemAnimating("正在注册",true));
      let submitData = {
        mobile: mobile,
        password: password,
        orgName: enterpriseName,
        firstName: firstName,
        lastName: lastName,
        position: areacode,
        validCode: validCode,
        openId: Util.getOpenId(),
        domain: Tool.localItem("fieldType"),
        tags: Tool.localItem("tagList"),
      };
      Tool.fetchPost("/api/register",JSON.stringify(submitData),{},'json','basic',
        (res) => {
          dispatch(setSystemAnimating("",false));
          /* 注册成功 */
          if(res.serror){
            Toast.info(res.serror.desc,3);
          }else{

            /* 注册成功 */
            res.result.token=res.token;
            dispatch(loginUser(res.result));//保存数据
            Tool.localItem("phoneUser",mobile);
            Toast.info('注册成功', 2, function (i) {
              var prePathName = Tool.localItem("prevPathName")?Tool.localItem("prevPathName"):"/";
              // return this.context.router.push({ pathname: prePathName }); //跳转到首页
                if(areacode=="+86"){
                    browserHistory.push("/register/authidentity");
                }else{
                    browserHistory.push("/register/authmail");
                }
              //browserHistory.push('/field/userfield?from=1');
            })

          }
        }, (err) => {
          dispatch(setSystemAnimating("",false));
          Toast.info("注册失败",3);
          this.setState({button: '重新注册'});
        });

    }

    /*发送验证码*/
    this.sendCode = () => {
      if(this.state.sendCodeFlag){
        var mobile = this.refs.mobile.value;//手机号
        var code = this.refs.code_s.refs.code.value;
        if(!Util.Phone(mobile)){
          Toast.info("请输入正确格式手机号",3);
          return false;
        }
        if(Util.IsNull(code)){
            Toast.info("请输入图片验证码",2);
            return false;
        }
        Tool.fetchPost("/api/register/mobile-request-code",JSON.stringify({mobile:mobile,verifyCode:code}),{},'json','basic',
          (res) => {
            if(!res.serror){
              Toast.info("短信发送成功",3);
                var t=61;
                var tim = setInterval(function () {
                    t--;
                    if(t<1){
                        window.clearInterval(tim);
                        this.setState({
                            send:"重新发送",
                            activeSend:"",
                            sendCodeFlag:true
                        })
                    }else{
                        this.setState({
                            send:t+"s",
                            activeSend:"active",
                            sendCodeFlag:false
                        })
                    }
                }.bind(this),1000);
            }else{
                this.refs.code_s.refCode();
                Toast.info(res.serror.desc,3);
            }
          }, (err) => {
            this.refs.code_s.refCode();
            Toast.info("短信发送失败",3);
            console.log(err);
          });
      }
    }
    this.onChangeCountry=(value)=>{
        areacode = value[0];
        this.setState({
            asyncValue:value,
            codeActive:((value[0]=="+86")?true:false)
        })
    }
    this.onPickerChange=(value)=>{
      //alert(value)
    }
  }

  componentWillMount() {
    countryDate = Util.countryDate();
      let {dispatch} = this.props;
      dispatch(setSysCode("",false));
  }

  render() {
      let {SysCommon} = this.props;
    return (
      <div className="pub-padding-lf-wrap">
      <div className="pub-form register-form" onChange={this.props.onSubmit}>
          <div className="field">
            <input type="text" placeholder="请输入机构/高校名称" ref="enterpriseName" defaultValue=""/>
          </div>
          <div className="field">
            <input type="text" placeholder="请输入您的姓" ref="lastname" defaultValue=""/>
          </div>
          <div className="field">
            <input type="text" placeholder="请输入您的名" ref="firstname" defaultValue=""/>
          </div>

          <div className="field picker-list">
            <div className="select">
              <Picker data={countryDate} cols={1} className="forss short" value={this.state.asyncValue}
                      onChange={this.onChangeCountry} onPickerChange={this.onPickerChange}>
                  <List.Item arrow="horizontal"></List.Item>
              </Picker>
            </div>  
            {/*<input type="text" placeholder="+86" ref="areacode" className="short" defaultValue="+86"/>*/}
            <input type="text" placeholder="请输入手机号码" ref="mobile" className="middle maginleft-percent5" defaultValue=""/>
          </div>

          {this.state.codeActive?
              <div className="re_codes">
              {true?
                  <CodeCommon ref="code_s"/>:""
              }
              <div className="field">
                  <input type="text" placeholder="请输入验证码" ref="smscode"  defaultValue=""/>
                  {/*<button className="sendSmsBtn posa">发送验证码</button>*/}
                  <button className={this.state.activeSend + " sendSmsBtn posa"} onClick={this.sendCode}>{this.state.send}</button>
              </div></div>:""
          }

          <div className="field">
            <input type="password" placeholder="请输入密码" ref="password" defaultValue=""/>
          </div>

          <div className="field">
            <button className="btn_def_expert margin_top" onClick={this.register}>{this.state.button}</button>
          </div>
          <div className="field">
            <Link to="/login" className="login_link">已有账号，去登录</Link>
            {/*<Link to="/register/authmail" className="login_link">authmail</Link>*/}

          </div>

      </div>
      </div>
    )
  }
}
RegisterForm.contextTypes = {
  // onSubmit: React.PropTypes.object.isRequired
}

export default connect((state) => ({
  User: state.User,
  Login:state.Login,
  SysCommon:state.SysCommon
}))(RegisterForm); //连接redux