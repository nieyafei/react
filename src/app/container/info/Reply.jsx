import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {handleLogin,setSystemAnimating} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {Header,Footer} from '../../common/ComponentList';
import Util from '../../common/Util';
import {Toast} from 'antd-mobile';
/*
回复页面
* */
var id,pid,type,from;
class Main extends Component {
    constructor(props,context){
        super(props,context);
        let {dispatch} = this.props;
        
        this.replyAdd=()=>{
            
            console.log("点击了回复");
            var content = Util.TransferString(this.refs.content.value);
            if(Util.IsNull(content)){
                Toast.info("请填写回复内容",3);
                return;
            }
            dispatch(setSystemAnimating("正在提交",true));
            var typeInt = 1;
            if(type=="case"){typeInt = 3;}else if(type=="tech"){typeInt = 6;}else if(type=="opinion"){typeInt = 5;}
            Tool.fetchPost(Util.getApi("questionAnwser"),JSON.stringify({qid:id,content:content,parent_id:pid,type:typeInt}),{},'json','basic',
                (res) => {
                    if(res.result.action=="回复成功"){
                        //return this.context.router.push({ pathname: "/"+type+"/info/"+id+"?reply=1"}); //详情页面
                        Tool.setSession("fromReply",true);
                        dispatch(setSystemAnimating("",false));
                        return browserHistory.push("/"+type+"/"+(type=="question"?"detail":"info")+"/"+id); //详情页面
                    }else{
                        dispatch(setSystemAnimating("",false));
                        console.log("数据加载失败");
                    }
                }, (err) => {
                    dispatch(setSystemAnimating("",false));
                    console.log(err);
                });
        }
    }
    componentWillMount(){
        
        id = this.props.params.id;
        type = this.props.params.type;
        pid = this.props.location.query.pid;
        from = this.props.location.query.from;
        // if(Util.IsNull(id) || !(type=="question" || type=="tech" || type=="case" || type=="opinion")){
        //     browserHistory.push("/");
        // }
        Tool.saveScroll("detailScroll",type);
        Util.bodyOver(true);
        Util.prevPathName(this.props);
        Util.isLogin(this.props);
    }
    render() {
        return (
            <div className="page_hei_cons home_cons div_hidden">
                <Header title="添加回复" leftInfo="back" rightClick="replyAdd" replyAdd={this.replyAdd}/>
                <div className="page bg_color">
                    <div className="reply_text">
                    <textarea placeholder="请输入你要回复的内容" ref="content" className="bg_color"></textarea>
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

