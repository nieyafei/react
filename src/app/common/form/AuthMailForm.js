/**
 * Created by Lichong on 24/03/2017.
 */
import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {setSystemAnimating, handleLogin, loginUser} from '../../action/Action';
import {Tool} from "../../Tool";
import Util from '../../common/Util';
import {Header, LoadingToast} from '../../common/ComponentList';
import {Toast} from 'antd-mobile';
import  "../../../style/form/form.less"

import authMailImg from '../../../img/header-caption/authmail.png';
var from;
export class AuthMailForm extends Component {
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
            text:"正在验证",
            animating:false
        }
        let {dispatch} = this.props;

        /*发送验证码*/
        this.sendCode = () => {
            if(this.state.sendCodeFlag){
                var email = this.refs.email.value;//手机号
                if(!Util.Mail(email)){
                    Toast.info("请输入正确的邮箱地址",3);
                    return false;
                }

                Tool.fetchPost(Util.getApi("EmailCode"),JSON.stringify({email:email}),{},'json','basic',
                    (res) => {
                        if(!res.serror){
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
                            Toast.info("验证码发送成功",3);
                        }
                    }, (err) => {
                        Toast.info("验证码发送失败",3);
                        console.log(err);
                    });
            }
        }
    
    
        this.validateMailCode = () => {
            var email = this.refs.email.value;
            var emailcode = this.refs.emailcode.value;
            if(!Util.Mail(email)){
                Toast.info("请输入正确的邮箱地址",3);
                return false;
            }
            if(Util.IsNull(emailcode)){
                Toast.info("请输入邮箱验证码",3);
                return false;
            }
            dispatch(setSystemAnimating("正在验证",true));
            
            let submitData = {
                email: email,
                code: emailcode
            };
            Tool.fetchPost(Util.getApi("EmailVerifyCode"),JSON.stringify(submitData),{},'json','basic',
                (res) => {
                    dispatch(setSystemAnimating("",false));
                    /* 验证失败 */
                    if(res.serror){
                        Toast.info(res.serror.desc,3);
                    }else{
                        /* 验证成功 */
                        var props = this.props;
                        Toast.info('邮箱认证成功', 2, function (i) {
                            /* 更新User */
                            var User = props.prevProps.User;
                            User.verifyStatus=1;
                            dispatch(loginUser(User));
                            if(props.from==1){
                                if(Util.IsNull(props.prevProps.User.domain)){
                                    browserHistory.push("/field/userfield?from=2");
                                }else{
                                    browserHistory.push("/");
                                }
                            }else{
                                browserHistory.push("/register/authidentity");
                            }
                        })
                    
                    }
                }, (err) => {
                    dispatch(setSystemAnimating("",false));
                    Toast.info("邮箱认证失败",3);
                    this.setState({button: '重新认证邮箱'});
                });
        
        }
        
    }
    
    componentWillMount() {
    }
    
    goAuthIdentity(e) {
        browserHistory.push("/register/authidentity");
    }
    
    render() {
        return (
            <div className="pub-padding-lf-wrap">
                <div className="register-form login_form aut-mail">
                    <div className="field">
                        <input type="text" placeholder="请输入机构邮箱" ref="email"/>
                    
                    </div>
                    <div className="field">
                        <div className="field-alert sc-bfc">
                            <img src={authMailImg} alt=""/>
                            <span>若您使用的是非机构邮箱，后台会通过电话与您确认</span>
                        </div>
                    </div>
                    
                    <div className="field">
                        <div className="field-code">
                            <input type="text" placeholder="请输入验证码" ref="emailcode"/>
                            <button className={this.state.activeSend + " sendSmsBtn posa"} onClick={this.sendCode}>{this.state.send}</button>
                        </div>
                    </div>
                    
                    <div className="field">
                        <div className="field-nextstep">
                            <button className="sumit-btn" onClick={this.validateMailCode}>下一步</button>
                        </div>
                    </div>
                    {/*<div className="field-skip posa">
                        <Link to="/register/authidentity" className="login_link">跳过,稍后再验证</Link>
                    </div>*/}
                
                </div>
            </div>
        )
    }
}
