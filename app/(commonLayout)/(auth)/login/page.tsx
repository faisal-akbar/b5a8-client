import LoginForm from "@/components/auth/login-form";

export const dynamic = "force-dynamic";

const LoginPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) => {
  const params = (await searchParams) || {};
  const redirectTo = params.redirect;

  // Don't check auth here - let the login form handle redirects after successful login
  // This prevents redirect loops when user is already logged in
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center bg-muted/30 px-4 py-12">
        <LoginForm redirect={redirectTo} />
      </main>
    </div>
  );
};

export default LoginPage;
