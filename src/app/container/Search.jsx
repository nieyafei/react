import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory,withRouter } from 'react-router';
import { connect } from 'react-redux';
import {loadHome,setSystemAnimating,FollowOn,loadSearch,commonAction} from '../action/Action';
import { Tool, merged } from '../Tool';
import {ListView,ActivityIndicator,SearchBar,RefreshControl,Flex} from 'antd-mobile';
import Util from '../common/Util';
import {FollowCommon,ProjectSearchList} from '../common/ComponentList';
import logoImage from '../../img/sinw.png';
/*
 * 所有页面的外壳
 * */

let pageIndexSearch = -1;
let totalPagesSearch = 1;
var type="all";//默认综合列表
var prevType;
var loadFlagSearch=true;
var searchValue="";//搜索词
var searchType = 0;
var scrollTop = 0,scrollTopInit=0;
var searchAct = ["active","","","",""];
var searchTypeStr = ["all","question","case","tech","opinion","issue","enterprise"];
class List extends Component {
    /* 首次渲染结束之后调用 */
    componentDidMount(){
        this.setScrollTop();
    }
    constructor(props){
        super(props);
        /* 获取数据类型 */
        this.state = {
            headActive:"active",
            showCancelButton:true,
            searchValue:"搜索",
            btnSearchActive:"",
            historyActive:"false",
            searchAct:searchAct,
            flagRef:false,
            serResultActive:"",
            focused:false,
            searchFlag:"false",
            hideResult:"false",
            searchMenuActive:"",
            changeValue:"",
            isLoadingSearch:false
        }
        /* search 搜索 */
        let {dispatch} = this.props;
        //获取焦点之后的操作
        this.focus=()=>{
            this.setState({
                headActive:"",
                searchValue:"找问答、案例、技术、知识...",
                btnSearchActive:"active",
                focused:false,
                hideResult:"true",
                serResultActive:"active",
                searchMenuActive:"active",
                menuActive:"",
                changeValue:searchValue,
            })
            loadFlagSearch = false;
            this.hideHistory();
            Tool.setSession("is_search",true);
            document.body.style.overflow="initial";
        }
        this.hideHistory=()=>{
            if(Util.IsNull(searchValue)){
                this.setState({
                    historyActive:"true"
                })
            }else{
                this.setState({
                    historyActive:"false"
                })
            }
        }
        /* 取消焦点 */
        this.blur=()=> {
            this.setState({
                focused:false
            })
        }
        /*取消搜索-back-home*/
        this.cancel=()=>{
            this.setState({
                headActive:"active",
                btnSearchActive:"",
                historyActive:"false",
                hideResult:"false",
                serResultActive:"",
                searchMenuActive:"",
                changeValue:"",
            })
            searchValue="";
            Tool.setSession("is_search",false);
            document.body.style.overflow="hidden";
            Tool.delSession("dataSearchScroll");
            dispatch(commonAction("set_search_null"))
        }
        this.inputChange=(value)=>{
            searchValue = value;
            this.setState({
                changeValue:value,
            })
            this.hideHistory();
        }

        this.refreshChange=(change_type)=>{
            /* 切换type */
            searchType = change_type;
            searchAct = ["","","","","","",""];
            searchAct[change_type]="active";
            this.setState({
                searchAct:searchAct
            })
            this.search();
        }
        this.search=()=>{
            //this.refs.searchList.searchList();/!*.props.searchList(searchValue,searchType);*!/
            this.searchList();
        }

        this.hisChange=(value)=>{
            searchValue = value;
            this.setState({
                changeValue:value,historyActive:"false"
            })
            this.searchList();
        }

        this.searchList=()=>{
            document.body.scrollTop=document.documentElement.scrollTop=0
            loadFlagSearch = true;
            Util.addSearchHistory(searchValue);
            dispatch(commonAction("set_history_list"));
            //this.refs.historyLists.addValue();
            pageIndexSearch = -1;
            totalPagesSearch = 1;
            this.setState({
                isLoadingSearch:true
            })
            dispatch(setSystemAnimating("正在搜索",true));
            this.dataInitSearch();
        }
        this.onEndReachedSearch=()=>{
            if (this.state.isLoadingSearch || !loadFlagSearch) {
                return;
            }
            this.dataInitSearch();
        };
        /* 搜索方法 end */

        /* 操作左侧菜单导航 */
        this.openLayers=()=>{
            this.setState({menuActive:"active"})
        }
        this.closeLayers=()=>{
            this.setState({menuActive:""})
        }

        /*
         * 搜索接收数据
         * */
        this.dataInitSearch=()=>{
            if(Util.IsNull(searchValue)){
                dispatch(setSystemAnimating("正在搜索",false));
                return;
            }
            if(loadFlagSearch){
                this.setState({ isLoadingSearch: true });
                //this.setState({ refreshing: true });
                loadFlagSearch = false;
                /* 初次加载第一次获取数据 */
                var pageNum = ++pageIndexSearch;//页数
                if(totalPagesSearch <= pageNum){
                    dispatch(setSystemAnimating("正在搜索",false));
                    this.setState({ isLoadingSearch: false });
                    return;
                }
                var va ="";
                if(searchType==1){
                    va="q/";
                }else if(searchType==5){
                    va="i/";
                }else if(searchType==6){
                    va="user/";
                }else{va="";}
                var url="/api/s/"+va+searchValue+"/"+pageNum+"/0";
                Tool.fetchGet(url,"",{},'json','basic',
                    (res) => {
                        if(res.result){
                            var data = [];
                            if(searchType==0){
                                data=[];
                                if(!Util.IsNull(res.result.searchQuestion)){
                                    data = data.concat(res.result.searchQuestion);
                                }
                                if(!Util.IsNull(res.result.searchIssue)){
                                    data = data.concat(res.result.searchIssue);
                                }
                                if(!Util.IsNull(res.result.searchUser)){
                                    data = data.concat(res.result.searchUser);
                                }
                                totalPagesSearch = 1;
                            }else{
                                if(res.result.content.length>0){
                                    data = res.result.content;
                                    totalPagesSearch = res.result.totalPages;
                                }
                            }
                            if(data && data.length>0){
                                dispatch(loadSearch(searchTypeStr[searchType],data,pageNum));
                            }
                        }else{
                            console.log("数据加载失败");
                        }
                        setTimeout(() => {
                            this.setState({
                                isLoadingSearch: false,
                            });
                            loadFlagSearch = true;
                            dispatch(setSystemAnimating("正在搜索",false));
                        }, 1000);
                    }, (err) => {
                        loadFlagSearch = false;
                        console.log(err);
                        dispatch(setSystemAnimating("正在搜索",false));
                    });
            }
            //dispatch(loadHome(type,++Home[type].page));
        }

        /* 设置滚动条位置 */
        this.setScrollTop=()=>{
            let dataSearchScroll= Tool.getSession('dataSearchScroll')||[];
            let indexTy=dataSearchScroll.findIndex(function(value, index, arr) {
                return value.tabName == searchTypeStr[searchType];
            });
            let scroll=indexTy==-1?0:dataSearchScroll[indexTy].scroll;
            if(this.state.isLoadingSearch){
                //正在加载延时调用自己
                window.setTimeout(this.setScrollTop,150)
            }else {
                console.log(scroll);
                setTimeout(function(){
                    document.body.scrollTop=document.documentElement.scrollTop=scroll
                },150)
            }
        }
        //使用Promise主要是为了组件没卸载的时候能准确的先设置滚动条位置再返回之前版块的滚动条位置
        this.saveScroll=()=>{
            return new Promise((resolve, reject) => {
                let dataSearchScroll= Tool.getSession('dataSearchScroll')||[];
                let obj={};
                obj.tabName=searchTypeStr[searchType];
                obj.scroll=document.body.scrollTop||document.documentElement.scrollTop;;
                let indexIf=dataSearchScroll.findIndex(function(value, index, arr) {
                    return value.tabName == searchTypeStr[searchType];
                });
                if(indexIf !== -1){
                    dataSearchScroll[indexIf]=obj
                }else {
                    dataSearchScroll.push(obj)
                }
                /* 开始插入数据 */
                Tool.setSession("dataSearchScroll",dataSearchScroll);
                setTimeout(function(){
                    document.body.scrollTop=document.documentElement.scrollTop=0
                },150)
                resolve()
            });
        }

        this.setScrollTop=this.setScrollTop.bind(this);
        /*
         * 点击关注 点赞 1 关注  2取消关注  3点赞
         * */
        /*this.follow=(ty,uid,clickType)=>{
            if(!(clickType == 1 || clickType == 2 || clickType == 3)){
                return ;
            }
            if(Util.isLogin(this.props)){
                //type 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                var token = Util.getToken(this.props);
                let {dispatch} = this.props;
                dispatch(FollowOn(type,ty,uid,token,clickType,0,"set_search_follow"));
            }
        }*/
    }

