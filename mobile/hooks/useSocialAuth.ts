import { View, Text, Alert } from "react-native";
import { useSSO } from "@clerk/clerk-expo";
import React, { useState } from "react";

type Strategy = "oauth_google" | "oauth_apple";
export default function useSocialAuth() {
  // const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();
  const handleSocialAuth = async (strategy: Strategy) => {
    setLoadingProvider(strategy);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.log("💥Error in SocialAuth", error);
      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`
      );
    } finally {
      setLoadingProvider(null);
    }
  };
  return { loadingProvider, handleSocialAuth };
}
