import { contentfulClient } from './contentful';
import { GET_ALL_POSTS, GET_POST_BY_ID } from './queries';
import { GET_ALL_PROJECTS, GET_FEATURED_PROJECTS, GET_PROJECT_BY_SLUG, GET_ALL_ACTIVITIES, GET_ALL_TEAM_MEMBERS, GET_SITE_CONFIG } from './queries';

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

export async function getAllActivities() {
  const data = await contentfulClient.request(GET_ALL_ACTIVITIES);
  return data.activityCollection.items;
}

export async function getProjectBySlug(slug) {
  const data = await contentfulClient.request(GET_PROJECT_BY_SLUG, { slug });
  const item = data.projectCollection.items[0];
  if (!item) return null;
  return { ...item, specs: item.specs?.json ?? null };
}

export async function getAllTeamMembers() {
  const data = await contentfulClient.request(GET_ALL_TEAM_MEMBERS);
  return data.teamMemberCollection.items;
}

export async function getSiteConfig() {
  const data = await contentfulClient.request(GET_SITE_CONFIG);
  return data.siteConfigCollection.items[0] || null;
}