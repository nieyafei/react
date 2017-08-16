import {browserHistory} from 'react-router';
import {Tool} from '../Tool';
import Util from '../common/Util';
import {Toast} from 'antd-mobile';

/* 加载动画 */
export const setSystemAnimating = (text, animating) => {
    return {
        type: 'set_system_animating',
        text,
        animating
    }
};

export const setHomeLoadingMore = (isLoadingMore) => {
    return {
        type: 'set_home_loadingMore',
        isLoadingMore
    }
};

export const setHome = (tabData, tabName) => {
    //tabData:{list:[],page:0}
    //tabName:all
    return {
        type: 'set_home_list',
        tabData,
        tabName
    }
};

export const setIndustry = (tabData, tabName) => {
    return {
        type: 'set_industry_list',
        tabData,
        tabName
    }
};

export const setIndustryNew = (tabData, tabName) => {
    return {
        type: 'set_industry_list_new',
        tabData,
        tabName
    }
};

export const setScience = (tabData, tabName) => {
    return {
        type: 'set_science_list',
        tabData,
        tabName
    }
};

/* 加载首页数据 */
export const loadHome = (tab, date, page, totalPages) => {
    return dispatch => {
        let obj = {date: date, page: page, totalPages: (totalPages ? totalPages : 1)};
        dispatch(setHome(obj, tab));
    }
};

export const loadIndustry = (tab, date, page, totalPages) => {
    return dispatch => {
        let obj = {date: date, page: page, totalPages: (totalPages ? totalPages : 1)};
        // dispatch(setIndustry(obj, tab));
        dispatch(setIndustryNew(obj, tab));
    }
};

export const loadScience = (tab, date, page, totalPages) => {
    return dispatch => {
        let obj = {date: date, page: page, totalPages: (totalPages ? totalPages : 1)};
        dispatch(setScience(obj, tab));
    }
};

/* 获取搜索数据 */
export const loadSearch = (tab, date, page) => {
    return dispatch => {
        let obj = {date: date, page: page};
        dispatch(setSearch(obj, tab));
    }
};

export const setSearch = (tabData, tabName) => {
    return {
        type: 'set_search_list',
        tabData,
        tabName
    }
};

/*
 * 点击关注
 * */
export const FollowOn = (tabName, type, id, token, clickType, sourceFrom, actionType) => {
    return dispatch => {
        // debugger;
        //let obj = {date: date, page:page};
        //dispatch(setHome(obj, tab));
        //clickType 1 关注  2 取消关注  3 点赞
        //sourceFrom 0 首页  1 关注页面
        //dispatch(setHomeFollow(tabName,uid));
        if (Util.IsNull(clickType)) {
            return;
        }
        actionType = actionType ? actionType : "set_home_follow";
        console.log(clickType);
        var keyApiName = "followOn", tipName = "关注";
        if (clickType == 2) {
            keyApiName = "followOut";
            tipName = "取消关注";
        } else if (clickType == 3) {
            keyApiName = "like";
            tipName = "点赞";
        }
        Tool.fetchPost(Util.getApi(keyApiName), JSON.stringify({
                type: type,
                id: id,
                token: token
            }), {}, 'json', 'basic',
            (res) => {
                if (res.serror) {
                    Toast.info(res.serror.desc, 3);
                } else {
                    /* 关注成功 */
                    if (res.result == 200) {
                        /* 更新state */
                        if (clickType == 1 || clickType == 2) {
                            Toast.info(tipName+"成功", 1);
                        }
                        dispatch(setHomeFollow(tabName, id, clickType, sourceFrom, actionType));
                    } else {
                        Toast.info(tipName+"失败", 1);
                    }
                }
            }, (err) => {
                //console.log(err);
                //Toast.info(tipName+"失败",3);
            });
    }
};

export const setHomeFollow = (tabName, uid, clickType, sourceFrom, actionType) => {
    return {
        type: actionType,
        tabName,
        uid,
        clickType,
        sourceFrom
    }
};

