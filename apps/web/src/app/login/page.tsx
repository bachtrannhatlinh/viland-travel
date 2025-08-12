import LoginForm from '../../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Đăng nhập
          </h2>
          <p className="mt-2 text-gray-600">
            Đăng nhập vào tài khoản GoSafe của bạn
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
