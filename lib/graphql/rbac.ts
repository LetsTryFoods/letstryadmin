import { gql } from "@apollo/client";

// ============ PERMISSION QUERIES ============

export const GET_PERMISSIONS = gql`
  query GetPermissions {
    permissions {
      _id
      slug
      name
      description
      module
      sortOrder
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_ACTIVE_PERMISSIONS = gql`
  query GetActivePermissions {
    activePermissions {
      _id
      slug
      name
      description
      module
      sortOrder
      isActive
    }
  }
`;

export const GET_PERMISSION_MODULES = gql`
  query GetPermissionModules {
    permissionModules
  }
`;

// ============ ADMIN ROLE QUERIES ============

export const GET_ADMIN_ROLES = gql`
  query GetAdminRoles($page: Int, $limit: Int) {
    adminRoles(page: $page, limit: $limit) {
      items {
        _id
        name
        slug
        description
        permissions {
          permission {
            _id
            slug
            name
            module
          }
          actions
        }
        isSystem
        isActive
        createdAt
        updatedAt
      }
      meta {
        totalCount
        page
        limit
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_ACTIVE_ADMIN_ROLES = gql`
  query GetActiveAdminRoles {
    activeAdminRoles {
      _id
      name
      slug
      description
      isSystem
      isActive
    }
  }
`;

export const GET_ADMIN_ROLE = gql`
  query GetAdminRole($id: String!) {
    adminRole(id: $id) {
      _id
      name
      slug
      description
      permissions {
        permission {
          _id
          slug
          name
          module
        }
        actions
      }
      isSystem
      isActive
      createdAt
      updatedAt
    }
  }
`;

// ============ ADMIN USER QUERIES ============

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers($page: Int, $limit: Int) {
    adminUsers(page: $page, limit: $limit) {
      items {
        _id
        name
        email
        phone
        avatar
        role {
          _id
          name
          slug
        }
        isActive
        lastLoginAt
        createdAt
        updatedAt
      }
      meta {
        totalCount
        page
        limit
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_ADMIN_USER = gql`
  query GetAdminUser($id: String!) {
    adminUser(id: $id) {
      _id
      name
      email
      phone
      avatar
      role {
        _id
        name
        slug
        permissions {
          permission {
            _id
            slug
            name
            module
          }
          actions
        }
      }
      isActive
      lastLoginAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_ADMIN_ME = gql`
  query GetAdminMe {
    adminMe {
      _id
      name
      email
      phone
      avatar
      roleName
      roleSlug
      permissions {
        slug
        name
        module
        actions
      }
      isActive
    }
  }
`;

// ============ PERMISSION MUTATIONS ============

export const CREATE_PERMISSION = gql`
  mutation CreatePermission($input: CreatePermissionInput!) {
    createPermission(input: $input) {
      _id
      slug
      name
      description
      module
      sortOrder
      isActive
    }
  }
`;

export const UPDATE_PERMISSION = gql`
  mutation UpdatePermission($id: String!, $input: UpdatePermissionInput!) {
    updatePermission(id: $id, input: $input) {
      _id
      slug
      name
      description
      module
      sortOrder
      isActive
    }
  }
`;

export const DELETE_PERMISSION = gql`
  mutation DeletePermission($id: String!) {
    deletePermission(id: $id)
  }
`;

export const TOGGLE_PERMISSION_ACTIVE = gql`
  mutation TogglePermissionActive($id: String!) {
    togglePermissionActive(id: $id) {
      _id
      isActive
    }
  }
`;

// ============ ADMIN ROLE MUTATIONS ============

export const CREATE_ADMIN_ROLE = gql`
  mutation CreateAdminRole($input: CreateAdminRoleInput!) {
    createAdminRole(input: $input) {
      _id
      name
      slug
      description
      permissions {
        permission {
          _id
          slug
          name
        }
        actions
      }
      isSystem
      isActive
    }
  }
`;

export const UPDATE_ADMIN_ROLE = gql`
  mutation UpdateAdminRole($id: String!, $input: UpdateAdminRoleInput!) {
    updateAdminRole(id: $id, input: $input) {
      _id
      name
      slug
      description
      permissions {
        permission {
          _id
          slug
          name
        }
        actions
      }
      isSystem
      isActive
    }
  }
`;

export const DELETE_ADMIN_ROLE = gql`
  mutation DeleteAdminRole($id: String!) {
    deleteAdminRole(id: $id)
  }
`;

export const TOGGLE_ADMIN_ROLE_ACTIVE = gql`
  mutation ToggleAdminRoleActive($id: String!) {
    toggleAdminRoleActive(id: $id) {
      _id
      isActive
    }
  }
`;

// ============ ADMIN USER MUTATIONS ============

export const CREATE_ADMIN_USER = gql`
  mutation CreateAdminUser($input: CreateAdminUserInput!) {
    createAdminUser(input: $input) {
      _id
      name
      email
      phone
      role {
        _id
        name
        slug
      }
      isActive
    }
  }
`;

export const UPDATE_ADMIN_USER = gql`
  mutation UpdateAdminUser($id: String!, $input: UpdateAdminUserInput!) {
    updateAdminUser(id: $id, input: $input) {
      _id
      name
      email
      phone
      role {
        _id
        name
        slug
      }
      isActive
    }
  }
`;

export const DELETE_ADMIN_USER = gql`
  mutation DeleteAdminUser($id: String!) {
    deleteAdminUser(id: $id)
  }
`;

export const TOGGLE_ADMIN_USER_ACTIVE = gql`
  mutation ToggleAdminUserActive($id: String!) {
    toggleAdminUserActive(id: $id) {
      _id
      isActive
    }
  }
`;

// ============ AUTH MUTATIONS ============

export const ADMIN_USER_LOGIN = gql`
  mutation AdminUserLogin($input: AdminLoginInput!) {
    adminUserLogin(input: $input) {
      accessToken
      _id
      name
      email
      roleName
      roleSlug
      permissions {
        slug
        name
        module
        actions
      }
    }
  }
`;

export const CHANGE_ADMIN_PASSWORD = gql`
  mutation ChangeAdminPassword($input: ChangePasswordInput!) {
    changeAdminPassword(input: $input)
  }
`;

export const ADMIN_LOGOUT = gql`
  mutation AdminLogout {
    adminLogout
  }
`;
