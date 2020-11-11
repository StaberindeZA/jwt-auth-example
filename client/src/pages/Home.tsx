import React from 'react'
import { Link } from 'react-router-dom'

interface HomeProps {

}

export const Home: React.FC<HomeProps> = ({}) => {
    return <div>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
    </div>
}