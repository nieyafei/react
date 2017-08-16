import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../../action/Index';
import {Header,ListLiFeild,LoginCom} from '../../common/ComponentList';
/*
* 问答模板页面
* */
var dateActive="",payType=0;
class Main extends Component {
    constructor(props){
        super(props);
        var  type = this.props.params.type;//根据不同的状态选择不同的支付显示
        var questionId = this.props.location.query.id;//获取问题的id
        console.log(type);//问题的类型profession :专业问题    project 项目需求
        this.state={
            newActive:"",
            title:type=="profession"?"选择服务类型和支付":"项目需求支付确认",
            dateActive:"",
            loginActive:""
        }
        this.toPay=()=>{//提交新的问题
            console.log(payType);
            /* 判断是否登录 */
            /*this.setState({
                loginActive:"active"
            })*/
            /* 显示new表单 */
            this.setState({
                newActive:"active",
            })
        }
        this.weiXinPay=()=>{
            /* 微信支付 */
            browserHistory.push("/question/result/success");
        }
        this.change=(type)=>{
            console.log(type);
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
            this.setState({
                dateActive:dateActive
            })
            console.log(dateActive);
        }
        this.closeLayer=()=>{
            this.setState({
                newActive:"",
            })
        }
        this.closeLoginLayer=()=>{
            this.setState({
                loginActive:""
            })
        }

    }
    render() {
        var paymain;
        if(this.props.params.type=="profession"){
            paymain = <Profession />;
        }else{
            paymain = <Project />;
        }
        return (
            <div className="page question_icon">
                <Header title={this.state.title} leftInfo="back"/>
                {paymain}
                <div className="btn_question no_bottom">
                <Link onClick={this.toPay}>下一步</Link>
                </div>
                {/* 选择支付表单 */}
                <div className={this.state.newActive + " new_question layer_form"}>
                    <div className="bgs_all"></div>
                    <div className="question_form layer_form_cons little">
                        <div className="form_cons">
                            <div className="div_scro">
                                <div className="lay_top"><h3>请选择支付方式</h3></div>
                                <div className="weixin_pay_link" onClick={this.weiXinPay}>
                                    <i className="iconfont icon-weixin"></i>
                                    微信支付
                                </div>
                                {/*<div className="btn">
                                    <button className="btn_def">下一步</button>
                                </div>*/}
                                <div className="close_bgs" onClick={this.closeLayer}><i className="iconfont icon-guanbi"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={this.state.loginActive + " layer_login"}>
                    <LoginCom closeLoginLayer={this.closeLoginLayer}/>
                </div>
            </div>
        )
    }
}

/*
* 专业问题
* */
class Profession extends Component{
    constructor(props){
        super(props);
        this.state={
            type:0
        }
        this.changePay=(type)=>{
            this.setState({
                type:type
            })
            payType = type;
        }
    }
    render(){
        var setCur = ["","",""];
        setCur[this.state.type-1] = 'active';
        return(
            <div className="profession_pay">
                <div className={setCur[0]+" pay_types1"} onClick={this.changePay.bind(this,1)} data-flex>
                    <div className="le"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                    <div className="pay_money" data-flex="main:center cross:center" data-flex-box="0">
                        <i>￥</i><span>5</span><em>元</em>
                    </div>
                    <div className="pay_infos" data-flex="main:center cross:center" data-flex-box="1">
                        短信邮件推送给<br/>
                        20位匹配专家
                    </div>
                    <div className="ri"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                </div>
                <div className={setCur[1]+" pay_types1 pay_types2"} onClick={this.changePay.bind(this,2)} data-flex>
                    <div className="le"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                    <div className="pay_money" data-flex="main:center cross:center" data-flex-box="0">
                        <i>￥</i><span>10</span><em>元</em>
                    </div>
                    <div className="pay_infos" data-flex="main:center cross:center" data-flex-box="1">
                        短信邮件推送给<br/>
                        50位匹配专家
                    </div>
                    <div className="ri"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                </div>
                <div className={setCur[2]+" pay_types1 pay_types2"} onClick={this.changePay.bind(this,3)} data-flex>
                    <div className="le"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                    <div className="pay_money" data-flex="main:center cross:center" data-flex-box="0">
                        <i>￥</i><span>20</span><em>元</em>
                    </div>
                    <div className="pay_infos" data-flex="main:center cross:center" data-flex-box="1">
                        短信邮件推送给<br/>
                        100位匹配专家
                    </div>
                    <div className="ri"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                </div>
            </div>
        )
    }
}

/*
 * 项目需求
 * */
class Project extends Component{
    render(){
        return(
            <div className="profession_pay project_pay">
                <div className="pay_tit_mon">您将支付200元</div>
                <div className="pay_types1 pay_types2" data-flex>
                    <div className="le"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                    <div className="pay_money" data-flex="main:center cross:center" data-flex-box="1">
                        <i>￥</i><span>200</span><em>元</em>
                    </div>
                    <div className="ri"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                </div>
                <div className="project_infos">
                    支付成功后，科学家在线将联系您，和您
                    充分沟通确认后，为您找到最佳的4位专
                    家，并促成您和每位专家的10分钟三方通
                    话，由您来选择最合适的专家来进行项目
                    需求的对接。
                </div>
            </div>
        )
    }
}

export default connect((state) => ({
    User: state.User
}))(Main);