import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import PopUpGetNow from "@/components/PopUpGetNow";
import CongratulationsComponent from "@/components/Congratulations";
import { RiErrorWarningLine } from "react-icons/ri";

import MediaThemeTailwindAudio from "player.style/tailwind-audio/react";
interface PreviousContentProps {
 // handleViewReport:string,
  username: string;
  firstUser: FirstUser;
  id: string;
  setPrimaryProgress: React.Dispatch<React.SetStateAction<number>>;
  followers: Follower[];
  isFetchingData:boolean;
  highlightData: {
    thumbnail?: string;
    highlightId?: string;
  };
  congratulation: boolean;
  setCongratulation: React.Dispatch<React.SetStateAction<boolean>>; 
  isErro429: boolean;
  followersError: string | null;
  followersError2: boolean | null;
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
  profile_pic_base64?: string; // Adicionando o campo opcional para a imagem Base64
}

interface CustomCSS extends React.CSSProperties {
  "--media-primary-color"?: string;
  "--media-secondary-color"?: string;
}

const PreviousContent: React.FC<PreviousContentProps> = ({
  username,
  firstUser,
  setPrimaryProgress,
  setCongratulation,
  followers,
  highlightData,
  congratulation,
  isErro429,
  followersError,
  followersError2,
  isFetchingData,
}) => {
  //const [followers, setFollowers] = useState<Follower[]>([]);
  // const [highlightData, setHighlightData] = useState<{
  //   thumbnail?: string;
  //   highlightId?: string;
  // }>({});

  const [loading, setLoading] = useState<boolean>(true);

  const [endAudio, setEndAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

 // const [congratulation, setCongratulation] = useState<boolean>(false);
  const [showPopUpCongratulation, setShowPopUpCongratulation] = useState(false);
  //const [isErro429, setIsErro429] = useState<boolean>(false);
  //const [isBlocked,setIsBlocked]= useState<boolean>(false);
  //const [isErro429Popup, setIsErro429Popup] = useState<boolean>(false);
  //const [showCongratulation, setShowCongratulation] = useState(false);

  //const [followersError, setFollowersError] = useState<string | null>(null);
  //const [followersError2, setFollowersError2] = useState<boolean | null>(false);
  //const [isFetching, setIsFetching] = useState(false);

  // const [highlightsError, setHighlightsError] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);
  const [localization, setLocalization] = useState<string>("*******");
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const testMode = urlParams.get("test") === "1";

  //   // Modo de teste remove o bloqueio
  //   if (testMode) {
  //     localStorage.removeItem("blocked429");
  //     return;
  //   }

  //   // Verificar se está bloqueado
  //   if (localStorage.getItem("blocked429")) {
  //     setCongratulation(true);
  //   }
  // }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const remainingTime =
        audioRef.current.duration - audioRef.current.currentTime;

      if (remainingTime <= 1) {
        audioRef.current.pause(); // Para o áudio 2 segundos antes
        setEndAudio(true); // Mostra a div
      }
    }
  };

  const handleViewReport = () => {
    setCongratulation(true);
    setPrimaryProgress(100);
    window.scrollTo({ top: 0 });
  };

  const carouselRef = useRef<HTMLUListElement>(null);
  // const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  useEffect(() => {
    console.log(isErro429);
    //console.log(followers)
   
    if (congratulation) {
      // Primeiro popup (aparece depois de 5 segundos)

      const timerError = setTimeout(() => {
       // setIsErro429(false);
      }, 10000);

      // Segundo popup (aparece depois de 10 segundos)
      const timer = setTimeout(() => {
        setShowPopUpCongratulation(true);
      }, 10000);

      // Limpa os timers se `congratulation` mudar antes do tempo
      return () => {
        clearTimeout(timer);
        clearTimeout(timerError);
      };
    } else {
      setShowPopUpCongratulation(false);
    //  setIsErro429(false); // Garante que os popups desapareçam se `congratulation` for falso
    }
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            //console.log("Latitude: " + latitude + ", Longitude: " + longitude);

            try {
              // Fazendo a requisição para a API de geocodificação reversa
              const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=77d5ab0032034c27a023322cc201cb5e`
              );
              const data = await response.json();

              // Verificando se a resposta contém a cidade
              if (data.results && data.results.length > 0) {
                const components = data.results[0].components;

                // Tentando obter a cidade, cidade secundária, ou vila
                const city =
                  components.city ||
                  components.town ||
                  components.village ||
                  "Cidade não encontrada";
                //console.log("Cidade encontrada:", city);

                // Definindo a cidade no estado
                setLocalization(city);
              } else {
                setLocalization("*******");
              }
            } catch (error) {
              console.error("Erro ao obter nome da cidade:", error);
              setLocalization("*******");
            }
          },
          (error) => {
            console.error("Erro ao obter localização: ", error);
            setLocalization("*******");
          }
        );
      } else {
        console.error("Geolocalização não é suportada neste navegador.");
        setLocalization("*******");
      }
    };

    getLocation();
  }, [congratulation]);
  useEffect(() => {
    if (followers.length >= 0 || isFetchingData) {
      setLoading(false);
    }
  
    console.log("Followers Error:", followersError);
    console.log("Followers Error 2:", followersError2);
    console.log("Is Fetching Data:", isFetchingData);
  }, [loading, followersError, followersError2, isFetchingData]);
  
  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (isFetching) return;
  //     setIsFetching(true);
  
  //     // Verifica bloqueio antes de qualquer operação
  //     const isBlocked = localStorage.getItem("blocked429") === "true";
  //     if (isBlocked) {
  //       setIsErro429(true);
  //       setCongratulation(true);
  //       setIsFetching(false);
  //       return;
  //     }
  
  //     try {
  //       setLoading(true);
  
  //       // Funções de fetch paralelas
  //       const fetchFollowers = async () => {
  //         try {
  //           const response = await fetch(
  //             `https://apiinstagram-ieuw.onrender.com/api/instagram-followers/${username}`
  //           );
            
  //           if (response.status === 429) {
  //             localStorage.setItem("blocked429", "true");
  //             setCongratulation(true);
  //             setIsErro429(true);
  //             return;
  //           }
  
  //           if (!response.ok) {
  //             setFollowersError2(true);
  //             throw new Error(`Erro HTTP! Status: ${response.status}`);
  //           }
  
  //           const data = await response.json();
  //           if (data.status === "success" && data.followers?.length) {
  //             const followers = data.followers.map((follower: Follower) => ({
  //               username: follower.username,
  //               full_name: follower.full_name,
  //               profile_pic_base64: follower.profile_pic_base64 || "data:image/png;base64,...",
  //             }));
  //             setFollowers(followers);
  //             setFollowersError("seguidores carregados");
  //           } else {
  //             setFollowersError2(true);
  //           }
  //         } catch (err) {
  //           const error = err as Error;
  //           if (error.message.includes("429")) {
  //             localStorage.setItem("blocked429", "true");
  //             setCongratulation(true);
  //             setIsErro429(true);
  //           }
  //           console.error("Erro seguidores:", error);
  //           setFollowersError("Erro ao carregar seguidores");
  //         }
  //       };
  
  //       const fetchHighlights = async () => {
  //         try {
  //           const response = await fetch(
  //             `https://apiinstagram-ieuw.onrender.com/api/instagram-highlights/${username}`
  //           );
            
  //           if (response.status === 502) throw new Error("Problema temporário com o Instagram");
  //           if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
  
  //           const data = await response.json();
  //           if (data.status === "success") {
  //             setHighlightData({
  //               thumbnail: data.thumbnailBase64,
  //               highlightId: data.highlightId,
  //             });
  //           } else {
  //             setFollowersError("Nenhum dado encontrado");
  //           }
  //         } catch (err) {
  //           console.error("Erro highlights:", err);
  //           setFollowersError("Erro ao carregar destaques");
  //         }
  //       };
  
  //       // Executa ambos em paralelo
  //       await Promise.allSettled([fetchFollowers(), fetchHighlights()]);
  
  //     } catch (error) {
  //       console.error("Erro geral:", error);
  //     } finally {
  //       setIsFetching(false);
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchData();
  // }, [username]);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 150, behavior: "smooth" });
        }
      }
    }, 5000);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className=" w-full mx-auto">
      {!congratulation ? (
        <div className="flex flex-col max-w-[450px]  text-white  lg:pl-0 lg:pr-0 ">
          <h1 className="text-4xl mt-8 text-center font-bold">
          Essa sessão é apenas a 
            <b className="text-[#5468FF]"> Prévia </b>  
            <p className="text-xl pt-4 "> de como será sua experiência com nossa ferramenta. </p>
          </h1>
          <div className="items-center px-6 mx-auto rounded font-bold text-center bg-[#272445] p-5 mt-5">
            Prévia disponível
            <br /> por <b className="text-[#FF5489]">apenas 24h</b>
          </div>
          <button
            onClick={handleViewReport}
            className=" my-10 w-full bg-[#5266FF] p-6 text-xl font-semibold rounded-xl inline-flex items-center justify-center "
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
          <h3 className="text-2xl mt-5 text-center font-bold">
            Pessoas que ela mais <b className="text-[#5468FF]">interage</b>
          </h3>

          {isFetchingData ? (
            <div className="mx-auto mt-8 items-center flex flex-col space-y-3">
              <h1 className="font-medium">Buscando dados do <b className="font-medium text-[#5468FF]">@</b></h1>
              <LoadingSpinner />
            </div>
          ) : followersError === null ? (
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
                <img
                  src="/header-dm.png"
                  className="mb-2 w-full object-contain z-10 rounded-2xl"
                  alt=""
                  draggable="false"
                />
                <div className="itens space-x-3 flex items-end absolute z-[4] left-[4%] top-[35%]">
                  <img
                    src="/profile-m.png"
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
          ) : (
            <>
              <div className="relative w-full max-w-[300px] mx-auto overflow-hidden ">
                <ul
                  ref={carouselRef}
                  className="mt-4 text-black flex space-x-10 items-center overflow-x-scroll no-scrollbar scroll-smooth snap-x snap-mandatory"
                >
                  {followers.map((follower, index) => (
                    <li key={index} className="snap-center ">
                      {/* <div className="bg-red-500">
                        <img src={follower.profile_pic_base64} alt={follower.username} />

                      </div> */}

                      <div className="overflow-hidden rounded-lg shadow-sm hover:shadow-lg w-44 ">
                        <img
                          src={
                            follower.profile_pic_base64 || "/picturenone.png"
                          }
                          alt={follower.username}
                          width={100}
                          height={100}
                          className="w-80 object-contain"
                        />
                        <div className="bg-white p-4 w-full max-h-[80px]">
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
            </>
          )}
          {isFetchingData ? (
            <p></p>
          ) : followersError2 ? (
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
                <img
                  src="/header-dm.png"
                  className="mb-2 w-full object-contain z-10 rounded-2xl"
                  alt=""
                  draggable="false"
                />
                <div className="itens space-x-3 flex items-end absolute z-[4] left-[4%] top-[35%]">
                  <img
                    src="/profile-m.png"
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
          ) : followersError2 === false ? (
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
                  <img
                    src="/storiesEdited2.png"
                    alt="highlights"
                    className="w-[400px] min-w-[340px] object-cover"
                  />
                  <div className="absolute top-0 mt-3">
                    <p className="text-gray-600 text-[10px] mt-[48px] sm:mt-[60px] mb-2  ml-12 sm:ml-12">
                      Enviou o stories de @{username}
                    </p>
                    <div className="flex  items-center space-x-1 absolute ml-[55px] sm:ml-[64px] mt-3">
                      <img
                        src={firstUser.profile_pic_url}
                        alt="user highlight"
                        width={100}
                        height={100}
                        className="rounded-full min-w-[20px] w-[20px] sm:w-[24px]  p-[0.5px] border-[1px] border-green-500"
                      />
                      <span className="text-white font-normal text-[8px] max-w-14 sm:max-w-16 overflow-x-hidden">
                        {username}
                      </span>
                    </div>
                    {highlightData.thumbnail && (
                      <img
                        src={highlightData.thumbnail}
                        alt={`Highlight ${highlightData.highlightId}`}
                        width={100}
                        height={100}
                        className="rounded-xl h-[170px] w-[105px] sm:h-[185px] sm:w-[115px] top-0 mt-[0px] ml-[50px] sm:ml-[58px]"
                      />
                    )}
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
              <img
                src="/blocked-user.svg"
                className="mb-2"
                alt=""
                width="30"
                draggable="false"
              />
              <div className="messages select-none pointer-events-none space-y-[3px] pr-[20px] ">
                <div className="bg-[#262626] text-[14px] w-fit overflow-clip rounded-tr-3xl rounded-bl-3xl rounded-br-3xl rounded-tl-[4px] px-[14px] py-[8px] text-[#eee]">
                  <img src="/audio.svg" alt="" width="200" draggable="false" />
                </div>
              </div>
            </div>
            <div className="itens w-full space-x-3 flex items-end absolute z-[4] right-[2%] top-[14%] mt-10 flex-row-reverse ">
              {/* <img
              src={userBlocked}
              className="mb-2"
              alt=""
              width="30"
              draggable="false"
            /> */}
            
              <div className="messages select-none pointer-events-none space-y-[3px] pr-[10px] ">
                <div className="bg-[#3B67EA] text-[14px] w-fit overflow-clip rounded-tl-3xl rounded-br-[4px] rounded-bl-3xl rounded-tr-[4px] px-[14px] py-[8px] text-[#eee]">
                  <img src="/audio.svg" alt="" width="200" draggable="false" />
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
              <img
                alt=""
                src="/PUP.svg"
                className="mt-5 false"
                draggable="false"
              />
            </div>
          ) : (
            <div>
              <MediaThemeTailwindAudio
                className="w-full"
                style={
                  {
                    "--media-primary-color": "#404040",
                    "--media-secondary-color": "#171717",
                  } as CustomCSS
                }
              >
                <audio
                  slot="media"
                  src="/audio.mp3"
                  ref={audioRef}
                  onTimeUpdate={handleTimeUpdate}
                  playsInline
                ></audio>
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
              className="relative mx-auto  pointer-events-none "
              role="region"
              aria-roledescription="carousel"
            >
              <div className="flex gap-2 justify-center relative  ">
                <div className="flex items-center w-[180px] absolute justify-between mr-36 mt-3 lg:w-[210px] lg:mr-[180px]">
                  <div className="flex items-center">
                    <img
                      src={firstUser.profile_pic_url} // Exibe a primeira thumbnail corretamente
                      alt="user highlight"
                      width={100}
                      height={100}
                      className="rounded-full mr-2 border-2  p-[1px] border-green-500 ml-3 min-w-[32px] w-[30px]"
                    />
                    <span className="text-white font-normal text-[10px] -mr-6 sm:text-[11px]">
                      {username}
                    </span>
                  </div>

                  <img
                    src="/close.png"
                    alt="user highlight"
                    width={100}
                    height={100}
                    className=" min-w-[80px] w-[30px]"
                  />
                </div>
                <div className="flex items-center absolute w-[180px] ml-[170px] justify-between  mt-3 lg:w-[210px] lg:ml-[210px]">
                  <div className="flex items-center">
                    <img
                      src={firstUser.profile_pic_url} // Exibe a primeira thumbnail corretamente
                      alt="user highlight"
                      width={100}
                      height={100}
                      className="rounded-full mr-2 border-2  p-[1px] border-green-500 ml-3 min-w-[32px] w-[30px]"
                    />
                    <span className="text-white font-normal text-[10px] -mr-6 sm:text-[11px]">
                      {username}
                    </span>
                  </div>
                  <img
                    src="/close.png"
                    alt="user highlight"
                    width={100}
                    height={100}
                    className="min-w-[80px] w-[30px]"
                  />
                </div>

                <img
                  src="/story_1.png" // Exibe a primeira thumbnail corretamente
                  alt="user highlight"
                  className="rounded-xl w-[150px] h-[270px] lg:w-[200px] lg:h-[320px] "
                />
                <img
                  src="/story_2.png" // Exibe a primeira thumbnail corretamente
                  alt="user highlight"
                  className="rounded-xl w-[150px] h-[270px] lg:w-[200px] lg:h-[320px]"
                />
              </div>
            </div>
          </div>

          <h3 className="text-2xl mt-[100px] mb-3 text-center">
            Tenha acesso em <b className="text-[#5468FF]">TEMPO REAL</b> a
            localização do dispositivo da pessoa.
          </h3>
          <img src="/map.png" alt="user highlight" className="w-full mb-8" />
          <h3 className="text-2xl mt-[100px] mb-3 text-center">
            Alguns arquivos de mídia como{" "}
            <b className="text-[#5468FF]">fotos e vídeos</b> foram encontrados
            em algumas conversas.
          </h3>
          <img
            src="/gallery.png"
            alt="user highlight"
            className="w-full mb-4"
          />
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
          <CongratulationsComponent isErro429={isErro429} />
          {/* <button onClick={()=>setCongratulation(false)}>teste</button> */}
          {!isErro429 && (
            <div
              role="alert"
              className="rounded-sm border-s-4 border-red-500 bg-red-50 p-4 absolute -top-0 w-[80%] mx-10"
            >
              <strong className="flex gap-2 items-center font-medium text-red-800 ">
                {" "}
                <RiErrorWarningLine className="text-2xl" />
                Você Atingiu o limite de busca !{" "}
              </strong>
            </div>
          )}

          {showPopUpCongratulation && (
            <PopUpGetNow
              username={username}
              showPopUpCongratulation={showPopUpCongratulation}
              setShowPopUpCongratulation={setShowPopUpCongratulation}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PreviousContent;
