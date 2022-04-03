import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link as RouterLink} from 'react-router-dom';
// 위 아래 Link 라이브러리 이름이 중복되므로 위의 Link 라이브러리의 이름을 변경해서 사용 
import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';

const styles = {
    root: {
        flexGrow: 1,
    },
    menuButton: {
        // 이렇게 하면 좌측 정렬 됨
        marginRight: 'auto'
    }
}

// 상단 네비게이션 바
class AppShell extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {
            toggle: false
        };
    }

    handleDrawerToggle = () => this.setState({
        toggle: !this.state.toggle
    })

    logout = () => {
        window.localStorage.removeItem("userInfo");
        location.reload();
    }

    render(){
        // 아래 export 의 withStyles 파라미터인 style의 요소가 classes에 담겨 사용 가능하다.
        const { classes } = this.props;
        const member = JSON.parse(window.localStorage.getItem("userInfo"));

        return(
            // 하나의 큰 div 안에 여러 내용 작성해야 하는 구조
            <div>
                <div className={classes.root}>
                    <img src='/img/logoHome.jpg' alt='home' width="200px" height="50px"/>
                    <AppBar position="static">
                        <Grid container>
                            <Grid item xs={12}>
                                <IconButton className={classes.menuButton} color="inherit" onClick={this.handleDrawerToggle}>
                                    <MenuIcon/>
                                </IconButton>
                                <Button color="inherit" href="/#" component={Link}>
                                    에브리타임
                                </Button>
                                {window.localStorage.getItem("userInfo") === null && 
                                    <div style={{float: "right", marginTop: "5px", marginRight: "10px"}}>
                                        <Button color="inherit" href="/#/Login" component={Link}>
                                            로그인
                                        </Button>
                                        <Button color="inherit" href="/#/Regist" component={Link} endIcon={<ExitToApp/>}>
                                            회원가입
                                        </Button>
                                    </div>
                                }
                                {window.localStorage.getItem("userInfo") === null ? null : 
                                    <div style={{float: "right", marginTop: "5px", marginRight: "10px"}}>
                                        <Button className={classes.member} color="inherit" href="#" component={Link}>
                                            {member.name} 님
                                        </Button>
                                        <Button className={classes.member} color="inherit" 
                                            endIcon={<ExitToApp/>} onClick={this.logout}>
                                            로그아웃
                                        </Button>
                                    </div>
                                }
                            </Grid>
                        </Grid>
                    </AppBar>
                    {/* Drawer의 open 값이 true가 되면 자동으로 나타나며, false가 되면 들어간다. */}
                    {/* onClose 안에 함수 넣으면, 바깥 영역 클릭하거나 esc 눌렀을때 닫음 */}
                    <Drawer open={this.state.toggle} style={{width: "300px", padding: "40px"}} onClose={this.handleDrawerToggle}>
                        <MenuItem onClick={this.handleDrawerToggle}>
                            <Link component={RouterLink} to="/">
                                <br/>
                                <img src='/img/logo.jpg' alt='home' width="140px" height="100px" style={{display: "inline"}}/>
                                <br/><br/>
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={this.handleDrawerToggle}>
                            <Link component={RouterLink} to="/Questions">
                                <Typography variant="h6" component="h2">
                                    문제 풀기
                                </Typography>
                            </Link>
                        </MenuItem>
                    </Drawer>
                </div>
                {/* 위 네비게이션 아래에 페이지 보여주기 */}
                <div id="content" style={{margin: 'auto', marginTop: '20px'}}>
                    {React.cloneElement(this.props.children)}
                </div>
            </div>

        )
    }
}

// 아래와 같이 withStyles하고 위에서 지정한 styles를 담아주면 AppShell 의 render 에 해당 style에 적용되어 return 에 쓸 수 있다.
export default withStyles(styles)(AppShell);