import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const databaseURL = "https://nextiteverytime-default-rtdb.firebaseio.com";

class Questions extends React.Component{
    constructor(){
        super();
        this.state = {
            questions: {},      // 전체 문제 가져오기
            qList: [],          // 문제를 리스트 타입으로 변경
            userInfo: {},       // 로그인한 유저 localStorage에서 가져옴
            user: {},           // 로그인한 유저
            userId: '',         // member 테이블에서의 userId
            qIndex: 0
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
            if(this.state.userInfo == null){
                if(window.confirm("문제풀이는 로그인 후 가능합니다.")){
                    document.location.href = "/#/Login";
                }else{
                    document.location.href = "/#/Login";
                }
                return;
            }

            let memberList = Object.keys(members);

            for(let i = 0; i < memberList.length; i++){
                if(members[memberList[i]].email == this.state.userInfo.id){
                    this.state.user = members[memberList[i]];
                    this.state.userId = memberList[i];
                }
            }

            this._getQuestion();
        });
    }// .then은 비동기함수이며, 앞단 함수가 실행

    _getQuestion(){
        // fetch 내부 url 에 변수를 넣는 경우 쉬프트 + 물결 에 있는 기호 사용
        fetch(`${databaseURL}/questions.json`).then(res => {
            // firebase url로 (api)에 대한 응답의 상태(response.status)가
            // 200 이면 문제가 있는 상황이고, 아니라면 정상임으로 res.json() 리턴
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json();
        // res.json() 을 리턴한 내용을 클래스 생성자 내에 있는 state 내부 boards에(왼쪽) 반영    
        }).then(questions => {
            let questionList = Object.keys(questions);
            this.shuffle(questionList);

            for(let i = 0; i < questionList.length; i++){
                this.state.qList.push(questions[questionList[i]]);
            }

            this.setState({questions: questions});
        });
    }// .then은 비동기함수이며, 앞단 함수가 실행

    shuffle(array) { array.sort(() => Math.random() - 0.5); }

    _update(member, id){
        return fetch(`${databaseURL}/members/${id}.json`, {
            method: 'PATCH',
            body: JSON.stringify(member)          // 입력한 word가 database에 UPDATE됨
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json;
        }).then(data => {
            this.nextQuestion();
        });
    }

    nextQuestion = () => {
        if(this.state.qIndex+1 < this.state.qList.length){
            this.state.qIndex++;
        }else{
            this.state.qIndex = 0;
        }

        // 랜더링을 강제로 다시한다.
        this.forceUpdate();
    }

    handleUpdate = () => {
        this.state.user["exp"] = this.state.user["exp"] + 1;
        this._update(this.state.user, this.state.userId);
    }    

    // 모든 UI가 불러와진 경우(컴포넌트가 불러와진 경우)에 실행됨
    componentDidMount(){
        const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
        this.state.userInfo = userInfo;
        this._get();    // 함수 실행
    }

    answerOne = () => {
        const correct = this.state.qList[this.state.qIndex].correct;

        if("1" == correct){
            if(window.confirm("정답입니다.")){
                this.handleUpdate();
            }else{
                this.handleUpdate();
            }
        }else{
            if(window.confirm("틀렸습니다. 정답은 " + correct + "번 입니다.")){
                this.nextQuestion();
            }else{
                this.nextQuestion();
            }
        }
    }

    answerTwo = () => {
        const correct = this.state.qList[this.state.qIndex].correct;

        if("2" == correct){
            if(window.confirm("정답입니다.")){
                this.handleUpdate();
            }else{
                this.handleUpdate();
            }
        }else{
            if(window.confirm("틀렸습니다. 정답은 " + correct + "번 입니다.")){
                this.nextQuestion();
            }else{
                this.nextQuestion();
            }
        }
    }

    answerThree = () => {
        const correct = this.state.qList[this.state.qIndex].correct;

        if("3" == correct){
            if(window.confirm("정답입니다.")){
                this.handleUpdate();
            }else{
                this.handleUpdate();
            }
        }else{
            if(window.confirm("틀렸습니다. 정답은 " + correct + "번 입니다.")){
                this.nextQuestion();
            }else{
                this.nextQuestion();
            }
        }
    }

    answerFour = () => {
        const correct = this.state.qList[this.state.qIndex].correct;

        if("4" == correct){
            if(window.confirm("정답입니다.")){
                this.handleUpdate();
            }else{
                this.handleUpdate();
            }
        }else{
            if(window.confirm("틀렸습니다. 정답은 " + correct + "번 입니다.")){
                this.nextQuestion();
            }else{
                this.nextQuestion();
            }
        }
    }

    render(){

        return (
            <div>
                {this.state.qList.length === 0 ? null : 
                <Grid container>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent style={{padding: "40px"}}>
                                <div style={{position: "relative", left: "00%"}}>
                                    <Typography variant="h5">
                                        {this.state.qList[this.state.qIndex].title}
                                    </Typography>
                                    <br/><br/>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Button color="inherit" onClick={this.answerOne}>
                                                <Typography variant="h6">
                                                    ① {this.state.qList[this.state.qIndex]["1"]}
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Button color="inherit" onClick={this.answerTwo}>
                                                <Typography variant="h6">
                                                    ② {this.state.qList[this.state.qIndex]["2"]}
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Button color="inherit" onClick={this.answerThree}>
                                                <Typography variant="h6">
                                                    ③ {this.state.qList[this.state.qIndex]["3"]}
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Button color="inherit" onClick={this.answerFour}>
                                                <Typography variant="h6">
                                                    ④ {this.state.qList[this.state.qIndex]["4"]}
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                }
            </div>
        );
    }
}

export default Questions;