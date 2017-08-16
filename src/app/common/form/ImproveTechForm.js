/**
 * Created by Lichong on 24/03/2017.
 */
import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {setSystemAnimating, handleLogin, loginUser, loadDomain, updateDomain} from '../../action/Action';
import Util from '../../common/Util';
import {Tool} from "../../Tool";
import {Header, LoadingToast, ListLiFeild} from '../../common/ComponentList';

import {DatePicker, List, Toast, Flex, TextareaItem} from 'antd-mobile';
import {createForm} from 'rc-form';
import moment from 'moment';
import 'moment/locale/zh-cn';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';


import  "../../../style/form/form.less"

import {Scrollbars} from 'react-custom-scrollbars';


const CustomChildren = props => (
    <div
        onClick={props.onClick}
        style={{backgroundColor: '#fff', height: '0.9rem', lineHeight: '0.9rem', padding: '0 0.3rem'}}
    >
        {props.children}
        <span style={{float: 'right', color: '#888'}}>{props.extra}</span>
    </div>
);


var dateActive = "1,";

export class ImproveTechForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            button: "注册",
            active1: "active",
            active2: "",
            loginType: 1,
            send: "发送验证码",
            activeSend: "",
            sendCodeFlag: true, //发送验证码
            text: "正在注册",
            animating: false,
            dateActive: ""
        }
        let {dispatch} = this.props;
        
        this.register = () => {
            
        }
        
        /*发送验证码*/
        this.sendCode = () => {
            
        }
        
        this.change = (type)=> {
            if (dateActive.indexOf(type + ",") > -1) {
                var array = dateActive.split(",");
                var newdate = "";
                for (var i = 0; i < array.length - 1; i++) {
                    if (!(array[i] == type)) {
                        newdate += array[i] + ",";
                    }
                }
                dateActive = newdate;
            } else {
                dateActive += type + ",";
            }
            dispatch(updateDomain(dateActive, 1));
        }
    }
    
    componentWillMount() {
        let {dispatch} = this.props;
        dispatch(loadDomain());
        this.setState({
            btnInfo: "保存"
        })
    }
    
    render() {
        let {UserCenter} = this.props;
        dateActive = UserCenter["domainList"][0] ? UserCenter["domainList"][0].content : "";
        
        return (
            <div className="pub-padding-lf-wrap">
                
                <div className="pub-form improve-case-form" onChange={this.props.onSubmit}>
                    <div className="field">
                        <input type="text" placeholder="上传您的技术" ref="enterpriseName"/>
                    
                    </div>
                    <div className="field">
                        <input type="text" placeholder="请输入技术关键词" ref="lastname"/>
                    </div>
                    <div className="field">
                        <input type="text" placeholder="请输入您的名" ref="firstname"/>
                    </div>
                    
                    <div className="field">
                        <label htmlFor="">请选择该案例所属的领域：</label>
                        <div className="sc-bfc">
                            <ListLiFeild dateActive={dateActive} change={this.change}/>
                        </div>
                    </div>
                    
                    
                    <div className="field">
                        <input type="text" placeholder="请输入其他合作方式" ref="firstname"/>
                    </div>
                    
                    <div className="field">
                        <input type="text" placeholder="请输入详细描述案例内容" ref="password"/>
                        
                        <div className="textarea-wrap">
                            <TextareaItem
                                className="mulrows_text"
                                rows={5}
                                placeholder="请输入详细描述案例内容"
                            />
                        </div>
                    
                    </div>
                    <div className="field">
                        
                        <div className="textarea-wrap">
                            <TextareaItem
                                className="mulrows_text"
                                rows={5}
                                placeholder="请输入技术信息"
                            />
                        </div>
                    
                    </div>
                    
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                
                
                </div>
            </div>
        )
    }
}
ImproveTechForm.contextTypes = {
    // onSubmit: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User,
    UserCenter: state.UserCenter,
    Login: state.Login
}))(ImproveTechForm); //连接redux