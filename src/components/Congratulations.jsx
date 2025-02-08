import React, { useState, useEffect } from "react";
import Image from "next/image";
import CongratulationsImage from "../app/assets/congratulations.png";
import Confetti from "../app/assets/confetti.png";
import Champion from "../app/assets/champion.svg";
import Verify from "../app/assets/verify-foreground.svg";
import Cf from "../app/assets/cf-logo-1.png";

import Feedback1 from "../app/assets/feedback.png";
import Feedback2 from "../app/assets/feedback_1.png";
import Feedback3 from "../app/assets/feedback_2.png";
import Feedback4 from "../app/assets/feedback_3.png";
import Feedback5 from "../app/assets/feedback_4.png";

const Congratulations = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const feedbacks = [Feedback1, Feedback2, Feedback3, Feedback4, Feedback5];
  const [currentTime, setCurrentTime] = useState(new Date()); // Hora atual
  const [timeLeft, setTimeLeft] = useState({});
  const [vagasData, setVagasData] = useState("");

  useEffect(() => {
    // Definindo a data de término como meia-noite do dia atual
    const endDate = new Date(currentTime);
    endDate.setHours(24, 0, 0, 0); // Definir a hora para meia-noite (00:00:00) do dia atual

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endDate - now;
      
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    // Formatação manual da data no formato dd/mm/yyyy
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0'); // Adiciona zero à esquerda, se necessário
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda, se necessário
    const year = today.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    setVagasData(formattedDate);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [currentTime]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % feedbacks.length);
  };

  // Passa a imagem automaticamente a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(nextSlide, 3000); // 3000ms = 3 segundos
    return () => clearInterval(interval); // Limpa o intervalo quando o componente for desmontado
  }, []);

  return (
    <div className="flex flex-col text-white ">
      <div className="absolute left-1/2 -translate-x-1/2 max-w-sm">
        <Image
          src={CongratulationsImage}
          className="w-80 object-contain mx-auto -mb-24"
        />
        <div className="text-center">
          <h1 class="text-3xl font-bold text-[#00D9CD]">
            Parabéns seu relatório foi gerado com sucesso!{" "}
          </h1>
          <h3 class="">
            <b class="text-[#FF3333]">ATENÇÃO</b> Liberamos apenas um relatório
            por dispositivo.
          </h3>
        </div>
      </div>
      <div className="confetti -mt-10">
        <Image src={Confetti} className="w-full h-64 object-cover " />
        <Image src={Confetti} className="w-full h-64 object-cover " />
      </div>
      {/* LIST */}
      <div className="flex flex-col gap-4 mt-10">
        <div className="relative flex items-center gap-3 shadow-sm rounded-xl py-[15px] px-[15px] bg-[#272445]">
          <Image
            src={Champion}
            alt="Ícone"
            width={40}
            height={40}
            className="size-10"
          />
          <h3>Tenha acesso a visualização de stories da pessoa.</h3>
        </div>

        <div className="relative flex items-center gap-3 shadow-sm rounded-xl py-[15px] px-[15px] bg-[#272445]">
          <Image
            src={Champion}
            alt="Ícone"
            width={40}
            height={40}
            className="size-10"
          />
          <h3>Tenha acesso aos arquivados (conversas antigas trancadas).</h3>
        </div>

        <div className="relative flex items-center gap-3 shadow-sm rounded-xl py-[15px] px-[15px] bg-[#272445]">
          <Image
            src={Champion}
            alt="Ícone"
            width={40}
            height={40}
            className="size-10"
          />
          <h3>
            Tenha acesso ao <b className="text-green-400">DIRECT COMPLETO</b> da
            pessoa.
          </h3>
        </div>

        <div className="relative flex items-center gap-3 shadow-sm rounded-xl py-[15px] px-[15px] bg-[#7BFF66] text-[#164F20] font-bold">
          <div className="absolute bg-red-600 text-white right-4 -top-3 inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 px-2.5 py-0.5 text-xs">
            Novidade
          </div>
          <Image
            src={Verify}
            alt="Ícone"
            width={40}
            height={40}
            className="size-10"
          />
          <h3>
            Bônus: Tenha acesso exclusivo ao <b>CLOSE FRIENDS</b> da pessoa.
          </h3>
        </div>

        <div className="relative flex items-center gap-3 shadow-sm rounded-xl py-[15px] px-[15px] bg-[#272445]">
          <Image
            src={Champion}
            alt="Ícone"
            width={40}
            height={40}
            className="size-10"
          />
          <h3>Veja com quem essa pessoa conversa mais frequentemente.</h3>
        </div>

        <div className="relative flex items-center gap-3 shadow-sm rounded-xl py-[15px] px-[15px] bg-[#272445]">
          <Image
            src={Champion}
            alt="Ícone"
            width={40}
            height={40}
            className="size-10"
          />
          <h3>
            Veja fotos de visualização única que essa pessoa envia ou recebe.
          </h3>
        </div>
      </div>
      <p class="my-8 text-center">
        Nosso sistema é <b>O ÚNICO</b> que te dá informações que nem um
        investigador particular conseguiria com tanta rapidez e precisão. Você
        já parou para pensar quanto custaria ter acesso a essas informações que
        iremos te entregar em <b>MINUTOS</b> e direto na palma da sua mão?
      </p>
      <div
        style={{ backgroundColor: "#85C763" }}
        className="text-black p-4 pb-6 rounded-xl pt-10 relative mt-[70px] "
      >
        {/* Ícone centralizado */}
        <div
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 border-[#85C763] border-[12px] 
  rounded-full flex items-center justify-center size-16"
        >
          <Image src={Cf} alt="Close Friends Logo" className="w-12 h-12" />
        </div>

        {/* Título */}
        <h2 className="text-2xl mb-5 font-bold text-center text-[#2F5825]">
          BONUS EXCLUSIVO
        </h2>

        {/* Texto */}
        <p className="text-center mb-3 text-[#0B2010] font-bold">
          Adquirindo agora você pode ter a oportunidade de receber acesso ao{" "}
          <b>CloseX</b>, uma ferramenta que faz com que você tenha ao{" "}
          <b>CLOSE FRIENDS DE QUALQUER PESSOA!</b>
        </p>
      </div>
      <div
        className="inline-flex max-w-40 mx-auto items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent
 bg-red-600 justify-center px-8 text-white hover:bg-red-600/80  py-2 text-base mt-10 rounded-lg"
      >
        ATENÇÃO
      </div>
      <p class="mt-8 text-center">
        O Instagram pode derrubar nossa plataforma a qualquer momento, porque
        estamos te oferecendo um poder <b>REAL</b> que outras pessoas pagam uma
        fortuna para ter.
      </p>
      <p class="mt-2 text-center font-bold">
        Não é brincadeira, é agora ou nunca!
      </p>
      <div
        className="inline-flex max-w-40 mx-auto items-center border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent
 bg-red-600 justify-center px-8 text-white hover:bg-red-600/80  py-1 text-base mt-10 rounded-lg"
      >
        Feedbacks
      </div>
     
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translate3d(-${currentSlide * 100}%, 0px, 0px)`,
            }}
          >
            {feedbacks.map((feedback, index) => (
              <div
                key={index}
                role="group"
                aria-roledescription="slide"
                className="min-w-0 shrink-0 grow-0 pl-4 basis-full"
              >
                <Image
                  src={feedback}
                  width={300}
                  height={200}
                  className="shadow-md mt-4 mx-auto"
                  alt={`Feedback ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <p class="my-2 text-center mt-5 text-lg font-semibold">
          Nossa ferramenta é <b class="text-green-400">limitada</b> ao público,
          poucas pessoas conseguem ter acesso...
        </p>
        <div className="py-1 px-2 rounded-lg bg-[#FF2733] text-white font-bold mt-5 text-center">
          {`Apenas 4 vagas liberadas para ${vagasData}`}
        </div>

        <div class="bg-white mb-40 shadow-sm rounded-xl justify-center w-full flex flex-wrap items-start px-5 mt-12 py-6">
          <h3 class="text-xl mb-3 text-center text-[#344356] font-bold">
            Oferta por tempo limitado:
          </h3>

          <div className="w-full flex justify-center">
            <div className="bg-[#FF7C83] rounded-xl mx-2 w-16 py-1 text-center drop-shadow-2xl">
              <div className="text-4xl font-extrabold mt-1">
                {timeLeft.hours || 0}
              </div>
              <div className="bottom-2 text-center text-xs">horas</div>
            </div>

            <div className="bg-[#FF7C83] rounded-xl mx-2 w-16 py-1 text-center drop-shadow-2xl">
              <div className="text-4xl font-extrabold mt-1">
                {timeLeft.minutes || 0}
              </div>
              <div className="bottom-2 text-center text-xs">minutos</div>
            </div>

            <div className="bg-[#FF7C83] rounded-xl mx-2 w-16 py-1 text-center drop-shadow-2xl">
              <div className="text-4xl font-extrabold mt-1">
                {timeLeft.seconds || 0}
              </div>
              <div className="bottom-2 text-center text-xs">segundos</div>
            </div>
          </div>

          <p class="text-sm mt-10 mb-3 text-center text-[#344356] font-semibold">
            Receba{" "}
            <b class="text-[#5468FF]">
              acesso a ferramenta espiã completa e veja informações
            </b>{" "}
            da conta de qualquer pessoa.
          </p>

          <div class="flex-col flex items-center relative">
            <small class="text-center text-base font-bold text-[#FF7C83] line-through">
              de R$ 166 por:
            </small>
            <h2 class="font-mono text-[#344356] text-center text-8xl mt-1 font-extrabold">
              <b class="text-[#5468FF] text-5xl">R$</b>49.90
            </h2>
            <div class="absolute -left-2 top-12 inline-flex items-center rounded-xl border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-[#FF2733] text-primary-foreground mb-3">
              70% off
            </div>
          </div>

          <div class="w-full bottom-2 mt-5 flex justify-center items-center ">
            <a
              class=" z-20 uppercase bg-[#5468FF] h-10 px-4 py-10 text-xl font-bold flex bg-primary rounded-2xl w-full justify-center items-center"
              href="https://checkout.perfectpay.com.br/pay/PPU38CP8I9K?utm_source=FB&utm_campaign=%F0%9F%9F%A3+BM+7+C2++-+%5BABO%5D+%5BDARKPOST%5D+%5BIG+8%5D%7C120214815490410124&utm_medium=VAL+3+-+1+6%7C120215179470900124&utm_content=V1+1+6%7C120215179477180124&utm_term=Instagram_Reels&xcod=FBhQwK21wXxR%F0%9F%9F%A3+BM+7+C2++-+%5BABO%5D+%5BDARKPOST%5D+%5BIG+8%5D%7C120214815490410124hQwK21wXxRVAL+3+-+1+6%7C120215179470900124hQwK21wXxRV1+1+6%7C120215179477180124hQwK21wXxRInstagram_Reels&sck=FBhQwK21wXxR%F0%9F%9F%A3+BM+7+C2++-+%5BABO%5D+%5BDARKPOST%5D+%5BIG+8%5D%7C120214815490410124hQwK21wXxRVAL+3+-+1+6%7C120215179470900124hQwK21wXxRV1+1+6%7C120215179477180124hQwK21wXxRInstagram_Reels"
            >
              <p>Acessar Agora</p>
            </a>
          </div>
        </div>
      </div>
  
  );
};

export default Congratulations;
