import { contentfulClient } from './contentful';
import { GET_ALL_POSTS, GET_POST_BY_ID } from './queries';
import { GET_ALL_PROJECTS, GET_FEATURED_PROJECTS, GET_PROJECT_BY_SLUG } from './queries';

export async function getPosts() {
  const data = await contentfulClient.request(GET_ALL_POSTS);
  return data.blogTestCollection.items;
}

export async function getPost(id) {
  const data = await contentfulClient.request(GET_POST_BY_ID, { id });
  return data.blogTest;
}

export async function getAllProjects() {
  const data = await contentfulClient.request(GET_ALL_PROJECTS);
  return data.projectCollection.items;
}

export async function getFeaturedProjects() {
  const data = await contentfulClient.request(GET_FEATURED_PROJECTS);
  return data.projectCollection.items;
}

export async function getProjectBySlug(slug) {
  const data = await contentfulClient.request(GET_PROJECT_BY_SLUG, { slug });
  return data.projectCollection.items[0] || null;
}
