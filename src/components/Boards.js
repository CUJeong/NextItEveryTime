import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {Link as RouterLink} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import { Tooltip } from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';

const styles = theme => ({
    fab: {
        // 둥둥 떠있고
        position: 'fixed',
        // 오른쪽과 아래 여백 20px 씩
        bottom: '20px',
        right: '20px'
    },
    cardStyle: {
        marginTop: '20px',
        marginBottom: '20px'
    }
});

const databaseURL = "https://nextiteverytime-default-rtdb.firebaseio.com";

class Boards extends React.Component{
    constructor(){
        super();
        this.state = {
            boards: {},      // 글 객체
            dialog: false,
            title: '',
            content: '',
            date: '',
            author: '',
            reples: {},
            userInfo: {},
            repleId: '',
            repleField: '',
            repleDate: ''
        };
    }

    _get(){
        // fetch 내부 url 에 변수를 넣는 경우 쉬프트 + 물결 에 있는 기호 사용
        fetch(`${databaseURL}/boards.json`).then(res => {
            // firebase url로 (api)에 대한 응답의 상태(response.status)가
            // 200 이면 문제가 있는 상황이고, 아니라면 정상임으로 res.json() 리턴
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json();
        // res.json() 을 리턴한 내용을 클래스 생성자 내에 있는 state 내부 boards에(왼쪽) 반영    
        }).then(boards => this.setState({boards: boards}));
    }// .then은 비동기함수이며, 앞단 함수가 실행

    _post(board){
        return fetch(`${databaseURL}/boards.json`, {
            method: 'POST',
            body: JSON.stringify(board)          // 입력한 word가 database에 INSERT됨
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json;
        }).then(data => {
            let nextState = this.state.boards;   // 현재 보유중인 필드 객체를 가져온 다음
            nextState[data.name] = board;
            this.setState({boards: nextState});  // 화면을 보여줌
            this._get();    // 바로 firebase에서 데이터 다시 긁어옴
        });
    }

    // id는 태그 자신을 말함
    _delete(id){
        return fetch(`${databaseURL}/boards/${id}.json`, {
            method: 'DELETE'          // 입력한 word가 database에서 DELETE됨
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json;
        }).then(() => {
            let nextState = this.state.boards;   
            delete nextState[id];
            this.setState({boards: nextState});  // 화면을 보여줌
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

        if(this.state.userInfo == null){
            if(window.confirm("글쓰기는 로그인 후 가능합니다.")){
                document.location.href = "/#/Login";
            }else{
                document.location.href = "/#/Login";
            }
        }
    }

    // 글쓰기 INSERT 함수(_post)를 실제 실행하는 함수
    handleSubmit = () => {
        const time = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');
        const timeId = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')
                        .replace("-", "").replace(":", "").replace("-", "").replace(":", "").replace(" ", "");
        const tempReple = {
            repleId: '',
            repleField: '',
            repleDate: ''
        }

        var randStr = '';
        for(var i = 0; i < 6; i++){
            randStr += Math.floor(Math.random()*10);
        }

        var uniqueId = timeId + randStr;

        const tempRepleKing = {};
        tempRepleKing[uniqueId] = tempReple;

        const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));

        const board = {
            title: document.getElementById("idTitle").value,      // 사용자가 입력한게 우선 필드 state에 담기므로 이를 꺼냄
            content: document.getElementById("idContent").value,
            date: time,
            author: userInfo["name"],
            reples: tempRepleKing
        }
        this.handleDialogToggle();      // 다이얼로그 열린건 닫음
        if(!board.title && !board.content){     // 사용자가 입력한 데이터가 정상적으로 작성이 되어 있지 않은 경우 false
            return;
        }
        document.getElementById("idTitle").value = "";
        document.getElementById("idContent").value = "";
        this._post(board);
    }

    // DELETE 함수를 실제 실행하는 함수
    handleDelete = (id) => {
        this._delete(id);
    }

    // 모든 UI가 불러와진 경우(컴포넌트가 불러와진 경우)에 실행됨
    componentDidMount(){
        const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
        this.state.userInfo = userInfo;
        this._get();    // 함수 실행
    }

