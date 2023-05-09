import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Signin() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex justify-center h-screen">
      {session ? (
        <div className="grid m-auto text-center">
          <div className="m-4 text-xl text-white">
            {" "}
            "{session.user.name}" 으로 로그인되었습니다 :)
          </div>
          <button
            className={`w-60
                      justify-self-center
                      p-1 mb-4
                    bg-pink-500 text-white
                      border border-pink-500 rounded
                    hover:bg-white hover:text-pink-500`}
            onClick={() => router.push("/")}
          >
            "{session.user.name}"의 TO-DO 수정하기
          </button>
          {session?.user.id === "2781685147" ? (
            <button
              className={`w-60
                      justify-self-center
                      p-1 mb-4
                    bg-green-500 text-white
                      border border-green-500 rounded
                    hover:bg-white hover:text-green-500`}
              onClick={() => router.push("/admin")}
            >
              관리자 페이지로 가기
            </button>
          ) : (
            <div></div>
          )}
          {console.log()}
          <button
            className={`w-60
                      justify-self-center
                      p-1 mb-4
                    text-blue-500
                      border border-blue-500 rounded
                    hover:bg-white hover:text-blue-500`}
            onClick={() => signOut()}
          >
            로그아웃하기
          </button>
        </div>
      ) : (
        <div className="grid m-auto text-center">
          <div className="m-4 text-white">
            로그인되지 않았습니다. <br></br>아래 버튼을 눌러 로그인해주세요!
          </div>
          <button
            className={`w-40
                      justify-self-center
                      p-1 mb-4
                    bg-pink-500 text-white
                      border border-pink-500 rounded
                    hover:bg-white hover:text-pink-500`}
            onClick={() => signIn()}
          >
            로그인 하기
          </button>
        </div>
      )}
    </div>
  );
}
