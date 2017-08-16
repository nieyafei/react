import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {loginOut} from '../../action/Action';
import {Tool} from '../../Tool';
import {Toast, Flex, WhiteSpace} from 'antd-mobile';
import {Header, Footer} from '../../common/ComponentList';
import Util from '../../common/Util';

import authDemo from '../../../img/auth_demo.png';

/*
 * 个人中心页面
 * */


class Main extends Component {
    constructor(props, context) {
        super(props, context);
        let {dispatch} = this.props;
        this.userLoginOut = () => {
            /* 退出登录 */
            dispatch(loginOut());
            this.context.router.replace({pathname: '/'});
        }
        this.state = {
            isLoading: false,
            experInfos: null
        }
    }
    
    componentWillMount() {
        /* 判断是否登录状态 */
        //console.log(this.props.location.pathname+this.props.location.search);
        Tool.localItem("prevPathName", this.props.location.pathname + this.props.location.search);
        if(Util.isLogin(this.props)){
            this.initData()
        }
    }
    
    initData() {
        
        var _this = this;
        
        _this.setState({
            isLoading: true
        })
        
        var url = Util.getApi("expertInfo");
        Tool.fetchGet(url, "", {}, 'json', 'basic',
            (res) => {
                if (res.result) {
                    _this.setState({
                        experInfos: res.result
                    })
                } else {
                    console.log("数据加载失败");
                }
                
                this.setState({
                    isLoading: false,
                })
            }, (err) => {
                // _this.userLoginOut()
                console.log(err);
            });
    }
    
    render() {
        let User = this.props.User;
        
        let experInfos = this.state.experInfos;

        var area = '';
        if (experInfos && experInfos.domains) {
            area = experInfos.domains.toString()
        }
        
        return (
            <div className="page user_cons">
                <Header title="我的" leftInfo="back" />
                <div className="my_info item_info">

                    <div className="user_detail auth-identity-list pub-padding-lf-wrap">
                        
                        <div className="single-item">
                            <Flex className="align-items-stretch mb32">
                                <div className="author_img">
                                    <img src={Util.images(User?User.portrait:"")}/>
                                </div>
                                <Flex.Item>
                                    <div className="sc-bfc author_title">
                                        <div className="fl nt">
                                            <span
                                                className="name">{experInfos && experInfos.userName ? experInfos.userName : ""}</span>
                                        </div>
                                        <div className="fr">
                                            
                                            {
                                                experInfos && experInfos.v ?
                                                    <span className="auth done">
                                                        已认证
                                                    </span>
                                                    :
                                                    <span className="auth">
                                                        未认证
                                                    </span>
                                            }
                                        
                                        
                                        </div>
                                    </div>
                                    <div className="author_info bigger">
                                        <div
                                            className="text-ellipsis fontsize28">{experInfos && experInfos.orgName ? experInfos.orgName : ""}</div>
                                        <div className="fontsize28">研究领域：{area}</div>
                                    </div>
                                </Flex.Item>
                            </Flex>
                            <div className="static-and-tags">
                                
                                <Flex className="align-items-stretch mb32">
                                    <Flex.Item data-flex-box="1">
                                        
                                        {/*<span className="count">{Util.getCount(experInfos?experInfos.questionCount:0)}</span>
                                        <span className="label">问题</span>
                                        
                                        <span className="count">{Util.getCount(experInfos?experInfos.issueCount:0)}</span>
                                        <span className="label">需求</span>*/}
                                        <span className="count">{Util.getCount(experInfos?experInfos.followCount:0)}</span>
                                        <span className="label">企业关注</span>
                                    </Flex.Item>
                                    
                                    <div data-flex-box="0">
                                        {/*<Link to={"/user/expert/?id=" + experInfos.uid}>*/}
                                        <Link to={"/expert/info/" + (experInfos?experInfos.uid:"")}>
                                            < i className="iconfont icon-wenj"></i>
                                            <span className="count"> 查看学术主页</span>
                                        </Link>
                                    </div>
                                
                                </Flex>
                            
                            
                            </div>
                        
                        
                        </div>
                    
                    </div>
                    
                    
                    <div className="user_menus">
                        <ul>
                            <li>
                                <Link to="/user/cloud/me">
                                    <i className="iconfont icon-cloud"></i>
                                    我的标签云
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>
                            
                            <li>
                                <Link to="/user/perfect-userinfo">
                                    <i className="iconfont icon-bianji"></i>
                                    完善产业资料
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="/user/push">
                                    <i className="iconfont icon-icon"></i>
                                    推送给我的问题需求
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>

                            <li>
                                <Link to="/user/question">
                                    <i className="iconfont icon-wenhao"></i>
                                    我回答的问题
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>
                            
                            <li>
                                <Link to="/user/expert">
                                    <i className="iconfont icon-guanzhu2"></i>
                                    关注我的企业
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to="/field/userfield">
                                    <i className="iconfont icon-shezhi-copy"></i>
                                    我的领域
                                    <i className="iconfont icon-jiantou"></i>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="btn_divs">
                        <button className="btn_def_expert" onClick={this.userLoginOut}>退出</button>
                    </div>
                </div>
                {/* footer */}
                <Footer myActive="active" className="normal_footer"/>
            </div>
        )
    }
}

Main.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default connect((state) => ({
    User: state.User
}))(Main); //连接redux