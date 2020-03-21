import gql from 'graphql-tag';

export const GET_FEED_QUERY = gql`
  query getFeed($first: Int!, $after: String, $admin: Boolean, $parent: String) {
    getFeed(first: $first, after: $after, admin: $admin, parent: $parent) {
      posts {
        id
      }
      count
    }
  }
`;
