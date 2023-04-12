import React from 'react';
import './App.scss';
import Landing from "./Landing";
interface IApp {
}
const App: React.FC<IApp> = () => {
    return (
        <div className="App">
            <Landing/>
        </div>
    );
}
export default App;