// import type { LoginCredentials, LoginResponse, User } from "@/lib/types/auth.types"

// // Mock users for development
// const MOCK_USERS = [
//   {
//     id: "1",
//     email: "receptionist@medilink.lk",
//     password: "reception123",
//     name: "Nimal Perera",
//     role: "receptionist" as const,
//     clinicId: "clinic-001",
//     clinicName: "MediLink Central Clinic",
//   },
//   {
//     id: "2",
//     email: "doctor@medilink.lk",
//     password: "doctor123",
//     name: "Dr. Kumari Silva",
//     role: "doctor" as const,
//     clinicId: "clinic-001",
//     clinicName: "MediLink Central Clinic",
//   },
//   {
//     id: "3",
//     email: "pharmacist@medilink.lk",
//     password: "pharmacy123",
//     name: "Sunil Fernando",
//     role: "pharmacist" as const,
//     clinicId: "clinic-001",
//     clinicName: "MediLink Central Clinic",
//   },
//   {
//     id: "4",
//     email: "admin@medilink.lk",
//     password: "admin123",
//     name: "Chaminda Rajapaksa",
//     role: "admin" as const,
//     clinicId: "clinic-001",
//     clinicName: "MediLink Central Clinic",
//   },
// ]

// class AuthService {
//   async login(credentials: LoginCredentials): Promise<LoginResponse> {
//     // Mock API call - simulate network delay
//     await new Promise((resolve) => setTimeout(resolve, 800))

//     const user = MOCK_USERS.find((u) => u.email === credentials.email && u.password === credentials.password)

//     if (!user) {
//       throw new Error("Invalid email or password")
//     }

//     const { password, ...userWithoutPassword } = user
//     const mockToken = `mock_token_${user.id}_${Date.now()}`

//     return {
//       user: userWithoutPassword,
//       token: mockToken,
//     }
//   }

//   async logout(): Promise<void> {
//     // Mock API call
//     await new Promise((resolve) => setTimeout(resolve, 300))
//     localStorage.removeItem("auth_token")
//   }

//   async getCurrentUser(): Promise<User> {
//     // Mock API call to get current user from token
//     await new Promise((resolve) => setTimeout(resolve, 500))

//     const token = localStorage.getItem("auth_token")
//     if (!token) {
//       throw new Error("No authentication token found")
//     }

//     // Extract user ID from mock token
//     const userId = token.split("_")[2]
//     const user = MOCK_USERS.find((u) => u.id === userId)

//     if (!user) {
//       throw new Error("User not found")
//     }

//     const { password, ...userWithoutPassword } = user
//     return userWithoutPassword
//   }
// }

// export const authService = new AuthService()
