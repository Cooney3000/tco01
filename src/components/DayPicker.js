import React, { Component } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import {getDateArray} from "./functions";
import Config from './Defaults';


// Das ist das Array mit den Tagen
let list = [];

// One item component
// selected prop will be passed
const MenuItem = ({ text, selected }) => {
  return (
    <div className={`dateBtn ${selected ? 'aktiv' : ''}`}>
      {text}
    </div>
  );
};

// All items component
// Important! add unique key
export const Menu = (list) => list.map(el => {
  const { name, text } = el;

  return (
    <MenuItem
      text={text}
      key={name}
    />
  );
});

const Arrow = ({ text, className }) => {
  return (
    <div
      // className={className}
      className="dateBtn arrowPicker"
    >{text}</div>
  );
};

const ArrowLeft = Arrow({ text: '<', className: 'arrow-prev' });
const ArrowRight = Arrow({ text: '>', className: 'arrow-next' });

class DayPicker extends Component {
  state = {
    selected: 0
  };

  componentWillMount() {
    const {startswith, day} = this.props;
    let end = new Date(day);
    end.setDate(end.getDate() + Config.maxDaypickerDays);
    list = getDateArray(startswith, end);
    this.setState({selected: day});
  }

  onSelect = key => {
    this.setState({ selected: key }, () => this.props.onClickHandler(key));
  }
  render() {
    const { selected } = this.state;
    // Create menu from items
    const menu = Menu(list, selected);

    return (
      <div className="App">
        <ScrollMenu
          data={menu}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          selected={selected}
          onSelect={this.onSelect}
        />
      </div>
    );
  }

}

export default DayPicker;
  