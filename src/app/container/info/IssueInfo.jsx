import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link, hashHistory} from 'react-router';
import {connect} from 'react-redux';
import {handleLogin, detail, FollowOn, replyList} from '../../action/Action';
import {Tool, merged} from '../../Tool';
import {Header, Footer} from '../../common/ComponentList';
import Util from '../../common/Util';
import {ListView, ActivityIndicator, Toast, Flex} from 'antd-mobile';
import contaceBtn from '../../../img/contace_btn.png';
/*
 * 问题详情页面
 * */
var type = "issue", uri, page = -1, loadFlag = true, totalPages = 1, if_Reply = true;
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        }
        let {dispatch} = this.props;
        this.follow = (ty, uid, clickType, sourceFrom,actionType) => {
            if (!(clickType == 1 || clickType == 2 || clickType == 3)) {
                return;
            }
            if (Util.isLogin(this.props)) {
                //type 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                let {dispatch} = this.props;
                var token = Util.getToken(this.props);
                dispatch(FollowOn(type, ty, uid, token, clickType, sourceFrom,actionType));
            }
        }
        this.onEndReached = () => {
            if (this.state.isLoading || !loadFlag) {
                return;
            }
            this.dataInit();
        }
        this.dataInit = () => {
            if (loadFlag) {
                this.setState({isLoading: true});
                loadFlag = false;
                var pageNum = ++page;//页数
                if (totalPages <= pageNum) {
                    this.setState({isLoading: false});
                    return;
                }
                Tool.fetchGet(Util.getApi("issueContaceList") + uri + "/" + pageNum + "/10", "", {}, 'json', 'basic',
                    (res) => {
                        if (!res.serror) {
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
        
        this.closeQuestion = () => {
            //点击关闭
            console.log("点击关闭");
            Tool.fetchPost(Util.getApi("needClose"), JSON.stringify({qid: uri}), {}, 'json', 'basic',
                (res) => {
                    if (!res.serror) {
                        //dispatch();获取数据返回给state
                        Toast.info("问题成功关闭", 3);
                    }
                }, (err) => {
                    console.log(err);
                });
        }
        
    }
    
    componentDidMount() {
    
    }
    
    componentWillMount() {
        /* 获取uri */
        uri = this.props.params.uri;
        let {dispatch} = this.props;
        page = -1;
        loadFlag = true;
        totalPages = 1;
        if (uri) {
            dispatch(detail(type, uri));
            this.dataInit();
        } else {
            //uri不存在
            
        }
    }
    
    render() {
        
        let {Detail} = this.props;
        var detailInfo = Detail["detail"];
        const info = () => {
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
                                <span className="color1">[{detailInfo.domainName}领域]</span>
                                {detailInfo.title}
                            </div>
                            <div data-flex  className="info_time_ques">
                                <div data-flex="main:left cross:center" data-flex-box="1" className="le">
                                    <div>
                                        <i className="iconfont icon-shizhong"></i>
                                        发布时间：{Tool.formatDateTime(detailInfo.create_time)}
                                    </div>
                                </div>
                                <div data-flex="main:right cross:center" data-flex-box="0" className="ri">
                                    <Link className="" to={"/contact/me/"+uri}>
                                        <img src={contaceBtn}/>
                                    </Link>
                                </div>
                            </div>

                            <div className="row_quet_info">
                                {detailInfo.content}
                            </div>
                            {
                                detailInfo.followAndLike ?
                                    <div className="row_quet_bot">
                                        <span>{detailInfo.followAndLike.followCount} 关注</span><em>|</em>
                                        <span
                                            onClick={this.follow.bind(this, 2, detailInfo.id, detailInfo.followAndLike.userFollow ? 2 : 1, 0,"set_detail_follow")}>
                                    {detailInfo.followAndLike.userFollow ?
                                        <font className="ac"><i className="iconfont icon-guanzhu red"></i>取消关注</font>:
                                        <font><i className="iconfont icon-guanzhu1"></i>关注需求</font>
                                    }
                                </span>
                                        <span className={detailInfo.followAndLike.userLike ? "active like" : "like"}
                                              onClick={this.follow.bind(this, 2, detailInfo.id, detailInfo.followAndLike.userLike ? 0 : 3, 0,"set_detail_follow")}>
                                 {detailInfo.followAndLike.likeCount > 0 ? detailInfo.followAndLike.likeCount : ""}
                                            <i className="iconfont icon-dianzan"></i>
                                 </span>
                                    </div>
                                    : ''
                            }

                        </div>
                    </div>
                )
            }
        }
        
        const row = (rowData, sectionID, rowID) => {
            if (Util.IsNullJson(rowData)) {
                return;
            }
            return (
                <div key={rowID} className="reply_list">
                    <div className="reply_cs">
                        <div data-flex className="reply_head issue_contact">
                            <div className="le" data-flex="cross:center" data-flex-box="1">
                                <Link to={"/expert/info/"+rowData.uid} data-flex>
                                    <span data-flex="cross:center" data-flex-box="0"><img src={Util.images(rowData.expertIndexStream.coverPic, 0)}/></span>
                                    <span data-flex="cross:center" className="name" data-flex-box="0">{rowData.expertName}</span>
                                    <span data-flex="cross:center" data-flex-box="1">{rowData.orgName}</span>
                                </Link>
                            </div>
                            <div className="ri" data-flex="cross:center" data-flex-box="0">
                                {Tool.formatDate(rowData.createTime)}对它感兴趣
                            </div>
                        </div>
                        <div className="reply_content">
                            {rowData.content}
                        </div>
                    </div>
                    
                </div>
            )
        };
        var userQuestion = detailInfo.userQuestion;
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = Detail["replyList"].date;
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        return (
            <div className="detail_cons page_hei_cons issue_page">
                <Header title="需求详情" leftInfo="back" rightClick={userQuestion ? "closeQuestion" : ""}
                        closeQuestion={this.closeQuestion} rightInfo={userQuestion ? "关闭" : ""}/>
                <div className="page_body page_normal bg_color">
                    {info()}
                    <div className="list_caption">
                        需求动态
                    </div>
                    
                    <div className="scroll_list">
                        <ListView
                            dataSource={dataSource.cloneWithRows(data)}
                            renderFooter={() => <div className="false footerRender" style={{textAlign: 'center'}}>
                                {this.state.isLoading ? loadInfo : '暂无更多需求动态信息'}
                            </div>}
                            renderRow={row}
                            style={{
                                margin: '0',
                            }}
                            initialListSize={dataSource.length - 8}
                            pageSize={10}
                            scrollRenderAheadDistance={500}
                            scrollEventThrottle={20}
                            scrollerOptions={{scrollbars: true}}
                            onScroll={() => {
                            }}
                            useBodyScroll
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={1000}
                        />
                        <br/><br/><br/>
                    </div>
                </div>
                
                {/*<Link className="inf_fixed_reply" to={"/info/reply/" + uri}>*/}
                    {/*<i className="iconfont icon-xiaoxi color1"></i>*/}
                {/*</Link>*/}
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
    Detail: state.Detail,
}))(Main);

