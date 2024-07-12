import Image from 'next/image';
import { AuthView } from './SignUpMethods';

interface AuthMethodsProps {
  handleGoogleLogin: () => Promise<void>;
  setView: React.Dispatch<React.SetStateAction<AuthView>>;
}

const AuthMethods = ({ handleGoogleLogin }: AuthMethodsProps) => {
  return (
    <>
      <div className="flex flex-col mt-6 space-y-2">
        <div className="flex space-x-2">
          <button
            type="button"
            className="flex-grow relative text-sm font-medium text-center rounded-md py-1.5 px-2.5 cursor-pointer bg-transparent border border-gray-100 hover:bg-gray-50 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-gray-100 focus:ring-offset-2 disabled:opacity-60"
            onClick={handleGoogleLogin}
          >
            <div className="relative w-6 h-6">
              <Image
                src="/google.png"
                alt="Google logo"
                fill={true}
                sizes="100%"
                className="object-contain"
              />
            </div>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden sm:block">
              Google
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthMethods;
