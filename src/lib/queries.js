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