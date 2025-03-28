import { AuthButton } from "../auth/AuthButton";
import { HeaderBase } from "./HeaderBase";
import { auth } from "@/lib/auth/helper";

export async function Header() {
  const user = await auth();

  return (
    <HeaderBase isAuthenticated={!!user}>
      <AuthButton />
    </HeaderBase>
  );
}
