import { FC } from 'react';

import Link from 'next/link';

import { Button } from "@/components/ui/button";

import { CustomButtonProps } from '@/lib/interfaces';



const CustomButtonGray: FC<CustomButtonProps> = ({ text, href }) => {
  return (
    <Link href={href}>
      <Button variant="default" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700">
        {text}
      </Button>
    </Link>
  );
};

export default CustomButtonGray;
