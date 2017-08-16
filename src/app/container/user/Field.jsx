import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {loadDomain,updateDomain} from '../../action/Action';
import Util from '../../common/Util';
import {Header,ListLiFeild} from '../../common/ComponentList';
import {Tool} from '../../Tool';
import {Toast, Flex} from 'antd-mobile';


import registerSucImg from '../../../img/register-suc.png';
/**
 * 领域页面
 * @param {String} type    startfield:引导领域页面    userfield:用户领域页面
 */
var dateActive="1,";
var type,from;
class Main extends Component {
    componentDidMount(){
        
    }
    constructor(props){
        super(props);
        this.state={
            btnInfo:"",
            dateActive:""
        }
        let {dispatch} = this.props;
        
        type = this.props.params.type;//获取类型
        this.submitForm =()=>{
            if(type=="startfield"){
                /* 引导页下一步 */
                if(!Util.IsNull(dateActive)){
                    Tool.localItem("fieldType",dateActive);
                    // browserHistory.push("/user/cloud/start");//去标签云
                    browserHistory.push("/");
                }else{
                    Toast.info("请至少选择一个领域",3);
                }
            }else if(type=="userfield"){
                /* 用户保存领域 */
                if(!Util.IsNull(dateActive)){
                    dispatch(updateDomain(dateActive,0,from));
                }else{
                    Toast.info("请至少选择一个领域",3);
                }
            }
        }
        this.change=(type)=>{
            if(dateActive.indexOf(type+",")>-1){
                var array = dateActive.split(",");
                var newdate="";
                for(var i=0;i<array.length-1;i++){
                    if(!(array[i] == type)){
                        newdate+=array[i]+",";
                    }
                }
                dateActive = newdate;
            }else{
                dateActive +=type+",";
            }
            dispatch(updateDomain(dateActive,1));
        }
    }
    componentWillMount(){
        type = this.props.params.type;//获取类型
        from = this.props.location.query.from;
        let {dispatch} = this.props;
        dispatch(loadDomain());
        
        if(type=="startfield"){
            this.setState({
                btnInfo:"完成"
            })
            Tool.removeLocalItem("tagList");
        }else if(type=="userfield"){
            
            this.setState({
                btnInfo:"保存"
            })
        }else{
            browserHistory.push('/');//返回首页
        }
    }
    render() {
        //判断显示内容
        var headerNew = <Header leftInfo="back" title="选择订阅内容"/>;
        if(this.props.params.type=="startfield"){
            headerNew = <Header title="选择订阅内容"/>;
        }
        
        let {UserCenter} = this.props;
        dateActive=UserCenter["domainList"][0]?UserCenter["domainList"][0].content:"";
        
        return (
            <div className="page user_field">
                {headerNew}
                {from==1 || from==2?
                    <Flex justify="center" className="register-suc">
                        <img className="suc" src={registerSucImg} alt=""/>
                        <span className="text">{from==1?"注册":"登录"}成功</span>
                    </Flex>:""
                }

                <h1 className="tits">为使我们能提供更高质量的服务，请选择您感兴趣的内容：</h1>
                <ListLiFeild dateActive={dateActive} change={this.change}/>
                <div className="clear"></div>
                <button onClick={this.submitForm} className="field_btn btn_def_expert">{this.state.btnInfo}</button>
            </div>
        )
    }
}

export default connect((state) => ({
    User: state.User,
    UserCenter:state.UserCenter
}))(Main);