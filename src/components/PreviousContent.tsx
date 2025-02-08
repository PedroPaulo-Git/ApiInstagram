import { useEffect, useRef, useState } from "react";
import Image from "next/image";

//import Audiomp3 from '../app/assets/audio.mp3'


import Direct from "../app/assets/header-dm.png";
import userDirect from "../app/assets/profile-m.png";

import templateHighlights from "../app/assets/storiesEdited2.png";
import CloseFriendsStories from "../app/assets/story_1.png";
import CloseFriendsStories2 from "../app/assets/story_2.png";
import Close from "../app/assets/close.png";
import Map from "../app/assets/map.png";
import Gallery from "../app/assets/gallery.png";
import AudioPng from "../app/assets/audio.svg";
import userBlocked from "../app/assets/blocked-user.svg";
import PUP from '../app/assets/PUP.svg';

import LoadingSpinner from "@/components/LoadingSpinner";
import PopUpGetNow from '@/components/PopUpGetNow';
import CongratulationsComponent from '@/components/Congratulations';


import MediaThemeTailwindAudio from "player.style/tailwind-audio/react";
interface PreviousContentProps {
  username: string;
  firstUser: FirstUser;
  id: string;
  setPrimaryProgress: React.Dispatch<React.SetStateAction<number>>;
}

interface FirstUser {
  id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  highlights?: string[];
}

interface Follower {
  username: string;
  full_name: string;
  profile_pic_url: string;
}

