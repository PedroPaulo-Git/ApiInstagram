"use client";
import Image from "next/image";
import DecryptionGif from "../app/assets/gifdecryption.gif";
import Success from "../app/assets/successblue.gif";
import GifPadlock2 from "../app/assets/gifpacklock2.gif";
import noPicture from "../app/assets/picturenone.png";
import Logo from '../app/assets/espia.png';
import { useState, useEffect } from "react";
import { GiPadlock } from "react-icons/gi";
import { IoSearchSharp } from "react-icons/io5";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

import LoadingSpinnerSmall from "@/components/LoadingSpinnerSmall";
import "react-circular-progressbar/dist/styles.css"; // Para importar o estilo da barra circular

import VerticalIcons from "../components/VerticalProgress";
import PreviousContent from "../components/PreviousContent";

interface InstagramUser {
  id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [firstUser, setFirstUser] = useState<InstagramUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Percentual de progresso
  const [showImage, setShowImage] = useState(false); // Para controlar quando mostrar a imagem
  const [primaryProgress, setPrimaryProgress] = useState(25); // Progresso da barra principal, começa em 25%
  // Adicione um novo estado para armazenar o nome de usuário encontrado
  const [username, setUsername] = useState<string | null>(null);
  const [usernameId, setUsernameId] = useState<string | null>(null);

  const [decryptionProgress, setDecryptionProgress] = useState(false);
  const [progressDecry, setProgressDecry] = useState(0);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      // Começa o carregamento da barra
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setShowImage(true); // Quando atingir 100%, mostra a imagem
            setPrimaryProgress(50);
            // Quando a circular chegar a 100%, a barra principal vai para 50%
            return 100;
          }
          return prev + 2; // Ajuste para o incremento do progresso
        });
      }, 100); // Atualiza a barra a cada 100ms
    }
 
    if (progressDecry >= 100) {
      setPrimaryProgress(95);
     
    }
  }, [loading, progressDecry]);

  const handleSearch = async () => {
    if (!search) return;

    setLoading(true);
    setFirstUser(null);
    setShowImage(false); // Esconde a imagem quando a busca começar
    setUsername(null);

    try {
      const response = await fetch(
        `https://instagram-scraper-api2.p.rapidapi.com/v1.2/search?search_query=${search}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "07f8ca038amshb9b7481a48db93ap121322jsn2d474082fbff",
            "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
          },
        }
      );

      const data = await response.json();

      if (data.data.users.length > 0) {
        const user = data.data.users[0];
        setFirstUser({
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          profile_pic_url: user.profile_pic_url,
        });
        // console.log(user);
        setUsername(user.username);
        setUsernameId(user.id);
      }
      // console.log(data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };
  const [showFirst, setShowFirst] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowFirst((prev) => !prev);
    }, 3000); // Alterna a cada 1 segundo (ajuste o tempo conforme necessário)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center max-w-[450px] w-full px-8 mx-auto h-svh bg-[#171531] ">
      <div className=" w-full max-w-md  my-10 space-y-5">
        <div className="relative w-full max-w-mdh-2 bg-gray-700 rounded-full mx-auto">
          <div
            className="h-2 bg-[#00D9CD] rounded-full transition-all duration-500"
            style={{ width: `${primaryProgress}%` }} // Barra principal
          ></div>
        </div>

        {progress < 10 && (
          <Image
          src={Logo}
          alt="Loading..."
          className="w-52 mx-auto "
        />
        )}
        {decryptionProgress && progressDecry < 100 && (
          <div className="py-6">
            {progressDecry < 60 && (
              <div className="w-40 h-40 overflow-hidden rounded-full mx-auto">
                <Image
                  src={DecryptionGif}
                  alt="Loading..."
                  className="w-60 h-44 scale-100 -mt-0 object-cover "
                />
              </div>
            )}
            {progressDecry > 60 && progressDecry < 99 && (
              <div className="w-40 h-40 overflow-hidden rounded-full mx-auto">
                <Image
                  src={Success}
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
                  
                      {loading ? <LoadingSpinnerSmall /> : <IoSearchSharp  />}
                  
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
                    value={progress}
                    strokeWidth={3}
                    styles={buildStyles({
                      pathColor: "#ffffff", // Cor da barra
                      textColor: "#fff", // Cor do texto (percentual)
                      trailColor: "#3e3e3e", // Cor do fundo
                    })}
                  />
                  {progress < 100 ? (
                    <div className="text-white font-semibold text-xl flex flex-col text-center">
                      <Image
                        src={noPicture}
                        alt={firstUser.username}
                        width={110}
                        height={110}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                      />
                    </div>
                  ) : (
                    <div>
                      <Image
                        src={firstUser.profile_pic_url}
                        alt={firstUser.username}
                        width={110}
                        height={110}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                      />
                    </div>
                  )}
                </div>
                {progress < 100 && (
                  <div className="text-white font-semibold text-lg w-full flex flex-col text-center">
                    <h1 className="text-2xl my-2">Analisando...</h1>

                    <h2 className="px-0 flex">
                      {" "}
                      Nosso sistema está procurando falhas segurança nessa conta
                      para achar uma brecha.
                    </h2>
                  </div>
                )}
                {progress === 100 && (
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
                      onClick={() => setFirstUser(null)}
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
