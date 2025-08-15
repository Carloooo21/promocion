'use client'
import RegisterForm from "../component/page";
import Image from "next/image";
import React from "react";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden">

            {/* FONDO */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/Fondo (1).jpg"
                    alt="Imagen principal"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* GRID PRINCIPAL */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] grid-rows-[auto_auto_1fr_auto] flex-grow px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">

                {/* LOGO - CAMBIOS PRINCIPALES AQUÍ */}
                <div
                    className={`
                        w-60
                        row-start-1 col-span-full
                        flex justify-center
                        w-40 sm:w-44 md:w-48 lg:w-52 xl:w-70
                        mb-6 sm:mb-8 md:mb-0
                        z-20
                        /* posicionamientopara sm */
                        sm:row-start-1
                        sm:col-start-1
                        sm:col-span-full
                        sm:justify-center
                        sm:items-center

                        /* posicionamientopara md */
                        md:row-start-1
                        md:col-start-1
                        md:justify-self-end /*  Alinea horizontalmente a la derecha */
                        md:items-start /* Alinea verticalmente arriba */
                        md:w-[200px]

                        /* posicionamiento para lg */
                        lg:row-start-1
                        lg:col-start-2
                        lg:justify-self-end /*  Alinea horizontalmente a la derecha */
                        lg:items-start /* Alinea verticalmente arriba */

                        /* posicionamiento para XL */
                        xl:row-start-1  /* Posiciona en la primera fila (arriba) */
                        xl:col-start-2  /* : Ubica en la columna derecha */
                        xl:justify-self-end /*  Alinea horizontalmente a la derecha */
                        xl:items-start /* Alinea verticalmente arriba */
                        xl:ml-[25vh]
                        xl:w-95
            
          `}
                >
                    <Image
                        src="/LogoData.png"
                        alt="Logo Dataservicios"
                        width={224}
                        height={93}
                        className="w-full h-auto"
                        priority
                    />
                </div>

                {/* TÍTULO */}
                <h1 style={{
                fontSize: 'clamp(30px, 5vw, 45px)',
                fontFamily: 'cursive'
                }} className="
                text-black
                row-start-2 col-span-full
                md:col-start-1 md:row-start-2
                text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl
                font-bold
                text-center md:text-left
                mb-6 sm:mb-8 md:mb-0
                md:self-center
                /* Cambio para md */
                sm:row-start-2
                sm:col-start-1
                sm:mb[200px]

                /* Cambio para LG */
                lg:row-start-2
                lg:col-start-1
                lg:self-center
                /* Cambio para XL */
                xl:row-start-1
                xl:col-start-1
                xl:self-center
                xl:ml-[1vh]
        ">
                ¡Reclama aquí tu beneficio exclusivo!
            </h1>

            {/* PERSONAJE */}
            <div className="
                    row-start-2 md:row-start-3 
                    col-span-full mt-[10vh]
                    flex justify-center md:justify-center 
                    md:mt-8 pt-4 
                    /* Cambio para sm */
                    sm:row-start-2
                    sm:col-span-full
                    sm:justify-center
                    sm:items-center
                     /* Cambio para md */
                    md:row-start-3
                    md:col-span-full
                    md:mr-[40px]
                    md:justify-center
                    md:items-center
                    /* Cambio para lg */
                    lg:row-start-3
                    lg:col-span-full
                    lg:justify-center
                    lg:ml-[10vh]

                    /* CAMBIO PARA XL */
                    xl:row-start-2
                    xl:col-span-full
                    xl:justify-center
                    /* Nuevas clases para LG y XL */
                    lg:items-end
                    xl:items-end
                    lg:pt-0
                    xl:pt-0
                    xl:mr-[80vh]
                    ">
                {/* Contenedor de la imagen con nuevos tamaños */}
                <div className="
                        w-2/3 sm:w-1/2 md:w-1/2 
                        /* Tamaños ajustados para LG y XL */
                        lg:w-[300px] 
                        xl:w-[750px]
                        /* Mantenemos la relación de aspecto */
                        aspect-[3/4]
                        relative
                        /* Alineación al fondo */
                        self-end
  ">
                    <Image
                        src="/Personaje-1 (1) (1).png"
                        alt="Personaje"
                        fill
                        className="object-contain"
                    />
                    {/* Texto sobre imagen */}
                    <h1 style={{
                        fontSize: '40px',
                    }}
                        className="
                        hidden /* Oculto por defecto en todos los tamaños */
                        md:block /* Visible a partir de md (768px) */
                        md:flex  /* Necesario para mantener el centrado flex */
                        font-poppins
                        lg:text-6x1
                        font-bold sm:font-bold md:font-bold lg:fond-bold xl:fond-bold
                        absolute inset-x-0 bottom-0      /* ocupa todo el contenedor */
                        flex                  /* para centrar fácilmente */
                        items-center          /* centra vertical */
                        justify-center        /* centra horizontal */
                        text-white            /* color del texto */
                        p-4                   /* un poco de padding */
                        text-center           /* alinea texto multilinea */
                        z-10                  /* asegúrate de que vaya encima de la imagen */
                        xl:mb-110px lg:mb-[110px] md:mb-[110px]
                        /* Nuevas clases para sombras de fondo */
                        drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                        pb-6

          
                ">
                        Tu voucher te esta esperando
                    </h1>
                </div>
            </div>

            {/* FORMULARIO  */}
            <div className="
                row-start-3 md:row-start-2 
                col-span-full md:col-span-2
                flex justify-center items-center 
                py-4 
                /* Tamaño para md */
                md:justify-center
                md:items-center
                md:row-start-4
                md:col-span-full
                md:flex
                md:justify-center
                md:items-center
                /* tamaño para lg */
                lg:row-start-4
                lg:justify-center
                lg:items-center
                lg:ml-[20vh]
                /* tamaño para XL */
                xl:row-start-2
                xl:col-start-2
                xl:pt-20
">
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md md:justify-center md:content-center xl:mr-10">
                    <RegisterForm />
                </div>
            </div>

        </div>
        </main >
    )
}