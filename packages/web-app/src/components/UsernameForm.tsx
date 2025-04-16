import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// フォームスキーマの定義
const formSchema = z.object({
  username: z
    .string()
    .min(1, 'ユーザー名を入力してください')
    .max(50, '50文字以内で入力してください')
    .regex(/^[a-zA-Z0-9_.-]+$/, '英数字、アンダースコア、ドット、ハイフンのみ使用可能です'),
});

type FormValues = z.infer<typeof formSchema>;

interface UsernameFormProps {
  onSubmit: (username: string) => void;
  isLoading?: boolean;
}

export function UsernameForm({ onSubmit, isLoading = false }: UsernameFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  const onFormSubmit = (data: FormValues) => {
    onSubmit(data.username);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="w-full">
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          ユーザー名
        </label>
        <div className="relative">
          <input
            id="username"
            type="text"
            {...register('username')}
            className={`w-full px-4 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="確認したいユーザー名を入力"
            disabled={isLoading}
            autoComplete="off"
          />
        </div>
        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full px-4 py-2 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? '確認中...' : '利用可能か確認する'}
      </button>
    </form>
  );
}
