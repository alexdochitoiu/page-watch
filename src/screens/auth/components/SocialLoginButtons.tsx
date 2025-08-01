"use client";

import { FaGoogle, FaFacebook, FaApple, FaDiscord } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";

export const SocialLoginButtons = () => {
  const { signInWithOAuth } = useAuthStore();

  return (
    <div className="flex justify-center gap-4">
      <Button variant="outline" onClick={() => signInWithOAuth("google")} type="button">
        <FaGoogle className="h-5 w-5 text-red-600" />
      </Button>
      <Button variant="outline" onClick={() => signInWithOAuth("facebook")} type="button">
        <FaFacebook className="h-5 w-5 text-blue-700" />
      </Button>
      <Button variant="outline" onClick={() => signInWithOAuth("discord")} type="button">
        <FaDiscord className="h-5 w-5 text-blue-500" />
      </Button>
      <Button variant="outline" onClick={() => signInWithOAuth("apple")} type="button">
        <FaApple className="h-5 w-5 text-black-600" />
      </Button>
    </div>
  );
};
