import { createAction } from "redux-actions";

//
// Util
import request, { ignoreFailure } from "util/http";

//
// Redux
import {
  FETCH_MEDIUM_POSTS,
  SET_MEDIUM_POSTS,
} from "action-types";

export const setMediumPosts = createAction(SET_MEDIUM_POSTS);

export const fetchMediumPosts = () => {
  return (dispatch) => {
    dispatch(createAction(FETCH_MEDIUM_POSTS)());

    return request
    .get("/latest_posts?count=2")
    .then(response => {
      const posts = JSON.parse(response.data.data).payload.references.Post;

      dispatch(setMediumPosts(posts));
    })
    .catch(ignoreFailure);
  };
};
