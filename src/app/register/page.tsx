import { MainContainer } from "@/components/layout/MainContainer";
import { AuthScreen, AuthTabs } from "@/screens/auth/AuthScreen";

export default function RegisterPage() {
  return (
    <MainContainer>
      <AuthScreen tab={AuthTabs.REGISTER} />
    </MainContainer>
  );
}
