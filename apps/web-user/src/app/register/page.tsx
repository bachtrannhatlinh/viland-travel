import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Đăng ký tài khoản
          </h1>
          <p className="mt-2 text-gray-600">
            Tạo tài khoản ViLand Travel để bắt đầu hành trình của bạn
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
