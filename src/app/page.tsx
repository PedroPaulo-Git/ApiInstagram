"use client";
import Image from "next/image";
import { useState } from "react";
import { GiPadlock } from "react-icons/gi";

interface InstagramUser {
  id: string;
  username: string;
  full_name: string;
  profile_pic_url: string;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<InstagramUser[]>([]);

  const handleSearch = async () => {
    if (!search) return;

    try {
      const response = await fetch(
        `https://instagram-scraper-api2.p.rapidapi.com/v1.2/search?search_query=${search}`,
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
      console.log("Dados recebidos:", data);
      console.log("id do primeiro user", data.data.users[0].id);

      if (data.data.users[0].id) {
        setUsers(
          data.data.users.map((user: any) => ({
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            profile_pic_url: user.profile_pic_url,
          }))
        );

        console.log(users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setUsers([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/*
  Heads up! 👋

  Plugins:
    - @tailwindcss/forms
*/}

<div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-lg">
  <div>
  <span id="ProgressLabel" className="sr-only">Loading</span>
  <div
    role="progressbar"
    aria-labelledby="ProgressLabel"
    aria-valuenow={25} 
    className="block rounded-full bg-gray-200"
    style={{ width: '100%' }}  
  >
    <div className="block h-3 rounded-full bg-indigo-600" style={{ width: '25%' }}></div>
  </div>
</div>

    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Logo</h1>
 
  

    <form action="#" className="mt-6 mb-0 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">   Espione qualquer
pessoa apenas
com o @</h1>
      <hr />

      <p className="text-center text-lg font-medium">Coloque o @ da pessoa que você quer espionar</p>

      <div>
        <label htmlFor="email" className="sr-only">Email</label>

        <div className="relative">
        <input
          type="search"
          placeholder="Buscar... (Nome de usuário)"
          className="w-full p-2 outline-none text-black"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      
          <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
          <button
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
          onClick={handleSearch}
        >
          Buscar
        </button>
          </span>
        </div>
      </div>
      

      <p className="text-center text-sm text-gray-500">
      <GiPadlock />
      Dados seguros, a pessoa não saberá que você tentou espionar ela
      </p>
    </form>
  </div>
</div>
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full max-w-md">
        
      </div>
      <div className="mt-4 w-full max-w-md">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center p-2 border-b border-gray-200"
            >
             <Image
        src={user.profile_pic_url}
        alt={user.username}
        width={48}
        height={48}
        className="rounded-full mr-3"
      />
               <div>
                <p className="font-semibold">{user.full_name}</p>
                <p className="text-gray-500">@{user.username}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">
            Nenhum usuário encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