export const setAttention = (tabData, tabName) => {
    return {
        type: 'set_attention_list',
        tabData,
        tabName
    }
};

export const loadAttention = (tab, date, page) => {
    return dispatch => {
        let obj = {date: date, page: page};
        dispatch(setAttention(obj, tab));
    }
};
/* 登录模块start */

/* 判断登录是否显示 */
export const setLoginShowHide = (isLogin) => {
    return {
        type: 'set_login_isLogin',
        isLogin
    }
};

/* 登录弹层显示 */
export const handleLogin = (obj) => {
    return dispatch => {
        //是否显示显示弹层
        dispatch(setLoginShowHide(obj));
    }
}

/* 登录用户信息 */
export const loginUser = (UserJson) => {
    return {
        type: "loginSuccess",
        UserJson
    }
}
/* 退出登录 */
export const loginOut = () => {
    return {
        type: "loginOut",
    }
}
/* 通用回调 */
export const commonAction = (type) => {
    return {
        type: type,
    }
}

/* 登录模块end */
/* 问题、案例、观点、技术详情 */
export const detail = (type, uri) => {
    return dispatch => {
        if (Util.IsNull(uri)) {
            return;
        }
        Tool.fetchGet(Util.getApi(type + "Detail") + uri, "", {}, 'json', 'basic',
            (res) => {
                if (res.serror && res.serror.type === '1') {
                    //token失效{serror: {title: "授权失败", type: "TOKEN_EXPIRED", desc: "Token过期", catalog: 0}}
                    if (res.serror.type == "TOKEN_EXPIRED") {
                        console.log("重新刷新token");
                        Tool.refreshToken();
                    }
                } else {
                    if (res.result) {
                        //dispatch();获取数据返回给state
                        dispatch(setDetail(res.result))
                    }
                }
            }, (err) => {
                console.log(err);
            });
    }
}


export const recommendList = (type, uri) => {
    return dispatch => {
        if (Util.IsNull(uri)) {
            return;
        }
        Tool.fetchGet(Util.getApi(type + "Recommend") + uri, "", {}, 'json', 'basic',
            (res) => {
                if (res.result) {
                    //dispatch();获取数据返回给state
                    dispatch(setRecommendList(res.result))
                } else {
                }
            }, (err) => {
                console.log(err);
            });
    }
}

export const replyList = (obj) => {
    return dispatch => {
        dispatch(setReplyList(obj));
        /*if(Util.IsNull(uri)){
         return ;
         }
         Tool.fetchGet(Util.getApi("questionReply")+uri+"/"+page+"/10","",{},'json','basic',
         (res) => {
         if(!res.serror){
         //dispatch();获取数据返回给state
         let obj = {date: res.content, page:page};
         console.log(123456789)
         dispatch(setReplyList(obj))
         }else{
         }
         }, (err) => {
         console.log(err);
         });*/
    }
}

export const setDetail = (detail) => {
    return {
        type: "set_detail",
        detail
    }
}

export const setReplyList = (list) => {
    return {
        type: "set_reply_list",
        list
    }
}

export const setRecommendList = (recommendList) => {
    return {
        type: "set_recommend_list",
        recommendList
    }
}

/*
 * 支付列表
 * */
export const loadPayList = (tab, date, page) => {
    return dispatch => {
        let obj = {date: date, page: page};
        dispatch(setPayList(obj, tab));
    }
}

export const setPayList = (tabData, tabName) => {
    return {
        type: "set_pay_list",
        tabData,
        tabName
    }
}

/*
 * 专家详情
 * */
