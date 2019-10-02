import React from 'react';

export class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfClicks: 0
    };
  }

  render() {
    const numberOfClicks = this.state.numberOfClicks;
    return (
      <div>
        <button onClick={() => { 
          alert(`${this.props.text}, number of clicks: ${numberOfClicks}`); 
          this.setState({ numberOfClicks: numberOfClicks + 1 });
          }}>Click me!</button>
      </div>
    );
  }
}
export class App extends React.Component {
  render() {
    return (
      <div>
        <header>
          My First React App
      </header>
        <MyComponent text={'Button click text'} />
      </div>
    );
  }
}
