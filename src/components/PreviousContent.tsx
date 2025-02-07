import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import templateHighlights from '../app/assets/storiesEdited2.png';


interface PreviousContentProps {
  username: string;
  firstUser: FirstUser;
  id: string;  // Alterado para aceitar o tipo FirstUser
}

interface FirstUser {
  id:string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  highlights?: string[]; // Adicionando highlights aqui
}
interface Follower {
  username: string;
  full_name: string;
  profile_pic_url: string;
  highlights?: string[]; // Adicionando highlights aqui
}

const PreviousContent: React.FC<PreviousContentProps> = ({ username, firstUser,id }) => {
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]); // Para armazenar highlights
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const carouselRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      console.log(`Buscando seguidores para: ${username}`);

      try {
        const response = await fetch(
          `https://instagram-scraper-api2.p.rapidapi.com/v1/followers?username_or_id_or_url=${username}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": "e9b32b11efmsh61c3992491c9be9p1319a0jsn3179f3d855a3",
              "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
            },
          }
        );

        const data = await response.json();
        console.log("Resposta da API (seguidores):", data);

        if (data.data.items && Array.isArray(data.data.items)) {
          const followersList = data.data.items.map((follower: any) => ({
            username: follower.username,
            full_name: follower.full_name,
            profile_pic_url: follower.profile_pic_url,
          }));

          setFollowers(followersList.slice(0, 10));
          setError(null);
        } else {
          setError("Nenhum seguidor encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar seguidores:", error);
        setError("Erro ao carregar seguidores.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFollowers();
  }, [username]);

  // Fetch de highlights do usuário
  useEffect(() => {
    const fetchHighlights = async () => {
      console.log(`Buscando highlights para: ${username}`);
      try {
        const response = await fetch(
          `https://instagram-scraper-api2.p.rapidapi.com/v1/highlights?username_or_id_or_url=${username}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": "e9b32b11efmsh61c3992491c9be9p1319a0jsn3179f3d855a3",
              "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
            },
          }
        );
  
        const data = await response.json();
        console.log("Resposta da API (highlights):", data);
  
        if (data.data?.items?.length > 0) {
          const firstHighlight = data.data.items[0]; // Pega o primeiro highlight
          const firstHighlightId = firstHighlight.id; // ID do primeiro highlight
          console.log("ID do primeiro highlight:", firstHighlightId);
  
          // Agora fazendo o fetch para pegar a imagem com a segunda API
          const formData = new URLSearchParams();
          formData.append("highlight_id", firstHighlightId);
  
          const fetchThumbnail = await fetch(
            "https://instagram-scraper-stable-api.p.rapidapi.com/get_highlights_stories.php",
            {
              method: "POST",
              headers: {
                "x-rapidapi-key": "e9b32b11efmsh61c3992491c9be9p1319a0jsn3179f3d855a3",
                "x-rapidapi-host": "instagram-scraper-stable-api.p.rapidapi.com",
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: formData.toString(),
            }
          );
  
          const thumbnailData = await fetchThumbnail.json();
          console.log("Thumbnail Data:", thumbnailData);
  
          if (thumbnailData.items?.length > 0) {
            const thumbnailUrl = thumbnailData.items[0].image_versions2.candidates[0].url;
            setHighlights([thumbnailUrl]); // Atualiza a imagem do highlight com a thumbnail
          }
        } else {
          setError("Nenhum highlight encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar highlights:", error);
        setError("Erro ao carregar highlights.");
      }
    };
  
    fetchHighlights();
  }, [username]);
  
  
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

        if (scrollLeft + clientWidth >= scrollWidth) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 300, behavior: "smooth" }); // Aumentei para 300px
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
                        @{"*".repeat(3) +
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
          Detectamos <b className="text-[#5468FF]">conversas pessoais</b> dessa pessoa
        </h1>
        <p className="text-gray-400 text-center mt-5 mb-5">
          Nossa inteligência artificial identificou algumas conversas mais pessoais.
        </p>

        <div className="flex items-center justify-between mt-10">
          <div className="h-80 relative mx-auto ">
            <Image
              src={templateHighlights}
              alt="highlights"
              className=" w-96 object-cover"
            />
            {highlights.length > 0 && (
              <div className="absolute top-0" >
                <p className="text-gray-600 text-xs mt-[70px] mb-2 ml-12">Enviou o stories de @{username}</p>
                <div className="flex items-center space-x-2 absolute ml-[70px] mt-3">
                  <Image
                    src={firstUser.profile_pic_url} // Exibe a primeira thumbnail corretamente
                    alt="user highlight"
                    width={100}
                    height={100}
                    className="rounded-full min-w-[20px] w-[20px]"
                  />
                  <span className="text-white font-normal text-[9px]">{username}</span>
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
      </div>
    </div>
  );
};

export default PreviousContent;