export const loadExpert=(uid)=>{
    return dispatch=>{
        Tool.fetchGet("/api/expert/"+uid,"",{},'json','basic',
            (res) => {
                if(res.result){
                    dispatch(setExpertInfo(res.result));
                }else{
                    console.log("数据加载失败");
                }
            }, (err) => {
                console.log(err);
            });
        
        /*Tool.fetchGet("/api/expert/industry/e6b3fd220491dc1a0149ad367a1e6095","",{},'json','basic',
         (res) => {
         if(res.result){
         //industryList = res.result.content;
         dispatch(setIndustryInfo(res.result));
         }else{
         console.log("数据加载失败");
         }
         }, (err) => {
         console.log(err);
         });*/
    }
}

export const setExpertInfo = (info) => {
    return {
        type: "set_expert_info",
        info
    }
}
export const setIndustryInfo = (industryList) => {
    return {
        type: "set_industry_list",
        industryList
    }
}
export const setScienceInfo = (scienceList) => {
    return {
        type: "set_science_list",
        scienceList
    }
}

/*
 *  我的领域
 * */
export const loadDomain = () => {
    return dispatch => {
        Tool.fetchGet(Util.getApi("userDomain"), "", {}, 'json', 'basic',
            (res) => {
                if (res.result) {
                    dispatch(setUserDomain(res.result));
                } else {
                    console.log("数据加载失败");
                }
            }, (err) => {
                console.log(err);
            });
    }
}

/*
 *  我的领域
 * */
export const updateDomain = (domain, type, from) => {
    return dispatch => {
        if (type == 1) {
            let obj = {id: "", domain: 0, content: domain};
            dispatch(setUserDomain(obj));
            return false;
        }
        Tool.fetchGet(Util.getApi("updateDomain") + domain, "", {}, 'json', 'basic',
            (res) => {
                if (res.result != 100) {
                    let obj = {id: "", domain: 0, content: domain};
                    dispatch(setUserDomain(obj));
                    var User = Util.updateDomain(domain);
                    dispatch(loginUser(User));
                    if(from==1 || from==2){
                        browserHistory.push("/");
                    }
                    Toast.info("领域更新成功", 3);
                } else {
                    console.log("数据加载失败");
                }
            }, (err) => {
                console.log(err);
            });
    }
}

/*
 * 我的标签云
 * */
export const loadTags = (type) => {
    return dispatch => {
        if (type == 0) {
            if (Tool.localItem("tagList")) {
                dispatch(setTagList(JSON.parse(Tool.localItem("tagList"))));
                return;
            }
            Tool.fetchGet(Util.getApi("userStartTags") + Tool.localItem("company"), "", {}, 'json', 'basic',
                (res) => {
                    if (res.result) {
                        dispatch(setTagList(res.result));
                    } else {
                        console.log("数据加载失败");
                    }
                }, (err) => {
                    console.log(err);
                });
        } else if (type == 1) {
            Tool.fetchGet(Util.getApi("userTags"), "", {}, 'json', 'basic',
                (res) => {
                    if (res.result) {
                        dispatch(setTagList(res.result));
                    } else {
                        console.log("数据加载失败");
                    }
                }, (err) => {
                    console.log(err);
                });
        }
    }
}

/*
 * 专家标签云
 * */
export const loadExpertTags=(uid)=>{
    return dispatch=>{
        Tool.fetchGet(Util.getApi("expertTags")+uid,"",{},'json','basic',
            (res) => {
                if(res.result){
                    dispatch(setTagList(res.result));
                }else{
                    console.log("数据加载失败");
                }
            }, (err) => {
                console.log(err);
            });
    }
}

