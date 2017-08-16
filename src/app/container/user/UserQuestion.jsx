import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {loadUserQuestionList,AnsweredQuestionByMe} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {RefreshControl,ListView,ActivityIndicator} from 'antd-mobile';
import {Header,Footer, ProjectList} from '../../common/ComponentList';
import Util from '../../common/Util';


const PAGE_NUMBER = 10;//初始化，每页数量
/*
 * 专家回答的问题列表
*/
var type="list";
var loadFlag=true;
var totalPages = 1,pageIndex=-1;
class Main extends Component {
    constructor(props){
        super(props)
        /* 获取数据类型 */
        this.state = {
            homeActive:"active",
            serActive:"",
            isLoading: true,
            refreshing: false,
        }
        
        this.onEndReached = () =>{//滑动加载
            if (this.state.isLoading || !loadFlag) {
                return;
            }
            this.dataInit();
        }
        
        /*
         * 接收数据
         * */
        let {dispatch} = this.props;
        this.dataInit=()=>{
            if(loadFlag){
                this.setState({ isLoading: true });
                loadFlag = false;
                setTimeout(() => {
                    /* 初次加载第一次获取数据 */
                    var pageNum = ++pageIndex;//页数
                    if(totalPages <= pageNum){
                        this.setState({ isLoading: false });
                        return;
                    }
                    var url=Util.getApi("userQuestionList")+pageNum+"/"+PAGE_NUMBER;
                    Tool.fetchGet(url,"",{},'json','basic',
                        (res) => {
                            if(res.result){
    
                                var dataList = res.result.content;
                                totalPages = res.result.totalPages;
                                
                                dispatch(AnsweredQuestionByMe(type,dataList,pageNum));
                            }else{
                                console.log("数据加载失败");
                            }
                            this.setState({
                                isLoading: false,
                            })
                            loadFlag = true;
                        }, (err) => {
                            loadFlag = true;
                            console.log(err);
                        });
                },1000);
            }
        }
    }
    
    componentWillMount(){
        if(Util.isLogin(this.props)){
            let {UserCenter} = this.props;
            /*if(UserCenter["answeredQuestionByMeList"].page){
                return;
            }*/
            this.dataInit();//初始加载
        }
    }
    
    render() {
        const row = (rowData, sectionID, rowID) => {
            return (
                <div key={rowID} className="row home_list_row  type_question">
                    <ProjectList {...this.props} rowData={rowData} tabName="question" type="1" linkTo={"/question/detail/"} linkToID={rowData.id} actionType="set_answer_question_follow"/>
                </div>
            )
        };
        let {UserCenter} = this.props;
        const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = UserCenter["answeredQuestionByMeList"].date;
        var loadInfo = <ActivityIndicator text="加载中..." size="small"/>;
        return (
            <div className="pay_cons page_hei_cons bg_color">
                <Header title="我回答的问题" leftInfo="back"/>
                <div className="page pay_lists bg_color no_sc_pag">
                    <div className="scroll_list">
                        <ListView
                            dataSource={dataSource.cloneWithRows(data)}
                            renderFooter={() => <div className={this.state.refreshing + " footerRender"} style={{ textAlign: 'center'}}>
                                {this.state.isLoading ? loadInfo : '加载完成，暂无更多数据'}
                            </div>}
                            renderRow={row}
                            style={{
                                height: document.documentElement.clientHeight,
                                overflow: 'hidden',
                                margin: '0',padding:"1.17rem 0 1.41rem 0"
                            }}
                            initialListSize={dataSource.length-8}
                            pageSize={10}
                            scrollRenderAheadDistance={500}
                            scrollEventThrottle={20}
                            scrollerOptions={{ scrollbars: true }}
                            onScroll={()=>{}}
                            useZscroller
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={1000}
                        />
                    </div>
                </div>
                <Footer />
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

