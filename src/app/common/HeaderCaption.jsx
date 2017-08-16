import React, {Component, PropTypes} from 'react';
import {Router, Route, IndexRoute, browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';

export class HeaderCaption extends Component {
  render() {
    let registerCaptionImgWrap = '';
    let {captionImg, captionText} = this.props;

    if (captionText && captionImg) {
      registerCaptionImgWrap = <img src={captionImg} className="caption-img"/>
    }

    return (
      <div className={'header-caption'}>
        <div className="pub-padding-lf-wrap sc-bfc">
          <span className="fl img">{registerCaptionImgWrap}</span>
          <span className="fl text">{captionText}</span>
        </div>
      </div>
    );
  }
}

HeaderCaption.defaultProps = {
  captionText: '欢迎来到科学家在线'
}
