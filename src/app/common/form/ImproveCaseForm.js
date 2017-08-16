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

const FileInput = require('react-file-input');
let PubSub = require('pubsub-js');
import 'moment/locale/zh-cn';


import  "../../../style/form/form.less"

import {Scrollbars} from 'react-custom-scrollbars';


const zhNow = moment().locale('zh-cn').utcOffset(8);
// const maxDate = moment('2016-12-03 +0800', 'YYYY-MM-DD Z').utcOffset(8);
const defaultDate = moment('2000-01-01 +0800', 'YYYY-MM-DD Z').utcOffset(8);

// const maxTime = moment('22:00 +0800', 'HH:mm Z').utcOffset(8);
// const minTime = moment('08:30 +0800', 'HH:mm Z').utcOffset(8);

// const gmtNow = moment().utcOffset(0);


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

export class ImproveCaseForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            active1: "active",
            active2: "",
            loginType: 1,
            activeSend: "",
            animating: false,
            dateActive: "",
            detail: null,
            file: null
        }
        let {dispatch} = this.props;
        
        this.change = (type)=> {
            console.log(dateActive)
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
        
        this.saveImporveCaseSubscriber = (msg, data) => {
            // console.log( msg, data );
            
            let enterpriseName = this.refs.enterpriseName.value;
            let lastName = this.refs.lastname.value;
            let firstName = this.refs.firstname.value;
            let {startTime, endTime, detail} = this.state;
            let title = this.refs.title.value;
            let keyword = this.refs.keyword.value;
            let capital = this.refs.capital.value;
            let effect = this.refs.effect.value;
            let coverPic = this.refs.coverPic.value;
            
            if (Util.IsNull(enterpriseName)) {
                Toast.info("请输入机构/高校名称", 3);
                return false;
            }
            if (Util.IsNull(lastName)) {
                Toast.info("请输入您的姓", 3);
                return false;
            }
            if (Util.IsNull(title)) {
                Toast.info("请输入标题", 3);
                return false;
            }
            if (Util.IsNull(keyword)) {
                Toast.info("请输入关键词", 3);
                return false;
            }
            if (Util.IsNull(firstName)) {
                Toast.info("请输入您的名", 3);
                return false;
            }
            
            if (Util.IsNull(startTime)) {
                Toast.info("请选择开始时间", 3);
                return false;
            }
            if (Util.IsNull(endTime)) {
                Toast.info("请选择结束时间", 3);
                return false;
            }
            if (!Util.isNumber(capital)) {
                Toast.info("请输入案例企业的投入资金金额", 3);
                return false;
            }
            if (Util.IsNull(effect)) {
                Toast.info("请输入案例企业的效果效益", 3);
                return false;
            }
            if (Util.IsNull(detail)) {
                Toast.info("请输入详细描述案例内容", 3);
                return false;
            }
            
            // if(Util.IsNull(file)){
            //     Toast.info("请上传案例图片",3);
            //     return false;
            // }
            
            startTime = this.format(startTime, 'YYYY-MM-DD');
            endTime = this.format(endTime, 'YYYY-MM-DD');
            
            dispatch(setSystemAnimating("正在发布...", true));
            
            let submitData = {
                enterpriseName: enterpriseName,
                firstName: firstName,
                lastName: lastName,
                startTime: startTime,
                endTime: endTime,
                title: title,
                keyword: keyword,
                detail: detail,
                capital: parseFloat(capital),
                // domain: Tool.localItem("fieldType"),
                domain: 1,
                coverPic: coverPic,
                tags: Tool.localItem("tagList")
            };
            
            Tool.fetchPost("/api/case/add", JSON.stringify(submitData), {}, 'json', 'basic',
                (res) => {
                    dispatch(setSystemAnimating("", false));
                    /* 发布成功 */
                    if (res.serror) {
                        Toast.info(res.serror.desc, 3);
                    } else {
                        Toast.info('发布成功', 2, function (i) {
                            browserHistory.push('/?type=case');
                        })
                        
                    }
                }, (err) => {
                    dispatch(setSystemAnimating("", false));
                    Toast.info("发布失败", 3);
                });
            
        };
    }
    
    componentWillMount() {
        let {dispatch} = this.props;
        dispatch(loadDomain());
        this.setState({
            btnInfo: "保存"
        });
        
        PubSub.subscribe('saveImporveCase', this.saveImporveCaseSubscriber);
    }
    
    format(date, format) {
        if (date && format) {
            return date.format(format);
        }
    }
    
    handleChange(event) {
        this.setState({
            file: event.target.files[0]
        })
        console.log('Selected file:', event.target.files[0]);
    }
    
    render() {
        
        let {UserCenter} = this.props;
        dateActive = UserCenter["domainList"][0] ? UserCenter["domainList"][0].content : "";
        
        return (
            <div className="pub-padding-lf-wrap">
                <form action="">
                    <div className="pub-form improve-case-form">
                        <div className="field">
                            <input type="text" placeholder="请输入合作企业的真实名称（不会对其他人公开）" ref="enterpriseName" />
                        
                        </div>
                        <div className="field">
                            <input type="text" placeholder="请输入您的姓" ref="lastname" defaultValue=""/>
                        </div>
                        <div className="field">
                            <input type="text" placeholder="请输入您的名" ref="firstname" defaultValue=""/>
                        </div>
                        
                        <div className="field">
                            {/*<input type="text" placeholder="+86" ref="areacode" className="almost-equal"/>*/}
                            {/*<input type="text" placeholder="请输入手机号码" ref="mobile" className="almost-equal maginleft-percent5"/>*/}
                            
                            
                            <div className="date-picker">
                                <DatePicker
                                    mode="date"
                                    title="选择日期"
                                    extra=""
                                    value={this.state.startTime}
                                    onChange={v => this.setState({startTime: v})}
                                >
                                    <CustomChildren>开始时间</CustomChildren>
                                </DatePicker>
                            </div>
                        
                        
                        </div>
                        
                        <div className="field">
                            {/*<input type="text" placeholder="+86" ref="areacode" className="almost-equal"/>*/}
                            {/*<input type="text" placeholder="请输入手机号码" ref="mobile" className="almost-equal maginleft-percent5"/>*/}
                            
                            <div className="date-picker">
                                
                                <DatePicker
                                    mode="date"
                                    title="选择日期"
                                    extra=""
                                    value={this.state.endTime}
                                    onChange={v => this.setState({endTime: v})}
                                >
                                    <CustomChildren>结束时间</CustomChildren>
                                </DatePicker>
                            </div>
                        
                        </div>
                        
                        
                        <div className="field">
                            <input type="text" placeholder="请输入案例标题" ref="title" defaultValue=""/>
                        </div>
                        
                        <div className="field">
                            <input type="text" placeholder="请输入案例关键词" ref="keyword" defaultValue=""/>
                        </div>
                        
                        <div className="field">
                            <label htmlFor="">请选择该案例所属的领域：</label>
                            <div className="sc-bfc">
                                <ListLiFeild dateActive={dateActive} change={this.change}/>
                            </div>
                        </div>
                        
                        
                        <div className="field">
                            <input type="text" placeholder="请输入案例企业的投入资金金额" ref="capital" defaultValue=""/>
                            <span className="danwei"> ( 万元 ) </span>
                        </div>
                        <div className="field">
                            <input type="text" placeholder="请输入案例企业的效果效益" ref="effect" defaultValue=""/>
                        </div>
                        <div className="field">
                            
                            <div className="textarea-wrap">
                                <TextareaItem
                                    className="mulrows_text"
                                    rows={5}
                                    onChange={ value=>this.setState({detail: value}) }
                                    placeholder="请输入详细描述案例内容"
                                />
                            </div>
                        
                        </div>
                        
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        
                        
                        <div className="field">
    
                            <div className="sc-bfc upload_warp">
                                <i className="camera"></i>
                                <input type="text" ref="coverPic" style={{"marginTop":"0"}}
                                       defaultValue=""/>
                            </div>
                            
                        </div>
                        
                        <div className="field none">
                            
                            <input type="text" ref="coverPic" defaultValue=""/>
                            
                            <Flex className="uploadImage none">
                                <div className="sc-bfc upload_warp">
                                    <i className="camera fl"></i>
                                    <span className="fl">上传案例照片</span>
                                </div>
                                <Flex.Item className="upload_input_area">
                                    <FileInput name="myImage"
                                               accept=".png,.gif,.jpg"
                                               placeholder="My Image"
                                               className="inputClass"
                                               onChange={this.handleChange}/>
                                
                                </Flex.Item>
                            </Flex>
                        </div>
                        <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
                    </div>
                </form>
            </div>
        )
    }
}
ImproveCaseForm.contextTypes = {
    // onSubmit: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User,
    UserCenter: state.UserCenter,
    Login: state.Login
}))(ImproveCaseForm); //连接redux
