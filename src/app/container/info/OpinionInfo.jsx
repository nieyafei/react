import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import {detail,FollowOn,commonAction} from '../../action/Action';
import { Tool, merged } from '../../Tool';
import {Header,Footer,ReplyList,CommonInfoTabs} from '../../common/ComponentList';
import Util from '../../common/Util';
/*
 * 观点详情页面
 * */
var type="opinion",uri;
class Main extends Component {
    componentDidMount(){
        Tool.setScrollTop("detailScroll",type);
    }
    constructor(props){
        super(props);
        this.state = {
            showDetail: false,
        }
        this.toContactExpert=(contactName,contactTitle)=>{
            Util.contactSession("观点",contactName,contactTitle,"other",uri);
        }
    }
    componentWillMount(){
        /* 获取uri */
        Util.bodyOver(false);
        uri = this.props.params.uri;
        let {dispatch,Detail} = this.props;
        if(uri){
            if(Detail["detail"].id==uri){
                return ;
            }
            dispatch(commonAction("set_detail_init"));
            dispatch(detail(type,uri));
        }else{
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

        var iconArea = <i className="iconfont icon-arrowDown"></i>;
        var foldingState = ''
        if (this.state.showDetail) {
            iconArea = <i className="iconfont icon-top"></i>
            foldingState = 'folding-down'
        }

        const info =()=> {
            if (Util.IsNullJson(detailInfo)) {
                return (
                    <div className="home_list_row info_null">
                        暂无详情数据信息
                    </div>
                )
            } else {
                return (
                    <div className="home_list_row item-commons">
                        <div className="item-detail-title row_title bgcolor-cons ">
                            {detailInfo.title}
                        </div>
                        <div className="item_detail_nav_li">
                            <p className="">领 域：<span className="color2">{detailInfo.domain}</span></p>
                            {detailInfo.keyword?
                                <p className="">关键词：{detailInfo.keyword}</p>:""
                            }
                        </div>
                        <div className={foldingState+" more_content"}>
                            <div className='folding-detail item_detail_nav_li '>
                                <div className="detail_nav">
                                    <div className="form_ul">
                                        <div className="li">
                                            <label>观点详情：</label>
                                            <span>{detailInfo.content}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="folding-area" onClick={this.toggleDetails.bind(this)}>
                                {iconArea}{foldingState=="folding-down"?"收起":"展开"}观点详情
                            </div>
                        </div>
                        <br/>
                    </div>
                )
            }
        }
        //推荐列表
        var recommend = Detail["recommendList"];
        const recommendList =()=>{
            if(!Util.IsNullJson(recommend) && recommend.length>0){
                return (
                    <div className="recommend">
                        <div className="recommend_header" data-flex="cross:center">
                            <i className="iconfont icon-yonghu-copy"></i>
                            推荐观点
                        </div>
                        <div>
                            {
                                recommend.map(function (item,key) {
                                    return (
                                        <div key={key} className="recommend_li">
                                            <div data-flex className="expert">
                                                <Link to="" className="le" data-flex="cross:center" data-flex-box="1">
                                                    <img src={Util.images(item.expertIndexStream.coverPic,0)}/>
                                                    {item.expertIndexStream.name}<span>{item.expertIndexStream.title}</span>
                                                </Link>
                                                <div className="ri" data-flex="cross:center" data-flex-box="0">
                                                    {item.expertIndexStream.org}
                                                </div>
                                            </div>
                                            <h1><Link to={"/opinion/info/"+item.id}><span className="color1">[观点]</span>{item.title}</Link></h1>
                                            <div className="info_tech">
                                                {item.content}
                                            </div>
                                        </div>
                                    );
                                }, this)
                            }
                        </div>

                    </div>
                )
            }
        }

        return (
            <div className="detail_cons page_hei_cons">
                <Header title="观点详情" leftInfo="back"/>
                <div className="page_body page_normal">
                    {info()}
                    {/*{recommendList()}*/}
                    <CommonInfoTabs type={type} uri={uri}/>
                </div>
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
    Detail:state.Detail
}))(Main);

