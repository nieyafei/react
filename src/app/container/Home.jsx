import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link, hashHistory, withRouter} from 'react-router';
import {connect} from 'react-redux';
import {loadHome, setSystemAnimating, FollowOn, setMyProjectCount} from '../action/Action';
import {Tool, merged} from '../Tool';
import {Header, Footer, FollowCommon, ExpertFollowCommon, ExpertTags, ProjectList} from '../common/ComponentList';
import {RefreshControl, ListView, ActivityIndicator, SearchBar, Toast, Flex} from 'antd-mobile';
import Util from '../common/Util';
import {SearchList, SearchHistory}  from './Search';

import authMailImg from '../../img/header-caption/authmail.png';

/*
 * 所有页面的外壳
 * */

let pageIndex = -1;
let totalPages = 1;
const PAGE_NUMBER = 10;//初始化，每页数量
var type = "all";//默认综合列表
var prevType;
var loadFlag = true;
var scrollTop = 0, scrollTopInit = 0;
var objFortest, is_scroll = false;

var myProjectCountText = '';


class Main extends Component {
    
    constructor(props) {
        super(props);
        type = this.props.location.query.type || 'question';//获取不同的类型
        /* 获取数据类型 */
        this.state = {
            homeActive: "active",
            homePage: 1,//页面模式1：home 2:搜索
            isLoading: false,
            refreshing: false,
            menuActive: "",
            refreshHeight: (80 / 2 * (dataDpr))
        }
        this.onRefresh = () => {
            /* 下来刷新重新加载 */
            this.setState({isLoading: false});
            this.refPage();
            pageIndex = -1;
            this.setState({refreshing: true});
            this.dataInit();
        }
        
        this.refPage = ()=> {
            loadFlag = true;
            pageIndex = -1;
            totalPages = 1;
        }
        
        this.clearRefresh = () => {
            /* 下来刷新重新加载 */
            this.onRefresh();
        }
        
        this.onEndReached = () => {//滑动加载
            if (this.state.isLoading || !loadFlag) {
                return;
            }
            this.dataInit();
        }
        
        /*
         * 首页接收数据
         * */
        let {dispatch} = this.props;
        this.dataInit = ()=> {
            if (loadFlag) {
                this.setState({isLoading: true});
                //this.setState({ refreshing: true });
                loadFlag = false;
                /* 初次加载第一次获取数据 */
                //dispatch(setSystemAnimating("正在加载",true));
                var uid = this.props.User ? this.props.User.uid : null;
                var pageNum = ++pageIndex;//页数
                if (totalPages <= pageNum) {
                    this.setState({isLoading: false});
                    this.setState({refreshing: false});
                    return;
                }
                // var url="/api/index/"+(type=="all"?"":type+"/")+uid+"/"+pageNum+"/"+PAGE_NUMBER;
                var url = "/api/index/" + type + '/' + pageNum + "/" + PAGE_NUMBER;
                Tool.fetchGet(url, "", {}, 'json', 'basic',
                    (res) => {
                        if (res.result) {
                            var datn = res.result.content;
                            totalPages = res.result.totalPages;
                            if(datn.length>0){
                                dispatch(loadHome(type, datn, pageNum));
                            }
                            //将首页个人案例、观点、技术统计存起来
                            if (res.result && res.result.totalElements){
                                dispatch(setMyProjectCount(type, res.result.totalElements));
                            }
                        } else {
                            console.log("数据加载失败");
                        }
                        setTimeout(() => {
                            this.setState({
                                isLoading: false,
                                refreshing: false,
                            });
                            loadFlag = true;
                        }, 1000);
                    }, (err) => {
                        loadFlag = false;
                        console.log(err);
                    });
            }
            //dispatch(loadHome(type,++Home[type].page));
        }
        
        /* 设置滚动条位置 */
        this.setScrollTop = ()=> {
            const {Home:{isLoadingMore}} = this.props;
            let dataScroll = Tool.getSession('dataScroll') || [];
            let indexTy = dataScroll.findIndex(function (value, index, arr) {
                return value.tabName == type;
            });
            let scroll = indexTy == -1 ? 0 : dataScroll[indexTy].scroll;
            if (this.state.isLoading) {
                //正在加载延时调用自己
                window.setTimeout(this.setScrollTop, 150)
            } else {
                setTimeout(function () {
                    objFortest.refs.listview.scrollTo(0, scroll);
                }, 150)
            }
        }
        this.setScrollTop = this.setScrollTop.bind(this);
        //使用Promise主要是为了组件没卸载的时候能准确的先设置滚动条位置再返回之前版块的滚动条位置
        this.saveScroll = ()=> {
            return new Promise((resolve, reject) => {
                let dataScroll = Tool.getSession('dataScroll') || [];
                let obj = {};
                obj.tabName = prevType;
                obj.scroll = scrollTop;
                let indexIf = dataScroll.findIndex(function (value, index, arr) {
                    return value.tabName == prevType;
                });
                if (indexIf !== -1) {
                    dataScroll[indexIf] = obj
                } else {
                    dataScroll.push(obj)
                }
                /* 开始插入数据 */
                Tool.setSession("dataScroll", dataScroll);
                document.body.style.overflow = "none";
                resolve()
            });
        }
        /*
         * 点击关注 点赞 1 关注  2取消关注  3点赞
         * */
        this.follow = (ty, uid, clickType)=> {
            if (!(clickType == 1 || clickType == 2 || clickType == 3)) {
                return;
            }
            if (Util.isLogin(this.props)) {
                //type 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                var token = Util.getToken(this.props);
                let {dispatch} = this.props;
                dispatch(FollowOn(type, ty, uid, token, clickType, 0));
            }
        }
    }
    
