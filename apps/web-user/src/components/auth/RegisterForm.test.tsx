import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from '@/components/auth/RegisterForm';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
  apiClient: { post: jest.fn() },
  API_CONFIG: {
    BASE_URL: 'http://localhost:5000',
    VERSION: 'v1',
    get FULL_URL() {
      return `${this.BASE_URL}/api/${this.VERSION}`;
    },
  },
}));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), success: jest.fn() } }));

describe('RegisterForm', () => {
  it('renders all input fields and button', () => {
    render(<RegisterForm />);
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đăng ký/i })).toBeInTheDocument();
    expect(screen.getByText(/đăng nhập/i)).toBeInTheDocument();
  });

  it('shows error if passwords do not match', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'A' } });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'B' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: '123456' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: '654321' } });
    fireEvent.click(screen.getByRole('button', { name: /đăng ký/i }));
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });
});
