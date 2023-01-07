
import api from "../Services/Api"
import reposApi from './ReposApi'

export const LOAD_REPOS_LOADING = 'REDUX_THUNK_LOAD_REPOS_LOADING';
export const LOAD_REPOS_SUCCESS = 'REDUX_THUNK_LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'REDUX_THUNK_LOAD_REPOS_ERROR';

const loadRepos = () => dispatch => {
   dispatch(request());
  reposApi.getRepository(api)
    .then(response => {
      console.log(response);
      return dispatch(success(response.data))
    })
    .catch(error => dispatch(failure(error)))
};

const success = data => ({
  type: LOAD_REPOS_SUCCESS,
  payload: data
});

const request = () => ({
  type: LOAD_REPOS_LOADING
});

const failure = error => ({
  type: LOAD_REPOS_ERROR,
  payload: {
    error
  }
});

export default {
  loadRepos
}