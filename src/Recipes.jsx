import React, { useState } from 'react'
import { Mutation, Query } from 'react-apollo'
import { recipesQuery } from './queries'
import gql from 'graphql-tag';

const updateRecipeStarredMutation = gql`
 mutation updateRecipeStarred($id: ID!, $isStarred: Boolean!) {
     updateRecipeStarred(id: $id, isStarred: $isStarred) @client
 }
`

const Recipes = () => {
  const [vegetarian, setVegetarian] = useState(false);
  const toggleVegetaian = () => setVegetarian(!vegetarian);

  return (
    <Query query={recipesQuery} variables={{vegetarian}}>
      {({data, loading, error, refetch}) => {
        if (loading) return <p>Loading ...</p>
        if (error) return <p>Something went wrong ...</p>

        return (
          <>
            <button onClick={() => refetch()}>Refresh</button>
            <div>
              <input type="checkbox"
                     onClick={toggleVegetaian}/>
            </div>
            <ul>
              {data.recipes.map(({id, title, isStarred}) =>
                <li key={id}>
                  {title}
                  <Mutation
                    mutation={updateRecipeStarredMutation}
                    refetchQueries={[
                      {
                        query: recipesQuery,
                        variables: {vegetarian: false}
                      },
                      {
                        query: recipesQuery,
                        variables: {vegetarian: true}
                      }
                    ]}
                  awaitRefetchQueries={true}>
                    {(updateRecipeStarred, {loading, error}) => (
                      <button
                      className="star-btn"
                      style={{
                        color: isStarred ? "orange" : "grey",
                        animation: loading ? "inflate 0.7s ease infinite alternate" :
                          "none"
                      }}
                        onClick={() =>
                        updateRecipeStarred({
                          variables: {
                            id,
                            isStarred: !isStarred
                          }
                        })
                      }>
                        {isStarred ? <span role="img" aria-label="Active star">⭐️</span> : <span role="img" aria-label="Inactive star">★</span>}
                      </button>
                    )}
                  </Mutation>

                </li>
              )}
            </ul>

          </>
        )
      }}
    </Query>
  )
}

export default Recipes
