import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../../action/Index';
import {Header,ListLiFeild,LoginCom} from '../../common/ComponentList';

import failImg from '../../../img/fail.png';
import sucImg from '../../../img/success.png';

/*
* 问答模板页面
* */
var dateActive="";
class Main extends Component {
    constructor(props){
        super(props);
        var  type = this.props.params.type;//success  成功   fail 失败
        console.log(type);//问题的类型profession :专业问题    project 项目需求

    }
    render() {
        var result;
        if(this.props.params.type=="success"){
            result = <Success />;
        }else{
          result = <Success />;
            // result = <Fail />;
        }
        return (
            <div className="page question_icon">
                <Header title="支付结果" leftInfo="back"/>
                {result}
            </div>
        )
    }
}
/*
* success
* */
class Success extends Component{
    render(){
        return(
            <div className="pay_result">
                <div className="result_cos" data-flex>
                    <div className="fl2" data-flex="main:center cross:center" data-flex-box="1">
                        <img src={sucImg} />
                        <div>
                            <span>支付成功</span>

                        </div>
                    </div>
                </div>
                <div className="result_tips">
                  <div>专业问题提交成功</div>
                    科学家在线将按照您的服务类型将问题推
                    送给专家，请留意专业的响应和回复。
                </div>
                <Link to="" className="btn_def">查看问题详情</Link>
            </div>
        )
    }
}

/*
 * fail
 * */
class Fail extends Component{
    render(){
        return(
            <div className="pay_result">
                <div className="result_cos result_cos2" data-flex>
                    <div className="fl1" data-flex="main:center cross:center" data-flex-box="1">

                    <img src={failImg} />
                        <span>支付失败</span>
                    </div>
                </div>
                <div className="result_tips center">
                    支付失败，请重新提交您的问题。
                </div>
                <Link to="" className="btn_def">重新提交问题</Link>
            </div>
        )
    }
}

export default connect((state) => ({
    User: state.User
}))(Main);