    componentWillMount(){
        loadFlagSearch = true;
        this.setState({
            focused:((Tool.getSession("is_search")&&Tool.getSession("is_search")==true)?true:false)
        })
    }

    render() {
        const separator = (sectionID, rowID) => (//分隔条
            <div className={`${sectionID}-${rowID}`}
                 key={`${sectionID}-${rowID}`}
                 style={{
                     backgroundColor: '#efeff4',
                     height:'0.4rem',
                 }}
            />
        );
        /* 数据展示,通过对应的数据集拿出一条数据来渲染row */
        let {Search} = this.props;//综合里只有问题有分页，其他类型一样
        var listSearch = Search[searchTypeStr[searchType]].date;
        const dsSearch = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const rowSearch = (rowData, sectionID, rowID) => {
            var botMore = "",topHtml="",topHtmlStr="";
            if(searchType==0){
                var cliType = 1;
                if(rowData.typeStr=="问题"){
                    cliType = 1;topHtmlStr="问题";
                }else if(rowData.typeStr=="企业需求"){
                    cliType = 5;topHtmlStr="需求";
                }else if(rowData.typeStr=="企业用户"){
                    cliType = 6;topHtmlStr="企业";
                }
                botMore = (
                    <div className="more_list" onClick={this.refreshChange.bind(this,cliType)}>
                        查看更多
                        <i className="iconfont icon-jiantou1"></i>
                    </div>
                )
                topHtml = (
                    <div className="top_htmls">
                        <div>{topHtmlStr}</div>
                    </div>
                )
            }
            if(rowData.typeStr=="问题"){//问题
                return (
                    <div key={rowID} className="item_info item-commons no_padd attention_info">
                        {topHtml}
                        <ProjectSearchList {...this.props} rowData={rowData} all={searchType==0?true:false} tabName="question" type="1" linkTo={"/question/detail/"} linkToID={rowData.id} actionType="set_search_follow"/>
                        {botMore}
                    </div>
                );
            }else if(rowData.typeStr=="企业需求"){
                return (
                    <div key={rowID} className="item_info item-commons no_padd attention_info">
                        {topHtml}
                        <ProjectSearchList {...this.props} rowData={rowData} all={searchType==0?true:false} tabName="issue" type="2" linkTo={"/issue/info/"} linkToID={rowData.id} actionType="set_search_follow"/>
                        {botMore}
                    </div>
                );
            }else if(rowData.typeStr=="企业用户"){
                return (
                    <div key={rowID} className="item_info item-commons no_padd attention_info">
                        {topHtml}
                        <ProjectSearchList {...this.props} rowData={rowData} all={searchType==0?true:false} tabName="enterprise" type="0" linkTo={"/issue/info/"} linkToID={rowData.id} actionType="set_search_follow"/>
                        {botMore}
                    </div>
                );
            }
        };
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        return (
            <div className={this.state.searchFlag + " search_container"}>
                <div className="positi">
                    {/* Header */}
                    <div className="header_height2">
                        <header className="common_header common_header_search" data-flex>
                            <div  className={this.state.headActive + " left_menus"} data-flex="main:center cross:center" data-flex-box="0">
                                <img src={logoImage} className="menu_logo"/>
                                {/*<i className="iconfont icon-menu"></i>{this.state.active}onClick={this.openLayers}*/}
                            </div>
                            <div className={this.state.headActive + " search_cons"} data-flex-box="1">
                                <SearchBar placeholder={this.state.searchValue}
                                           focused={this.state.focused}
                                           onFocus={this.focus}
                                           onBlur={this.blur}
                                           onSubmit={this.search}
                                           onCancel={this.cancel}
                                           onChange={this.inputChange}
                                           showCancelButton={this.state.showCancelButton}
                                           value={this.state.changeValue}
                                />
                                <div onClick={this.search.bind(this)} className={this.state.btnSearchActive + " btn_submit_search"}>搜索</div>
                            </div>
                            <div className={this.state.headActive + " new_answer none"} data-flex="main:center cross:center" data-flex-box="0">
                                <Link to="/question">
                                    <i className="iconfont icon-bianji"></i>
                                </Link>
                            </div>
                        </header>
                        <HeaderSearchMenu searchMenuActive={this.state.searchMenuActive} refreshChange={this.refreshChange} searchAct={this.state.searchAct}/>
                    </div>
                    <SearchHistory showHideClass={this.state.historyActive} inputChange={this.hisChange}/>
                    <div className={this.state.serResultActive + " page2 bg_color scroll_list search_results"}>
                        {/* 搜索结果 */}
                        <ListView
                            dataSource={dsSearch.cloneWithRows(listSearch)}
                            renderFooter={() => <div style={{textAlign: 'center'}}>
                                {this.state.isLoadingSearch ? loadInfo : '加载完成，暂无更多数据'}
                            </div>}
                            renderRow={rowSearch}
                            ref="fortestSearch"
                            style={{
                                margin: '0',padding:"2.21rem 0 1.42rem 0"
                            }}
                            initialListSize={listSearch.length}
                            pageSize={10}
                            scrollRenderAheadDistance={500}
                            scrollEventThrottle={20}
                            scrollerOptions={{ scrollbars: true }}
                            onScroll={(view) => {
                            }}
                            useBodyScroll
                            onEndReached={this.onEndReachedSearch}
                            onEndReachedThreshold={1000}
                        />
                    </div>
                </div>
                {/*左侧菜单*/}
                <LayerMenus ref="historyLists" active={this.state.menuActive} closeLayers={this.closeLayers}/>
            </div>
        )
    }

