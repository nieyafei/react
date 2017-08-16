import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import action from '../../action/Index';
import { Tool, merged } from '../../Tool';
import {Header,Footer} from '../../common/ComponentList'

import {ImproveTechForm} from '../../common/form/ImproveTechForm'
/*
 * 案例详情页面
 * */
class Main extends Component {
    constructor(props){
        super(props)
        
    }
    replyAdd(){
        console.log('improve case replyAdd')
    }
    render() {
        let {dispatch,UserCenter} = this.props;
        return (
            <div className="page  com_cos_login com_cos_confull white_bg register-page">
                <Header title="上传您的技术" leftInfo="back" rightClick="replyAdd" replyAdd={this.replyAdd}/>
                <ImproveTechForm dispatch={dispatch} UserCenter={UserCenter}/>
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