import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {loadAttention, FollowOn, companyAttention} from '../action/Action';
import {Header, Footer, FollowCommon, ExpertFollowCommon, ExpertTags, ProjectList,ContectorInfo,ProjectAttentionList} from '../common/ComponentList';
import {CompanyAttention, AttentionEnterpriseList} from '../common/ComponentDetails';
import {RefreshControl, ListView, ActivityIndicator, Popup} from 'antd-mobile';
import {Tool} from '../Tool';
import Util from '../common/Util';


// TODO:Levi 这个页面之前已经写好了，但是接口没有，需要再联调接口


/*
 * 关注页面
 * */
let index = 0;
let pageIndex = -1;
let pageIndexSearch = -1;
let totalPages = 1;
let totalPagesSearch = 0;
let nUM_SECTIONS = 1;//首次加载几页
let nUM_ROWS_PER_SECTION = 10;//每页多少
const PAGE_NUMBER = 10;//初始化，每页数量
var type = "all";//默认列表
var data;//接收数据
var loadFlag = true;
let dataSource, prevType;
var scrollTop, scrollTopInit;

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
    // Note: the popup content will not scroll.
    maskProps = {onTouchStart: e => e.preventDefault(),};
}

class Main extends Component {
    /* 首次渲染结束之后调用 */
    componentDidMount() {
        console.log("渲染之后调用");
        this.setScrollTop();
    }
    
    constructor(props) {
        super(props);
        dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        /* 获取数据类型 */
        this.state = {
            pageType: 1,//判断是否登录过,决定在哪儿
            homeActive: "active",
            serActive: "",
            isLoading: true,
            refreshing: false,
            bottomLayer: ""
        }
        this.onRefresh = () => {
            /* 下来刷新重新加载 */
            this.setState({ isLoading: false });
            this.refPage();
            this.setState({ refreshing: true });
            this.dataInit();
        }
        
        this.clearRefresh = () => {
            /* 下来刷新重新加载 */
            this.onRefresh();
        }

        this.onEndReached = (event) =>{//滑动加载
            if (this.state.isLoading || !loadFlag) {
                return;
            }
            this.dataInit();
        }

        this.refPage=()=>{
            loadFlag = true;
            pageIndex = -1;
            totalPages = 1;
        }

        let {Attention, dispatch} = this.props;
        /*
         * 首页接收数据
         * */
        this.dataInit = () => {
            if (loadFlag) {
                this.setState({isLoading: true});
                loadFlag = false;
                setTimeout(() => {
                    /* 初次加载第一次获取数据 */
                    var token = this.props.User ? this.props.User.token : null;
                    var pageNum = ++pageIndex;//页数
                    if (totalPages <= pageNum) {
                        this.setState({ isLoading: false });
                        this.setState({ refreshing: false });
                        loadFlag = false;
                        return;
                    }
                    console.log("加载：" + type);
                    var url = "/api/"+type+"/attention/" + pageNum;
                    Tool.fetchGet(url, "", {}, 'json', 'basic',
                        (res) => {
                            if (res.result) {
                                var datn = res.result.list;
                                totalPages = res.result.totalCount;
                                if(datn.length>0){dispatch(loadAttention(type, datn, pageNum));}
                                this.setState({
                                    isLoading: false,
                                    refreshing: false,
                                });
                            } else {
                                console.log("数据加载失败");
                                this.setState({
                                    isLoading: false,
                                    refreshing: false,
                                })
                            }
                            loadFlag = true;
                        }, (err) => {
                            loadFlag = true;
                            console.log(err);
                        });
                }, 1000);
            }
        }
        
        /* 设置滚动条位置 */
        this.setScrollTop = () => {
            let attentionScroll = Tool.getSession('attentionScroll') || [];
            console.log(type);
            let indexTy = attentionScroll.findIndex(function (value, index, arr) {
                return value.tabName == type;
            });
            let scroll = indexTy == -1 ? 0 : attentionScroll[indexTy].scroll;
            if (!loadFlag) {
                //正在加载延时调用自己
                window.setTimeout(this.setScrollTop, 150)
            } else {
                //document.body.scrollTop=document.documentElement.scrollTop=scroll
                this.refs.fortest.refs.listview.scrollTo(0, scroll);
            }
        }
        //使用Promise主要是为了组件没卸载的时候能准确的先设置滚动条位置再返回之前版块的滚动条位置
        this.saveScroll = () => {
            return new Promise((resolve, reject) => {
                let attentionScroll = Tool.getSession('attentionScroll') || [];
                let obj = {};
                obj.tabName = prevType;
                obj.scroll = scrollTop;
                let indexIf = attentionScroll.findIndex(function (value, index, arr) {
                    return value.tabName == prevType;
                });
                if (indexIf !== -1) {
                    attentionScroll[indexIf] = obj
                } else {
                    attentionScroll.push(obj)
                }
                /* 开始插入数据 */
                Tool.setSession("attentionScroll", attentionScroll);
                resolve()
            });
        }
        
        this.setScrollTop = this.setScrollTop.bind(this);
        
        this.clickBottomLayer = (ty, uid) => {
            Popup.show(
                <div className="bottom_lays">
                    <div className="lay_tops">
                        <div className="ls" onClick={this.follow.bind(this, ty, uid, 2)}>取消关注</div>
                    </div>
                    <div className="lay_bot" onClick={this.onCloseBottom}>取消</div>
                </div>, {animationType: 'slide-up', maskProps, maskClosable: false});
            this.setState({
                bottomLayer: "active"
            })
        }
        this.onCloseBottom = () => {
            Popup.hide();
        }
        /*
         * 点击取消关注
         * */
        this.follow = (ty, uid, clickType) => {
            if (Util.isLogin(this.props)) {
                console.log(clickType)
                //ty 0 企业 1 问答 2需求 3案例 4 专家 5 观点 6 技术
                if (!(clickType == 1 || clickType == 2 || clickType == 3)) {
                    return;
                }
                var token = Util.getToken(this.props);
                let {dispatch} = this.props;
                dispatch(FollowOn(type, ty, uid, token, clickType, 1));
            }
        }
        
    }
    
