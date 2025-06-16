"use client";
import LoginForm from "../../components/common/loginform";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter();
  const goHome = () => {
    router.push("/");
  };

  return (
    
    <div>
        <button onClick={goHome} className="m-5 bg-white/10 text-white px-4 py-2 rounded shadow hover:bg-white/20 transition w-fit">
  Home
</button>
      <LoginForm />
 
    </div>
  );
}
