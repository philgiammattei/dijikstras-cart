import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';




//begin Dijkstra

class NewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {newItemText: 'New Item...'};
    this.handleEnter = this.handleEnter.bind(this);
  }

  handleEnter(e) {
    if(e.key === 'Enter') {
      const newItemText = this.refs.newtextinput.value;
      this.refs.newtextinput.value = "";
      this.props.handleEnter(newItemText);
    }
  }

  render() {
    return (
      <div className="new-item">
        <input type="text" id="newitem" placeholder={this.state.newItemText}
          onKeyPress={this.handleEnter} ref="newtextinput"/>
      </div>
    )
  }
}

class Item extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
      itemId: props.itemId,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onClick(this.state.itemId);
  }

  render() {
    return (
      <div className="list-item">
        <div className="list-item-checkbox">
          <Checkbox onClick={() => this.onClick()} />
        </div>
        <div className="list-item-text">
          {this.state.text}
        </div>

      </div>
    )
  }
}

function Checkbox(props) {
  return (
    <button className="checkbox" onClick={props.onClick}/>
  )
}

class Section extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(itemId) {
    this.props.onClick(itemId);
  }

  render() {
    const matches = this.props.list.filter(item => item.section === this.props.name);

    return (
      <div className="section" style={{display: (matches.length > 0 ? 'block' : 'none')}}>
        <h3>{this.props.name}</h3>
        {matches.map(item => <Item text={item.text} onClick={this.handleClick} key={item.itemId}
          itemId={item.itemId} />)}
      </div>

    );
  }

}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      list: [
        {
          itemId: 0,
          name: "Tap the circle to cross me off the list!",
        }
      ],
      sections: [],
      sectionJSON: [],
      matchJSON: [],
      newId:1,
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    fetch('https://api.airtable.com/v0/appjMVyQxNAsRgoTO/section?api_key=keyWJQGOCzHBgXF70')
    .then((resp) => resp.json())
    .then(data => {
      this.setState({sectionJSON: data.records});
    }).catch(err => {
    });

    fetch('https://api.airtable.com/v0/appjMVyQxNAsRgoTO/item?api_key=keyWJQGOCzHBgXF70')
    .then((resp) => resp.json())
    .then(data => {
      this.setState({matchJSON: data.records});
    }).catch(err => {
    });
    this.buildState();

  }

  buildState() {
    let sections = [];
    let sectionJSON = this.state.sectionJSON;
    let matchesJSON = this.state.matchJSON;
    //build section objects
    for (let i = 0; i < sectionJSON.length; i++) {
      sections.push({
        sectionId: i,
        name: sectionJSON[i].fields.name,
        matches: [],
      });

      //add matching items to section objects
      for (let m of matchesJSON) {
          if (m.fields.section === sections[i].name) {
            sections[i].matches.push(m.fields.fname);
        }
      }
    }
    //add section objects to state
    this.setState({sections: sections});
  }

  handleClick(deleteItemId) {
    const newList = this.state.list.filter(item => item.itemId !== deleteItemId);
    this.setState({list: newList});
  }

  handleEnter(inputText) {
      let newList = this.state.list;
      let newSection = this.findSection(inputText);
      console.log(newSection);
      newList.push({
        text: inputText,
        itemId: this.state.newId,
        section: newSection
        });
      this.setState({list: newList});
      this.setState({newId: this.state.newId + 1});
  }

  findSection(itemName) {
    let sectionReturn = "uncategorized";
    for (let section of this.state.sections) {
      for(let match of section.matches) {
        if (itemName.toLowerCase() === match.toLowerCase()) {
          sectionReturn = section.name;
        }
      }
    }
    return sectionReturn;
  }

  render() {
    const sections = this.state.sections;
    return (
      <div className="list">
        {this.state.sections.map(section =>
        <Section name={section.name} key={section.sectionId} list={this.state.list}
          onClick={this.handleClick}/>
      )}
        <NewItem handleEnter={this.handleEnter} />
      </div>
    );
  }
}

class App extends React.Component {


    constructor(props) {
      super(props);
      this.state = {
        test: [],
      };
    }



    render() {
    return (
    <div className="list">
      <h1>Dijikstra's Cart</h1>
      <h3>An Automagic Shopping List</h3>
      <List key="1"/>
    </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
