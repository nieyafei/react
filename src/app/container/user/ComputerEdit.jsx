import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link,hashHistory } from 'react-router';
import { connect } from 'react-redux';
import action from '../../action/Index';
import { Tool, merged } from '../../Tool';
import {Header,Footer} from '../../common/ComponentList'
import {RefreshControl, ListView, ActivityIndicator, SearchBar, Toast, Flex} from 'antd-mobile';
import  "../../../style/form/form.less"

import {ImproveCaseForm} from '../../common/form/ImproveCaseForm'
import registerSucImg from '../../../img/symbol_tan.png';

let type;
class Main extends Component {
    constructor(props){
        super(props)
        type = this.props.params.type;
        if (!type){
            browserHistory.push('/');
        }
    }
    replyAdd(){
        console.log('improve case replyAdd')
    }
    
    
    render() {
        let {dispatch,UserCenter} = this.props;
        return (
            <div className="page  com_cos_login com_cos_confull white_bg computer-edit">
                <Header title="操作提示" leftInfo="back"/>
                
                <div className="pub-padding-lf-wrap">
    
                    <Flex justify="center" className="register-suc">
                        <img className="symbol_tan" src={registerSucImg} alt=""/>
                        <span className="text">资料上传尚未开放</span>
                    </Flex>
                
                <div className="content tip_lap">
                    如您要上传案例、观点、技术成果等，或者进行专家认证，请直接联系我们，邮件: service@scientistin.com 服务热线：400-830-8832。
                </div>
    
    
                    {/*<Link to={"/user/improve-" + type}>
                        <button className="still_edit_btn">
                            知道了，仍然去编辑
                        </button>
                    </Link>*/}
                    
                    
                    
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