    componentWillMount() {
        
        if (Util.isLogin(this.props)) {
            type = this.props.location.query.type || 'enterprise';//获取不同的类型
            let {Attention} = this.props;
            if(Attention[type].page > -1){
                this.setState({ isLoading: false });
                return;
            }
            this.refPage();
            /* 重新加载 */
            scrollTop = 0;prevType = type;
            this.saveScroll();
            this.dataInit();
        }
    }
    
    render() {
        const separator = (sectionID, rowID) => (//分隔条
            <div className={`${sectionID}-${rowID}`}
                 key={`${sectionID}-${rowID}`}
                 style={{
                     backgroundColor: '#efeff4',
                     height: '0.4rem',
                 }}
            />
        );
        /* 如果已存在数据则不需要初始加载 */
        let {Attention} = this.props;
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        data = Attention[type].date;
        /* 数据展示,通过对应的数据集拿出一条数据来渲染row */
        index = 0;
        const row = (rowData, sectionID, rowID) => {
            if(JSON.stringify(rowData) == "{}"){
                return null;
            }
            if (type == "enterprise") {//企业
                return (
                    <div key={rowID} className="row attention_list_row">
                        <AttentionEnterpriseList {...this.props} rowData={rowData} tabName={type} type="0" linkTo={"/enterprise/info/" + rowData.id} actionType="set_attention_follow"/>
                    </div>
                );
            } else if (type == "question") {//问答
                return (
                    <div key={rowID} className="row home_list_row">
                        <ProjectAttentionList {...this.props} rowData={rowData} tabName={type} type="1" linkTo={"/question/detail/" + rowData.id} />
                    </div>
                );
            } else if (type == "issue") {//需求
                return (
                    <div key={rowID} className="row attention_list_row home_list_row">
                        <ProjectAttentionList {...this.props} rowData={rowData} tabName={type} type="2" linkTo={"/issue/info/" + rowData.id} />
                    </div>
                );
            }
            
        };
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        return (
            <div className="page attention_page  attention_cons bg_color">
                <div className="header_height3">
                    <Header leftInfo="back" title="关注"/>
                    <HeaderMenu type={type}/>
                </div>
                <div className="scroll_list active">
                    <ListView
                        dataSource={dataSource.cloneWithRows(data)}
                        renderFooter={() => <div className={this.state.refreshing + " footerRender"}
                                                 style={{textAlign: 'center'}}>
                            {this.state.isLoading ? loadInfo : '加载完成，暂无更多数据'}
                        </div>}
                        renderRow={row}
                        ref="fortest"
                        style={{
                            height: document.documentElement.clientHeight,
                            overflow: 'hidden',
                            margin: '0', padding: "2.21rem 0 1.42rem 0"
                        }}
                        initialListSize={dataSource.length - 8}
                        pageSize={10}
                        scrollRenderAheadDistance={500}
                        scrollEventThrottle={20}
                        scrollerOptions={{scrollbars: true}}
                        onScroll={(view) => {
                            scrollTop = view.scroller.getValues().top;
                            //this.saveScroll();
                        }}
                        refreshControl={<RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh}
                            distanceToRefresh={80/2 * (dataDpr)}
                            loading={<div className="loading_pull_up"><ActivityIndicator text="加载中..." size="small"/>
                            </div>}
                        />}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={100}
                    />
                </div>
                {/*<div className="bottom_layer" style={{position:'fixed',top:'20%',left:'0',zIndex:'99'}} onClick={this.clickBottomLayer.bind(1,"12345678945645654")}>
                 点击显示
                 </div>*/}
                <Footer attentionActive="active"/>
            </div>
        )
    }
    
    /**
     * 在组件接收到新的 props 的时候调用。在初始化渲染的时候，该方法不会调用
     */
    componentWillReceiveProps(np) {
        var {location} = np;
        prevType = type;
        type = location.query.type || 'enterprise';
        let self = this;
        scrollTopInit = scrollTop;
        if (this.props.location.query.type !== np.location.query.type) {
            
            this.saveScroll().then(function () {
                //回到顶部
                loadFlag = false;
                self.refs.fortest.refs.listview.scrollTo(0, 0);
                //window.setTimeout(self.setScrollTop,100);
                self.onRefresh();
            });
            //this.clearRefresh();
            //this.unmount(); //地址栏已经发生改变，做一些卸载前的处理
        }
        //this.initState(np);
    }
    
    shouldComponentUpdate(nextProps) {
        return true
    }
    
    //组件卸载，存储滚动条位置
    componentWillUnmount() {
        this.saveScroll();
    }
    
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
            <div className="home_menus active">
                <ul className="menu" data-flex="box:mean">
                    <li className={setCur.enterprise}>
                        <Link to="/attention/?type=enterprise">企业</Link>
                    </li>
                    <li className={setCur.question}>
                        <Link to="/attention/?type=question">问题</Link>
                    </li>
                    <li className={setCur.issue}>
                        <Link to="/attention/?type=issue">需求</Link>
                    </li>
                </ul>
            </div>
        )
    }
    
    shouldComponentUpdate(np) {
        return this.props.type !== np.type; //type和之前的不一致，组件才需要更新，否则不更新，提升性能
    }
}

export default connect(state => ({
    Attention: state.Attention,
    User: state.User
}))(Main); //连接redux