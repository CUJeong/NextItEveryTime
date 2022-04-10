import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const databaseURL = "https://nextiteverytime-default-rtdb.firebaseio.com";

const styles = theme => ({
    cardStyle: {
        marginTop: '20px',
        marginBottom: '20px'
    }
});

class Rank extends React.Component{
    constructor(){
        super();
        this.state = {
            memberList: []
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
            const temp = Object.keys(members);
            let tempList = [];

            for(let i = 0; i < temp.length; i++){
                tempList.push(members[temp[i]]);
            }
            tempList.sort((a,b) => b.exp-a.exp);

            this.state.memberList = tempList;

            // 랜더링을 강제로 다시한다.
            this.forceUpdate();
        });
    }// .then은 비동기함수이며, 앞단 함수가 실행

    // 모든 UI가 불러와진 경우(컴포넌트가 불러와진 경우)에 실행됨
    componentDidMount(){
        this._get();    // 함수 실행
    }

    render(){
        const { classes } = this.props;

        let rank = 0;

        return (
            <div>
                <Card className={classes.cardStyle}>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={3}>
                                <Typography variant="h6">
                                    랭킹
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant="h6">
                                    레벨
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6">
                                    이름
                                </Typography>
                            </Grid>
                        </Grid>

                        <br/>

                        {this.state.memberList.map((item) => {

                            rank++;

                            return(
                                <div id={item.name}>
                                    <Grid container>
                                        <Grid item xs={3}>
                                            <Typography variant="h6">
                                                {rank}.
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="h6">
                                                {item.exp}
                                            </Typography>    
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="h6">
                                                {item.name} [{item.title}]
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withStyles(styles)(Rank);