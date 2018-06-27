import * as React from 'react';
import './App.css';
import CardTableView from './View/CardTableView'

class App extends React.Component {
  public render() {

    return (
      <div className="App">
       
        <p>
          <CardTableView />
        </p>
        
      </div>
    );
  }
}

export default App;
