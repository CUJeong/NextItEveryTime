import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {Link as RouterLink} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const databaseURL = "https://nextiteverytime-default-rtdb.firebaseio.com";

class Login extends React.Component{
    constructor(){
        super();
        this.state = {
            members: {},
            dialog: false,
            email: '',
            name: '',
            password: ''
        };
    }

    _get(){
        // fetch 내부 url 에 변수를 넣는 경우 쉬프트 + 물결 에 있는 기호 사용
        fetch(`${databaseURL}/members.json`).then(res => {
            // firebase url로 (api)에 대한 응답의 상태(response.status)가
            // 200 이면 문제가 있는 상황이고, 아니라면 정상임으로 res.json() 리턴
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json();
        // res.json() 을 리턴한 내용을 클래스 생성자 내에 있는 state 내부 boards에(왼쪽) 반영    
        }).then(members => {
                this.setState({members: members});
                this.loginCheck();
            }    
        );
    }// .then은 비동기함수이며, 앞단 함수가 실행

    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog
    })

    handleLogin = () => {
        this._get();
    }

    loginCheck = () => {
        const memberList = Object.keys(this.state.members);

        const email = document.getElementById("idEmail").value;
        const password = document.getElementById("idPassword").value;

        for(var i = 0; i < memberList.length; i++){
            const member = this.state.members[memberList[i]];
            if(member.email == email){
                if(member.password == password){
                    var temp = {};
                    temp.id = member.email;
                    temp.name = member.name;
                    window.localStorage.setItem("userInfo", JSON.stringify(temp));
                    document.location.href = "/";
                    return;
                }
            }
        }
        alert("회원정보가 일치하지 않습니다.");
    }

    render(){
        return (
            <div>
                <Grid container>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent style={{padding: "40px"}}>
                                <div style={{position: "relative", left: "0%"}}>
                                    <Typography variant="h5" component="h2">
                                        NextIt 에브리타임
                                    </Typography>
                                    <br/><br/>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <TextField fullWidth id="idEmail" label="아이디" placeholder='구글 이메일 입력' 
                                                                    type="text" name="email" onChange={this.handleValueChange} tabIndex="1"/><br/><br/>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                                <td rowSpan={1}>
                                                    <Button variant="contained" color="primary" style={{top: "10px", left: "25%", height: "50px"}} 
                                                        onClick={this.handleLogin} tabIndex="3">
                                                        로그인
                                                    </Button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <TextField fullWidth id="idPassword" label="비밀번호" type="password" name="name" 
                                                                onChange={this.handleValueChange} tabIndex="2"/><br/><br/>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>            
                                    
                                    <br/><br/>
                                    
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <Link component="button" onClick={this.handleDialogToggle} style={{left: "25%"}} >
                                                                <Typography size='small' color='textSecondary'>아이디/비밀번호 찾기</Typography>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Typography color='textSecondary' size='small'>계정이 존재하지 않는다면</Typography>
                                                        </td>
                                                        <td>
                                                            <Link component={RouterLink} to="/Regist">
                                                                <Typography size='middle'>&nbsp;&nbsp;회원가입</Typography>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Grid> 
                                    </Grid>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>


                <Dialog open={this.state.dialog} onClose={this.handleDialogToggle} style={{padding: "40px"}}>
                    <DialogTitle style={{marginTop: "20px", marginLeft: "20px", marginRight: "20px"}}>미구현 항목입니다.</DialogTitle>
                    <DialogContent style={{margin: "20px"}}>
                        <TextField id="idTitle" label="이메일" type="text" name="title"/><br/><br/>
                    </DialogContent>
                    <br/>
                    <DialogActions style={{marginBottom: "20px", marginLeft: "20px", marginRight: "20px"}}>
                        <Button variant="outlined" color="primary" onClick={this.handleDialogToggle}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default Login;