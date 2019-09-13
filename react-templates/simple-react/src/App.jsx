import React from 'react';
export class MyComponent extends React.Component {
  render() {
    return (
      <div>
        <button onClick={() => { alert('button clicked!'); }}>Click me!</button>
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
        <MyComponent />
      </div>
    );
  }
}
