import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import action from '../../action/Index';
import { Tool, merged } from '../../Tool';
import {Header,Footer} from '../../common/ComponentList'
/*
* 付费历史页面
* */
class Main extends Component {
    constructor(props){
        super(props)

    }
    render() {
        return (
            <div className="page pay_cons bg_color">
                <Header title="付费历史" leftInfo="back"/>
                <div className="pay_lists">
                    <div className="list_info">
                        <h1>支付金额<span>2017-01-23</span></h1>
                        <h2>￥1.00</h2>
                        <div className="lis">
                            <span>支付方式：</span>支付宝/微信支付
                        </div>
                        <div className="lis">
                            <span>商品详情：</span>王岳成教授的电话咨询费用
                        </div>
                        <div className="lis">
                            <span>支付结果：</span>您已经成功购买了王岳成教授的电话咨询，小编将在三方通话
                            三方童虎开始前10分钟短信提醒你。
                        </div>
                    </div>
                    <div className="list_info">
                        <h1>支付金额<span>2017-01-23</span></h1>
                        <h2>￥1.00</h2>
                        <div className="lis">
                            <span>支付方式：</span>支付宝/微信支付
                        </div>
                        <div className="lis">
                            <span>商品详情：</span>王岳成教授的电话咨询费用
                        </div>
                        <div className="lis">
                            <span>支付结果：</span>您已经成功购买了王岳成教授的电话咨询，小编将在三方通话
                            三方童虎开始前10分钟短信提醒你。
                        </div>
                    </div>
                    <div className="list_info">
                        <h1>支付金额<span>2017-01-23</span></h1>
                        <h2>￥1.00</h2>
                        <div className="lis">
                            <span>支付方式：</span>支付宝/微信支付
                        </div>
                        <div className="lis">
                            <span>商品详情：</span>王岳成教授的电话咨询费用
                        </div>
                        <div className="lis">
                            <span>支付结果：</span>您已经成功购买了王岳成教授的电话咨询，小编将在三方通话
                            三方童虎开始前10分钟短信提醒你。
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount(){

    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User
}))(Main);