export const updateTags = (id, content, domain, type, userType) => {
    return dispatch => {
        if (userType == "start") {
            //无用户情况下，只需要更新本地数据
            let obj = {id: "", weight: domain, text: content}
            dispatch(setTagList(obj, type, userType));
        } else if (userType == "me") {
            if (type == 1){
                //用户更新
                Tool.fetchPost(Util.getApi("updateTags"), JSON.stringify({
                        id: id,
                        content: content,
                        domain: domain,
                        action: type
                    }), {}, 'json', 'basic',
                    (res) => {
                        if (res.result) {
                            let obj = {id: res.result, weight: domain, text: content}
                            dispatch(setTagList(obj, type, userType));
                        } else {
                            console.log("数据加载失败");
                        }
                    }, (err) => {
                        console.log(err);
                    });
            }else{
                //删除标签
                Tool.fetchPost(Util.getApi("deleteTags"), JSON.stringify({
                        id: id,
                        content: content,
                        domain: domain,
                        action: type
                    }), {}, 'json', 'basic',
                    (res) => {
                        if (res.result) {
                            let obj = {id: res.result, weight: domain, text: content}
                            dispatch(setTagList(obj, type, userType));
                        } else {
                            console.log("数据加载失败");
                        }
                    }, (err) => {
                        console.log(err);
                    });
            }
        }
    }
}

/*
 * 关注我的专家
 * */
export const LoadUserExpertList = (tab, date, page) => {
    return dispatch => {
        let obj = {date: date, page: page};
        dispatch(setExpertList(obj));
    }
}
/*
 * 我的问题
 * */
export const loadUserQuestionList = () => {
    return dispatch => {
        Tool.fetchGet(Util.getApi("userQuestionList"), "", {}, 'json', 'basic',
            (res) => {
                if (res.result) {
                    dispatch(setQuestionList(res.result));
                } else {
                    console.log("数据加载失败");
                }
            }, (err) => {
                console.log(err);
            });
    }
}
/*
 * 我的需求
 * */
export const loadUserIssueList = () => {
    return dispatch => {
        Tool.fetchGet(Util.getApi("userIssueList"), "", {}, 'json', 'basic',
            (res) => {
                if (res.result) {
                    dispatch(setIssueList(res.result));
                } else {
                    console.log("数据加载失败");
                }
            }, (err) => {
                console.log(err);
            });
    }
}

export const setUserDomain = (domainList) => {
    return {
        type: "set_user_domain",
        domainList
    }
}

export const setTagList = (tagList, typeName, userType) => {
    return {
        type: "set_tag_list",
        tagList,
        typeName,
        userType
    }
}

export const setExpertList = (expertList) => {
    return {
        type: "set_expert_list",
        expertList
    }
}

export const setQuestionList = (questionList) => {
    return {
        type: "set_question_list",
        questionList
    }
}

export const setIssueList = (issueList) => {
    return {
        type: "set_issue_list",
        issueList
    }
}


export const setMyProjectCount = (home_type, count) => {
    return {
        type: 'set_home_my_project_count',
        home_type,
        count
    }
};


/* 企业关注列表 */
/* 案例、观点 */
export const companyAttention = (type, typeStr, uri, pageNum,totalPages) => {
    return dispatch => {
        //false 加载完成    true正在加载
        if(pageNum>=totalPages){
            dispatch(setCompanyAttentionLoading(false,typeStr));
            return ;
        }
        if (Util.IsNull(uri)) {
            return;
        }
        dispatch(setCompanyAttentionLoading(true,typeStr));
        var api  = Util.getApi("attentionCompany");
        var typests=3;
        if (typeStr == 'likeList'){
            api = Util.getApi("supportCompany");
        }else if(typeStr == 'questionList'){
            api = Util.getApi("questionCompany");
        }
        if(type=="tech"){
            typests = 6;
        }else if(type=="opinion"){
            typests = 5;
        }
        Tool.fetchGet(api + (typeStr=="questionList"?"":(typests + "/" ))+ uri + "/" + pageNum + "/10", "", {}, 'json', 'basic',
            (res) => {
                if (res.serror && res.serror.type === '1') {
                    dispatch(setCompanyAttentionLoading(false,typeStr));
                    //token失效{serror: {title: "授权失败", type: "TOKEN_EXPIRED", desc: "Token过期", catalog: 0}}
                    if (res.serror.type == "TOKEN_EXPIRED") {
                        console.log("重新刷新token");
                        Tool.refreshToken();
                    }
                } else {
                    if (res.result && res.result.content.length>0) {
                        //dispatch();获取数据返回给state
                        dispatch(setCompanyAttention(res.result, type, typeStr));
                    }
                    setTimeout(function () {
                        dispatch(setCompanyAttentionLoading(false,typeStr));
                    },150)
                }
            }, (err) => {
                dispatch(setCompanyAttentionLoading(false,typeStr));
                console.log(err);
            });
    }
}


