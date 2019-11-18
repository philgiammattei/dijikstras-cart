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
    this.handleUpClick = this.handleUpClick.bind(this);
    this.handleDownClick = this.handleDownClick.bind(this);

  }

  handleUpClick() {
    this.props.onClick(this.props.sectionId, "button-up");
  }

  handleDownClick() {
    this.props.onClick(this.props.sectionId, "button-down");
  }

  handleClick(itemId, sectionString) {
    this.props.onClick(itemId, sectionString);
  }

  render() {
    const matches = this.props.list.filter(item => item.section === this.props.name);
    return (
      <div className="section" style={{display: (matches.length > 0 ? 'block' : 'none')}}>
        <div className="section-header">
          <h3 style={{color: this.props.color}}>{this.props.name}</h3>
          <div className="section-buttons">
            <button onClick={this.handleUpClick} className="section-arrow" style={{color: this.props.color}}>&#9650;</button>
            <button onClick={this.handleDownClick} className="section-arrow" style={{color: this.props.color}}>&#9660;</button>
          </div>

        </div>
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
          text: "Tap the circle to cross items (like this one!) off the list.",
          section: "tutorial"
        },
        {
          itemId: 1,
          text: "Tap ! on uncategorized items to set their section. I'll remember your selection.",
          section: "tutorial"
        },
        {
          itemId: 2,
          text: "Reorder sections with the arrow buttons.",
          section: "tutorial"
        },
        {
          itemId: 4,
          text: "Bacon",
          section: "meat"
        },
        {
          itemId: 5,
          text: "Lettuce",
          section: "produce"
        },
        {
          itemId: 6,
          text: "Tomato",
          section: "produce"
        },
      ],
      sections: [],
      sectionJSON: [],
      matchJSON: [],
      newId:7,
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    //call 2 airtable tables, write JSON to local state.
    //each method call is nested because otherwise state change does not persist(?)
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
      const sec = sectionJSON.filter(a => a.fields.order === i)[0];
      newSections.push({
        sectionId: sec.fields.sectionId,
        name: sec.fields.name,
        matches: [],
        color: sec.fields.color,
        order: sec.fields.order,
      });

      //add matching items to section objects
      for (let m of matchesJSON) {
          if (m.fields.section === newSections[i].name) {
            newSections[i].matches.push(m.fields.name);
        }
      }
    }
    newSections.sort((a,b) => a.order < b.order);
    console.log(newSections);
    //add section objects to state
    this.setState({sections: newSections});
    console.log(this.state);
  }

  handleClick(id, sectionString) {
    //handle string arg - "dismiss" removes item from list
    if (sectionString === "dismiss") {
      const newList = this.state.list.filter(item => item.itemId !== id);
      this.setState({list: newList});
    } else if (sectionString === "button-up") {
      //section reordering - check for limits and switch places with immediate visible neighbor
      let newSections = this.state.sections;
      let visibleSections = this.getVisibleSections(newSections);
      let visibleIndex  = visibleSections.map(i => i.sectionId).indexOf(id);
      if (visibleIndex > 0) {
        let neighborId = visibleSections[visibleIndex - 1].sectionId;
        let thisOrder = newSections.filter(i => i.sectionId === id)[0].order;
        let neighborOrder = newSections.filter(i => i.sectionId === neighborId)[0].order;
        let thisIndex = newSections.map(i => i.sectionId).indexOf(id);
        let neighborIndex = newSections.map(i => i.sectionId).indexOf(neighborId);
        //switch orders of visible neighbors, rerender
        newSections[thisIndex].order = neighborOrder;
        newSections[neighborIndex].order = thisOrder;
        newSections.sort((a,b) => (a.order < b.order) ? -1 : 1);
        this.setState({sections: newSections});
      }
    } else if (sectionString === "button-down") {
      //section reordering - check for limits and switch places with immediate visible neighbor
      let newSections = this.state.sections;
      let visibleSections = this.getVisibleSections(newSections);
      let visibleIndex  = visibleSections.map(i => i.sectionId).indexOf(id);
      if (visibleIndex < visibleSections.length - 1) {
        let neighborId = visibleSections[visibleIndex + 1].sectionId;

        let thisOrder = newSections.filter(i => i.sectionId === id)[0].order;
        let neighborOrder = newSections.filter(i => i.sectionId === neighborId)[0].order;

        let thisIndex = newSections.map(i => i.sectionId).indexOf(id);
        let neighborIndex = newSections.map(i => i.sectionId).indexOf(neighborId);

        //switch orders of visible neighbors, rerender
        newSections[thisIndex].order = neighborOrder;
        newSections[neighborIndex].order = thisOrder;
        newSections.sort((a,b) => (a.order < b.order) ? -1 : 1);
        this.setState({sections: newSections});
      }
    } else {
    //otherwise string arg is to set section for item
    //to render properly, remove item from list, add identical element with correct section
      let item = this.state.list.filter(i => i.itemId === id)[0];
      let sections = this.state.sections;
      sections.filter(s => s.name === sectionString)[0].matches.push(item.text);
      this.setState({sections: sections});

      let list = this.state.list;

      list = list.filter(i => i.text !== item.text);
      list.push({
        text: item.text,
        itemId: item.itemId,
        section: sectionString,
      });

      this.setState({list: list});
      //update airtable with new section mapping
      var Airtable = require('airtable');
      var base = new Airtable({apiKey: 'keyWJQGOCzHBgXF70'}).base('appjMVyQxNAsRgoTO');

      base('item').create([
      {
        "fields": {
        "name": item.text,
        "section": sectionString,
      }
    }
  ], function(err, records) {
    if (err) {
      console.error(err);
      return;
    }
    records.forEach(function (record) {
      console.log(record.getId());
  });
});
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

  getVisibleSections(sections) {
    let visible = [];
    let items = this.state.list;

    for (let item of items) {
      visible.push(sections.filter(i => i.name === item.section)[0]);
    }
    visible.sort((a,b) => (a.order < b.order) ? -1 : 1);
    return visible;
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
        {sections.sort((a,b) => (a.order < b.order) ? -1 : 1).map(section =>
        <Section name={section.name} key={section.sectionId} list={this.state.list}
          color={section.color} onClick={this.handleClick} sectionId={section.sectionId}/>
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
      <h1>Dijkstra's Cart</h1>
      <h3>An Automagic Shopping List</h3>
      <List key="1"/>
      <footer><p>From <a href="https://giammattei.co">Phil Giammattei</a>, 2019</p></footer>
    </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
