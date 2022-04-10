import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const databaseURL = "https://nextiteverytime-default-rtdb.firebaseio.com";

class Info extends React.Component{
    constructor(){
        super();
        this.state = {
            userInfo: {},       // 로그인한 유저 localStorage에서 가져옴
            user: {},           // 로그인한 유저
            userId: '',         // member 테이블에서의 userId
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



            this.forceUpdate();
        });
    }// .then은 비동기함수이며, 앞단 함수가 실행


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
        });
    }

    handleUpdate = () => {
        const itemList = document.querySelectorAll("option");

        for(let i = 0; i < itemList.length; i++){
            if(itemList[i].selected){
                this.state.user["title"] = itemList[i].value;
                this._update(this.state.user, this.state.userId);

                if(window.confirm("회원정보가 수정되었습니다.")){
                    document.location.href = "/#/";
                }else{
                    document.location.href = "/#/";
                }
            }
        }
        
    }    

    // 모든 UI가 불러와진 경우(컴포넌트가 불러와진 경우)에 실행됨
    componentDidMount(){
        const userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
        this.state.userInfo = userInfo;
        this._get();    // 함수 실행
    }


    render(){

        let titleList = [];

        if(this.state.user != {}){
            const exp = this.state.user.exp;

            if(this.state.user.email == "akow283@gmail.com"){
                titleList.push("강사");
            }

            if(this.state.user.email == "bownowbownow35@gmail.com"){
                titleList.push("골D로져");
            }

            if(exp > 100){
                titleList.push("고급 개발자");
            }

            if(exp > 50){
                titleList.push("중급 개발자");
            }

            if(exp > 10){
                titleList.push("초급 개발자");
            }

            titleList.push("신입 개발자");
        }


        return (
            <div>
                {this.state.user === {} ? null : 
                <Grid container>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent style={{padding: "40px"}}>
                                <div style={{position: "relative", left: "00%"}}>
                                    <Typography variant="h5" component="h2">
                                        {this.state.user.name} 님 정보
                                    </Typography>
                                    <br/><br/>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style={{width:"100px"}}>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography variant="h6" component="h2">
                                                                이메일
                                                            </Typography>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                                <td>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography variant="h6" component="h2">
                                                                {this.state.user.email}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography variant="h6" component="h2">
                                                                닉네임
                                                            </Typography>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                                <td>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography variant="h6" component="h2">
                                                                {this.state.user.name}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Typography variant="h6" component="h2">
                                                                칭호
                                                            </Typography>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                                <td>
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                                <select style={{width:"200px", height:"30px"}}>

                                                                    {titleList.map((item) => {

                                                                        if(item == this.state.user.title){
                                                                            return(
                                                                                <option value={item} selected>{item}</option>
                                                                            )
                                                                        }else{
                                                                            return(
                                                                                <option value={item}>{item}</option>
                                                                            )
                                                                        }
                                                                        
                                                                    })}
                                                                </select>
                                                        </Grid>
                                                    </Grid> 
                                                </td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>            
                                    
                                    <br/>

                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Button variant="contained" color="primary"  style={{width: "300px", marginBottom: "10px"}}
                                                onClick={this.handleUpdate}>
                                                정보수정
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

export default Info;