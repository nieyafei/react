import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {handleLogin,setSystemAnimating} from '../../action/Action';
import {Header,ListLiFeild,LoginCom} from '../../common/ComponentList';
import {Tool} from '../../Tool';
import {Toast} from 'antd-mobile';
import Util from '../../common/Util';

/*
* 问答模板页面
* */
var dateActive="1,",question_area=1;
class Main extends Component {
    constructor(props){
        super(props);
        var  type = this.props.params.type;
        //问题的类型profession :专业问题    project 项目需求
        this.state={
            newActive:"",
            title:type=="profession"?"提交专业问题":"提交项目需求",
            dateActive:dateActive,
            loginActive:"",
            textTitle:type=="profession"?"问题":"项目需求"
        }
        let {dispatch} = this.props;
        this.newQuestion=()=>{//提交新的问题
            /* 判断是否登录 */
            var token = this.props.User ? this.props.User.token : '';
            if(token == null || token.length<1){
                dispatch(handleLogin(true));
                return;
            }
            /* 显示new表单 */
            this.setState({
                newActive:"active",
            })
        }
        /* 提交表单 */
        this.submitQuestionForm=()=>{
            var question_title = this.refs.question_title.value;
            var keywords = this.refs.keywords.value;
            var content = this.refs.content.value;

            if(Util.IsNull(question_title)){
                Toast.info("请输入"+this.state.textTitle+"标题",3000);
                return false;
            }

            if(Util.IsNull(keywords)){
                Toast.info("请输入"+this.state.textTitle+"关键词",3);
                return false;
            }

            if(Util.IsNull(content)){
                Toast.info("请输入"+this.state.textTitle+"描述",3);
                return false;
            }

            dispatch(setSystemAnimating("正在提交",true));
            Tool.fetchPost(Util.getApi("questionCommit"),JSON.stringify({
                question_title:question_title,
                    keywords:[keywords],
                    content:content,
                    question_area:question_area,
                    token:this.props.User.token,
                    type:type=="profession"?0:1

            }),{},'json','basic',
                (res) => {
                    dispatch(setSystemAnimating("正在提交",false));
                    if(res.serror){
                        Toast.info(res.serror.desc,3);
                    }else{
                        /* 提交成功 */
                        if(res.result){
                            return this.context.router.push({ pathname: "/question/payment/123" }); //跳转到首页
                        }else{
                            Toast.info(res.serror.desc,3);
                        }
                    }
                }, (err) => {
                    dispatch(setSystemAnimating("正在提交",false));
                    Toast.info("提交失败",3);
                });

            //browserHistory.push("/question/payment/123");
        }
        /* 列表切换 */
        this.change=(type_area)=>{
            question_area = type_area;
            if(dateActive.indexOf(type_area+",")>-1){
                /*var array = dateActive.split(",");
                var newdate="";
                for(var i=0;i<array.length-1;i++){
                    if(!(array[i] == type)){
                        newdate+=array[i]+",";
                    }
                }
                dateActive = newdate;*/
            }else{
                dateActive = type_area+",";
            }
            this.setState({
                dateActive:dateActive
            })
            console.log(dateActive);
        }
        /* close */
        this.closeLayer=()=>{
            this.setState({
                newActive:"",
            })
        }
    }
    componentWillMount(){
        Tool.localItem("prevPathName",this.props.location.pathname+this.props.location.search);
    }
    render() {
        return (
            <div className="page question_icon">
                <Header title="提问" leftInfo="back"/>
                <h2 className="tem_tits_info">为了能让专家更积极，快递的响应和回答您的专业问题，请参考如下的提问模板：</h2>
                <div className="ques_template ques_template_bg">
                    <div className="tim_lay">
                        <i className="iconfont icon-wenjuan"></i> 提问模板一
                    </div>
                    <div className="tem_cons">
                        <div className="cons_flo">
                            <label>标&nbsp;&nbsp;&nbsp;&nbsp;题：</label>
                            <span>为什么TPU薄膜会生产过程中会出现白雾？</span>
                        </div>
                        <div className="cons_flo">
                            <label>关键词：</label>
                            <span>TPU  白雾</span>
                        </div>
                        <div className="cons_flo">
                            <label>内&nbsp;&nbsp;&nbsp;&nbsp;容：</label>
                            <span>生产过程中，为了缓解粘稠度，会加入一定润滑剂（MAX）,  可能是反映过程中多安春小分子反映不充分，游离出来。加入助剂（抗氧化剂，紫外线吸收）</span>
                        </div>
                    </div>
                </div>
                <div className="ques_template">
                    <div className="tim_lay">
                        <i className="iconfont icon-wenjuan"></i> 提问模板二
                    </div>
                    <div className="tem_cons">
                        <div className="cons_flo">
                            <label>标&nbsp;&nbsp;&nbsp;&nbsp;题：</label>
                            <span>为什么TPU薄膜会生产过程中会出现白雾？</span>
                        </div>
                        <div className="cons_flo">
                            <label>关键词：</label>
                            <span>TPU  白雾</span>
                        </div>
                        <div className="cons_flo">
                            <label>内&nbsp;&nbsp;&nbsp;&nbsp;容：</label>
                            <span>生产过程中，为了缓解粘稠度，会加入一定润滑剂（MAX）,  可能是反映过程中多安春小分子反映不充分，游离出来。加入助剂（抗氧化剂，紫外线吸收）</span>
                        </div>
                    </div>
                </div>
                <div className="tem_bot_heights"></div>
                <div className="btn_question">
                <Link onClick={this.newQuestion}>知道了，开始提问</Link>
                </div>
                {/* new的表单 */}
                <div className={this.state.newActive + " new_question layer_form"}>
                    <div className="bgs_all"></div>
                    <div className="question_form layer_form_cons">
                        <div className="form_cons">
                            <div className="lay_top"><h3>{this.state.title}</h3></div>
                            <div className="div_scro">
                                <textarea className="title" ref="question_title" placeholder={this.state.textTitle+"标题/简要概括您的"+this.state.textTitle+"："}></textarea>
                                <textarea className="keyword" ref="keywords" placeholder={"请输入"+this.state.textTitle+"关键词："}></textarea>
                                <textarea className="content" ref="content" placeholder={"输入您的"+this.state.textTitle+"问题描述..."}></textarea>
                                <div className="que_field">
                                    <span className="ple_change">请选择问题所在的领域：</span>
                                    <ListLiFeild dateActive={this.state.dateActive} change={this.change}/>
                                </div>
                            </div>
                            <div className="btn">
                                <button className="btn_def" onClick={this.submitQuestionForm}>下一步</button>
                            </div>
                            <div className="close_bgs" onClick={this.closeLayer}><i className="iconfont icon-guanbi"></i></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect((state) => ({
    User: state.User
}))(Main);