export const setCompanyAttention = (detail, tabName, typeStr) => {
    return {
        type: "set_company_attention",
        detail,
        tabName,
        typeStr
    }
}
export const setCompanyAttentionLoading = (flag,tabName) => {
    return {
        type: "set_company_attention_loading",
        flag,
        tabName,
    }
}
/*
 * 回复详情
 * */
export const loadReplyInfo=(id,type)=>{
    return dispatch=>{
        var tp = 1;
        if(type=="tech"){
            tp=6;
        }else if(type=="case"){
            tp=3;
        }else if(type=="opinion"){
            tp=5
        }

        Tool.fetchGet(Util.getApi("replyInfo")+id+"/"+tp,"",{},'json','basic',
            (res) => {
                if(res.result){
                    dispatch(setReplyInfo(res.result));
                }else{
                    console.log("数据加载失败");
                }
            }, (err) => {
                console.log(err);
            });
    }
}

export const setReplyInfo=(info)=>{
    return{
        type:"set_reply_info",
        info
    }
}

/*
 * 回复赞同 1 赞同   2不赞同
 * */
export const voteReplyInfo=(type,id,t)=>{
    return dispatch=>{
        Tool.fetchPost(Util.getApi("replyVote"),JSON.stringify({rid:id,value:type,type:t}),{},'json','basic',
            (res) => {
                if(res.result.action=="成功评论"){
                    dispatch(setReplyInfoVote(type));
                }else{
                    console.log("数据加载失败");
                }
            }, (err) => {
                console.log(err);
            });
    }
}
export const setReplyInfoVote=(typeVote)=>{
    return{
        type:"set_reply_vote",
        typeVote
    }
}





/*
 * 我回答的问题
 * */
export const AnsweredQuestionByMe = (tab, date, page) => {
    return dispatch => {
        let obj = {date: date, page: page};
        dispatch(setAnsweredQuestionByMe(obj));
    }
}


export const setAnsweredQuestionByMe = (answeredQuestionByMeList) => {
    return {
        type: "set_answered_question_by_me",
        answeredQuestionByMeList
    }
}



/*
 * 我回答的问题
 * */
export const AttentionToMyCompany = (tab, date, page) => {
    return dispatch => {
        let obj = {date: date, page: page};
        dispatch(setAttentionToMyCompany(obj));
    }
}


export const setAttentionToMyCompany = (attentionToMyCompanyList) => {
    
    return {
        type: "set_attention_to_my_company",
        attentionToMyCompanyList
    }
}


/*
 * 操作消息是否已读
 * */
export const updateNotify=(type,_read,msgId,tabName,from)=>{
    return dispatch=>{
        //用户更新消息
        Tool.fetchPost(Util.getApi("updateNotify"),JSON.stringify({msgId:msgId,type:from}),{},'json','basic',
            (res) => {
                if(!res.serror){
                    if(type==0){
                        dispatch(setUpdateNotify(msgId,tabName));
                    }
                }else{
                    console.log("数据加载失败");
                }
            }, (err) => {
                console.log(err);
            });
    }
}

export const setUpdateNotify=(msgId,tabName)=>{
    return{
        type: 'set_notify_read',
        msgId,
        tabName
    }
};


