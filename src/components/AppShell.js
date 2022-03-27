import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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
        const { classes } = this.props;
        return(
            <div className={classes.root}>
                <AppBar position="static">
                    <IconButton className={classes.menuButton} color="inherit" onClick={this.handleDrawerToggle}>
                        <MenuIcon/>
                    </IconButton>
                </AppBar>
                {/* Drawer의 open 값이 true가 되면 자동으로 나타나며, false가 되면 들어간다. */}
                <Drawer open={this.state.toggle}>
                    <MenuItem onClick={this.handleDrawerToggle}>Home</MenuItem>
                </Drawer>
            </div>
        )
    }
}

// 아래와 같이 withStyles하고 위에서 지정한 styles를 담아주면 AppShell 의 render 에 해당 style에 적용되어 return 에 쓸 수 있다.
export default withStyles(styles)(AppShell);