import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import AppShell from './AppShell';
import Texts from './Texts';
import Words from './Words';
import Boards from './Boards';
import Detail from './Detail';
import Login from './Login';
import Regist from './Regist';
import Questions from './Questions';
import Rank from './Rank';
import Info from './Info';

class App extends React.Component{
    render(){
        return (
            <Router>
                <AppShell>
                    {/* App 단에서 AppShell에 자식 컨텐츠를 넣은 이후 AppShell에서 이를 적용하도록 함 */}
                    <div>
                        <Route exact path="/" component={Boards}/>
                        <Route exact path="/texts" component={Texts}/>
                        <Route exact path="/words" component={Words}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/Regist" component={Regist}/>
                        <Route exact path="/Questions" component={Questions}/>
                        <Route exact path="/Rank" component={Rank}/>
                        <Route exact path="/Info" component={Info}/>
                        {/* <Route exact path="/detail/:textId" component={Detail}/> */}
                        <Route exact path="/detail/:boardId" component={Detail}/>
                    </div>
                </AppShell>
            </Router>
        );
    };
}

export default App;