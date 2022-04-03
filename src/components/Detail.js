import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import Link from '@material-ui/core/Link';
import {Link as RouterLink} from 'react-router-dom';
import Delete from '@material-ui/icons/Delete';
import { Tooltip } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';

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

class Detail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            boards: {},      // 글 객체
            title: '',
            content: '',
            date: '',
            author: '',
            reples: {},
            userInfo: {},
            repleId: '',
            repleField: '',
            repleDate: '',
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

    _update(board, id){
        return fetch(`${databaseURL}/boards/${id}.json`, {
            method: 'PATCH',
            body: JSON.stringify(board)          // 입력한 word가 database에 UPDATE됨
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json;
        }).then(data => {
            let nextState = this.state.boards;   // 현재 보유중인 필드 객체를 가져온 다음
            nextState[data.name] = board;
            this.setState({boards: nextState});  // 화면을 보여줌
        });
    }

    handleReple = () => {
        const boardAll = this.state.boards;
        // 주소창에 있는 board의 id값 가져옴
        const {params} = this.props.match;
        const id = params.boardId;

        const board = boardAll[id];

        const time = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');
        const timeId = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '')
                            .replace("-", "").replace(":", "").replace("-", "").replace(":", "").replace(" ", "");

        const reple = {
            repleId: this.state.userInfo.name,
            repleField: document.getElementById("idRepleField").value,
            repleDate: time
        }

        var randStr = '';
        for(var i = 0; i < 6; i++){
            randStr += Math.floor(Math.random()*10);
        }

        var uniqueId = timeId + randStr;

        board["reples"][uniqueId] = reple;

        if(!reple.repleField){     // 사용자가 입력한 데이터가 정상적으로 작성이 되어 있지 않은 경우 false
            return;
        }
        document.getElementById("idRepleField").value = "";
        this._update(board, id);
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
            alert("글이 삭제되었습니다.");
            document.location.href = "/";
        })
    }

    // DELETE 함수를 실제 실행하는 함수
    handleDelete = (id) => {
        if(confirm("정말로 삭제하시겠습니까?")){
            this._delete(id);
        }
    }

    handleValueChange = (e) => {
        // 사용자가 입력한 단어를 화면에 보여주기 위함
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);       // 현재 필드 객체인 state의 setter라고 보면 됨

        if(this.state.userInfo == null){
            if(window.confirm("답글 달기는 로그인 후 가능합니다.")){
                document.location.href = "/#/Login";
            }else{
                document.location.href = "/#/Login";
            }
        }
    }

    // 모든 UI가 불러와진 경우(컴포넌트가 불러와진 경우)에 실행됨
    componentDidMount(){
        const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
        console.log(userInfo);
        this.state.userInfo = userInfo;
        {/* 현재 주소에서 / 뒤의 파라미터 가져오는 기능 */}
        this._get(this.props.match.params.textId);    // 함수 실행
    }

    render(){
        const { classes } = this.props;
        const boardAll = this.state.boards;
        // 주소창에 있는 board의 id값 가져옴
        const {params} = this.props.match;
        const id = params.boardId;

        // 모든 board 데이터 중 상세페이지에 있는 boardId와 일치하는 하나의 board 데이터
        const board = boardAll[id];

        if(board == undefined){
            return(<div></div>);
        }

        return (
                <div>
                    <Card>
                        <CardContent>
                            <Grid container>
                                <table>
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

                            <br/>

                            {Object.keys(board.reples).length === 1 ? null : 
                                Object.keys(board.reples).reverse().map(idReple => {

                                const reple = board.reples[idReple];

                                if(reple.repleId == ""){
                                    return(<div key={idReple}></div>);
                                }

                                return(
                                    <div key={idReple}>
                                        <br/>
                                        <hr color="#CDCDCD" width="99%" size="1" style={{marginTop: '20px'}}/>
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
                                                                    &nbsp;{reple.repleId}
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
                                                    {reple.repleField}
                                                </Typography>
                                            </Grid>
                                        </Grid> 
                                        <Grid container>
                                            <Grid item xs={12} style={{marginTop: '10px'}}>
                                                <Typography color="textSecondary">
                                                    {reple.repleDate}
                                                </Typography>
                                            </Grid>
                                        </Grid> 
                                    </div>
                                )
                            })}

                            {/* 댓글 입력창 */}
                            <Grid container>
                                <Grid item xs={9} style={{marginTop: '30px', paddingRight: '10px'}}>
                                    <TextField id="idRepleField" variant="outlined" size="small" type="text"
                                        fullWidth onChange={this.handleValueChange}/>
                                </Grid>
                                <Grid item xs={3} style={{marginTop: '30px'}}>
                                    <Button variant="outlined" color="primary" onClick={this.handleReple}>
                                        <SendIcon color='primary'/>
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    
                    {this.state.userInfo === null ? null :
                        this.state.userInfo["name"] === board.author &&
                        <Fab className={classes.fab} onClick={() => this.handleDelete(id)} style={{backgroundColor:"#FF3232", color: "#EEEEEE"}}>
                            <Tooltip title="삭제">
                                <Delete/>
                            </Tooltip>
                        </Fab>
                    }                
                </div>
        );
    }
}

export default withStyles(styles)(Detail);