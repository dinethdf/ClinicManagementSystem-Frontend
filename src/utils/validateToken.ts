import axios from "axios";

// Basic token validation (already existing)
export async function validateToken(authToken: string) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/validate-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Token validation failed:", error);
    return { valid: false };
  }
}
