import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link, hashHistory} from 'react-router';
import {connect} from 'react-redux';
import {handleLogin,setSystemAnimating} from '../../action/Action';
import {Tool, merged} from '../../Tool';
import {Header, Footer} from '../../common/ComponentList';
import Util from "../../common/Util";
import {ListView, ActivityIndicator, Toast, Flex} from 'antd-mobile';

/*
 * 联系我页面
 * */
var uri, type;
class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: ""
        }
        
        let {dispatch} = this.props;
        
        this.replyAdd = () => {
            
            var content = this.refs.content.value;
            
            if (Util.IsNull(content)) {
                Toast.info("请填写内容", 3);
                return;
            }
            
            dispatch(setSystemAnimating("正在提交", true));
            Tool.fetchPost(Util.getApi("contaceMe"), JSON.stringify({
                    issueId: uri,
                    content: content
                }), {}, 'json', 'basic',
                (res) => {
                    if (res.serror && res.serror.type === '0') {
                        // if(res.result.action=="回复成功"){
                        //return this.context.router.push({ pathname: "/"+type+"/info/"+id+"?reply=1"}); //详情页面
                        Tool.setSession("fromReply", true);
                        return browserHistory.push("/issue/info/" + uri); //详情页面
                    } else {
                        Toast.info(res.serror.desc, 3);
                    }
                }, (err) => {
                    console.log(err);
                });
            dispatch(setSystemAnimating("", false));
        }
        
    }
    
    componentWillMount() {
        /* 获取专家uri */
        if (Util.isLogin(this.props)) {
            uri = this.props.params.uri;
            type = this.props.params.type;//来源
            if (Util.IsNull(uri)) {
                browserHistory.push("/");
            }
        }
    }
    
    
    render() {
        return (
            <div className="page_hei_cons home_cons div_hidden">
                <Header title="可以联系我" leftInfo="back" rightClick="replyAdd" replyAdd={this.replyAdd}/>
                <div className="page contactme-page pub-padding-lf-wrap">
                    <div className="reply_text">
                        <div className="reply_caption reply_caption_big">
                            感谢您对该项目需求感兴趣，科学家在线将根据您的资料，和企业沟通，如果合适，会和您联系进行需求的沟通和对接。
                        </div>
                        <textarea placeholder="请输入您的对接意向" ref="content" className=""></textarea>
                    </div>
                </div>
            </div>
        )
    }
    
    componentDidMount() {
    
    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User
}))(Main);

