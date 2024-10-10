import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Card, CardTitle, CardContent } from "@/components/ui/card";

interface PassionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  imageSrc: string;
}

const PassionCard: React.FC<PassionCardProps> = ({ icon: Icon, title, description, imageSrc }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const isInOriginalBounds = 
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      
      setIsHovered(isInOriginalBounds);
    }
  };

  return (
    <div 
      className="relative" 
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <Card 
        className={`transition-all duration-300 ease-in-out h-full ${
          isHovered ? 'absolute w-full shadow-lg' : ''
        }`}
        style={{
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          zIndex: isHovered ? 40 : 'auto',
        }}
      >
        <CardContent className="p-4 flex flex-col h-full">
          <div className={`transition-opacity duration-300 ${isHovered ? 'hidden' : 'block'}`}>
            <Icon className="h-12 w-12 mb-2 mx-auto" />
            <CardTitle className="text-lg text-center">{title}</CardTitle>
          </div>
          {isHovered && (
            <div className="flex flex-col items-center justify-start h-full">
              <div className="w-full h-48 relative mb-4 overflow-hidden rounded-lg">
                <Image
                  src={imageSrc}
                  alt={title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <CardTitle className="text-lg mb-2">{title}</CardTitle>
              <p className="text-sm text-center overflow-y-auto flex-grow">{description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PassionCard;