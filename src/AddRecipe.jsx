import React, { useState } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag'
import { recipesQuery } from './queries'

const addRecipeMutation = gql`
    mutation addRecipe($recipe: RecipeInput!) {
        addRecipe(recipe: $recipe) {
            id
            title
        }
    }
`

const AddRecipe = () => {
  const [vegetarian, setVegetarian] = useState(false);
  const toggleVegetaian = () => setVegetarian(!vegetarian);
  const resetVegetaian = () => setVegetarian(false);

  const [title, setTitle] = useState('');
  const updateTitle = (event) => setTitle(event.target.value);
  const resetTitle = () => setTitle('');

  const resetFields = () => {
    resetVegetaian();
    resetTitle();
  };

  const submitHandler = (event, addRecipe, title, vegetarian) => {
    event.preventDefault();

    addRecipe({
      variables: {
        recipe: {
          title,
          vegetarian
        }
      }
    });
    resetFields()
  }

  return (
    <Mutation
      mutation={addRecipeMutation}
      refetchQueries={[
        {
          query: recipesQuery,
          variables: {vegetarian: true}
        },
        {
          query: recipesQuery,
          variables: {vegetarian: false}
        }
      ]}
      awaitRefetchQueries={true}
    >
      {(addRecipe, {loading, error}) => (
        <form
          onSubmit={event => submitHandler.call(null, event, addRecipe, title, vegetarian)}
          style={{borderBottom: '1px solid black'}}
        >
          <div>
            <label htmlFor="title">
              <span>Title</span>
              <div>
                <input type="text"
                       defaultValue={title}
                       id={title}
                       onChange={updateTitle}
                />
              </div>
            </label>
          </div>


          <label>
            <input
              type="checkbox"
              defaultValue={vegetarian}
              onChange={toggleVegetaian}
            />
            <span>vegetarian</span>
          </label>
          <div>
            <button type="submit">Add Recipe</button>
          </div>
          {loading && <p>Loading ...</p>}
          {error && <p>Error :( Please try again ...</p>}
        </form>
      )}
    </Mutation>
  )
}

export default AddRecipe
