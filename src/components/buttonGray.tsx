import { FC } from 'react';

import Link from 'next/link';

import { Button } from "@/components/ui/button";

import { CustomButtonProps } from '@/lib/interfaces';


const CustomButtonGray: FC<CustomButtonProps> = ({ text, href }) => {
  return (
    <Link href={href}>
      <Button variant="default" className="py-2 px-4 text-white text-sm md:text-xl w-auto bg-[#3e3e3e]">
        {text}
      </Button>
    </Link>
  );
};

export default CustomButtonGray;