    componentWillMount() {
        type = this.props.location.query.type || 'question';//获取不同的类型
        ////初始加载*/
        const {Home} = this.props;
        if (Home[type].page > -1) {
            return;
        }
        this.refPage();
        /* 初步加载 */
        scrollTop = 0;
        prevType = type;
        this.saveScroll();
        this.dataInit();
    }
    
    
    /* 首次渲染结束之后调用 */
    componentDidMount() {
        Util.FilterIsStart();//判断是否访问过
        objFortest = this.refs.fortest
        this.setScrollTop();
    }
    
    render() {
        const separator = (sectionID, rowID) => (//分隔条
            <div className={`${sectionID}-${rowID}`}
                 key={`${sectionID}-${rowID}`}
                 style={{
                     backgroundColor: '#efeff4',
                     height: '0.0rem',
                 }}
            />
        );
        
        /* 数据展示,通过对应的数据集拿出一条数据来渲染row */
        let {Home}=this.props;
        let dateList = Home[type].date;
        /* 如果数据为空，直接不再进行加载 */
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const row = (rowData, sectionID, rowID) => {
            /*
             ENTEPRISE(0),
             QUESTION(1),   //问题
             ISSUE(2),   //需求
             CASE(3),   //案例
             EXPERT(4),
             OPINION(5),   // 观点
             TECHNOLOGY(6),  //技术
             ANSWER(7),
             PAPER(8),
             PATENT(9),
             PROJECT(10);   那就用这个来判断吧。
             */
            
            //type 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
            
            if (rowData.type == "1") {//问题
                return (
                    <div key={rowID} className="row home_list_row  type_question">
                        <ProjectList {...this.props} rowData={rowData} tabName="question" type="1" linkTo={"/question/detail/"} linkToID={rowData.id}/>
                    </div>
                );
            }
            else if (rowData.type == "2") {//需求
                return (
                    <div key={rowID} className="row home_list_row  type_issue">
    
                        <ProjectList {...this.props} rowData={rowData} tabName="issue" type="2" linkTo={"/issue/info/"} linkToID={rowData.id}/>
                    
                    </div>
                );
            }
            else if (rowData.type == "3") {//案例
                return (
                    <div key={rowID} className="row home_list_row  type_case">
                        <ProjectList {...this.props} rowData={rowData} tabName="case" type="3" linkTo={"/case/info/"}  linkToID={rowData.id}/>
                    
                    </div>
                );
            } else if (rowData.type == "5") {//专家观点
                return (
                    <div key={rowID} className="row home_list_row">
                        
                        <ProjectList {...this.props} rowData={rowData} tabName="opinion" type="5" linkTo={"/opinion/info/"}  linkToID={rowData.id}/>
                        
                    </div>
                );
            }
            else if (rowData.type == "6") {//技术
                return (
                    <div key={rowID} className="row home_list_row">
    
                        <ProjectList {...this.props} rowData={rowData} tabName="tech" type="6" linkTo={"/tech/info/"} linkToID={rowData.id}/>
                        
                    </div>
                );
            }
            else {
                return null;
            }
            
        };

        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        var _myPadding = "2.21rem 0 1.42rem 0";
        var myProjet = '';
        var myProjectCount = Home["myProjectCount"][type] ? Home["myProjectCount"][type] : 0;
        if (type == 'case' || type == 'opinion' || type == 'tech') {
            _myPadding = "5.71rem 0 1.42rem 0";
            myProjet = <MyProject type={type} myProjectCount={myProjectCount}/>
        }
        return (
            <div className={type+"_bott_ot question_page page home_cons bg_color----"}>
                {/* Header */}
                <div className="header_height2">
                    <div className={this.state.homeActive + " hide"}>
                        <HeaderMenu type={type} homeMenuActive={this.state.homeActive}/>
                    </div>
                </div>
                {myProjet}
                {/* 首页page cons */}
                <div className="home_fixed">
                    <div className={this.state.homeActive + " page bg_color scroll_list"}>
                        <ListView
                            dataSource={ds.cloneWithRows(dateList)}
                            renderFooter={() => <div className={this.state.refreshing + " footerRender"}
                                                     style={{textAlign: 'center'}}>
                                {this.state.isLoading ? loadInfo : '加载完成，暂无更多数据'}
                            </div>}
                            renderRow={row}
                            renderSeparator={separator}
                            ref="fortest"
                            style={{
                                height: document.documentElement.clientHeight,
                                overflow: 'hidden',
                                margin: '0',width:'100%',
                                padding: _myPadding
                            }}
                            initialListSize={dateList.length}
                            pageSize={10}
                            scrollRenderAheadDistance={500}
                            scrollEventThrottle={20}
                            scrollerOptions={{scrollbars: true}}
                            onScroll={(view) => {
                                scrollTop = view.scroller.getValues().top;
                            }}
                            refreshControl={<RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh}
                                distanceToRefresh={this.state.refreshHeight}
                                loading={<div className="loading_pull_up"><ActivityIndicator text="加载中..."
                                                                                             size="small"/></div>}
                            />}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={100}
                        />
                    </div>
                </div>
                {/* 搜索结果页面 */}
                <SearchList/>
                {/* footer */}
                <Footer homeActive="active"/>
            </div>
        )
    }
    
    /**
     * 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用
     */
    componentWillReceiveProps(nextProps) {
        var {location} = nextProps;
        var {pathname, search} = location;
        var path = pathname + search;
        prevType = type;
        type = location.query.type || 'question';
        let self = this;
        scrollTopInit = scrollTop;
        if (this.props.location.query.type !== nextProps.location.query.type) {
            //点击tab保存当前所对应的滚动条的位置
            this.saveScroll().then(function () {
                //回到顶部
                loadFlag = false;
                self.refs.fortest.refs.listview.scrollTo(0, 0);
                //window.setTimeout(self.setScrollTop,100);
                self.clearRefresh();
            });
        }
    }
    
    //组件卸载，存储滚动条位置
    componentWillUnmount() {
        this.saveScroll();
    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

/*
 * 首页菜单导航
 * 综合  问答  案例  技术  观点
 * 点一次是否刷新一次
 * */
class HeaderMenu extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        var setCur = {};
        setCur[this.props.type] = 'active';
        return (
            <div className={this.props.homeMenuActive + " home_menus"}>
                <ul className="menu" data-flex="box:mean">
                    
                    {/*<li className={setCur.all}>*/}
                    {/*<Link to="/">综合</Link>*/}
                    {/*</li>*/}
                    
                    <li className={setCur.question}>
                        <Link to="/?type=question">问题</Link>
                    </li>
                    
                    <li className={setCur.issue}>
                        <Link to="/?type=issue">需求</Link>
                    </li>
                    
                    <li className={setCur.case ? setCur.case + " " + "personal" : "personal"}>
                        <Link to="/?type=case">案例</Link>
                    </li>
                    
                    <li className={setCur.opinion ? setCur.opinion + " " + "personal" : "personal"}>
                        <Link to="/?type=opinion">观点</Link>
                    </li>
                    
                    
                    <li className={setCur.tech ? setCur.tech + " " + "personal" : "personal"}>
                        <Link to="/?type=tech">技术</Link>
                    </li>
                    
                    
                    {/*<li className={setCur.xxxxxx}>*/}
                    {/*<Link to="/?type=xxxxxx">xxxxxx</Link>*/}
                    {/*</li>*/}
                
                
                </ul>
            </div>
        )
    }
    
    shouldComponentUpdate(np) {
        return this.props.type !== np.type; //type和之前的不一致，组件才需要更新，否则不更新，提升性能
    }
}