    /**
     * 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用
     */
    componentWillReceiveProps(nextProps) {
    }
    //组件卸载，存储滚动条位置
    componentWillUnmount(){
        this.saveScroll();
        document.body.style.overflow="initial";
    }
}

/*
 * 首页搜索菜单导航
 * 综合  问答  案例  技术  观点
 * 点一次是否刷新一次
 * */
class HeaderSearchMenu extends Component{
    constructor(props){
        super(props);
    }
    render(){
        var searchAct=this.props.searchAct;
        return(
            <div className={this.props.searchMenuActive + " home_menus search_mes"}>
                <ul className="menu" data-flex="box:mean">
                    <li className={searchAct[0]}>
                        <Link onClick={this.props.refreshChange.bind(this,0)}>综合</Link>
                    </li>
                    
                    <li className={searchAct[5]}>
                        <Link onClick={this.props.refreshChange.bind(this,5)}>需求</Link>
                    </li>
                    <li className={searchAct[6]}>
                        <Link onClick={this.props.refreshChange.bind(this,6)}>企业</Link>
                    </li>
    
                    <li className={searchAct[1]}>
                        <Link onClick={this.props.refreshChange.bind(this,1)}>问答</Link>
                    </li>
                    
                </ul>
            </div>
        )
    }
}

