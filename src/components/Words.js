import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const databaseURL = "https://nextiteverytime-default-rtdb.firebaseio.com"

class Words extends React.Component{
    constructor(){
        super();
        this.state = {
            words: {}
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

    // words의 변경이 있을 경우(다음 상태인 nextState 파라미터 변수가 현재 state 내부 words와 다름) 
    // 리액트가 컴포넌트를 업데이트할 수 있도록 하는 제공함수를 재정의함
    shouldComponentUpdate(nextProps, nextState){
        return nextState.words != this.state.words;
    }

    // 모든 UI가 불러와진 경우(컴포넌트가 불러와진 경우)에 실행됨
    componentDidMount(){
        this._get();    // 함수 실행
    }

    render(){
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
                                    {/* variant 는 영어 대문자를 작게 하는 설정 */}
                                    <Typography variant="h5" component="h2">
                                        {word.word}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                    );
                })}

            </div>
        );
    }
}

export default Words;