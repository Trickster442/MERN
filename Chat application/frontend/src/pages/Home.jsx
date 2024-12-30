import React from 'react'
import Header from './Header'
import AddPost from './AddPost'
import PostFetch from './PostFetch'
const Home = () => {
  return (
    <div>
      <Header/>
      <br></br>
      <AddPost/>
      <PostFetch/>
    </div>
  )
}

export default Home
