import React, { useState } from 'react'
import { Query } from 'react-apollo'
import { recipesQuery } from './queries'

const Recipes = () => {
  const [vegetarian, setVegetarian] = useState(false);
  const toggleVegetaian = () => setVegetarian(!vegetarian);
  const resetVegetaian = () => setVegetarian(false);

  const [title, setTitle] = useState('');
  const updateTitle = (titleText) => setTitle(titleText);
  const resetTitle = () => setTitle('');

  const resetFields = () => {
    resetVegetaian()
    resetTitle()
  }

  return (
    <Query query={recipesQuery} variables={{vegetarian}}>
      {({data, loading, error}) => {
        if (loading) return <p>Loading ...</p>
        if (error) return <p>Something went wrong ...</p>

        return (
          <>
            <div>
              <input type="checkbox"
                     onClick={toggleVegetaian}/>
            </div>
            <ul>
              {data.recipes.map(({id, title}) =>
                <li key={id}>{title}</li>
              )}
            </ul>
          </>
        )
      }}
    </Query>
  )
}

export default Recipes
