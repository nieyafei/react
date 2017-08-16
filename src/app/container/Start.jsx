import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import action from '../action/Index';
import {LoginCom} from '../common/ComponentList';
import Util from '../common/Util';
import logoen from '../../img/logoen.png';
import {Tool} from "../Tool";
import {RefreshControl, ListView, ActivityIndicator, SearchBar, Toast, Flex} from 'antd-mobile';
/*
* Login
* */
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start1active:"active",
            start2active:"",
            need: 0,
            question:0,
            corporation:0
        }
        this.getCounts =()=>{
            Tool.fetchGet(Util.getApi("startCount"), "", {}, 'json', 'basic',
                (res) => {
                    if(res.result){
                        this.setState({
                            need: this.toThousands(res.result.issueCount),
                            question:this.toThousands(res.result.questionCount)
                        })
                    }
                }, (err) => {
                    console.log(err);
                });
        }
        this.start = ()=>{

            this.setState({
                start1active:"",
                start2active:"active"
            })

            setTimeout(function(){
                browserHistory.push("/field/startfield");
            },1000);
            //browserHistory.push("/field/startfield");
            /*Tool.fetchGet("/qichacha/",company,{},'json','basic',
            (res) => {
                console.log(res);
            }, (err) => {
                console.log(err);
            });*/

        }
    }

    toThousands(num) {
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }

    toThousandsSpan(num) {
        var indents = [];
        for(var i = 0; i < num.length; i++){
            if(num[i] == ','){
                indents.push(<span key={i} className='separate'>{num[i]}</span>);
            }else{
                indents.push(<span key={i}>{num[i]}</span>);
            }
        }
        return (
          <div>
              {indents}
          </div>
        );

    }

    componentWillMount() {
        this.getCounts();
        this.setState({
            need: this.toThousands(0),
            question:this.toThousands(0),
            corporation:this.toThousands(865654)
        })
    }

    render() {

        var {need, question, corporation} = this.state;
        corporation =  this.toThousandsSpan(corporation);

        return (
            <div className="start_cons">
                <div className="start_h">
                    <img src={logoen} className="logo_image"/>
                    <span>大数据为您精准对接千万中小企业</span>
                </div>
                <div className={this.state.start1active +" start_1 start_2"}>
                    <div className="start_wrap">
                        <div className="caption">
                            我们为您准备了：
                        </div>

                        <Flex className="static-info">
                            <Flex.Item className="item need">
                                <span>{need}</span>
                                <div>
                                    企业项目需求
                                </div>
                            </Flex.Item>
                            <Flex.Item className="item question">
                                <span>{question}</span>
                                <div>
                                    企业专业问题
                                </div>
                            </Flex.Item>
                        </Flex>

                    </div>

                    <h2 className="corporation_tips">更重要的是</h2>
                    <div className="corporation_static">

                        {corporation}
                        {/*<span>1</span>*/}
                        {/*<span>2</span>*/}
                        {/*<span>3</span>*/}
                        {/*<span className="separate">,</span>*/}
                        {/*<span>4</span>*/}
                        {/*<span>5</span>*/}
                    </div>

                    <h2 className="corporation_tips_name bold">中小科技企业</h2>

                    <div className="links">
                        <Link to="/register" className="register">注册成为专家</Link>
                        <Link to="/login" className="login">登 录</Link>
                    </div>

                </div>
                {/*根据公司匹配加载中*/}
                <div className={this.state.start2active + " start_1"}>
                    <div className="start_loading">
                        <div className="weui_loading">
                            <div className="weui_loading_leaf weui_loading_leaf_0"></div>
                            <div className="weui_loading_leaf weui_loading_leaf_1"></div>
                            <div className="weui_loading_leaf weui_loading_leaf_2"></div>
                            <div className="weui_loading_leaf weui_loading_leaf_3"></div>
                            <div className="weui_loading_leaf weui_loading_leaf_4"></div>
                            <div className="weui_loading_leaf weui_loading_leaf_5"></div>
                            <div className="weui_loading_leaf weui_loading_leaf_6"></div>
                            <div className="weui_loading_leaf weui_loading_leaf_7"></div>
                            <div className="weui_loading_leaf weui_loading_leaf_8"></div>
                            <div className="weui_loading_leaf weui_loading_leaf_9"></div>
                            <div className="weui_loading_leaf weui_loading_leaf_10"></div>
                            <div className="weui_loading_leaf weui_loading_leaf_11"></div>
                        </div>
                    </div>
                    <span className="loadtips">请稍后，大数据正在走遍互联网<br/>为您的公司进行诊断</span>
                </div>
            </div>
        )
    }
}
export default connect((state) => ({
    User: state.User
}))(Main);