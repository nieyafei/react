/**
 * Created by Lichong on 24/03/2017.
 */
import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {setSystemAnimating, handleLogin, loginUser} from '../../action/Action';
import {Tool} from "../../Tool";
import {Header, LoadingToast} from '../../common/ComponentList';
import {Toast, Flex, WhiteSpace} from 'antd-mobile';
import  "../../../style/form/form.less"
import  "../../../style/list/AuthIdentityList.less";
import Util from '../../common/Util';

import authDemo from '../../../img/auth_demo.png';

let dispatch =  null;
export class AuthIdentityList extends Component {
    constructor(props, context) {
        super(props, context);
        dispatch = this.props.dispatch;
    }
    
    chooseMe(m, y) {
        console.log(m);
        var flag = true;
        if(Util.isLogin(this.props.prevProps,1) && !Util.IsNull(m)){
            let {dispatch} = this.props;
            dispatch(setSystemAnimating("正在认领",true));
            Tool.fetchGet(Util.getApi("ClaimExpert")+m, "", {}, 'json', 'basic',
                (res) => {
                    if(res.result==200){
                        if(flag){
                            flag = false;
                            Toast.info("认领成功",1,function(){
                                browserHistory.push('/field/userfield?from=1');
                            })
                        }
                    }else if(res.result==100){
                        Toast.info("您已经认领过专家！",2);
                    }else{
                        Toast.info("认领失败",1);
                    }
                    dispatch(setSystemAnimating("正在认领",false));
                }, (err) => {
                    dispatch(setSystemAnimating("正在认领",false));
                    console.log(err);
                });
            setTimeout(function(){
                if(flag){
                    flag = false;
                    Toast.info("认领成功",1,function(){
                        browserHistory.push('/field/userfield?from=1');
                    })
                }
            },3000)
        }
    }

    componentWillMount() {
        
    }
    
    render() {
        let {CommonStr} = this.props.prevProps;
        var dataList = CommonStr["list"];
        return (
            <div className="auth-identity-list pub-padding-lf-wrap">
                {
                    dataList.map(function(item,key){
                        return (
                            <div key={key} className="single-item">
                                <Flex className="align-items-stretch mb32">
                                    {/*<div className="author_img">
                                        <img src={authDemo}/>
                                    </div>*/}
                                    <Flex.Item>
                                        <div className="sc-bfc author_title">
                                            <div className="fl nt">
                                                <span className="name">{item.name}</span>
                                                <span className="title">&nbsp;&nbsp;教授</span>
                                            </div>
                                            <div className="fr">
                                                <button className="choose-btn" onClick={this.chooseMe.bind(this, item.authorUri)}>这是我</button>
                                            </div>
                                        </div>
                                        <div className="author_info">
                                            <div className="text-ellipsis">{item.org} - 信息工程与机械工程学院信息工程与机械工程学院</div>
                                            <div className="text-ellipsis">研究领域：机构学、机械运动、机器动力学机构学机器动力学机构学机器动力学机构学</div>
                                        </div>
                                    </Flex.Item>
                                </Flex>
                                <div className="author_articles">
                                    <div className="text-ellipsis">文章：{item.paperTitle}</div>
                                </div>
                            </div>
                        )
                    }.bind(this))
                }
            </div>
        )
    }
}