import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import {Header,Footer,NotifyList} from '../../common/ComponentList';
import {RefreshControl,ListView,ActivityIndicator,Tabs} from 'antd-mobile';
import {Tool} from '../../Tool';
import Util from '../../common/Util';
const TabPane = Tabs.TabPane;
/*
 * 推送页面
 * */
class Main extends Component {
    constructor(props){
        super(props);
        this.state={
            isLoading:true,activeKey:"1"
        }
        this.onChangeBack=(key)=>{

        }
        this.makeTabPane=(key)=> {
            if (key == 1) {
                return (
                    <TabPane tab={`问题`} key={key}>
                        <div className="tab_cons_li no_top">
                            <NotifyList type="1" tabName="question" dateStr="pushList"/>
                        </div>
                    </TabPane>
                )

            } else if (key == 2) {
                return (
                    <TabPane tab={`需求`} key={key}>
                        <div className="tab_cons_li">
                            <NotifyList type="2" tabName="issue" dateStr="pushList"/>
                        </div>
                    </TabPane>
                )
            }else if (key == 3) {
                return (
                    <TabPane tab={`电话咨询`} key={key}>
                        <div className="tab_cons_li">
                            <NotifyList type="3" tabName="phonerequest" dateStr="pushList"/>
                        </div>
                    </TabPane>
                )
            }
        }
    }

    componentWillMount(){
        if(Util.isLogin(this.props)){
            Util.bodyOver(true);
        }
    }

    render() {

        return (
            <div className="notify_cons">
                <Header leftInfo="back" title="推送" />
                <div className="page page_normal info_tabs_list bg_color">
                    <Tabs defaultActiveKey={this.state.activeKey} pageSize={3} className="tabs_notify" animated={false}>
                        {this.makeTabPane(1)}
                        {this.makeTabPane(2)}
                        {this.makeTabPane(3)}
                    </Tabs>
                </div>
                <Footer />
            </div>
        )
    }
}

export default connect((state) => ({
    Notify:state.Notify,
    User: state.User
}))(Main);