    render(){
        const { classes } = this.props;
        return (
            <div>
                {/* 맵(Map) 이용하기 */}
                {/* 각각의 요소에 접근하여 처리 가능. Object.keys(jsonObject) 하면 keyList가 나오는데 reverse()를 하면 순서가 거꾸로 됨 */}
                {Object.keys(this.state.boards).reverse().map(id => {
                    // for문 처럼 뱅뱅 돌면서 각각에 대해 처리 가능
                    const board = this.state.boards[id];

                    return(
                        // for문 한번 돌때마다 외각에 key 속성을 넣어주어야 에러가 안난다.
                        <div key={id}>
                            <Card className={classes.cardStyle}>
                                <CardContent>
                                    {/* firebase database 에서 가져옴 */}
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <table style={{display: "inline"}}>
                                                <tbody>
                                                    <tr>
                                                        <td rowSpan="2">
                                                            {/* public 폴더 기준으로 경로 설정 */}
                                                            <img src='/img/profile.jpg' alt='empty.jpg' width="60px" height="60px" style={{borderRadius: "25%"}}/>
                                                        </td>
                                                        <td>
                                                            <Typography variant="h5" component="h2">
                                                                &nbsp;{board.author}
                                                            </Typography>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Typography color="textSecondary" gutterBottom>
                                                                &nbsp; {board.date}
                                                            </Typography>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>



                                        </Grid>
                                    </Grid>

                                    <br/>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography variant="h5">
                                                {board.title}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <br/>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Typography variant="h6">
                                                {board.content}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {/* 답글 달린 갯수가 0이 아니라면 댓글 보기 추가 */}
                                    {Object.keys(board.reples).length === 1 ? null : 
                                        <div>
                                            <br/>
                                            <br/>
                                            <hr color="#CDCDCD" width="99%" size="1"/>
                                            {/* 답글 1개만 표출 */}
                                            <Grid container>
                                                <Grid item xs={12} style={{marginTop: '20px'}}>
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <img src='/img/profile.jpg' alt='empty.jpg' width="40px" height="40px" style={{borderRadius: "25%"}}/>
                                                                </td>
                                                                <td>
                                                                    <Typography variant="body1">
                                                                        &nbsp;{board.reples[Object.keys(board.reples)[1]].repleId}
                                                                    </Typography>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </Grid>
                                            </Grid>
                                            <Grid container>
                                                <Grid item xs={12} style={{marginTop: '10px'}}>
                                                    <Typography>
                                                        {board.reples[Object.keys(board.reples)[1]].repleField}
                                                    </Typography>
                                                </Grid>
                                            </Grid> 

                                            {/* 답글 모두 보기 */}
                                            <Grid container>
                                                <Grid item xs={12} style={{marginTop: '20px'}}>
                                                    <Typography color="textSecondary" gutterBottom>
                                                        <Link component={RouterLink} to={"detail/" + id}>
                                                            <Button variant="text" style={{color: '#999999'}}>댓글 모두 보기</Button>
                                                        </Link>
                                                    </Typography>
                                                </Grid>
                                            </Grid>                                               
                                        </div>
                                    }

                                    {/* 답글 달린 갯수가 0이라면 댓글 달기 */}
                                    {Object.keys(board.reples).length === 1 && 
                                        <div>
                                            {/* 답글 모두 보기 */}
                                            <Grid container>
                                                <Grid item xs={12} style={{marginTop: '20px'}}>
                                                    <Typography color="textSecondary" gutterBottom>
                                                        <Link component={RouterLink} to={"detail/" + id}>
                                                            <Button variant="text" style={{color: '#999999'}}>댓글 달기</Button>
                                                        </Link>
                                                    </Typography>
                                                </Grid>
                                            </Grid>                                               
                                        </div>
                                    }

                                </CardContent>
                            </Card>
                        </div>
                    );
                })}

                <Fab color="primary" className={classes.fab} onClick={this.handleDialogToggle}>
                    <Tooltip title="글쓰기">
                        <AddIcon/>
                    </Tooltip>
                </Fab>

                {/* this.state.dialog가 true일때 open 하고, 닫히면(onClose) handleDialogToggle 함수 실행 */}
                {/* 다이얼로그라 알아서 바깥 영역 클릭시 close 되는데 이때도 this.state의 상태를 반영해주기 위함 */}
                <Dialog open={this.state.dialog} onClose={this.handleDialogToggle}>
                    <DialogTitle>글쓰기</DialogTitle>
                    <DialogContent>
                        <TextField id="idTitle" label="제목" type="text" name="title" onChange={this.handleValueChange}/><br/><br/>
                        <TextField id="idContent" multiline label="내용" type="text" name="content" onChange={this.handleValueChange}/><br/>
                    </DialogContent>
                    <br/>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>등록</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleDialogToggle}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(Boards);