var SearchList = connect(state=>({
    Search:state.Search
}))(List);

var historyList=[];
class History extends Component {
    constructor(props){
        super(props);
        /* 获取数据类型 */
        this.deHistory=(value)=>{
            Util.delSearchHistory(value);
            this.refreshHis();
        }
        this.refreshHis=()=>{
            let {dispatch} = this.props;
            dispatch(commonAction("set_history_list"));
        }
    }
    componentWillMount(){
        this.refreshHis();
    }
    render() {
        let {Search} = this.props;
        historyList = Search["history"];
        return (
            <div className={this.props.showHideClass + " home_fixed bg_color history_list"}>
                <div className="search_history">
                    {/* 搜索历史 */}
                    <ul>
                        { historyList&&historyList.length>0?
                            historyList.map(function (item,key) {
                                return (
                                    <li data-flex key={key}>
                                        <a data-flex="cross:center" data-flex-box="1" onClick={this.props.inputChange.bind(this,item)} className="history_info">{item}</a>
                                        <a data-flex="cross:center" data-flex-box="0" className="del_history" onClick={this.deHistory.bind(this,item)}>
                                            <i className="iconfont icon-guanbi"></i>
                                        </a>
                                    </li>
                                )
                            },this):""
                        }
                    </ul>
                </div>
            </div>
        )
    }
}

/*var History = connect(state=>({
    Search:state.Search
}))(historyListCom);
export {History}*/

/*
 * 左侧菜单
 *
 * */
class LayerMenus extends Component{
    render(){
        let {active} = this.props;
        return(
            <div className={active + " layer_menus"}>
                <div className="bgs_layer" onClick={this.props.closeLayers}></div>
                <div className="menus_list">
                    <div className="list_lis">
                        <h1>为知识寻找价值</h1>
                        <ul>
                            <li>
                                <Link to="">专家端入口</Link>
                            </li>
                            <li>
                                <Link to="">专家端入口</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="list_lis">
                        <h1>可以有战略合作</h1>
                        <ul>
                            <li>
                                <Link to="">专家端入口</Link>
                            </li>
                            <li>
                                <Link to="">专家端入口</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

var SearchHistory = connect(state=>({
    Search:state.Search
}))(History);
export { SearchList,SearchHistory };


