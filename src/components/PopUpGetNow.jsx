import React from 'react'

const PopUpGetNow = ({showPopUpCongratulation,setShowPopUpCongratulation}) => {
  return (
    <div>
        {/* <div class="flex flex-col items-center pr-3 pl-3 pb-[100px]" 
        ></div>
      */}
        <div class="fixed text-gray-600  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 shadow-lg w-96 text-center">
        <p class="mb-6">Você enviou solicitação de relatório do perfil <b>@ret</b>.</p>
        <p class="p-2 bg-[#344356] rounded-2xl text-white">Se você sair dessa página você corre o risco do investigado ser notificado.</p>
        <p class="mt-5">Tenha acesso completo e veja tudo em tempo real</p>
        <button
          
            className="bg-[#5266FF] p-6 text-white text-xl font-semibold w-full mt-4 rounded-xl inline-flex items-center justify-center "
          >
            ADQUIRA AGORA
          </button>
          <div class="flex justify-center gap-4 mt-5">
            <button onClick={() => setShowPopUpCongratulation(!showPopUpCongratulation)} class="px-4 py-2 text-red-500 rounded-xl transition">Agora não</button>
            </div>
        </div>
        </div>
        </div>
    
  )
}

export default PopUpGetNow