"use client";
// import Image from "next/image";
// import DecryptionGif from "../../public/assets/gifdecryption.gif";
// import Success from "../../public/assets/successblue.gif";
// import noPicture from "../../public/assets/picturenone.png";
// import Logo from "../../public/assets/espia.png";
import { useState, useEffect } from "react";
import { GiPadlock } from "react-icons/gi";
import { IoSearchSharp } from "react-icons/io5";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import LoadingSpinnerSmall from "@/components/LoadingSpinnerSmall";
import "react-circular-progressbar/dist/styles.css"; // Para importar o estilo da barra circular

import VerticalIcons from "../components/VerticalProgress";
import PreviousContent from "../components/PreviousContent";
import Congratulations from "@/components/Congratulations";

interface InstagramUser {
  id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [firstUser, setFirstUser] = useState<InstagramUser | null>(null);
  // const [firstUser, setFirstUser] = useState<InstagramUser | null>({
  //   id: '',
  //   username: '',
  //   full_name: '',
  //   profile_pic_url: ''
  // });
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0); // Percentual de progresso
  // const [showImage, setShowImage] = useState(false); // Para controlar quando mostrar a imagem
  const [primaryProgress, setPrimaryProgress] = useState(25); // Progresso da barra principal, começa em 25%
  // Adicione um novo estado para armazenar o nome de usuário encontrado
  const [username, setUsername] = useState<string | null>(null);
  // const [usernameId, setUsernameId] = useState<string | null>(null);

  const [decryptionProgress, setDecryptionProgress] = useState(false);
  const [imageFetch, setImageFetch] = useState(false);
  const [progressDecry, setProgressDecry] = useState(0);
  const [isErro429, setIsErro429] = useState(false);

  const [progressAnalys, setProgressAnalys] = useState(0);
  const [loadingAnalys, setLoadingAnalys] = useState(false);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      // Começa o carregamento da barra
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100 ) {
            clearInterval(progressInterval);
            // setShowImage(true); // Quando atingir 100%, mostra a imagem
            //setPrimaryProgress(50);
            // Quando a circular chegar a 100%, a barra principal vai para 50%
            //setLoadingAnalys(true);
            //console.log('progress FIRST USER....')
            return 100;
          }
          
          return prev + 2; // Ajuste para o incremento do progresso
        });
      }, 1000); // Atualiza a barra a cada 100ms
    }
  
    if (progressDecry >= 100) {
      setPrimaryProgress(95);
    }
  
    if (firstUser){
      setProgress(100);
      setLoadingAnalys(true);
     // console.log(loadingAnalys,"-------------------------------")
     // console.log(loading)
    }
    // console.log(username);
    // console.log(firstUser);
  }, [loading, progressDecry,firstUser]);



  useEffect(() => {
    // if (progress >= 100 && !loadingAnalys) {
    //   setLoadingAnalys(true);
    //   console.log(" setLoadingAnalys(true)");
    // }

    if (loadingAnalys) {
      setProgressAnalys(0)
//console.log("___________________________!!!!!!!!!!!")
     // console.log(loadingAnalys)
     // console.log(progressAnalys)
     
      // Começa o carregamento da barra
      const progressIntervalAnalys = setInterval(() => {
        setProgressAnalys((prev2) => {
          if (prev2 >= 100) {
            clearInterval(progressIntervalAnalys);
            // setShowImage(true); // Quando atingir 100%, mostra a imagem
            setPrimaryProgress(50);
            //console.log('LOADED')
            //setLoadingAnalys(false);
            // Quando a circular chegar a 100%, a barra principal vai para 50%
            return 100;
          }
         // console.log(prev2, "PREV 2 ")
          return prev2 + 3; // Ajuste para o incremento do progresso
        });
        
      }, 100); // Atualiza a barra a cada 100ms
    }
    // if (loadingAnalys >= 100){
    //   setLoadingAnalys(false);
    // }
    // console.log("progress 1 ", progress);
    // console.log("progress primary ", primaryProgress);
    // console.log("progress ANALYS ", progressAnalys);
    // console.log("progress DECRY ", progressDecry);
    // console.log(loadingAnalys);
  }, [loadingAnalys]);


  const handleReset = ()=>{
    setFirstUser(null)
    setLoadingAnalys(true)
  }
  const handleSearch = async () => {
    if (!search) return;
    const test429Error = localStorage.getItem("blocked429") === "true";
    if (test429Error) {
      setIsErro429(true);
      return; // ❌ Se já estiver bloqueado, para a execução aqui
    }

    setLoading(true);
    setFirstUser(null);
    const formattedSearch = search.replace(/^@/, "");
    try {
      const response = await fetch(
        `https://apiinstagram-ieuw.onrender.com/api/instagram-profile-pic/${formattedSearch}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const profileData = await response.json();

      if (profileData) {
        console.log(profileData);
        setImageFetch(false);
      }

      setFirstUser({
        id: profileData.id,
        username: profileData.username,
        full_name: profileData.full_name,
        profile_pic_url: profileData.profile_pic_url, // Já é uma data URL
      });
      setUsername(profileData.username);
      setLoading(false);
    } catch (error) {
      console.error("Erro na busca:", error);
      alert(`Erro ao buscnar perfil. Tente novamente :${error}`);
    } finally {
      // setLoading(false);
      console.log(formattedSearch); // Verifique o valor de search
    }
  };
  if (isErro429) {
    return (
      <div>
        <Congratulations isErro429={isErro429} />
      </div>
    ); // ✅ Agora está correto!
  }

  return (
    <div className="flex flex-col items-center max-w-[450px] w-full px-8 mx-auto h-svh bg-[#171531] ">
      <div className=" w-full max-w-md  my-10 space-y-5">
        <div className="relative w-full max-w-mdh-2 bg-gray-700 rounded-full mx-auto">
          <div
            className="h-2 bg-[#00D9CD] rounded-full transition-all duration-500"
            style={{ width: `${primaryProgress}%` }} // Barra principal
          ></div>
        </div>

        {!firstUser && (
          <img src="/espia.png" alt="Loading..." 
          className="w-52 mx-auto " />
        )}
        {decryptionProgress && progressDecry < 100 && (
          <div className="py-6">
            {progressDecry < 60 && (
              <div className="w-40 h-40 overflow-hidden rounded-full mx-auto">
                <img
                  src="gifdecryption.gif"
                  alt="Loading..."
                  className="w-60 h-44 scale-100 -mt-0 object-cover "
                />
              </div>
            )}
            {progressDecry > 60 && progressDecry < 99 && (
              <div className="w-40 h-40 overflow-hidden rounded-full mx-auto">
                <img
                  src="/successblue.gif"
                  alt="Loading..."
                  className="w-52 h-52 -mt-6 scale-110 object-cover transition-opacity duration-500 "
                />
              </div>
            )}
          </div>
        )}
      </div>
      {!firstUser ? (
        <div className="w-full max-w-md bg-[#232048] rounded-lg shadow-lg">
          <div className="mt-6 space-y-8 p-6 rounded-lg bg-[#232048]">
            <h1 className="text-center text-2xl font-semibold text-white sm:text-3xl">
              Espione <span className="text-blue-500">qualquer pessoa</span>{" "}
              apenas com o <span className="font-bold">@</span>
            </h1>
            <hr />
            <p className="text-center text-lg font-medium text-white ">
              Coloque o <span className="text-cyan-400">@ </span>da pessoa que
              você quer espionar
            </p>
            <div>
              <div className="relative mb-5">
                <input
                  type="search"
                  placeholder="Ex.: neymarjr"
                  className="rounded-xl w-full p-3 pr-16 outline-none text-white bg-[#232048] border border-cyan-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-3">
                  <button
                    className="rounded-lg bg-cyan-400 text-black px-4 py-2 hover:bg-cyan-400 disabled:opacity-50"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? <LoadingSpinnerSmall /> : <IoSearchSharp />}
                  </button>
                </span>
              </div>
            </div>
            <span className="text-center text-sm text-gray-500 relative ">
              <GiPadlock className=" text-cyan-400 text-2xl mt-4 absolute " />
              <span className="flex flex-col">
                <p className="mt-1 text-base">Dados seguros, a pessoa não</p>
                <p>saberá que você tentou espionar ela</p>
              </span>
            </span>
          </div>
        </div>
      ) : (
        <div>
          {!decryptionProgress ? (
            <div>
              <div className="flex flex-col items-center p-6 rounded-lg bg-[#232048]">
                <div className="relative w-[120px] h-[120px] mb-4">
                  <CircularProgressbar
                    value={progressAnalys}
                    strokeWidth={3}
                    styles={buildStyles({
                      pathColor: "#ffffff", // Cor da barra
                      textColor: "#fff", // Cor do texto (percentual)
                      trailColor: "#3e3e3e", // Cor do fundo
                    })}
                  />
                  {/* IMAGEM ICON */}
                  {progressAnalys < 100 ? (
                    <div className="text-white font-semibold text-xl flex flex-col text-center">
                      <img
                        src="/picturenone.png"
                        alt={firstUser.username}
                        width={110}
                        height={110}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                      />
                    </div>
                  ) : (
                    <div>
                      {!imageFetch ? (
                        <div>
                          <div>
                            <img
                              src={firstUser.profile_pic_url}
                              alt={firstUser.username}
                              width={110}
                              height={110}
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <img
                            src="/picturenone.png"
                            alt={firstUser.username}
                            width={110}
                            height={110}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {progressAnalys < 100 && (
                  <div className="text-white font-semibold text-lg w-full flex flex-col text-center">
                    <h1 className="text-2xl my-2">Analisando...</h1>

                    <h2 className="px-0 flex">
                      {" "}
                      Nosso sistema está procurando falhas segurança nessa conta
                      para achar uma brecha.
                    </h2>
                  </div>
                )}
                {progressAnalys === 100 && (
                  <>
                    <p className="text-white text-lg font-medium">
                      {firstUser.full_name}
                    </p>
                    <p className="text-gray-400">@{firstUser.username}</p>

                    <div className="mt-4 flex flex-col space-y-4 text-center">
                      <h1 className=" text-white font-normal text-lg px-4 py-2 ">
                        Podemos prosseguir ?
                      </h1>
                      <button
                        className="bg-cyan-600 text-white font-semibold text-md px-4 py-2 rounded-lg hover:bg-cyan-700"
                        onClick={() => setDecryptionProgress(true)}
                      >
                        Continuar, o perfil está correto
                      </button>
                      <button
                        className=" text-white font-semibold px-4 py-2 rounded-lg text-sm"
                        onClick={handleReset}
                      >
                        Não, quero corrigir
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              {progressDecry < 100 ? (
                <div className="w-full max-w-md p-6 px-2 sm:px-6 bg-[#232048] rounded-lg shadow-lg">
                  <div>
                    <VerticalIcons
                      progress={progressDecry}
                      setProgress={setProgressDecry}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {isErro429 && (
                    <div>
                      <Congratulations isErro429={isErro429} />
                    </div>
                  )}
                  {username && firstUser && (
                    <PreviousContent
                      setPrimaryProgress={setPrimaryProgress}
                      username={username}
                      firstUser={firstUser}
                      id={firstUser.id}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
