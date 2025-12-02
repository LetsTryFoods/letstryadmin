import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/graphql',
  credentials: 'include',
})

console.log('🚀 Apollo Client URI:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/graphql')

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  console.log('🔐 Apollo Client Auth Token:', token ? `Bearer ${token.substring(0, 20)}...` : 'None')

  const authHeaders = {
    ...(headers || {}),
    authorization: token ? `Bearer ${token}` : '',
  }

  console.log('📤 Headers being sent:', {
    authorization: authHeaders.authorization ? 'Present' : 'None',
    otherHeaders: headers ? Object.keys(headers).length : 0
  })

  return {
    headers: authHeaders,
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})