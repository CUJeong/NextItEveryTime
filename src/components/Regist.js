import React from 'react';
import Link from '@material-ui/core/Link';
import {Link as RouterLink} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { ExitToApp } from '@material-ui/icons';


const databaseURL = "https://nextiteverytime-default-rtdb.firebaseio.com";

const responseGoogle = (response) => {
    console.log(response);
}

class Login extends React.Component{
    constructor(){
        super();
        this.state = {
            members: {},
            emails: {},
            dialog: false,
            emailCheck: false,
            dupleCheck: false,
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
                this.dupleCheck();
            }    
        );
    }// .then은 비동기함수이며, 앞단 함수가 실행

    _getEmail(){
        // fetch 내부 url 에 변수를 넣는 경우 쉬프트 + 물결 에 있는 기호 사용
        fetch(`${databaseURL}/emails.json`).then(res => {
            // firebase url로 (api)에 대한 응답의 상태(response.status)가
            // 200 이면 문제가 있는 상황이고, 아니라면 정상임으로 res.json() 리턴
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json();
        // res.json() 을 리턴한 내용을 클래스 생성자 내에 있는 state 내부 boards에(왼쪽) 반영    
        }).then(emails => {
                this.setState({emails: emails});
                this.emailCheck();
            }    
        );
    }// .then은 비동기함수이며, 앞단 함수가 실행


    dupleCheck = () => {
        const memberList = Object.keys(this.state.members);
        const name = document.getElementById("idName").value;

        for(var i = 0; i < memberList.length; i++){
            const member = this.state.members[memberList[i]];
            if(member.name == name){
                alert("존재하는 닉네임입니다.");
                return;
            }
        }

        alert("사용 가능한 닉네임입니다.");
        this.state.dupleCheck = true;
    }    

    emailCheck = () => {
        const emailList = Object.keys(this.state.emails);
        const email = document.getElementById("idEmail").value;

        for(var i = 0; i < emailList.length; i++){
            const v_emails = this.state.emails[emailList[i]];
            if(v_emails.email == email){
                alert("인증 되었습니다.");
                this.state.emailCheck = true;
                return;
            }
        }
        alert("허가되지 않은 이메일입니다. 찬웅쌤에게 문의해주세요.");
    } 

    handleGetMember = () => {
        this._get();
    }

    handleGetEmail = () => {
        this._getEmail();
    }

    _post(member){
        return fetch(`${databaseURL}/members.json`, {
            method: 'POST',
            body: JSON.stringify(member)          // 입력한 word가 database에 INSERT됨
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json;
        }).then(data => {
            let nextState = this.state.members;   // 현재 보유중인 필드 객체를 가져온 다음
            nextState[data.name] = member;
            this.setState({members: nextState});  // 화면을 보여줌
            alert("회원가입이 완료되었습니다. 로그인 후 이용해주세요.");
            document.location.href = "/#/Login";
        });
    }

    // INSERT 함수(_post)를 실제 실행하는 함수
    handleSubmit = () => {
        const v_email = document.getElementById("idEmail").value;
        const v_namename = document.getElementById("idName").value;
        const v_password = document.getElementById("idPassword").value;
        const v_repassword = document.getElementById("idRePassword").value;

        // TODO 정규표현식 싹다 적용

        if(v_email=="" || v_namename=="" || v_password=="" || v_repassword==""){     // 사용자가 입력한 데이터가 정상적으로 작성이 되어 있지 않은 경우 false
            alert("아이디, 닉네임, 비밀번호 중 입력하지 않은 항목이 있습니다.");
            return;
        }

        if(!this.state.emailCheck){
            alert("이메일 인증을 진행해주세요.");
            return;
        }

        if(!this.state.dupleCheck){
            alert("닉네임 중복 체크를 진행해주세요.");
            return;
        }

        if(v_password != v_repassword){
            alert("처음 입력한 비밀번호와 재입력한 비밀번호가 서로 다릅니다.");
            return;
        }

        const member = {
            email: document.getElementById("idEmail").value,      // 사용자가 입력한게 우선 필드 state에 담기므로 이를 꺼냄
            name: document.getElementById("idName").value,
            password: document.getElementById("idPassword").value
        }

        if(!member.email && !member.name && !member.password){     // 사용자가 입력한 데이터가 정상적으로 작성이 되어 있지 않은 경우 false
            alert("데이터가 정상적으로 반영되지 않았습니다.");
            return;
        }

        this._post(member);
    }

    handleNameChange = (e) => {
        this.state.dupleCheck = false;
    }

    handleEmailChange = (e) => {
        this.state.emailCheck = false;
    }

    render(){
        return (
            <div>
                <Grid container>
                <Grid item xs={12}>
                        <Card>
                            <CardContent style={{padding: "40px"}}>
                                <div style={{position: "relative", left: "00%"}}>
                                    <Typography variant="h5" component="h2">
                                        NextIt 에브리타임 회원가입
                                    </Typography>
                                    <br/><br/>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <TextField fullWidth id="idEmail" label="아이디" placeholder='구글 이메일 입력' 
                                                                    type="text" name="email" tabIndex="1" onChange={this.handleEmailChange}/><br/><br/>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                                <td>
                                                    <Button variant="contained" color="default" style={{left: "25%"}} 
                                                        onClick={this.handleGetEmail} tabIndex="2">
                                                        이메일 인증
                                                    </Button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <TextField fullWidth id="idName" label="닉네임" type="text" name="name" 
                                                                tabIndex="3" onChange={this.handleNameChange}/><br/><br/>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                                <td>
                                                    <Button variant="contained" color="default" style={{left: "25%"}} 
                                                        tabIndex="4" onClick={this.handleGetMember}>
                                                        중복체크
                                                    </Button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <TextField fullWidth id="idPassword" label="비밀번호" type="password" name="name" 
                                                                tabIndex="5"/><br/><br/>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                                <td>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <TextField fullWidth id="idRePassword" label="비밀번호 재입력" type="password" name="name" 
                                                                tabIndex="6"/><br/><br/>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                                <td>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>            
                                    
                                    <br/>

                                    <Grid container>
                                        <Grid item xs={12}>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td colSpan={2}>
                                                            <Button variant="contained" color="primary"  style={{width: "300px", marginBottom: "10px"}}
                                                                onClick={this.handleSubmit} tabIndex="7" endIcon={<ExitToApp/>}>
                                                                회원가입
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <Typography color='textSecondary' size='small'>이미 계정이 존재한다면</Typography>
                                                        </td>
                                                        <td>
                                                            <Link component={RouterLink} to="/Login">
                                                                <Typography size='middle'>로그인</Typography>
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

            </div>
        );
    }
}

export default Login;