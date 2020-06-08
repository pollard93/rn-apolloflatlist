/* eslint-disable react-native/no-inline-styles */
/* eslint-disable camelcase */
/* eslint-disable react-native/no-color-literals */
import React, { useState, FC } from 'react';
import { storiesOf } from '@storybook/react-native';
import { Text, View, TextInput } from 'react-native';
import ApolloFlatList, { HeaderFooterProps } from 'mbp-components-rn-apolloflatlist';
import { getFeedVariables, getFeed, getFeed_getFeed_posts } from '../components/getFeed/__generated__/getFeed';
import { feedSubVariables, feedSub } from '../components/feedSub/__generated__/feedSub';
import { GET_FEED_QUERY } from '../components/getFeed/getFeed';
// import { FEED_SUBSCRIPTION } from '../components/feedSub/feedSub';


/**
 * Create an extension class so it is typed
 */
class ApolloFlatListExt extends ApolloFlatList<getFeedVariables, getFeed, getFeed_getFeed_posts, feedSubVariables, feedSub> {}


/**
 * Generic header footer component
 * Must be defined out of scope of render
 */
const HeaderFooterComponent: FC<HeaderFooterProps> = () => <Text>Footer|header</Text>;


storiesOf('ApolloFlatList', module)
  .add('ApolloFlatList Default', () => {
    const TestComponent = () => (
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
        ListEmptyComponent={(queryResult) => {
          if (queryResult.loading) {
            return <Text>Loading</Text>;
          }

          if (queryResult.error) {
            return <Text>Error</Text>;
          }

          return null;
        }}
        ListHeaderComponent={HeaderFooterComponent}
        ListFooterComponent={HeaderFooterComponent}
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
    );

    return <TestComponent />;
  })
  .add('ApolloFlatList - dynamic variables', () => {
    interface HeaderWithSearchProps extends HeaderFooterProps {
      search: any;
      setSearch: any;
    }


    /**
     * Header with search, props extend HeaderFooterProps
     */
    const HeaderWithSearch: FC<HeaderWithSearchProps> = (props) => (
      <TextInput
        placeholder="Search input"
        value={props.search}
        onChangeText={props.setSearch}
      />
    );


    const TestComponent = () => {
      const [search, setSearch] = useState('');

      return (
        <View>
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
            ListEmptyComponent={(queryResult) => {
              if (queryResult.loading) {
                return <Text>Loading</Text>;
              }

              if (queryResult.error) {
                return <Text>Error</Text>;
              }

              return null;
            }}
            ListHeaderComponent={(props) => <HeaderWithSearch {...props} search={search} setSearch={setSearch} />}
            ListFooterComponent={HeaderFooterComponent}
          />
        </View>
      );
    };

    return <TestComponent />;
  });
