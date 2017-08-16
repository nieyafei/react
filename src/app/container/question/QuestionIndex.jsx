import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../../action/Index';
import {Header} from '../../common/ComponentList';
/*
* 问答引导页面
* */
class Main extends Component {
    render() {
        return (
            <div className="page question_icon">
                <Header title="提问" leftInfo="back"/>
                <div className="question_nav">
                    <Link to="/question/template/profession" className="quest_link">
                        <i className="iconfont icon-wenhao left_icon"></i>
                        专业问题
                        <i className="right_icon iconfont icon-jiantou"></i>
                    </Link>
                    <div className="li_mess">
                        你提交的专业问题，支付一定的信息服务费后，将
                        通过短信、邮件等方式推送给专家，有感兴趣的专
                        家进行问题的回答。
                    </div>
                </div>
                <div className="que_height"></div>
                <div className="question_nav">
                    <Link to="/question/template/project" className="quest_link">
                        <i className="iconfont icon-wenj2 left_icon"></i>
                        项目需求
                        <i className="right_icon iconfont icon-jiantou"></i>
                    </Link>
                    <div className="li_mess">
                        项目需求提交成功后，科学家在线将联系您，和您
                        充分沟通确认后，为您找到最佳的4位专家，并促
                        成您和每位专家的10分钟的三方电话，由您来选择
                        最适合的转降进行项目需求的对接。<br/>
                        该服务将收取200元信息服务费。
                    </div>
                </div>
            </div>
        )
    }
}
export default connect((state) => ({
    User: state.User
}))(Main);