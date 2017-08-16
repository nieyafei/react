/**
 * Created by Lichong on 24/03/2017.
 */
import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {setSystemAnimating, handleLogin, loginUser, loadDomain,updateDomain} from '../../action/Action';
import Util from '../../common/Util';
import {Tool} from "../../Tool";
import {Header, LoadingToast, ListLiFeild} from '../../common/ComponentList';

import {DatePicker, List, Toast, Flex, TextareaItem} from 'antd-mobile';
import {createForm} from 'rc-form';
import moment from 'moment';
import 'moment/locale/zh-cn';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
let PubSub = require('pubsub-js');

// http://stackoverflow.com/questions/34321128/render-array-of-inputs-in-react

import  "../../../style/form/form.less"

import {Scrollbars} from 'react-custom-scrollbars';
import Formsy from 'formsy-react';

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

export class ImproveOpinionForm extends Component {
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
            dateActive:"",
            content: null
        }
        let {dispatch} = this.props;
        
        this.register = () => {
            
        }
    
        this.saveImporveOpinionSubscriber = (msg, data) => {
            // console.log( msg, data );
        
            let title = this.refs.title.value;
            let keyword = this.refs.keyword.value;
            let {content} = this.state;
        
            if (Util.IsNull(title)) {
                Toast.info("请输入标题", 3);
                return false;
            }
            if (Util.IsNull(keyword)) {
                Toast.info("请输入关键词", 3);
                return false;
            }
            if (Util.IsNull(content)) {
                Toast.info("请输入详细描述案例内容", 3);
                return false;
            }
        
            dispatch(setSystemAnimating("正在发布...", true));
        
            let submitData = {
                title: title,
                keyword: keyword,
                content: content,
                type: 1,
                tags: Tool.localItem("tagList")
            };
        
            Tool.fetchPost("/api/opinion/add", JSON.stringify(submitData), {}, 'json', 'basic',
                (res) => {
                    dispatch(setSystemAnimating("", false));
                    /* 发布成功 */
                    if (res.serror) {
                        Toast.info(res.serror.desc, 3);
                    } else {
                        Toast.info('发布成功', 2, function (i) {
                            browserHistory.push('/?type=opinion');
                        })
                    
                    }
                }, (err) => {
                    debugger;
                    dispatch(setSystemAnimating("", false));
                    Toast.info("发布失败", 3);
                });
        
        };
    
        this.change=(type)=>{
            if(dateActive.indexOf(type+",")>-1){
                var array = dateActive.split(",");
                var newdate="";
                for(var i=0;i<array.length-1;i++){
                    if(!(array[i] == type)){
                        newdate+=array[i]+",";
                    }
                }
                dateActive = newdate;
            }else{
                dateActive +=type+",";
            }
            dispatch(updateDomain(dateActive,1));
        }
    }
    
    componentWillMount(){
        let {dispatch} = this.props;
        dispatch(loadDomain());
        this.setState({
            btnInfo:"保存"
        })
        PubSub.subscribe('saveImporveOpinion', this.saveImporveOpinionSubscriber);
    }
    
    render() {
        let {UserCenter} = this.props;
        dateActive = UserCenter["domainList"][0] ? UserCenter["domainList"][0].content : "";
        
        return (
            <div className="pub-padding-lf-wrap">
                
                
                <div className="pub-form improve-case-form" onChange={this.props.onSubmit}>
                    <div className="field">
                        <input type="text" placeholder="请输入合观点标题" ref="title"/>
                    
                    </div>
                    <div className="field">
                        <input type="text" placeholder="请输入观点关键词" ref="keyword"/>
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
    
                        <div className="textarea-wrap">
                            <TextareaItem
                                className="mulrows_text"
                                rows={5}
                                onChange={ value=>this.setState({content: value}) }
                                placeholder="请输入详细描述案例内容"
                            />
                        </div>
                        
                    </div>
    
                </div>
            </div>
        )
    }
}
ImproveOpinionForm.contextTypes = {
    // onSubmit: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User,
    UserCenter: state.UserCenter,
    Login: state.Login
}))(ImproveOpinionForm); //连接redux