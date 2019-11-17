import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';




//begin Dijkstra

//dropdown menu
class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
    }

    this.showMenu = this.showMenu.bind(this);
    this.cancel = this.cancel.bind(this);
    this.setSection = this.setSection.bind(this);
  }

  showMenu(event) {
    event.preventDefault();

    this.setState({
      showMenu: true,
    });
  }

  cancel(event) {
    event.preventDefault();

    this.setState({
      showMenu: false,
    });
  }

  setSection(section) {
    console.log("section: " + section);
    this.setState({
      showMenu: false,
    })
    console.log("fire setSection(section) in Menu");
    this.props.onClick(section);
  }

  render() {

    return (
    <div className="menu-container">
    <button className="menu-button" onClick={this.showMenu}>
      !
    </button>
    {
      this.state.showMenu
      ? (
        <div className="menu">
          <h3 className="menu-header">Choose a section:</h3>
          <button className="category-button" onClick={() => this.setSection("produce")}>Produce</button>
          <button className="category-button" onClick={() => this.setSection("condiments")}>Condiments</button>
          <button className="category-button" onClick={() => this.setSection("dry goods")}>Dry Goods</button>
          <button className="category-button" onClick={() => this.setSection("ethnic")}>Ethnic</button>
          <button className="category-button" onClick={() => this.setSection("beverages")}>Beverages</button>
          <button className="category-button" onClick={() => this.setSection("meat")}>Meat</button>
          <button className="category-button" onClick={() => this.setSection("dairy")}>Dairy</button>
          <button className="category-button" onClick={() => this.setSection("frozen")}>Frozen</button>
          <button className="category-button cancel-button" onClick={this.cancel}>Cancel</button>
        </div>
      )
      : (
        null
      )
    }

    </div>
  )
  }
}

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
    this.setSection = this.setSection.bind(this);
  }

  onClick() {
    this.props.onClick(this.state.itemId, "dismiss");
  }

  setSection(section) {
    console.log("fire setSection(itemId, section) in Item");
    console.log("section: " + section);
    this.props.onClick(this.state.itemId, section);
  }

  render() {
    return (
      <div style={{background:this.props.color}} className="list-item" >
        <div className="list-item-checkbox">
          <Checkbox onClick={() => this.onClick()} />
        </div>
        <div className="list-item-text">
          {this.state.text}
        </div>
        {this.props.section === "uncategorized" &&
          <Menu onClick={this.setSection}/>
        }

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

  handleClick(itemId, sectionString) {
    console.log("itemId: " + itemId + " sectionString: " + sectionString);
    this.props.onClick(itemId, sectionString);
  }

  render() {
    const matches = this.props.list.filter(item => item.section === this.props.name);
    return (
      <div className="section" style={{display: (matches.length > 0 ? 'block' : 'none')}}>
        <h3 style={{color: this.props.color}}>{this.props.name}</h3>
        {matches.map(item => <Item text={item.text} onClick={this.handleClick} key={item.itemId}
          color={this.props.color} itemId={item.itemId} section={this.props.name} />)}
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
          text: "Tap the circle to cross me off the list!",
          section: "tutorial"
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
    const that = this;
    fetch('https://api.airtable.com/v0/appjMVyQxNAsRgoTO/section?api_key=keyWJQGOCzHBgXF70')
    .then((resp) => resp.json())
    .then(data => {
      that.setState({sectionJSON: data.records});
      fetch('https://api.airtable.com/v0/appjMVyQxNAsRgoTO/item?api_key=keyWJQGOCzHBgXF70')
      .then((resp) => resp.json())
      .then(data => {
        that.setState({matchJSON: data.records});
        that.buildState();
      }).catch(err => {

      });
    }

    ).catch(err => {
    });

  }

  buildState() {
    let newSections = [];
    let sectionJSON = this.state.sectionJSON;
    let matchesJSON = this.state.matchJSON;
    console.log(this.state.sectionJSON);
    //build section objects
    for (let i = 0; i < sectionJSON.length; i++) {
      newSections.push({
        sectionId: i,
        name: sectionJSON[i].fields.name,
        matches: [],
        color: sectionJSON[i].fields.color,
        order: sectionJSON[i].order,
      });

      //add matching items to section objects
      for (let m of matchesJSON) {
          if (m.fields.section === newSections[i].name) {
            newSections[i].matches.push(m.fields.name);
        }
      }
    }
    //add section objects to state
    this.setState({sections: newSections});
    console.log(this.state);
  }

  handleClick(itemId, sectionString) {
    if (sectionString === "dismiss") {
      const newList = this.state.list.filter(item => item.itemId !== itemId);
      this.setState({list: newList});
    } else {
      let item = this.state.list.filter(i => i.itemId === itemId)[0];
      let sections = this.state.sections;
      sections.filter(s => s.name === sectionString)[0].matches.push(item.text);
      this.setState({sections: sections});

      let list = this.state.list;

      list = list.filter(i => i.itemId !== itemId);
      list.push({
        text: item.text,
        itemId: item.itemId,
        section: sectionString,
      });

      this.setState({list: list});

    }
  }

  handleEnter(inputText) {
      let newList = this.state.list;
      let newSection = this.findSection(inputText);
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
        {sections.sort((a,b) => a.order > b.order).map(section =>
        <Section name={section.name} key={section.sectionId} list={this.state.list}
          color={section.color} onClick={this.handleClick}/>
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
