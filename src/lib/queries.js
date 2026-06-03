// lib/queries.js
import { gql } from 'graphql-request';

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    blogTestCollection {
      items {
        sys {
          id
        }
        title
        body
        image1 {
          url
          title
          width
          height
        }
      }
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: String!) {
    blogTest(id: $id) {
      title
      body
    }
  }
`;

export const GET_ALL_PROJECTS = gql`
  query GetAllProjects {
    projectCollection {
      items {
        sys {
          id
        }
        title
        slug
        category
        region
        client
        year
        featured
        coverImage {
          url
          title
          width
          height
        }
      }
    }
  }
`;

export const GET_FEATURED_PROJECTS = gql`
  query GetFeaturedProjects {
    projectCollection(where: { featured: true }, limit: 3) {
      items {
        sys {
          id
        }
        title
        slug
        category
        region
        client
        year
        coverImage {
          url
          title
          width
          height
        }
      }
    }
  }
`;

export const GET_ALL_ACTIVITIES = gql`
  query GetAllActivities {
    activityCollection(order: order_ASC) {
      items {
        sys {
          id
        }
        title
        slug
        category
        shortDescription
        icon
        order
        coverImage {
          url
          title
          width
          height
        }
      }
    }
  }
`;

export const GET_PROJECT_BY_SLUG = gql`
  query GetProjectBySlug($slug: String!) {
    projectCollection(where: { slug: $slug }, limit: 1) {
      items {
        sys {
          id
        }
        title
        slug
        category
        region
        client
        year
        description
        budget
        duration
        specs { json }
        featured
        coverImage {
          url
          title
          width
          height
        }
      }
    }
  }
`;

export const GET_ALL_TEAM_MEMBERS = gql`
  query GetAllTeamMembers {
    teamMemberCollection(order: order_ASC) {
      items {
        sys { id }
        name
        role
        department
        bio
        order
        photo {
          url
          title
          width
          height
        }
      }
    }
  }
`;

export const GET_SITE_CONFIG = gql`
  query GetSiteConfig {
    siteConfigCollection(limit: 1) {
      items {
        heroTitle
        heroSubtitle
        projectsCount
        yearsCount
        regionsCount
        heroCtaLabel
      }
    }
  }
`;