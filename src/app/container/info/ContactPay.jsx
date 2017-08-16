import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import action from '../../action/Index';
import { Tool, merged } from '../../Tool';
import {Header,Footer} from '../../common/ComponentList';
import Util from '../../common/Util';
/*
* 电话咨询支付页面
* */
var id,type;
class Main extends Component {
    constructor(props){
        super(props);
        this.state={
            title:""
        }
        this.toPay=()=>{

        }

    }
    componentWillMount(){
        /* 获取专家id */
        if(Util.isLogin(this.props)){
            id = this.props.params.id;
            type = this.props.params.type;//来源
            if(Tool.getSession("contactExpertUid")!=id){
                browserHistory.push("/");
            }
            if(type=="other"){
                this.setState({
                    title:"您正在就"+Tool.getSession("contactTitle")+"联系专家"+Tool.getSession("contactName")
                })
            }else if(type="info"){
                this.setState({
                    title:"您正在联系专家"+Tool.getSession("contactName")
                })
            }
        }
    }
    render() {
        return (
            <div className="page contact_cons">
                <Header title="电话咨询" leftInfo="back"/>
                <div className="contact_top">
                    <h1>{this.state.title}，您可以选择：</h1>
                    <textarea placeholder="输入您想对专家说的话，或想问专家的问题，例如：如何研制什么....">
                    </textarea>
                    <h3>您需要支付58元服务费，平台将确保您与该专家进行10分钟的三方通话沟通。</h3>
                    <button className="btn_def but_to_pay" onClick={this.toPay}>去支付</button>
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

