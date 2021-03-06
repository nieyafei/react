import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {commonEnterpriseInfo,FollowOn,setEnterprise} from '../../action/Action';
import {Header,Footer,EnterpriseList,ExpertAttentionFollowCommon} from '../../common/ComponentList';
import {RefreshControl,ListView,ActivityIndicator,Tabs,Flex} from 'antd-mobile';
import {Tool} from '../../Tool';
import Util from '../../common/Util';
const TabPane = Tabs.TabPane;
/*
 * 推送页面
 * */
var uid;
class Main extends Component {
    constructor(props){
        super(props);
        this.state={
            isLoading:true,activeKey:"1"
        }
        this.onChangeBack=(key)=>{

        }
        this.makeTabPane=(key)=> {
            if (key == 1) {
                return (
                    <TabPane tab={`问题`} key={key}>
                        <div className="tab_cons_li no_top">
                            <EnterpriseList type="1" tabName="question" dateStr="pushList" uid={uid}/>
                        </div>
                    </TabPane>
                )

            } else if (key == 2) {
                return (
                    <TabPane tab={`需求`} key={key}>
                        <div className="tab_cons_li">
                            <EnterpriseList type="2" tabName="issue" dateStr="pushList" uid={uid}/>
                        </div>
                    </TabPane>
                )
            }
        }

        this.follow = (tabName, ty, id, clickType, sourceFrom,actionType) => {
            console.log(clickType);
            if (!(clickType == 1 || clickType == 2 || clickType == 3)) {
                return;
            }
            if (Util.isLogin(this.props)) {
                //ty 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                var token = Util.getToken(this.props);
                let {dispatch} = this.props;
                dispatch(FollowOn(tabName, ty, id, token, clickType, sourceFrom,actionType));
            }
        }

    }

    componentWillMount(){
        uid = this.props.params.id;
        if(Util.isLogin(this.props)){
            Util.bodyOver(true);
            let {dispatch,Enterprise} = this.props;
            if(Enterprise["info"].user && (this.props.uid != Enterprise["info"].user.uid)){
                var obj = {date:[],number:-1,totalPages:1}
                dispatch(setEnterprise(obj,"question"));dispatch(setEnterprise(obj,"issue"));
            }
            dispatch(commonEnterpriseInfo(uid));
        }
    }

    render() {
        let {Enterprise} = this.props;
        var enterpriseInfo = Enterprise["info"];
        return (
            <div className="notify_cons">
                <Header leftInfo="back" title="企业详情" />
                <div className="page page_normal info_tabs_list bg_color">
                    <div className="company_info item_info" data-flex>
                        <div data-flex="main:center cross:center" data-flex-box="0" className="le">
                            <img src={Util.images(enterpriseInfo&&enterpriseInfo.user?enterpriseInfo.user.portrait:"",0)}/>
                        </div>
                        <div data-flex="main:left cross:center" data-flex-box="1" className="ri">
                            {enterpriseInfo&&enterpriseInfo.user?
                            <div>
                                <span className="name">{enterpriseInfo.user.full_name} {enterpriseInfo.user.position}</span>
                                <span className="org">{enterpriseInfo.user.org_name}</span>
                                <Flex justify="between" className="static-infos">
                                    <div className="static-and-tags">
                                    <span className="count">{Util.getCount(enterpriseInfo.questionAttentCount)}</span>
                                    <span className="label">问题</span>
                                    <span className="count">{Util.getCount(enterpriseInfo.issueAttentCount)}</span>
                                    <span className="label">需求</span>
                                    <span className="count">{Util.getCount(enterpriseInfo.expertAttentCount)}</span>
                                    <span className="label">关注</span>
                                    <span className="label">|</span>
                                    <span className={enterpriseInfo.attention ? ' active attentioned' : ''}
                                          onClick={this.follow.bind(this, "info", 0, enterpriseInfo.user.uid, enterpriseInfo.attention? 2 : 1, 0,"set_enterprise_info_follow")}>
                                        {enterpriseInfo.attention?
                                            <font key="">
                                                <i className="iconfont icon-guanzhu red"></i>
                                                <span className="label">
                                              取消关注
                                          </span>
                                            </font>:
                                            <font key="">
                                                <i className="iconfont icon-guanzhu1"></i>
                                                <span className="label">
                                        关注企业
                                        </span>
                                            </font>
                                        }
                                    </span>
                                    </div>
                                </Flex>
                            </div>:""
                            }
                        </div>
                    </div>
                    <Tabs defaultActiveKey={this.state.activeKey} className="tab_bg_color" pageSize={3} animated={false}>
                        {this.makeTabPane(1)}
                        {this.makeTabPane(2)}
                    </Tabs>
                </div>
                <Footer />
            </div>
        )
    }
}

export default connect((state) => ({
    Enterprise:state.Enterprise,
    User: state.User
}))(Main);