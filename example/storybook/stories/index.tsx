/* eslint-disable react-native/no-inline-styles */
/* eslint-disable camelcase */
/* eslint-disable react-native/no-color-literals */
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { Text, View, TextInput } from 'react-native';
import ApolloFlatList from 'mbp-components-rn-apolloflatlist';
import { getFeedVariables, getFeed, getFeed_getFeed_posts } from '../components/getFeed/__generated__/getFeed';
import { feedSubVariables, feedSub } from '../components/feedSub/__generated__/feedSub';
import { GET_FEED_QUERY } from '../components/getFeed/getFeed';
// import { FEED_SUBSCRIPTION } from '../components/feedSub/feedSub';


/**
 * Create an extension class so it is typed
 */
class ApolloFlatListExt extends ApolloFlatList<getFeedVariables, getFeed, getFeed_getFeed_posts, feedSubVariables, feedSub> {}


storiesOf('ApolloFlatList', module)
  .add('ApolloFlatList Default', () => (
    <ApolloFlatListExt
      query={GET_FEED_QUERY}
      variables={{
        first: 5,
      }}
      context={{}}
      accessor='getFeed.posts'
      renderItem={({ item }) => (
        <View style={{ width: '100%', height: 100, backgroundColor: 'red', padding: 10 }}>
          <Text>{item.id}</Text>
        </View>
      )}
      LoadingErrorComponent={(queryResult) => {
        if (queryResult.loading) {
          return <Text>Loading</Text>;
        }

        if (queryResult.error) {
          return <Text>Error</Text>;
        }

        return null;
      }}
      ListHeaderComponent={() => (
        <Text>HEADER</Text>
      )}
      ListFooterComponent={(moreToLoad) => (
        <Text>{moreToLoad ? 'LOADING' : 'NO MORE TO LOAD'}</Text>
      )}
      // FlatListProps={{
      //   inverted: true,
      // } as any}
      // subscriptionOptions={{
      //   document: FEED_SUBSCRIPTION,
      //   variables: {},
      //   updateQuery: (prev, { subscriptionData }) => {
      //     // Only want to insert created nodes
      //     if (subscriptionData.data.feed.mutation !== 'CREATED') return prev;
      //     try {
      //       return {
      //         ...prev,
      //         getFeed: {
      //           ...prev.getFeed,
      //           posts: [subscriptionData.data.feed.node, ...posts],
      //           count: count + 1,
      //         },
      //       };
      //     } catch (e) {
      //       return prev;
      //     }
      //   },
      // }}
    />
  ))
  .add('ApolloFlatList - dynamic variables', () => {
    const TestComponent = () => {
      const [search, setSearch] = useState('');

      return (
        <View>
          <TextInput
            placeholder="Search input"
            value={search}
            onChangeText={setSearch}
          />

          <ApolloFlatListExt
            query={GET_FEED_QUERY}
            variables={{
              search,
              first: 5,
            }}
            context={{}}
            accessor='getFeed.posts'
            renderItem={({ item }) => (
              <View style={{ width: '100%', height: 100, backgroundColor: 'red', padding: 10 }}>
                <Text>{item.id}</Text>
              </View>
            )}
            LoadingErrorComponent={(queryResult) => {
              if (queryResult.loading) {
                return <Text>Loading</Text>;
              }

              if (queryResult.error) {
                return <Text>Error</Text>;
              }

              return null;
            }}
            ListHeaderComponent={() => (
              <Text>HEADER</Text>
            )}
            ListFooterComponent={(moreToLoad) => (
              <Text>{moreToLoad ? 'LOADING' : 'NO MORE TO LOAD'}</Text>
            )}
          />
        </View>
      );
    };

    return <TestComponent />;
  });
