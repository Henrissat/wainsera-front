import { GraphQLResolveInfo } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Bouteille = {
  __typename?: 'Bouteille';
  id: Scalars['Int'];
  millesime?: Maybe<Scalars['Int']>;
  alcool?: Maybe<Scalars['Float']>;
  quantite?: Maybe<Scalars['Int']>;
  vin?: Maybe<Vin>;
  cuvee?: Maybe<Cuvee>;
  region?: Maybe<Region>;
};

export type Vin = {
  __typename?: 'Vin';
  id: Scalars['Int'];
  nom: Scalars['String'];
};

export type Cuvee = {
  __typename?: 'Cuvee';
  id: Scalars['Int'];
  nom_domaine?: Maybe<Scalars['String']>;
};

export type Region = {
  __typename?: 'Region';
  id: Scalars['Int'];
  nom?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addBouteille?: Maybe<Bouteille>;
};


export type MutationAddBookArgs = {
  title?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  books?: Maybe<Array<Maybe<Book>>>;
  hello?: Maybe<Scalars['String']>;
};

export type AddBookMutationVariables = Exact<{
  title?: InputMaybe<Scalars['String']>;
}>;



export type GetBouteillesQueryVariables = Exact<{ [key: string]: never; }>;

export type GetBouteillesQuery = { __typename?: 'Query', listBouteilles: Array<{ __typename?: 'Bouteille', id: number, millesime?: number | null, alcool?: number | null, quantite?: number | null, vin?: { __typename?: 'Vin', id: number, nom: string } | null, cuvee?: { __typename?: 'Cuvee', id: number, nom_domaine?: string | null } | null, region?: { __typename?: 'Region', id: number, nom?: string | null } | null }> };

export type AddBouteilleMutationVariables = Exact<{
  bouteille: IAddBouteille;
}>;

export type AddBouteilleMutation = { __typename?: 'Mutation', addBouteille: { __typename?: 'Bouteille', id: number, millesime?: number | null, alcool?: number | null, quantite?: number | null, vin?: { __typename?: 'Vin', id: number, nom: string } | null, cuvee?: { __typename?: 'Cuvee', id: number, nom_domaine?: string | null } | null, region?: { __typename?: 'Region', id: number, nom?: string | null } | null } };

export type DeleteBouteilleMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type DeleteBouteilleMutation = { __typename?: 'Mutation', deleteBouteille: boolean };

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Bouteille: ResolverTypeWrapper<Bouteille>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Bouteille: Bouteille;
  Boolean: Scalars['Boolean'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
};

export type BookResolvers<ContextType = any, ParentType extends ResolversParentTypes['Bouteille'] = ResolversParentTypes['Bouteille']> = {
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addBook?: Resolver<Maybe<ResolversTypes['Bouteille']>, ParentType, ContextType, Partial<MutationAddBookArgs>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  books?: Resolver<Maybe<Array<Maybe<ResolversTypes['Bouteille']>>>, ParentType, ContextType>;
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Book?: BookResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

export const GetBouteillesDocument = gql`
  query GetBouteilles {
    listBouteilles {
      id
      millesime
      alcool
      quantite
      vin {
        id
        nom
      }
      cuvee {
        id
        nom_domaine
      }
      region {
        id
        nom
      }
    }
  }
`;

export const AddBookDocument = gql`
  mutation AddBook($title: String) {
    addBook(title: $title) {
      id
      title
    }
  }
  `;

export type AddBookMutationFn = Apollo.MutationFunction<AddBookMutation, AddBookMutationVariables>;

/**
 * __useAddBookMutation__
 *
 * To run a mutation, you first call `useAddBookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBookMutation, { data, loading, error }] = useAddBookMutation({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useAddBookMutation(baseOptions?: Apollo.MutationHookOptions<AddBookMutation, AddBookMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBookMutation, AddBookMutationVariables>(AddBookDocument, options);
      }
export type AddBookMutationHookResult = ReturnType<typeof useAddBookMutation>;
export type AddBookMutationResult = Apollo.MutationResult<AddBookMutation>;
export type AddBookMutationOptions = Apollo.BaseMutationOptions<AddBookMutation, AddBookMutationVariables>;
export const BooksDocument = gql`
  query Books {
    books {
      id
      title
    }
  }
`;

/**
 * __uuseWainseraQuery__
 *
 * To run a query within a React component, call `useWainseraQuery` and pass it any options that fit your needs.
 * When your component renders, `useWainseraQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWainseraQuery({
 *   variables: {
 *   },
 * });
 */
export function useWainseraQuery(baseOptions?: Apollo.QueryHookOptions<BooksQuery, BooksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BooksQuery, BooksQueryVariables>(BooksDocument, options);
      }
export function useBooksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BooksQuery, BooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BooksQuery, BooksQueryVariables>(BooksDocument, options);
        }
export type BooksQueryHookResult = ReturnType<typeof useWainseraQuery>;
export type BooksLazyQueryHookResult = ReturnType<typeof useBooksLazyQuery>;
export type BooksQueryResult = Apollo.QueryResult<BooksQuery, BooksQueryVariables>;