export interface AuthUser {
  id: string
  username: string
}

export interface AuthState {
  multiUserEnabled: boolean
  registrationEnabled: boolean
  user: AuthUser | null
}
