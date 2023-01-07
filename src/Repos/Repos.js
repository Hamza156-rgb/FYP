import React, {Component} from 'react';
import {connect} from 'react-redux'
import RepositoryActions from './ReposAction'

import {Button, ButtonToolbar, Well, ListGroup, ListGroupItem} from 'react-bootstrap';

class Repository extends Component {

    props: {
        repos: Object
    };
    state: {};

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {reposReq} = this.props;
        reposReq();
    }

    componentWillReceiveProps(newProps) {
    }

    renderRepo(repo, index) {
        return (
            <ListGroupItem key={index}>
                <div>Name: {repo.name}</div>
                <div>Full Name: {repo.full_name}</div>
                <div>Open Issues : {repo.open_issues_count}</div>
                <div>Watchers : {repo.watchers_count}</div>
                <div>Git URL : {repo.git_url}</div>
                <div>HTML URL : {repo.html_url}</div>
            </ListGroupItem>
        )
    }

    render() {

        console.log('repos: ' + this.props.repos);

        const data = this.props.repos.allRepos;
        return (
            <div className="container">
                <h1>Repositories...</h1>

                <div>
                    <ListGroup>
                        {data.map((repo, index) => this.renderRepo(repo, index))}
                    </ListGroup>
                </div>


            </div>
        )
    }
}


const mapStateToProps = ({repos = {}, }) => {
    return {
        repos,
    }
}

const mapDispatchToProps = (dispatch) => ({
    reposReq: () => dispatch(RepositoryActions.loadRepos())
})


export default connect(mapStateToProps, mapDispatchToProps)(Repository)