export const commonNotify=(tabName,page,totalPages)=>{
    return dispatch=>{
        //false 加载完成    true正在加载
        if(page>=totalPages){
            //dispatch(setNotifyLoading(tabName,false));
        }else{
            dispatch(setNotifyLoading(tabName,true));
            var api  = Util.getApi("notifyList"),apiType=(tabName=="list"?"":(tabName+"/"));
            if(!(tabName=="list" || tabName=="personal")){
                api = "/api/";apiType +="push/";
                if(tabName=="phonerequest"){
                    apiType = "expert/"+tabName+"/";
                }
            }
            Tool.fetchGet(api + (apiType) + page + "/10", "", {}, 'json', 'basic',
                (res) => {
                    if (!res.serror) {
                        dispatch(setNotify((tabName=="list" || tabName=="personal")?res:res.result,tabName));
                    }
                    setTimeout(function () {
                        dispatch(setNotifyLoading(tabName,false));
                    },1000)
                }, (err) => {
                    dispatch(setNotifyLoading(tabName,false));
                    console.log(err);
                });
        }
    }
};

export const setNotify=(tabData,tabName)=>{
    return{
        type: 'set_notify',
        tabData,
        tabName
    }
};

export const setNotifyLoading=(tabName,flag)=>{
    return{
        type: 'set_notify_loading',
        tabName,
        flag
    }
};

/*
* 企业详情
* */
export const commonEnterpriseInfo=(uid)=>{
    return dispatch=>{
            var api  = Util.getApi("enterpriseInfo");
            Tool.fetchGet(api + uid, "", {}, 'json', 'basic',
                (res) => {
                    if (res.serror && res.serror.type=="0") {
                        dispatch(setEnterpriseInfo(res.result));
                    }
                }, (err) => {
                    console.log(err);
                });
        }
};

export const commonEnterprise=(tabName,page,totalPages,uid)=>{
    return dispatch=>{
        //false 加载完成    true正在加载
        if(page>=totalPages){
            //dispatch(setNotifyLoading(tabName,false));
        }else{
            dispatch(setEnterpriseLoading(tabName,true));
            var api  = Util.getApi("enterpriseList");

            Tool.fetchGet(api + (tabName+"/"+uid+"/") + page + "/10", "", {}, 'json', 'basic',
                (res) => {
                    if (!res.serror) {
                        dispatch(setEnterprise((tabName=="list" || tabName=="personal")?res:res.result,tabName));
                    }
                    setTimeout(function () {
                        dispatch(setEnterpriseLoading(tabName,false));
                    },1000)
                }, (err) => {
                    dispatch(setEnterpriseLoading(tabName,false));
                    console.log(err);
                });
        }
    }
};
export const setEnterpriseInfo=(tabData)=>{
    return{
        type: 'set_enterprise_info',
        tabData
    }
};
export const setEnterprise=(tabData,tabName)=>{
    return{
        type: 'set_enterprise',
        tabData,
        tabName
    }
};
export const setEnterpriseLoading=(tabName,flag)=>{
    return{
        type: 'set_enterprise_loading',
        tabName,
        flag
    }
};

/*
* 认领匹配专家
* */
/*
 * 专家详情
 * */
export const loadMatchExpert=(uid)=>{
    return dispatch=>{
        var name = JSON.parse(Tool.localItem("User")).full_name;
        var org = JSON.parse(Tool.localItem("User")).org_name;
        Tool.fetchPost(Util.getApi("matchExpert"),JSON.stringify({name:name,org:org}),{},'json','basic',
            (res) => {
                if(res.result){
                    dispatch(setCommonList(res.result));
                }else{
                    console.log("数据加载失败");
                }
            }, (err) => {
                console.log(err);
            });
    }
}
export const setCommonList=(list)=>{
    return{
        type: 'set_common_list',
        list
    }
};

/* 获取验证码 */
export const setSysCode=(code,isShow)=>{
    return{
        type: 'set_sys_code',
        isShow
    }
};

