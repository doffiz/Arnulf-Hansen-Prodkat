import Image from 'next/image';
import React from 'react';

interface HeroProps {
  image: string;
  title: string;
  ingress: string;
}

const Hero: React.FC<HeroProps> = ({ image, title, ingress }) => {
  return (
    <section
      className="relative h-[50vh] max-h-[600px] md:max-h-[1200px] md:h-[70vh] w-full flex items-end justify-center text-white"
      style={{
        position: 'relative',
      }}
    >
      <div className="relative w-full h-full">
        <Image
          className='object-cover'
          src={image}
          alt={title}
          layout="fill"
          quality={80}
          priority={true}
        />
        {/* Black low-opacity gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70" />
      </div>
      <div className="z-10 py-20 flex flex-col gap-4 w-full absolute bottom-0 text-center">
        <h1 className="text-6xl font-bold">{title}</h1>
        <p className="text-lg">{ingress}</p>
      </div>
    </section>
  );
};

export default Hero;
