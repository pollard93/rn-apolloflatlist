/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: feedSub
// ====================================================

export interface feedSub_feed_node {
  __typename: "Post";
  id: string | null;
}

export interface feedSub_feed {
  __typename: "PostSubscriptionPayload";
  updatedFields: string[] | null;
  node: feedSub_feed_node | null;
}

export interface feedSub {
  feed: feedSub_feed | null;
}

export interface feedSubVariables {
  tenantId: string;
}
