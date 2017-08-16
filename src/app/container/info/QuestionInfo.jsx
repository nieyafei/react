import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {handleLogin,detail,FollowOn,replyList,commonAction} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {Header,Footer,ReplyList} from '../../common/ComponentList';
import Util from '../../common/Util';
import {ListView,ActivityIndicator,Toast,Flex} from 'antd-mobile';
import answerBtn from '../../../img/answer_btn.png';
/*
* 问题详情页面
* */
var type="question",uri,page=-1,loadFlag=true,totalPages=1,if_Reply=true,is_top=false;
class Main extends Component {
    componentDidMount(){
        if(is_top){
            Tool.setScrollTop("detailScroll",type);
        }
    }
    constructor(props){
        super(props);
        this.state={
            isLoading: true,
        }
        let {dispatch} = this.props;
        this.follow=(ty,uid,clickType,sourceFrom,actionType)=>{
            if(!(clickType == 1 || clickType == 2 || clickType == 3)){
                return ;
            }
            if(Util.isLogin(this.props)){
                //type 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                let {dispatch} = this.props;
                var token = Util.getToken(this.props);
                dispatch(FollowOn(type,ty,uid,token,clickType,sourceFrom,actionType));
            }
        }
        this.onEndReached=()=>{
            if (this.state.isLoading || !loadFlag) {
                return;
            }
            this.dataInit();
        }
        this.dataInit=()=>{
            if(loadFlag) {
                this.setState({isLoading: true});
                loadFlag = false;
                var pageNum = ++page;//页数
                if(totalPages <= pageNum){
                    this.setState({ isLoading: false });
                    return;
                }
                Tool.fetchGet(Util.getApi("questionReply") + "/" + uri + "/" + pageNum + "/10", "", {}, 'json', 'basic',
                    (res) => {
                        if (res.serror && res.serror.type === '0') {
                            // var res1 = res;
                            var res1 = res.result;
                            //dispatch();获取数据返回给state
                            let obj = {date: res1.content, page: pageNum};
                            totalPages = res1.totalPages;
                            dispatch(replyList(obj))
                        }
                        this.setState({
                            isLoading: false,
                        })
                        loadFlag = true;
                    }, (err) => {
                        this.setState({
                            isLoading: false,
                        })
                        loadFlag = true;
                        console.log(err);
                    });
            }
        }

        this.closeQuestion=()=>{
            //点击关闭
            console.log("点击关闭");
            Tool.fetchPost(Util.getApi("questionClose"), JSON.stringify({qid:uri}), {}, 'json', 'basic',
                (res) => {
                    if (!res.serror) {
                        //dispatch();获取数据返回给state
                        Toast.info("问题成功关闭",3);
                    }
                }, (err) => {
                    console.log(err);
                });
        }

    }
    componentWillMount(){
        /* 获取uri */
        Util.bodyOver(false);
        uri = this.props.params.uri;
        let {dispatch,Detail} = this.props;
        page=-1;loadFlag=true;totalPages=1;
        if(uri){
            if(Detail["detail"].id==uri){
                is_top = true;
                return ;
            }
            is_top = false;
            dispatch(detail(type,uri));
            this.dataInit();
        }else{
            //uri不存在
        }
    }
    render() {
        let {Detail} = this.props;
        var detailInfo = Detail["detail"];
        const info =()=> {
            if (Util.IsNullJson(detailInfo)) {
                return (
                    <div className="home_list_row info_null">
                        暂无详情数据信息
                    </div>
                )
            } else {
                return (
                    <div className="home_list_row">
                        <div className="row_question">
                            <div className="row_title p_top">
                                <span className="color1">[问题]</span>
                                {detailInfo.title}
                            </div>
                            <div className="detail_nav">
                                {detailInfo.userStreamProfile?
                                    <div data-flex className="detail_head">
                                        <div className="le" data-flex="cross:center" data-flex-box="1">
                                            <Link to={"/enterprise/info/"+detailInfo.uid} data-flex="cross:center">
                                                <img src={Util.images(detailInfo.userStreamProfile.pic,0)}/>
                                                <span className="over_hidden1">{detailInfo.userStreamProfile.username}&nbsp;&nbsp;{detailInfo.userStreamProfile.position}<em>{detailInfo.userStreamProfile.orgname}</em></span>
                                            </Link>
                                        </div>
                                    </div>:""
                                }
                            </div>
                            <div data-flex  className="info_time_ques">
                                <div data-flex="main:left cross:center" data-flex-box="1" className="le">
                                    <div>
                                        <i className="iconfont icon-shizhong"></i>
                                        发布时间：{Tool.formatDateTime(detailInfo.create_time)}
                                    </div>
                                </div>
                                <div data-flex="main:right cross:center" data-flex-box="0" className="ri">
                                    <Link className="" to={"/info/reply/question/"+uri}>
                                        <img src={answerBtn}/>
                                    </Link>
                                </div>
                            </div>

                            <div className="row_quet_info" dangerouslySetInnerHTML={Util.createMarkup(detailInfo.content)}>
                            </div>
                            <div className="row_quet_bot">
                                <span>{detailInfo.answerCount} 回答</span>&nbsp;&nbsp;
                                <span>{detailInfo.followAndLike.followCount} 关注</span><em>|</em>
                                <span
                                    onClick={this.follow.bind(this, 1, detailInfo.id, detailInfo.followAndLike.userFollow ? 2 : 1,0,"set_detail_follow")}>
                                    {detailInfo.followAndLike.userFollow ?
                                        <font className="ac"><i className="iconfont icon-guanzhu red"></i>取消关注</font>:
                                        <font><i className="iconfont icon-guanzhu1"></i>关注问题</font>
                                    }
                                </span>
                                <span className={detailInfo.followAndLike.userLike ? "active like" : "like"}
                                      onClick={this.follow.bind(this, 1, detailInfo.id, detailInfo.followAndLike.userLike ? 0 : 3,0,"set_detail_follow")}>
                                 {detailInfo.followAndLike.likeCount > 0 ? detailInfo.followAndLike.likeCount : ""}
                                    <i className="iconfont icon-dianzan"></i>
                                 </span>
                                {/*<span className="time">发布时间：{Tool.formatDateTime(detailInfo.create_time)}</span>*/}
                            </div>
                        </div>
                    </div>
                )
            }
        }
    
    
        var userQuestion = detailInfo.userQuestion;
        console.log(type,  uri);
        return (
            <div className="detail_cons page_hei_cons">
                <Header title="问题详情" leftInfo="back" rightClick={userQuestion?"closeQuestion":""} closeQuestion={this.closeQuestion} rightInfo={userQuestion?"关闭":""} />
                <div className="page_body page_normal bg_color">
                    {info()}
                    <ReplyList type={type} uri={uri}/>
                </div>
                {/* footer */}
                <Footer className="normal_footer"/>
            </div>
        )
    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User,
    Detail:state.Detail,
}))(Main);

