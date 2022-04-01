import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


class Detail extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <Card>
                <CardContent>
                    {/* 현재 주소에서 / 뒤의 파라미터 가져오는 기능 */}
                    {this.props.match.params.textId}
                </CardContent>
            </Card>
        );
    }
}

export default Detail;