import React,{useEffect} from 'react'

const PopUpGetNow = ({showPopUpCongratulation,setShowPopUpCongratulation,username}) => {
  useEffect(() => {
    if (showPopUpCongratulation) {
      document.body.style.overflow = "hidden"; // Impede o scroll
    } else {
      document.body.style.overflow = "auto"; // Restaura o scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // Garante que o scroll volte ao normal ao desmontar o componente
    };
  }, [showPopUpCongratulation]);
  return (
    <div>
        {/* <div className="flex flex-col items-center pr-3 pl-3 pb-[100px]" 
        ></div>
      */}
        <div className="fixed text-gray-600  inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg w-96 text-center">
        <p className="mb-6">Você enviou solicitação de relatório do perfil <b>@{username}</b>.</p>
        <p className="p-2 bg-[#344356] rounded-2xl text-white">Se você sair dessa página você corre o risco do investigado ser notificado.</p>
        <p className="mt-5">Tenha acesso completo e veja tudo em tempo real</p>
        <a
            className=" z-20 text-white mt-4 uppercase bg-[#5468FF] h-10 px-4 py-10 text-xl font-semibold flex bg-primary rounded-2xl w-full justify-center items-center"
            href="https://pay.ghostpaycheckout.com/checkout/96845eda-224b-41e6-9dc9-aecc33a2c630"
          >
            <p>ADQUIRA AGORA</p>
          </a>
          <div className="flex justify-center gap-4 mt-5">
            <button onClick={() => setShowPopUpCongratulation(!showPopUpCongratulation)} className="px-4 py-2 text-red-500 rounded-xl transition">Agora não</button>
            </div>
        </div>
        </div>
        </div>
    
  )
}

export default PopUpGetNow