/**
 * 添加案例、观点、技术
 */
export class MyProject extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        var _text = '案例';
        switch (this.props.type) {
            case 'case':
                _text = '案例';
                break;
            case 'opinion':
                _text = '观点';
                break;
            case 'tech':
                _text = '技术';
                break;
        }
        
        return (
            <div className="my-project-info industry-list new_header_fixed">
                <div className="home_add industry-item">
                    <div className={this.props.type+" link"}>
                    <Link to={"user/computer-edit/" + this.props.type}>
                            <i className="iconfont icon-jia"></i>添加{_text}
                    </Link>
                    </div>
                    <div className="field-alert sc-bfc mt20">
                        <i className="iconfont icon-tishi"></i>
                        <span>完善您的{_text}，将有更多的企业基于您的{_text}和您联系</span>
                    </div>
                </div>
                <div className="my-project-title">
                    {/*<p className={"active"+type + " title_info"}>如果有需要提交的{_text}，请联系我们</p>*/}
                    <div className="pub-padding-lf-wrap">
                        <i className="iconfont icon-wenjuan"></i>
                        我的{_text}（共{this.props.myProjectCount}个）
                    </div>
                </div>
            </div>
        )
    }
}
MyProject.contextTypes = {
}


export default connect(state=>({
    Home: state.Home,
    User: state.User
}))(Main);

