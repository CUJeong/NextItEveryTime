import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    fab: {
        // 둥둥 떠있고
        position: 'fixed',
        // 오른쪽과 아래 여백 20px 씩
        bottom: '20px',
        right: '20px'
    }
});

const databaseURL = "https://nextiteverytime-default-rtdb.firebaseio.com";

class Words extends React.Component{
    constructor(){
        super();
        this.state = {
            words: {},
            dialog: false,
            word: '',
            weight: ''
        };
    }

    _get(){
        // fetch 내부 url 에 변수를 넣는 경우 쉬프트 + 물결 에 있는 기호 사용
        fetch(`${databaseURL}/words.json`).then(res => {
            // firebase url로 (api)에 대한 응답의 상태(response.status)가
            // 200 이면 문제가 있는 상황이고, 아니라면 정상임으로 res.json() 리턴
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json();
        // res.json() 을 리턴한 내용을 Words 클래스 생성자 내에 있는 state 내부 words에 반영    
        }).then(words => this.setState({words: words}));
    }// .then은 비동기함수이며, 앞단 함수가 실행

    _post(word){
        return fetch(`${databaseURL}/words.json`, {
            method: 'POST',
            body: JSON.stringify(word)          // 입력한 word가 database에 INSERT됨
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json;
        }).then(data => {
            let nextState = this.state.words;   // 현재 보유중인 필드 객체를 가져온 다음
            nextState[data.name] = word;
            this.setState({words: nextState});  // 화면을 보여줌
        });
    }

    // id는 태그 자신을 말함
    _delete(id){
        return fetch(`${databaseURL}/words/${id}.json`, {
            method: 'DELETE'          // 입력한 word가 database에서 DELETE됨
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json;
        }).then(() => {
            let nextState = this.state.words;   
            delete nextState[id];
            this.setState({words: nextState});  // 화면을 보여줌
        })
    }

    // words의 변경이 있을 경우(다음 상태인 nextState 파라미터 변수가 현재 state 내부 words와 다름) 
    // 리액트가 컴포넌트를 업데이트할 수 있도록 하는 제공함수를 재정의함
    // shouldComponentUpdate(nextProps, nextState){
    //     return nextState.words != this.state.words;      // CRUD 를 직접 구현했으므로 의미가 없어짐
    // }

    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog
    })

    handleValueChange = (e) => {
        // 사용자가 입력한 단어를 화면에 보여주기 위함
        let nextState  = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);       // 현재 필드 객체인 state의 setter라고 보면 됨
    }

    // INSERT 함수(_post)를 실제 실행하는 함수
    handleSubmit = () => {
        const word = {
            word: this.state.word,      // 사용자가 입력한게 우선 필드 state에 담기므로 이를 꺼냄
            weight: this.state.weight
        }
        this.handleDialogToggle();      // 다이얼로그 열린건 닫음
        if(!word.word && !word.weight){     // 사용자가 입력한 데이터가 정상적으로 작성이 되어 있지 않은 경우 false
            return;
        }
        this._post(word);
    }

    // DELETE 함수를 실제 실행하는 함수
    handleDelete = (id) => {
        this._delete(id);
    }

    // 모든 UI가 불러와진 경우(컴포넌트가 불러와진 경우)에 실행됨
    componentDidMount(){
        this._get();    // 함수 실행
    }

    render(){
        const { classes } = this.props;
        console.log("랜더링 시작");
        console.log(this.state.words);

        return (
            <div>
                {/* 맵(Map) 이용하기 */}
                {/* 각각의 요소에 접근하여 처리 가능 */}
                {Object.keys(this.state.words).map(id => {
                    // for문 처럼 뱅뱅 돌면서 각각에 대해 처리 가능
                    const word = this.state.words[id];
                    return(
                        // for문 한번 돌때마다 외각에 key 속성을 넣어주어야 에러가 안난다.
                        <div key={id}>
                            <Card>
                                <CardContent>
                                    {/* firebase database 에서 가져옴 */}
                                    <Typography color="textSecondary" gutterBottom>
                                        가중치: {word.weight}
                                    </Typography>
                                    <Grid container>
                                        <Grid item xs={6}>
                                            {/* variant 는 영어 대문자를 작게 하는 설정 */}
                                            <Typography variant="h5" component="h2">
                                                {word.word}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button variant="contained" color="primary" onClick={() => this.handleDelete(id)}>삭제</Button>
                                        </Grid>
                                    </Grid>

                                </CardContent>
                            </Card>
                        </div>
                    );
                })}

                <Fab color="primary" className={classes.fab} onClick={this.handleDialogToggle}>
                    <AddIcon/>
                </Fab>

                {/* this.state.dialog가 true일때 open 하고, 닫히면(onClose) handleDialogToggle 함수 실행 */}
                {/* 다이얼로그라 알아서 바깥 영역 클릭시 close 되는데 이때도 this.state의 상태를 반영해주기 위함 */}
                <Dialog open={this.state.dialog} onClose={this.handleDialogToggle}>
                    <DialogTitle>단어 추가</DialogTitle>
                    <DialogContent>
                        <TextField label="단어" type="text" name="word" value={this.state.word} onChange={this.handleValueChange}/><br/><br/>
                        <TextField label="가중치" type="text" name="weight" value={this.state.weight} onChange={this.handleValueChange}/><br/>
                    </DialogContent>
                    <br/>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>추가</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleDialogToggle}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(Words);