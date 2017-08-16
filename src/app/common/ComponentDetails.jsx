import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import  action from '../action/Index';
import {handleLogin, setSystemAnimating, loginUser, FollowOn, replyList} from '../action/Action';
import {Header, Footer, ReplyList, ContectorInfo,ExpertFollowCommon, ExpertTags,ExpertAttentionFollowCommon} from '../common/ComponentList';
import {Tool, merged} from '../Tool';
import {RefreshControl, ListView, ActivityIndicator, SearchBar, Toast, Flex} from 'antd-mobile';
import Util from '../common/Util';


/* 企业关注列表 */

class CompanyAttentionComponent extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: false,
        }
        let {dispatch} = this.props;
        var page = -1, loadFlag = true, totalPages = 1;
        
        this.onEndReached = () => {
            if (this.state.isLoading || !loadFlag) {
                return;
            }
            this.dataInit();
        }
        
        this.dataInit = () => {
            // let {CompanyAttentionData}=this.props;
        }
    }

    render() {
    
        let {CompanyAttentionData, typeName}=this.props;
        
        const row = (rowData, sectionID, rowID) => {
            
            var _html = <div></div>;
            
            if (rowData) {
                _html = <div key={rowID} className="reply_list">
                    <ContectorInfo {...this.props} rowData={rowData}/>
                </div>
            }
            
            return (
                _html
            )
        };
        
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let data = [];

        if (CompanyAttentionData && CompanyAttentionData['typeStr']){
            let type = CompanyAttentionData['typeStr']
    
            data = CompanyAttentionData[type]["data"];
        }
        
        // this.setState({
        //     isLoading:false
        // })
        
        // debugger;
        let loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
    
        let dsNew = dataSource;
        if (data) {
            dsNew = dataSource.cloneWithRows(data)
        }
        
        
        return (
            <div>
                <div className="scroll_list">
                    <ListView
                        dataSource={dsNew}
                        renderFooter={() => <div className="false footerRender" style={{textAlign: 'center'}}>
                            {this.state.isLoading ? loadInfo : '暂无更多...'}
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
                {/*<Link className="inf_fixed_reply" to={"/info/reply/" + this.props.type + "/" + this.props.uri}>*/}
                    {/*<i className="iconfont icon-xiaoxi color1"></i>*/}
                {/*</Link>*/}
            </div>
        )
    }
}

var CompanyAttention = connect((state) => ({
    Detail: state.Detail,
    CompanyAttentionData: state.CompanyAttentionData
}))(CompanyAttentionComponent);
export {CompanyAttention}


/*
 * 关注企业列表
 * */
class AttentionEnterpriseListComment extends Component {
    constructor(props){
        super(props);
    }
    render() {
        let {rowData,tabName,prevProps,htmlType, type, linkTo, notShowUserStream} = this.props;
        var left_html= [];
        var tsType =(ty)=>{
            if(ty==6){
                return (
                    <font>技术</font>
                )
            }else if(ty==5){
                return (
                    <font>观点</font>
                )
            }else if(ty==3){
                return (
                    <font>案例</font>
                )
            }else if(ty==1){
                return (
                    <font>问题</font>
                )
            }else if(ty==7){
                return (
                    <font>回复</font>
                )
            }else if(ty==0){
                return (
                    <font>企业</font>
                )
            }else if(ty==4){
                return (
                    <font>专家</font>
                )
            }
        }
        var xsInfo =(dataInfo)=>{
            if(dataInfo.actionType==1){
                return (
                    <font>回复了一个{tsType(dataInfo.type)}</font>
                )
            }else if(dataInfo.actionType==2){
                return (
                    <font>关注了一个{tsType(dataInfo.type)}</font>
                )
            }else if(dataInfo.actionType==3){
                return (
                    <font>点赞了一个{tsType(dataInfo.type)}</font>
                )
            }else if(dataInfo.actionType==4){
                return (
                    <font>赞赏了一个回复</font>
                )
            }
        }
        return (
            <div className="item_info attention_info row_question item-commons">
                <div className="item_detail pub-padding-lf-wrap">
                    <Link to={"/enterprise/info/"+rowData.id}>
                    <Flex alignContent="center " className="personal_info">

                        <div className="sc-bfc personal_icon">
                            <img src={Util.images(rowData.image)} alt="" className="person fl"/>
                        </div>
                        <Flex.Item className="sc-bfc personal_detail">
                            <span className="name">{rowData.full_name} </span>
                            <span className="co_title">总经理 </span>
                            <div className="co_name">{rowData.org} </div>
                        </Flex.Item>

                    </Flex>

                    {rowData.userStream && rowData.userStream.message?
                        <div className="row_quet_info over_hidden5">
                            <span className="color1">最新动态：</span>
                            {xsInfo(rowData.userStream)}
                        </div>:<div className="row_quet_info over_hidden5">此企业暂无更新信息！</div>
                    }
                    </Link>
                    {/*<div className="new-single-ask">
                        <ul>
                            <li>
                                <i className="iconfont icon-wenjuan"></i>
                                最新问题：为什么生产馒头时候需要加入足量的水？
                            </li>
                            <li>
                                <i className="iconfont icon-queren"></i>
                                最新需求：如何提高馒头生产过成功的气泡
                            </li>
                        </ul>
                    </div>*/}
                    <Flex justify="between" className="static-infos">
                        <ExpertAttentionFollowCommon prevProps={this.props} rowData={rowData} tabName={this.props.tabName} type="0"
                                            sourceFrom="0" htmlType="atti_company" actionType={this.props.actionType}/>
                    </Flex>

                </div>
            </div>
        );
    }
}

var AttentionEnterpriseList = connect((state) => ({
    Attention:state.Attention
}))(AttentionEnterpriseListComment);
export { AttentionEnterpriseList }

