import { gql } from '@apollo/client'

export const GET_FOODS = gql`
  query GetFoods {
    foods {
      id
      _id
      name
      description
      imageUrl
      price
      category
      eanCode
      subCategory
      refundPolicy
      unit
      disclaimer
      flavour
      shelfLife
      dietPreference
      discountPercent
      discountedPrice
      ranges
      newLaunch
      tags
      createdAt
      updatedAt
    }
  }
`

export const GET_FOOD = gql`
  query GetFood($id: ID!) {
    food(id: $id) {
      id
      _id
      name
      description
      imageUrl
      price
      category
      eanCode
      subCategory
      refundPolicy
      unit
      disclaimer
      flavour
      shelfLife
      dietPreference
      discountPercent
      discountedPrice
      ranges
      newLaunch
      tags
      createdAt
      updatedAt
    }
  }
`

export const ADD_FOOD = gql`
  mutation AddFood($input: AddFoodInput!) {
    addFood(input: $input) {
      id
      _id
      name
      description
      imageUrl
      price
      category
      eanCode
      subCategory
      refundPolicy
      unit
      disclaimer
      flavour
      shelfLife
      dietPreference
      discountPercent
      discountedPrice
      ranges
      newLaunch
      tags
      createdAt
      updatedAt
    }
  }
`

export const UPDATE_FOOD = gql`
  mutation UpdateFood($id: ID!, $input: UpdateFoodInput!) {
    updateFood(id: $id, input: $input) {
      id
      _id
      name
      description
      imageUrl
      price
      category
      eanCode
      subCategory
      refundPolicy
      unit
      disclaimer
      flavour
      shelfLife
      dietPreference
      discountPercent
      discountedPrice
      ranges
      newLaunch
      tags
      createdAt
      updatedAt
    }
  }
`

export const DELETE_FOOD = gql`
  mutation DeleteFood($id: ID!) {
    deleteFood(id: $id)
  }
`

export const ADD_TAGS = gql`
  mutation AddTags($data: [AddTagsInput!]!) {
    addTags(data: $data)
  }
`