import AuthLayout from "@/components/layout/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";
import AppHeader from "@/components/layout/AppHeader";

export default function RegisterPage() {
  return (
     <AuthLayout header={<AppHeader />}>
      <RegisterForm />
    </AuthLayout>
  );
}