const PreviousContent: React.FC<PreviousContentProps> = ({
  username,
  firstUser,
  id,
  setPrimaryProgress,
}) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [endAudio, setEndAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [congratulation, setCongratulation] = useState<boolean>(false);
  const [showPopUpCongratulation, setShowPopUpCongratulation] = useState(false);

  const [followersError, setFollowersError] = useState<string | null>(null);
  const [highlightsError, setHighlightsError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localization, setLocalization] = useState<string>("");

const handleTimeUpdate = () => {
    if (audioRef.current) {
      const remainingTime = audioRef.current.duration - audioRef.current.currentTime;
      
      if (remainingTime <= 1) { 
        audioRef.current.pause(); // Para o áudio 2 segundos antes
        setEndAudio(true); // Mostra a div
      }
    }
  };

  const handleViewReport = () => {
    setCongratulation(true);
    setPrimaryProgress(100); 
    window.scrollTo({ top: 0});
  };

  const carouselRef = useRef<HTMLUListElement>(null);
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  useEffect(() => {
    if (congratulation) {
      const timer = setTimeout(() => {
        setShowPopUpCongratulation(true);
      }, 5000);
  
      return () => clearTimeout(timer); // Limpa o timer se `congratulation` mudar antes do tempo
    } else {
      setShowPopUpCongratulation(false); // Garante que o PopUp desapareça se `congratulation` for falso
    }
    const getIpLocation = async () => {
      try {
        const response = await fetch("http://ip-api.com/json/");
        const data = await response.json();
        setLocalization(data.city || "*****");
      } catch (error) {
        console.error("Erro ao obter localização pelo IP:", error);
        setLocalization("*****");
      }
    };

    getIpLocation();
  }, [congratulation]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // --- Fetch de seguidores ---
        try {
          console.log("Buscando seguidores para:", username);
          const followersResponse = await fetch(
            `https://instagram-scraper-api2.p.rapidapi.com/v1/followers?username_or_id_or_url=${username}`,
            {
              method: "GET",
              headers: {
                // "x-rapidapi-key":
                //   "07f8ca038amshb9b7481a48db93ap121322jsn2d474082fbff",
                "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
              },
            }
          );
          await delay(500);
          const followersData = await followersResponse.json();
          console.log("Dados de seguidores:", followersData);
          if (followersData.data?.items?.length) {
            setFollowers(
              followersData.data.items.slice(0, 10).map((f: any) => ({
                username: f.username,
                full_name: f.full_name,
                profile_pic_url: f.profile_pic_url,
              }))
            );
            setFollowersError(null);
          } else {
            setFollowersError("Nenhum seguidor encontrado.");
          }
        } catch (err) {
          console.error("Erro ao buscar seguidores:", err);
          setFollowersError("Erro ao carregar seguidores.");
        }

        // --- Fetch de highlights (primeira etapa: obter o highlight ID) ---
        try {
          console.log(
            "Buscando highlights (get_ig_user_highlights.php) para:",
            username
          );
          const highlightsResponse = await fetch(
            "https://instagram-scraper-stable-api.p.rapidapi.com/get_ig_user_highlights.php",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-rapidapi-host":
                  "instagram-scraper-stable-api.p.rapidapi.com",
                // "x-rapidapi-key":
                //   "07f8ca038amshb9b7481a48db93ap121322jsn2d474082fbff", // Use a chave de teste, se for o caso
              },
              body: `username_or_url=https://www.instagram.com/${username}/`,
            }
          );
          await delay(500); // Aumenta o delay para reduzir o risco de 429
          const highlightsData = await highlightsResponse.json();
          console.log(
            "Dados de highlights (get_ig_user_highlights.php):",
            highlightsData
          );

          if (highlightsData && highlightsData.length > 0) {
            // Acessa o primeiro highlight através da propriedade node
            const firstHighlight = highlightsData[0].node;
            // Extrai somente a parte numérica removendo o prefixo "highlight:"
            const highlightId = firstHighlight.id; // NÃO remover "highlight:"
            console.log("Highlight ID obtido:", highlightId);

            // --- Segunda etapa: buscar thumbnail usando o numericId ---
            // --- Segunda etapa: buscar thumbnail usando o numericId ---
            const fetchThumbnail = await fetch(
              "https://instagram-scraper-stable-api.p.rapidapi.com/get_highlights_stories.php",
              {
                method: "POST", // Alterado de GET para POST
                headers: {
                  "x-rapidapi-key":
                    "07f8ca038amshb9b7481a48db93ap121322jsn2d474082fbff",
                  "x-rapidapi-host":
                    "instagram-scraper-stable-api.p.rapidapi.com",
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `highlight_id=${encodeURIComponent(highlightId)}`, // Enviando somente o número
              }
            );
            await delay(100);
            const thumbnailData = await fetchThumbnail.json();
            console.log("Thumbnail Data:", thumbnailData);
            if (thumbnailData.items?.length > 0) {
              const thumbnailUrl = thumbnailData.items[0].image_versions2.candidates[0].url;
              setHighlights([thumbnailUrl]); // Atualiza a imagem do highlight com a thumbnail
            }
          } else {
            setHighlightsError("Nenhum highlight encontrado.");
          }
        } catch (err) {
          console.error("Erro ao buscar highlights:", err);
          setHighlightsError("Erro ao carregar highlights.");
        }
      } catch (err) {
        setError("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 4000);

    return () => clearInterval(scrollInterval);
  }, [followers]);

  return (
    <div className=" w-full mx-auto">
      {!congratulation ? (
        <div className="flex flex-col max-w-[450px]  text-white  lg:pl-0 lg:pr-0 ">
          <h1 className="text-4xl mt-8 text-center font-bold">
            <b className="text-[#5468FF]">Prévia</b> do seu @
          </h1>
          <div className="items-center px-6 mx-auto rounded font-bold text-center bg-[#272445] p-5 mt-5">
            Prévia disponível
            <br /> por <b className="text-[#FF5489]">apenas 24h</b>
          </div>
          <h3 className="text-2xl mt-5 text-center font-bold">
            Pessoas que ela mais <b className="text-[#5468FF]">interage</b>
          </h3>

          {loading ? (
            <div className="mx-auto mt-8">
              <LoadingSpinner />
            </div>
          ) : followersError ? (
            <div></div>
          ) : (
            <div className="relative w-full max-w-[300px] mx-auto overflow-hidden ">
              <ul
                ref={carouselRef}
                className="mt-4 text-black flex space-x-10 items-center overflow-x-scroll no-scrollbar scroll-smooth snap-x snap-mandatory"
              >
                {followers.map((follower, index) => (
                  <li key={index} className="snap-center ">
                    <div className="overflow-hidden rounded-lg shadow-sm hover:shadow-lg w-44 ">
                      <Image
                        src={follower.profile_pic_url}
                        alt={follower.username}
                        width={100}
                        height={100}
                        className="w-80 object-contain"
                      />
                      <div className="bg-white p-4 w-full">
                        <p className="text-lg font-semibold">
                          {"*".repeat(3) +
                            follower.full_name.slice(3, -3) +
                            "*".repeat(3)}
                        </p>
                        <p className="text-gray-400">
                          @
                          {"*".repeat(3) +
                            follower.username.slice(3, -3) +
                            "*".repeat(3)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {loading ? (
            <p></p>
          ) : followersError ? (
            <>
            <h1 className="text-2xl mt-[50px] text-center">
              Detectamos <b className="text-[#5468FF]">conversas pessoais</b>{" "}
              dessa pessoa
            </h1>
            <p className="text-gray-400 text-center mt-5 mb-5">
              Nossa inteligência artificial identificou algumas conversas mais
              pessoais.
            </p>
            <div className="print bg-[#000] rounded-2xl relative h-[240px] mt-[20px] w-full overflow-hidden">
              <Image
                src={Direct}
                className="mb-2 w-full object-contain z-10 rounded-2xl"
                alt=""
                draggable="false"
              />
              <div className="itens space-x-3 flex items-end absolute z-[4] left-[4%] top-[35%]">
                <Image
                  src={userDirect}
                  className="mb-2"
                  alt=""
                  width="30"
                  draggable="false"
                />
                <div className="messages select-none pointer-events-none space-y-[3px] pr-[20px] ">
                  <div className="bg-[#262626] text-[14px] w-fit rounded-tr-3xl rounded-bl-[4px] rounded-br-3xl rounded-tl-3xl px-[14px] py-[8px] text-[#eee]">
                    <span>ei</span>
                  </div>
                  <div className="bg-[#262626] text-[14px] w-fit rounded-tr-3xl rounded-tl-[4px] rounded-bl-[4px] rounded-br-3xl  px-[14px] py-[8px] text-[#eee]">
                    <span>Vai tá em {localization} esses dias?</span>
                  </div>
                  <div className="bg-[#262626] text-[14px] w-fit rounded-tr-3xl rounded-tl-[4px] rounded-bl-[4px] rounded-br-3xl  px-[14px] py-[8px] text-[#eee]">
                    <span>Quero te ver rsrsrsrs</span>
                  </div>
                </div>
              </div>
            </div>
            </>
          ) : highlights.length > 0 ? (
            <>
              <h1 className="text-2xl mt-[50px] text-center">
                Detectamos <b className="text-[#5468FF]">conversas pessoais</b>{" "}
                dessa pessoa
              </h1>
              <p className="text-gray-400 text-center mt-5 mb-5">
                Nossa inteligência artificial identificou algumas conversas mais
                pessoais.
              </p>

              <div className="flex items-center justify-between mt-10">
                <div className="h-80 relative mx-auto ">
                  <Image
                    src={templateHighlights}
                    alt="highlights"
                    className="w-96 object-cover"
                  />
                  <div className="absolute top-0 mt-3">
                    <p className="text-gray-600 text-[10px] mt-[52px] mb-2 ml-12">
                      Enviou o stories de @{username}
                    </p>
                    <div className="flex  items-center space-x-1 absolute ml-[58px] mt-3">
                      <Image
                        src={firstUser.profile_pic_url}
                        alt="user highlight"
                        width={100}
                        height={100}
                        className="rounded-full min-w-[20px] w-[20px]"
                      />
                      <span className="text-white font-normal text-[9px] max-w-16 overflow-x-hidden">
                        {username}
                      </span>
                    </div>
                    <Image
                      src={highlights[0]}
                      alt="user highlight"
                      width={100}
                      height={100}
                      className="rounded-xl h-[165px] top-0 mt-[0px] ml-[55px] "
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div></div>
          )}

          <h1 className="text-2xl mt-[100px] text-center">
            Detectamos{" "}
            <b className="text-[#5468FF]">áudios em algumas conversas...</b>
          </h1>
          <p className="text-gray-400 text-center mt-1 mb-5">
            Para desbloquear esses e outros áudios e conversas adquira nossa
            ferramenta.
          </p>

          <div className="print bg-[#000] rounded-2xl relative h-[180px] mt-[20px] w-full mx-3">
            <div className="itens space-x-3 flex items-end absolute z-[4] left-[4%] top-[5%]">
              <Image
                src={userBlocked}
                className="mb-2"
                alt=""
                width="30"
                draggable="false"
              />
              <div className="messages select-none pointer-events-none space-y-[3px] pr-[20px] ">
                <div className="bg-[#262626] text-[14px] w-fit overflow-clip rounded-tr-3xl rounded-bl-3xl rounded-br-3xl rounded-tl-[4px] px-[14px] py-[8px] text-[#eee]">
                  <Image src={AudioPng} alt="" width="200" draggable="false" />
                </div>
              </div>
            </div>
            <div className="itens w-full space-x-3 flex items-end absolute z-[4] right-[2%] top-[14%] mt-10 flex-row-reverse ">
              {/* <Image
              src={userBlocked}
              className="mb-2"
              alt=""
              width="30"
              draggable="false"
            /> */}
              <div className="messages select-none pointer-events-none space-y-[3px] pr-[10px] ">
                <div className="bg-[#3B67EA] text-[14px] w-fit overflow-clip rounded-tl-3xl rounded-br-[4px] rounded-bl-3xl rounded-tr-[4px] px-[14px] py-[8px] text-[#eee]">
                  <Image src={AudioPng} alt="" width="200" draggable="false" />
                </div>
                <div className="w-full flex justify-end">
                  <div className="bg-[#3B67EA] text-[14px] w-fit overflow-clip rounded-tl-3xl rounded-br-3xl rounded-bl-3xl rounded-tr-[4px] px-[14px] py-[8px] text-[#eee]">
                    Foi em {localization} viu kkkkk
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl mt-[100px] mb-3 text-center">
            Escute agora o <b className="text-[#5468FF]">áudio</b> que a pessoa
            que você quer espionar recebeu:
          </h3>
          <p className="text-gray-400 text-center mt-1">
            Toque no player para escutar.
          </p>
          {endAudio ? (
            <div>
<Image alt='' src={PUP} className="mt-5 false" draggable="false"/>
            </div>
          ):(
            <div>
              <MediaThemeTailwindAudio
            className="w-full"
            style={
              {
                "--media-primary-color": "#404040",
                "--media-secondary-color": "#171717",
              } as any
            }
          >
           <audio slot="media" 
           src="/audio.mp3" 
           ref={audioRef}
           onTimeUpdate={handleTimeUpdate}
           playsInline></audio>
          </MediaThemeTailwindAudio>
            </div>
          )}
        

          <h3 className="text-2xl mt-[100px] text-center">
            Por dentro do <b className="text-[#5468FF]">close friends</b>
          </h3>
          <p className="text-gray-400 text-center mt-1">
            Para desbloquear acesso total do CF da pessoa espionada adquira
            nosso sistema.
          </p>
          <div className="mt-8 ">
            <div
              className="relative mx-auto   pointer-events-none"
              role="region"
              aria-roledescription="carousel"
            >
              <div className="flex  gap-4 relative overflow-hidden ">
                <div className="flex items-center w-[200px] absolute justify-between  mt-3">
                  <div className="flex items-center">
                  <Image
                    src={firstUser.profile_pic_url} // Exibe a primeira thumbnail corretamente
                    alt="user highlight"
                    width={100}
                    height={100}
                    className="rounded-full mr-2 border-2  p-[1px] border-green-500 ml-3 min-w-[32px] w-[30px]"
                  />
                  <span className="text-white font-normal text-[11px] -mr-2">
                    {username}
                  </span>
                  </div>
                  
                  
                  <Image
                    src={Close}
                    alt="user highlight"
                    width={100}
                    height={100}
                    className=" min-w-[80px] w-[30px]"
                  />
                </div>
                <div className="flex items-center absolute w-[200px] ml-[200px] justify-between  mt-3">
                <div className="flex items-center">
                  <Image
                    src={firstUser.profile_pic_url} // Exibe a primeira thumbnail corretamente
                    alt="user highlight"
                    width={100}
                    height={100}
                    className="rounded-full mr-2 border-2  p-[1px] border-green-500 ml-3 min-w-[32px] w-[30px]"
                  />
                  <span className="text-white font-normal text-[11px] -mr-2">
                    {username}
                  </span>
                  </div>
                  <Image
                    src={Close}
                    alt="user highlight"
                    width={100}
                    height={100}
                    className="min-w-[80px] w-[30px]"
                  />
                </div>

                <Image
                  src={CloseFriendsStories} // Exibe a primeira thumbnail corretamente
                  alt="user highlight"
                  className="rounded-xl w-[220px] h-[320px] "
                />
                <Image
                  src={CloseFriendsStories2} // Exibe a primeira thumbnail corretamente
                  alt="user highlight"
                  className="rounded-xl w-[220px] h-[320px]"
                />
              </div>
            </div>
          </div>

          <h3 className="text-2xl mt-[100px] mb-3 text-center">
            Tenha acesso em <b className="text-[#5468FF]">TEMPO REAL</b> a
            localização do dispositivo da pessoa.
          </h3>
          <Image src={Map} alt="user highlight" className="w-full mb-8" />
          <h3 className="text-2xl mt-[100px] mb-3 text-center">
            Alguns arquivos de mídia como{" "}
            <b className="text-[#5468FF]">fotos e vídeos</b> foram encontrados
            em algumas conversas.
          </h3>
          <Image src={Gallery} alt="user highlight" className="w-full mb-4" />
          <button
            onClick={handleViewReport} 
            className=" mb-40 w-full bg-[#5266FF] p-6 text-xl font-semibold rounded-xl inline-flex items-center justify-center "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-eye mr-3 size-6"
            >
              <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>{" "}
            Ver relatório completo
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-start">
           
        <CongratulationsComponent/>
        {/* <button onClick={()=>setCongratulation(false)}>teste</button> */}
        {showPopUpCongratulation && 
        <PopUpGetNow 
        username={username}
        showPopUpCongratulation={showPopUpCongratulation} 
        setShowPopUpCongratulation={setShowPopUpCongratulation} />}
     
      </div>
      
      )}
    </div>
  );
};

export default PreviousContent;
