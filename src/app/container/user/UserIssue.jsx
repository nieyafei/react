import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {loadUserIssueList} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {RefreshControl,ListView,ActivityIndicator} from 'antd-mobile';
import {Header,Footer} from '../../common/ComponentList';
import Util from '../../common/Util';
/*
 * 关注我的专家
 * */
var type="list";
var loadFlag=true;
var totalPages = 1,pageIndex=-1;
class Main extends Component {
    constructor(props){
        super(props)
        /* 获取数据类型 */
        this.state = {
        }
    }
    
    componentWillMount(){
        if(Util.isLogin(this.props)){
            let {dispatch} = this.props;
            dispatch(loadUserIssueList());//初始加载
        }
    }
    
    render() {
        const row = (rowData, sectionID, rowID) => {
            
            return (
                <div key={rowID} className="row home_list_row">
                    <div className="row_question">
                        <Link to="" className="row_title">{rowData.title}</Link>
                        <div className="row_quet_info">
                            <p>发布时间：2016-1-12</p>
                            {rowData.content}q
                        </div>
                        <div className="row_quet_bot">
                            <span>未审核</span>
                        </div>
                        <div className="issue_speed">
                            <div data-flex>
                                <div className="spe active" data-flex="main:center cross:center" data-flex-box="1">
                                    <div>
                                        <i className="iconfont icon-shangchuan1"></i><br/>
                                        <span>提交需求</span>
                                    </div>
                                </div>
                                <div className="spj" data-flex="main:center cross:center" data-flex-box="0">
                                    <i className="iconfont icon-jiantou"></i>
                                </div>
                                <div className="spe active" data-flex="main:center cross:center" data-flex-box="1">
                                    <div>
                                        <i className="iconfont icon-querenfangan"></i><br/>
                                        <span>需求确认</span>
                                    </div>
                                </div>
                                <div className="spj" data-flex="main:center cross:center" data-flex-box="0">
                                    <i className="iconfont icon-jiantou"></i>
                                </div>
                                <div className="spe" data-flex="main:center cross:center" data-flex-box="1">
                                    <div>
                                        <i className="iconfont icon-queren"></i><br/>
                                        <span>需求签约</span>
                                    </div>
                                </div>
                                <div className="spj" data-flex="main:center cross:center" data-flex-box="0">
                                    <i className="iconfont icon-jiantou"></i>
                                </div>
                                <div className="spe" data-flex="main:center cross:center" data-flex-box="1">
                                    <div>
                                        <i className="iconfont icon-fuwu"></i><br/>
                                        <span>需求服务</span>
                                    </div>
                                </div>
                                <div className="spj" data-flex="main:center cross:center" data-flex-box="0">
                                    <i className="iconfont icon-jiantou"></i>
                                </div>
                                <div className="spe" data-flex="main:center cross:center" data-flex-box="1">
                                    <div>
                                        <i className="iconfont icon-querenshenhe"></i><br/>
                                        <span>需求关闭</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        };
        let {UserCenter} = this.props;
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = UserCenter["issueList"].date;
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        return (
            <div className="pay_cons bg_color">
                <Header title="我的需求" leftInfo="back"/>
                <div className="page pay_lists">
                    <div className="scroll_list">
                        <ListView
                            dataSource={dataSource.cloneWithRows(data)}
                            renderFooter={() => <div className="footerRender" style={{ textAlign: 'center'}}>
                                {'加载完成，暂无更多数据'}
                            </div>}
                            renderRow={row}
                            style={{
                                height: document.documentElement.clientHeight,
                                overflow: 'hidden',
                                margin: '0',padding:"1.17rem 0 1.42rem 0"
                            }}
                            initialListSize={dataSource.length-8}
                            pageSize={10}
                            scrollRenderAheadDistance={500}
                            scrollEventThrottle={20}
                            scrollerOptions={{ scrollbars: true }}
                            onScroll={()=>{}}
                        />
                    </div>
                    {/*<div className="row home_list_row">
                     <div className="row_question">
                     
                     <div className="row_quet_bot">
                     <span>未审核</span>
                     </div>
                     <div className="issue_speed">
                     <div data-flex>
                     <div className="spe active" data-flex="main:center cross:center" data-flex-box="1">
                     <div>
                     <i className="iconfont icon-shangchuan1"></i><br/>
                     <span>提交需求</span>
                     </div>
                     </div>
                     <div className="spj" data-flex="main:center cross:center" data-flex-box="0">
                     <i className="iconfont icon-jiantou"></i>
                     </div>
                     <div className="spe active" data-flex="main:center cross:center" data-flex-box="1">
                     <div>
                     <i className="iconfont icon-querenfangan"></i><br/>
                     <span>需求确认</span>
                     </div>
                     </div>
                     <div className="spj" data-flex="main:center cross:center" data-flex-box="0">
                     <i className="iconfont icon-jiantou"></i>
                     </div>
                     <div className="spe" data-flex="main:center cross:center" data-flex-box="1">
                     <div>
                     <i className="iconfont icon-queren"></i><br/>
                     <span>需求签约</span>
                     </div>
                     </div>
                     <div className="spj" data-flex="main:center cross:center" data-flex-box="0">
                     <i className="iconfont icon-jiantou"></i>
                     </div>
                     <div className="spe" data-flex="main:center cross:center" data-flex-box="1">
                     <div>
                     <i className="iconfont icon-fuwu"></i><br/>
                     <span>需求服务</span>
                     </div>
                     </div>
                     <div className="spj" data-flex="main:center cross:center" data-flex-box="0">
                     <i className="iconfont icon-jiantou"></i>
                     </div>
                     <div className="spe" data-flex="main:center cross:center" data-flex-box="1">
                     <div>
                     <i className="iconfont icon-querenshenhe"></i><br/>
                     <span>需求关闭</span>
                     </div>
                     </div>
                     </div>
                     </div>
                     </div>
                     </div>*/}
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
    User: state.User,
    UserCenter:state.UserCenter
}))(Main);

