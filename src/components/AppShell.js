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

    render(){
        // 아래 export 의 withStyles 파라미터인 style의 요소가 classes에 담겨 사용 가능하다.
        const { classes } = this.props;
        return(
            // 하나의 큰 div 안에 여러 내용 작성해야 하는 구조
            <div>
                <div className={classes.root}>
                    <AppBar position="static">
                        <IconButton className={classes.menuButton} color="inherit" onClick={this.handleDrawerToggle}>
                            <MenuIcon/>
                        </IconButton>
                    </AppBar>
                    {/* Drawer의 open 값이 true가 되면 자동으로 나타나며, false가 되면 들어간다. */}
                    <Drawer open={this.state.toggle}>
                        <MenuItem onClick={this.handleDrawerToggle}>
                            <Link component={RouterLink} to="/">
                                홈 화면
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={this.handleDrawerToggle}>
                            <Link component={RouterLink} to="/Texts">
                                텍스트 관리
                            </Link>
                        </MenuItem>
                        <MenuItem onClick={this.handleDrawerToggle}>
                            <Link component={RouterLink} to="/Words">
                                단어 관리
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