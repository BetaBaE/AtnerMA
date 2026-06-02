import { contentfulClient } from './contentful';
import { GET_ALL_POSTS, GET_POST_BY_ID } from './queries';

export async function getPosts() {
  const data = await contentfulClient.request(GET_ALL_POSTS);
  return data.blogTestCollection.items;
}

export async function getPost(id) {
  const data = await contentfulClient.request(GET_POST_BY_ID, { id });
  return data.blogTest;
}
