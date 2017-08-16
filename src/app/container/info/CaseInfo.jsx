import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link, hashHistory} from 'react-router';
import {connect} from 'react-redux';
import {handleLogin, detail, FollowOn, commonAction,companyAttention} from '../../action/Action';
import {Tool, merged} from '../../Tool';
import {Header, Footer, ReplyList, ContectorInfo,CommonInfoTabs} from '../../common/ComponentList';
import {CompanyAttention} from '../../common/ComponentDetails';
import Util from '../../common/Util';
import {RefreshControl, ListView, ActivityIndicator, SearchBar, Toast, Flex} from 'antd-mobile';

import ac from 'animate.css'


import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

/*
 * 案例详情页面
 * */
var type = "case", uri, fromReply = 0, pageNum = 0;
class Main extends Component {
    
    componentDidMount() {
        Tool.setScrollTop("detailScroll", type);
    }
    
    constructor(props) {
        super(props);
        
        this.state = {
            showDetail: false,
            tabType: 3,
            apiPrev: '/api/attention/user/',
            selectedIndex: 1
        };
        
        this.follow = (ty, uid, clickType, sourceFrom, actionType) => {
            if (!(clickType == 1 || clickType == 2 || clickType == 3)) {
                return;
            }
            if (Util.isLogin(this.props)) {
                //type 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                let {dispatch} = this.props;
                var token = Util.getToken(this.props);
                dispatch(FollowOn(type, ty, uid, token, clickType, sourceFrom, actionType));
            }
        }
        this.toContactExpert = (contactName, contactTitle) => {
            Util.contactSession("案例", contactName, contactTitle, "other", uri);
        }
    }
    
    componentWillMount() {
        /* 获取uri */
        Util.bodyOver(false);
        uri = this.props.params.uri;
        let {dispatch, Detail} = this.props;
        
        if (uri) {
            if (Detail["detail"].id == uri) {
                return;
            }
            dispatch(commonAction("set_detail_init"));
            dispatch(detail("case", uri));
            /*dispatch(companyAttention("3", 'case', uri, pageNum));*/
            
        } else {
            //uri不存在
            
        }
    }
    
    
    toggleDetails() {
        this.setState({
            showDetail: !this.state.showDetail
        })
    }
    
    render() {
        let {Detail} = this.props;
        var detailInfo = Detail["detail"];
        const info = () => {
            var iconArea = <i className="iconfont icon-arrowDown"></i>;
            // var foldingState = 'animated zoomOutDown'
            var foldingState = ''
            
            if (this.state.showDetail) {
                iconArea = <i className="iconfont icon-top"></i>
                foldingState = 'folding-down'
            }
            
            // console.log(this.state.showDetail, '=====this.state.showDetail')
            
            if (Util.IsNullJson(detailInfo)) {
                return (
                    <div className="home_list_row info_null">
                        暂无详情数据信息
                    </div>
                )
            } else {
                return (
                    <div className="home_list_row">
                        <div className="item_info item-commons no_bottom">
                            <Link data-flex>
                                <div className="item-detail-title bgcolor-cons text-ellipsis">
                                    {detailInfo['title']}
                                </div>
                            </Link>
                            
                            <div className="item_detail_nav_li">
                                <p className="">领 域：<span className="color2">{detailInfo.domain}</span></p>
                                {detailInfo.keyword?
                                    <p className="">关键词：{detailInfo.keyword}</p>:""
                                }
                            </div>
                            <div className={foldingState+" more_content"}>
                                <div className='folding-detail'>
                                    <div className="item_detail_nav_li">
                                        <span>案例详情</span>：
                                        {detailInfo.content}
                                        {detailInfo.coverPic?
                                            <div className="row_case_user">
                                                <img src={Util.images(detailInfo.coverPic)} />
                                            </div>:""
                                        }
                                    </div>
                                </div>
                                <div className="folding-area" onClick={this.toggleDetails.bind(this)}>
                                    {iconArea} {foldingState=="folding-down"?"收起":"展开"}案例详情
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
        
        const TagsList = () => {
            
            return (
                
                <div>
                    
                    <Tabs onSelect={this.tabChange.bind(this)} selectedIndex={this.state.selectedIndex}>
                        
                        <TabList className="tabs-wrap">
                            <Tab>
                                回复列表
                                {/*<span className="count">9</span>*/}
                            </Tab>
                            <Tab>企业关注</Tab>
                            <Tab>企业点赞</Tab>
                            <Tab>相关问题</Tab>
                        </TabList>
                        <TabPanel>

                        </TabPanel>
                        <TabPanel>

                        </TabPanel>
                        <TabPanel>

                        </TabPanel>
                        <TabPanel>

                        </TabPanel>
                    </Tabs>
                    
                    <div>
                        <CompanyAttention type={this.state.typeName}/>
                    </div>
                </div>
            )
        }
        
        
        return (
            <div className="detail_cons page_hei_cons caseinfo-page">
                <Header title="案例详情" leftInfo="back"/>
                <div className="page_body page_normal">
                    {info()}
                    <CommonInfoTabs type={type} uri={uri}/>
                    {/*{TagsList()}*/}
                </div>
                <Footer className="normal_footer"/>
            </div>
        )
    }
    
    tabChange(tabIndex){
        /*console.log(tabIndex)
        
        let {dispatch, Detail} = this.props;
        if (tabIndex == 1){
            dispatch(companyAttention("3", 'case', uri, pageNum));
        }else{
            dispatch(companyAttention("3", 'support', uri, pageNum));
        }
    
        this.setState({
            selectedIndex:tabIndex,
        })*/
        
    }
    
}


Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    Detail: state.Detail,
    User: state.User,
    CompanyAttentionData: state.CompanyAttentionData,
}))(Main);

