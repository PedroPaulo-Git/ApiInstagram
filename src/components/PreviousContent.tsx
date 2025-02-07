import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import templateHighlights from "../app/assets/storiesEdited2.png";
import CloseFriendsStories from "../app/assets/story_1.png";
import CloseFriendsStories2 from "../app/assets/story_2.png";
import Close from "../app/assets/close.png";
import Map from "../app/assets/map.png";
import Gallery from "../app/assets/gallery.png";
import MediaThemeTailwindAudio from "player.style/tailwind-audio/react";
interface PreviousContentProps {
  username: string;
  firstUser: FirstUser;
  id: string;
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
}) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLUListElement>(null);

  const fetchFollowers = async () => {
    try {
      const response = await fetch(
        `https://instagram-scraper-api2.p.rapidapi.com/v1/followers?username_or_id_or_url=${username}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "e9b32b11efmsh61c3992491c9be9p1319a0jsn3179f3d855a3",
            "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
          },
        }
      );

      const data = await response.json();
      if (data.data?.items?.length) {
        setFollowers(data.data.items.slice(0, 10).map((f: any) => ({
          username: f.username,
          full_name: f.full_name,
          profile_pic_url: f.profile_pic_url,
        })));
        setError(null);
      } else {
        setError("Nenhum seguidor encontrado.");
      }
    } catch (error) {
      setError("Erro ao carregar seguidores.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHighlights = async () => {
    try {
      const response = await fetch(
        `https://instagram-scraper-api2.p.rapidapi.com/v1/highlights?username_or_id_or_url=${username}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "e9b32b11efmsh61c3992491c9be9p1319a0jsn3179f3d855a3",
            "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
          },
        }
      );
      const data = await response.json();

      if (data.data?.items?.length) {
        const firstHighlight = data.data.items[0];
        const formData = new URLSearchParams();
        formData.append("highlight_id", firstHighlight.id);

        const fetchThumbnail = await fetch(
          "https://instagram-scraper-stable-api.p.rapidapi.com/get_highlights_stories.php",
          {
            method: "POST",
            headers: {
              "x-rapidapi-key":
                "e9b32b11efmsh61c3992491c9be9p1319a0jsn3179f3d855a3",
              "x-rapidapi-host":
                "instagram-scraper-stable-api.p.rapidapi.com",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
          }
        );

        const thumbnailData = await fetchThumbnail.json();
        if (thumbnailData.items?.length) {
          const thumbnailUrl =
            thumbnailData.items[0].image_versions2.candidates[0].url;
          setHighlights([thumbnailUrl]);
        }
      } else {
        setError("Nenhum highlight encontrado.");
      }
    } catch (error) {
      setError("Erro ao carregar highlights.");
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, [username]);

  useEffect(() => {
    fetchHighlights();
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
    <div className="max-w-[450px] w-full mx-auto">
      <div className="flex flex-col text-white">
        <h1 className="text-4xl mt-8 text-center font-bold">
          <b className="text-[#5468FF]">Prévia</b> do seu @
        </h1>
        <div className="items-center w-46 mx-auto rounded font-bold text-center bg-[#272445] p-5 mt-5">
          Prévia disponível
          <br /> por <b className="text-[#FF5489]">apenas 24h</b>
        </div>
        <h3 className="text-2xl mt-5 text-center font-bold">
          Pessoas que ela mais <b className="text-[#5468FF]">interage</b>
        </h3>

        {loading ? (
          <p>Carregando seguidores...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="relative w-full max-w-md overflow-hidden ">
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

        <h1 className="text-2xl mt-[50px] text-center">
          Detectamos <b className="text-[#5468FF]">conversas pessoais</b> dessa
          pessoa
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
              className=" w-96 object-cover"
            />
            {highlights.length > 0 && (
              <div className="absolute top-0">
                <p className="text-gray-600 text-xs mt-[70px] mb-2 ml-12">
                  Enviou o stories de @{username}
                </p>
                <div className="flex items-center space-x-2 absolute ml-[70px] mt-3">
                  <Image
                    src={firstUser.profile_pic_url} // Exibe a primeira thumbnail corretamente
                    alt="user highlight"
                    width={100}
                    height={100}
                    className="rounded-full min-w-[20px] w-[20px]"
                  />
                  <span className="text-white font-normal text-[9px]">
                    {username}
                  </span>
                </div>
                <Image
                  src={highlights[0]} // Exibe a primeira thumbnail de highlight corretamente
                  alt="user highlight"
                  width={100}
                  height={100}
                  className="rounded-xl h-[200px] w-32 top-0 mt-[0px] ml-[63px]"
                />
              </div>
            )}
          </div>
        </div>

        <h1 className="text-2xl mt-[100px] text-center">
          Detectamos{" "}
          <b className="text-[#5468FF]">áudios em algumas conversas...</b>
        </h1>
        <p className="text-gray-400 text-center mt-1 mb-5">
          Para desbloquear esses e outros áudios e conversas adquira nossa
          ferramenta.
        </p>
        <p className="text-gray-400 text-center mt-1">
          Toque no player para escutar.
        </p>
        <MediaThemeTailwindAudio
          style={
            {
              "--media-primary-color": "#404040",
              "--media-secondary-color": "#171717",
            } as any
          }
        >
          <audio
            slot="media"
            src="https://stream.mux.com/fXNzVtmtWuyz00xnSrJg4OJH6PyNo6D02UzmgeKGkP5YQ/low.mp4"
            playsInline
          ></audio>
        </MediaThemeTailwindAudio>

        <h3 className="text-2xl mt-[100px] text-center">
          Por dentro do <b className="text-[#5468FF]">close friends</b>
        </h3>
        <p className="text-gray-400 text-center mt-1">
          Para desbloquear acesso total do CF da pessoa espionada adquira nosso
          sistema.
        </p>
        <div className="mt-8">
          <div
            className="relative w-full max-w-sm pointer-events-none"
            role="region"
            aria-roledescription="carousel"
          >
            <div className="flex gap-4 relative ">
           
              <Image
                src={CloseFriendsStories} // Exibe a primeira thumbnail corretamente
                alt="user highlight"
                width={100}
                height={100}
                className="rounded-sm w-[220px] h-[320px] "
              />
              <div className="flex items-center absolute  mt-3">
                <Image
                  src={firstUser.profile_pic_url} // Exibe a primeira thumbnail corretamente
                  alt="user highlight"
                  width={100}
                  height={100}
                  className="rounded-full mr-2 border-2 border-green-500 ml-3 min-w-[32px] w-[30px]"
                />
                <span className="text-white font-normal text-[11px] -mr-2">
                  {username}
                </span>
                <Image
                  src={Close}
                  alt="user highlight"
                  width={100}
                  height={100}
                  className="-mr-[200px] min-w-[80px] w-[30px]"
                />
              </div>

              <Image
                src={CloseFriendsStories2} // Exibe a primeira thumbnail corretamente
                alt="user highlight"
                width={100}
                height={100}
                className="rounded-xl w-[220px] h-[320px]"
              />
              <div className="flex items-center -mr-3 absolute right-0 mt-3">
                <Image
                  src={firstUser.profile_pic_url} // Exibe a primeira thumbnail corretamente
                  alt="user highlight"
                  width={100}
                  height={100}
                  className="rounded-full mr-2 ml-40 border-2 border-green-500 min-w-[32px] w-[30px]"
                />
                <span className="text-white font-normal text-[11px] -mr-2">
                  {username}
                </span>
                <Image
                  src={Close}
                  alt="user highlight"
                  width={100}
                  height={100}
                  className="min-w-[80px] w-[30px]"
                />
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl mt-[100px] mb-3 text-center">Tenha acesso em <b className="text-[#5468FF]">TEMPO REAL</b> a localização do dispositivo da pessoa.</h3>
        <Image
                  src={Map}
                  alt="user highlight"
                  width={100}
                  height={100}
                  className="w-full mb-8"
                /> 
          <h3 className="text-2xl mt-[100px] mb-3 text-center">Alguns arquivos de mídia como <b className="text-[#5468FF]">fotos e vídeos</b> foram encontrados em algumas conversas.</h3>
          <Image
                  src={Gallery}
                  alt="user highlight"
                  width={100}
                  height={100}
                  className="w-full mb-4"
                /> 
                <button className=" mb-40 bg-[#5266FF] p-6 text-xl font-semibold rounded-xl inline-flex items-center justify-center "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-eye mr-3 size-6"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg> Ver relatório completo</button>
      </div>
    </div>
  );
};

export default PreviousContent;
