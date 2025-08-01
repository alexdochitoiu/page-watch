import Link from "next/link";
import { LoginForm } from "@/components/shared/login-form/LoginForm";
import { RegisterForm } from "@/components/shared/register-form/RegisterForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_ROUTES } from "@/lib/routes";
import { AuthScreenClient } from "@/screens/auth/components/AuthScreenClient";
import { SocialLoginButtons } from "@/screens/auth/components/SocialLoginButtons";

export enum AuthTabs {
  LOGIN = "login",
  REGISTER = "register",
}

interface AuthScreenProps {
  tab?: AuthTabs;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ tab = AuthTabs.LOGIN }) => {
  return (
    <AuthScreenClient>
      <div className="flex flex-col gap-4 w-full mx-auto max-w-md">
        <Card className="w-full mx-auto max-w-md">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>

            <CardDescription>
              Sign in to your account or create a new one to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue={tab} className="w-full">
              <TabsList className="w-full flex justify-center">
                <TabsTrigger value={AuthTabs.LOGIN} asChild>
                  <Link href={APP_ROUTES.LOGIN}>Login</Link>
                </TabsTrigger>

                <TabsTrigger value={AuthTabs.REGISTER} asChild>
                  <Link href={APP_ROUTES.REGISTER}>Register</Link>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={AuthTabs.LOGIN}>
                <LoginForm />
              </TabsContent>

              <TabsContent value={AuthTabs.REGISTER}>
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mb-2">Or continue with</div>

        <SocialLoginButtons />
      </div>
    </AuthScreenClient>
  );
};
