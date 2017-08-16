
export const Api=[
    {
        "key": "HomeList",
        "url": "/api/index/",
        "method": "get"
    },
    {
        "key":"questionCommit",
        "url":"/api/question/commit",
        "method": "post"
    },
    {
        "key":"followOn",
        "url":"/api/attention/add",
        "method": "post"
    },
    {
        "key":"followOut",
        "url":"/api/attention/del ",
        "method": "post"
    },
    {
        "key":"like",
        "url":"/api/like/add",
        "method": "post"
    },
    {
        "key":"caseDetail",
        "url":"/api/case/detail/",
        "method": "get"
    },
    {
        "key":"questionDetail",
        "url":"/api/question/detail/",
        "method": "get"
    },
    {
        "key":"opinionDetail",
        "url":"/api/opinion/detail/",
        "method": "get"
    },
    {
        "key":"techDetail",
        "url":"/api/tech/detail/",
        "method": "get"
    },
    {
        "key":"techRecommend",
        "url":"/api/tech/rec/",
        "method": "get"
    },
    {
        "key":"caseRecommend",
        "url":"/api/case/rec/",
        "method": "get"
    },
    {
        "key":"opinionRecommend",
        "url":"/api/opinion/rec/",
        "method": "get"
    },
    {
        "key":"questionRecommend",
        "url":"/api/question/rec/",
        "method": "get"
    },
    {
        "key":"refreshToken",
        "url":"/api/auth/token",
        "method": "get"
    },
    {
        "key":"userDomain",
        "url":"/api/user/domainList",
        "method": "get"
    },
    {
        "key":"userTags",
        "url":"/api/user/tagList",
        "method": "get"
    },
    {
        "key":"userStartTags",
        "url":"/api/enterprise/tag/",
        "method": "get"
    },
    {
        "key":"userExpertList",
        "url":"/api/follow/user/expertList/",
        "method": "get"
    },
    {
        "key":"userQuestionList",
        "url":"/api/user/answer/question/",
        "method": "get"
    },
    {
        "key":"userIssueList",
        "url":"/api/issue/list",
        "method": "get"
    },
    {
        "key":"updateDomain",
        "url":"/api/user/domain/ctrl/",
        "method": "get"
    },
    {
        "key":"updateTags",
        "url":"/api/user/tag/ctrl",
        /*"url":"/api/tags/add",*/
        "method": "post"
    },
    {
        "key":"deleteTags",
        "url":"/api/user/tag/ctrl",
        /*"url":"/api/tags/delete  ",*/
        "method": "post"
    },
    {
        "key":"replyCommit",
        "url":"/api/question/reply/commit",
        "method": "post"
    },
    {
        "key":"questionAnwser",
        "url":"/api/anwser/reply",
        "method": "post"
    },
    {
        "key":"questionReply",
        "url":"/api/question/reply",
        "method": "post"
    },
    {
        "key":"questionClose",
        "url":"/api/question/close",
        "method": "post"
    },
    
    {
        "key":"needCommit",
        "url":"/api/need/commit",
        "method": "post"
    },
    {
        "key":"issueDetail",
        "url":"/api/issue/detail/",
        "method": "get"
    },
    {
        "key":"needRecommend",
        "url":"/api/need/rec/",
        "method": "get"
    },
    {
        "key":"userneedList",
        "url":"/api/need/list",
        "method": "get"
    },
    {
        "key":"replyCommit",
        "url":"/api/need/reply/commit",
        "method": "post"
    },
    {
        "key":"needReply",
        "url":"/api/need/reply/",
        "method": "post"
    },
    {
        "key":"issueContaceList",
        "url":"/api/issue/contact/list/",
        "method": "post"
    },
    {
        "key":"needClose",
        "url":"/api/need/close",
        "method": "post"
    },
    {
        "key":"attentionCompany",
        "url":"/api/attention/user/",
        "method": "get"
    },
    {
        "key":"attentionCompany2",
        "url":"/api/expert/follow/user/enterpriseList/",
        "method": "get"
    },
    {
        "key":"supportCompany",
        "url":"/api/support/user/",
        "method": "get"
    },
    {
        "key":"questionCompany",
        "url":"/api/question/touser/",
        "method": "get"
    },
    {
        "key":"contaceMe",
        "url":"/api/issue/contactme",
        "method": "post"
    },
    {
        "key":"replyInfo",
        "url":"/api/reply/",
        "method": "get"
    },
    {
        "key":"replyVote",
        "url":"/api/reply/vote",
        "method": "post"
    },
    {
        "key":"expertInfo",
        "url":"/api/expert/info",
        "method": "get"
    },
    {
        "key":"notifyList",
        "url":"/api/messages/",
        "method": "get"
    },
    {
        "key":"updateNotify",
        "url":"/api/messages/update",
        "method": "post"
    },
    {
        "key":"enterpriseList",
        "url":"/api/user/",
        "method": "get"
    },
    {
        "key":"enterpriseInfo",
        "url":"/api/enterprise/info/",
        "method": "get"
    },
    {
        "key":"messagesUnread",
        "url":"/api/messages/unread",
        "method": "get"
    },
    {
        "key":"matchExpert",
        "url":"/api/matchuser",
        "method": "post"
    },
    {
        "key":"ClaimExpert",
        "url":"/api/user/is-me/",
        "method": "get"
    },
    {
        "key":"EmailCode",
        "url":"/api/email-verify",
        "method": "post"
    },
    {
        "key":"EmailVerifyCode",
        "url":"/api/register/email-request-verify-code",
        "method": "post"
    },
    {
        "key":"IsEmailVerify",
        "url":"/api/is-email-verify",
        "method": "get"
    },
    {
        "key":"expertTags",
        "url":"/api/expert-tags/",
        "method": "get"
    },
    {
        "key":"startCount",
        "url":"/api/question-count",
        "method": "get"
    },
    {
        "key":"code",
        "url":"/api/captcha/getcaptcha",
        "method": "get"
    }
];