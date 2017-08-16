import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link, hashHistory} from 'react-router';
import {connect} from 'react-redux';
import action from '../../action/Index';
import {Tool, merged} from '../../Tool';
import {Header, Footer} from '../../common/ComponentList'
import {HeaderCaption} from '../../common/HeaderCaption';

import  "../../../style/user/PerfectUserInfo.less"

import infoblackImg from '../../../img/header-caption/info-black.png';
import authMailImg from '../../../img/header-caption/authmail.png';


/*
 * 完善个人资料
 * */
class PerfectUserInfo extends Component {
    constructor(props) {
        super(props)
        
    }
    
    render() {
        return (
            <div className="page">
                <Header title="完善产业资料" leftInfo="back"/>
                <HeaderCaption captionText="完善您的个人产业数据（案例、观点、技术）以及您的学术数据，企业将更全面的了解您，将提高您和企业合作的概率。请选择要添加的资料："
                               captionImg={infoblackImg}/>
                
                <div className="pub-padding-lf-wrap bdt">
                    <div className="industry-list">
                        
                        <h1>产业数据：</h1>
                        
                        <div className="industry-item">
                            <div className="sumit-btn">
                                
                                
                                <Link to="/user/computer-edit/case">
                                    <i className="iconfont icon-jia"></i>添加案例
                                </Link>
                            
                            </div>
                            <div className="field-alert sc-bfc mt20">
                                <img src={authMailImg} alt=""/>
                                <span>提交您和企业合作的案例，体现您的产业化成功经验</span>
                            </div>
                        </div>
                        
                        <div className="industry-item">
                            <div className="sumit-btn">
                                <Link to="/user/computer-edit/opinion">
                                    <i className="iconfont icon-jia"></i>添加观点
                                </Link>
                            </div>
                            <div className="field-alert sc-bfc mt20">
                                <img src={authMailImg} alt=""/>
                                <span>提交您对产业、行业、技术、企业合作的观点和看法</span>
                            </div>
                        </div>
                        
                        <div className="industry-item">
                            <div className="sumit-btn">
                                <Link to="/user/computer-edit/tech">
                                    <i className="iconfont icon-jia"></i>添加技术
                                </Link>
                            </div>
                            <div className="field-alert sc-bfc mt20">
                                <img src={authMailImg} alt=""/>
                                <span>提交您已有的技术和成功转化的案例，可进行快速转化落地</span>
                            </div>
                        </div>

                    </div>
                </div>
            
            </div>
        )
    }
    
    componentDidMount() {
    
    }
}

PerfectUserInfo.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User
}))(PerfectUserInfo);

