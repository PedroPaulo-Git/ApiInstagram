"use client";
import Image from "next/image";
import { useState } from "react";
import { GiPadlock } from "react-icons/gi";
import { IoSearchSharp } from "react-icons/io5";

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

  const handleSearch = async () => {
    if (!search) return;
    
    setLoading(true);
    setFirstUser(null); // Resetando o estado ao iniciar a busca

    try {
      const response = await fetch(
        `https://instagram-scraper-api2.p.rapidapi.com/v1.2/search?search_query=${search}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": "e9b32b11efmsh61c3992491c9be9p1319a0jsn3179f3d855a3",
            "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
          },
        }
      );

      const data = await response.json();

      if (data.data.users.length > 0) {
        const user = data.data.users[0]; // Pegando apenas o primeiro usuário
        setFirstUser({
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          profile_pic_url: user.profile_pic_url,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#171531]">
      <div className="mx-auto max-w-screen-xl px-8 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xs sm:max-w-xs lg:max-w-md ">
          <h1 className="text-center text-2xl font-bold text-cyan-400 sm:text-3xl">
            Logo
          </h1>

          {!firstUser ? (
            <div className="mt-6 space-y-8 p-6 rounded-lg shadow-lg sm:p-6 lg:px-20 lg:py-20 bg-[#232048]">
              <h1 className="text-center text-2xl font-semibold text-white sm:text-3xl">
                Espione <span className="text-blue-500">qualquer pessoa</span>{" "}
                apenas com o <span className="font-bold">@</span> 
              </h1>

              <hr />

              <p className="text-center text-lg font-medium text-white ">
                Coloque o <span className="text-cyan-400">@ </span>da pessoa que você quer espionar
              </p>

              <div>
                <div className="relative mb-5">
                  <input
                    type="search"
                    placeholder="Ex.: neymarjr"
                    className="rounded-xl w-full p-3 outline-none text-white bg-[#232048] border border-cyan-400"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <span className="absolute inset-y-0 end-0 grid place-content-center px-3">
                    <button
                      className="rounded-lg bg-cyan-400 text-black px-4 py-2 hover:bg-cyan-400"
                      onClick={handleSearch}
                      disabled={loading}
                    >
                      {loading ? "Buscando..." : <IoSearchSharp />}
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
          ) : (
            <div className="flex flex-col items-center p-6 rounded-lg shadow-lg bg-[#232048]">
              <h2 className="text-white text-xl font-semibold">Resultado:</h2>
              <Image
                src={firstUser.profile_pic_url}
                alt={firstUser.username}
                width={120}
                height={120}
                className="rounded-full my-4"
              />
              <p className="text-white text-lg font-medium">{firstUser.full_name}</p>
              <p className="text-gray-400">@{firstUser.username}</p>
              <button
                className="mt-4 bg-cyan-400 text-black px-4 py-2 rounded-lg hover:bg-cyan-300"
                onClick={() => setFirstUser(null)}
              >
                Nova Busca
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
