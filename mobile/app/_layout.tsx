import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import "../global.css"

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache}>
        <Stack
          screenOptions={{
            headerShown: false
          }}
        />
      </ClerkProvider>
    </QueryClientProvider>
  )
}
