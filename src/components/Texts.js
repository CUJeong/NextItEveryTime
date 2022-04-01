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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import TextTruncate from 'react-text-truncate';

const styles = theme => ({
    hidden: {
        display: 'none'
    },
    fab: {
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    }
})

const databaseURL = "https://nextiteverytime-default-rtdb.firebaseio.com";

class Texts extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            fileName: '',       // 텍스트 파일 제목
            fileContent: null,  // 텍스트 파일 내용
            texts: {},      // firebase로부터 받아오는 TextSet
            textName: '',   // 각 text들에 대한 id값
            dialog: false
        }
    }

    _get(){
        // fetch 내부 url 에 변수를 넣는 경우 쉬프트 + 물결 에 있는 기호 사용
        fetch(`${databaseURL}/texts.json`).then(res => {
            // firebase url로 (api)에 대한 응답의 상태(response.status)가
            // 200 이면 문제가 있는 상황이고, 아니라면 정상임으로 res.json() 리턴
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json();
        // res.json() 을 리턴한 내용을 Words 클래스 생성자 내에 있는 state 내부 words에 반영    
        }).then(texts => this.setState({texts: (texts == null) ? {} : texts}));
    }// .then은 비동기함수이며, 앞단 함수가 실행

    _post(text){
        return fetch(`${databaseURL}/texts.json`, {
            method: 'POST',
            body: JSON.stringify(text)          // 입력한 word가 database에 INSERT됨
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json;
        }).then(data => {
            let nextState = this.state.texts;   // 현재 보유중인 필드 객체를 가져온 다음
            nextState[data.name] = text;
            this.setState({texts: nextState});  // 화면을 보여줌
        });
    }

    _delete(id){
        return fetch(`${databaseURL}/texts/${id}.json`, {
            method: 'DELETE'          // 입력한 word가 database에서 DELETE됨
        }).then(res => {
            if(res.status != 200){
                throw new Error(res.statusText);
            }
            return res.json;
        }).then(() => {
            let nextState = this.state.texts;   
            delete nextState[id];
            this.setState({texts: nextState});  // 화면을 보여줌
        })
    }

    componentDidMount(){
        this._get();
    }

    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog,
        fileName: '',
        fileContent: '',
        textName: ''    // 사용자가 이전에 업로드한 텍스트들은 제거되도록 함
    })

    handleValueChange = (e) => {
        // 사용자가 입력한 단어를 화면에 보여주기 위함
        let nextState  = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);       // 현재 필드 객체인 state의 setter라고 보면 됨
    }

    // INSERT 함수(_post)를 실제 실행하는 함수
    handleSubmit = () => {
        const text = {
            textName: this.state.textName,      // 사용자가 입력한게 우선 필드 state에 담기므로 이를 꺼냄
            textContent: this.state.fileContent
        }
        this.handleDialogToggle();      // 다이얼로그 열린건 닫음
        if(!text.textName && !text.textContent){
            return;
        }
        this._post(text);
    }

    // DELETE 함수를 실제 실행하는 함수
    handleDelete = (id) => {
        this._delete(id);
    }

    handleFileChange = (e) => {
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            this.setState({
                fileContent: text
            });
        }
        reader.readAsText(e.target.files[0], "UTF-8");
        this.setState({
            fileName: e.target.value
        })
    }

    render(){
        const {classes} = this.props;
        return (
            <div>
                {Object.keys(this.state.texts).map(id => {
                    const text = this.state.texts[id];
                    return (
                        <Card key={id}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    내용: {text.textContent.substring(0, 24) + "..."}
                                </Typography>
                                {/* container 를 넣어주어야 내부 Grid가 한줄로 위치할 수 있다. */}
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography variant="h5" component="h2">
                                            내용: {text.textContent.substring(0, 24) + "..."}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Link component={RouterLink} to={"detail/" + id}>
                                            <Button variant="contained" color="primary">보기</Button>
                                        </Link>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button variant="contained" color="primary" onClick={() => this.handleDelete(id)}>삭제</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    )
                })}

                <Fab color='primary' className={classes.fab} onClick={this.handleDialogToggle}>
                    <AddIcon/>
                </Fab>

                <Dialog open={this.state.dialog} onClose={this.handleDialogToggle}>
                    <DialogTitle>텍스트 추가</DialogTitle>
                    <DialogContent>
                        <TextField label="텍스트 이름" type="text" name="textName" value={this.state.textName} onChange={this.handleValueChange}/><br/><br/>
                        {/* input태그로 파일을 전송할 거지만 보이지는 않도록 hidden 클래스의 속성을 준다 */}
                        <input className={classes.hidden} accept="text/plain" id="raised-button-file" type="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange}/>
                        {/* input 태그 자리에 별도로 라벨 태그가 보이도록 함 */}
                        <label htmlFor="raised-button-file">
                            <Button variant="contained"  component="span" name="file">
                                {this.state.fileName === "" ? ".txt 파일 선택" : this.state.fileName}
                            </Button>
                        </label>
                        <TextTruncate line={1} truncateText="..." text={this.state.fileContent}/>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>추가</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleDialogToggle}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>

        );
    }
}

export default withStyles(styles)(Texts);