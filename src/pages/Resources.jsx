import React, { Component } from 'react';
import { withRouter } from 'react-router';
import data from '../data.json';
import SettingsButton from '../components/SettingsButton.jsx';

class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headline: '',
      resources: [],
      toc: '',
      content: '',
    };

    this.redirectToNextPage = this.redirectToNextPage.bind(this);
  }

  componentDidMount() {
    const { ID } = this.props.location.state;
    const dataString = JSON.stringify(data);
    let jsonData = JSON.parse(dataString);
    const filteredJSON = jsonData.filter(values => values.id === ID);
    localStorage.removeItem('visitedPages');
    localStorage.setItem('visitedPages', JSON.stringify(filteredJSON));

    let toc = '';
    let content = '';
    let anchorId = 0;
    jsonData.forEach(obj => {
      let added = false;
      let headline = '';
      let images = '';
      let text = '';
      if(obj.panels !== undefined){
        obj.panels.forEach(panel => {
          if(panel.type === 'resource'){
            headline = obj.headline;
            if(!added) {
              toc += "<a href='/resources#" + anchorId + "' >" + headline + "</a></br>";
              added = true;
            }
            text += panel.text;
            if(panel.images !== undefined){
              images = "<div class='resImages'>";
              panel.images.forEach(image => {
                images += "<img src='" + image + "' />";
              });
              images += "</div>";
            }
            text += images;
          }
        });
        if(headline !== '' ) content += "<div class='resBox'><div class='contentHeadline'><h3 id=" + anchorId + ">" + headline + "</h3></div><div class='contentText'>" + text + "</div></div>";
      }
      anchorId++;
    });
    
    this.setState({
      headline: filteredJSON[0].headline,
      toc: toc,
      content: content,
    })
  }
  
  redirectToNextPage(id) {
    const { history } = this.props;    
    history.push({
      pathname: '/overview',
      state: { ID: id },
    });
  }
  
  render() {
    const { headline, toc, content } = this.state;
    const topBtn = (<a href="/resources#top" className="top-btn" title="Go to top">Top</a>)

    return (
      <div className="Resources">
        {topBtn}
        <div id="top" className="topBar">
          <SettingsButton goBack={() => this.props.history.goBack()} />
          <button className="StartButton" onClick={() => this.redirectToNextPage(100)} title="Return to overview page">Return</button>
        </div>
        <div className="pagecontent">
          <h1 className="headline">{headline}</h1>
          <div className="resToC" dangerouslySetInnerHTML={{ __html: toc }} />
          <div className="resContent" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    );
  }
}

export default withRouter(Resources);

