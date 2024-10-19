import { FC } from 'react';

import Image from 'next/image';

import CustomButtonGray from '@/components/buttonGray';

import { ReasonsProps } from '@/lib/interfaces';


//reasons
const reasonsData: ReasonsProps[] = [
  {
    id: 1,
    heading: 'Why Choose Us?',
    description:
      'I am going sober-ish because I got sick of how wine made me feel. Moment has crafted their beverages to provide a sense of relaxation and calmness. Instead of reaching for that glass of wine, grab a Moment and experience a moment of tranquility without the negative effects of alcohol.',
    buttonText: 'Take a Moment Today',
    buttonHref: '/learn-more',
    imageHref: '/images/reason1_img.svg',
  },
  {
    id: 2,
    heading: 'Expert Team',
    description:
      "Goodbye hangovers, goodbye bloating! When you choose Moment as your replacement for booze, you're not only avoiding the negative effects of alcohol but also nourishing your body with natural and healthy ingredients. ",
    buttonText: 'Try Moment and Get Free Shipping',
    buttonHref: '/team',
    imageHref: '/images/reason2_img.svg',
  },
  {
    id: 3,
    heading: 'Customer Satisfaction',
    description:
      "Moment is formulated with adaptogens such as L-theanine, ashwagandha, and ginseng, which are known for their mood-boosting properties. These adaptogens help to reduce anxiety, improve focus, and increase feelings of well-being. So, when you're looking for a pick-me-up without the alcohol, reach for a can of Moment and enjoy a natural mood boost.",
    buttonText: 'Discover All of The Good and None of The Bad',
    buttonHref: '/testimonials',
    imageHref: '/images/reason3_img.svg',
  },
];

const ReasonsList: React.FC = () => {
  return (
    <div className="container mx-auto md:px-32 sm:px-12 px-6 md:py-16 sm:py-12 py-8 space-y-6 sm:space-y-10">
      {reasonsData.map((reason) => (
        <div key={reason.id}>
          <div className="flex gap-2 text-xl md:text-2xl font-bold mb-2">
            <span>{reason.id}.</span>
            <span>{reason.heading}</span>
          </div>
          <p className="md:text-lg text-md sm:mb-5 mb-3">{reason.description}</p>
          <div className="flex justify-center sm:mb-6 mb-3">
            <CustomButtonGray
              text={reason.buttonText}
              href={reason.buttonHref}
            />
          </div>
          <div className="flex justify-center sm:mb-6 mb-3"><Image
            src={reason.imageHref}
            alt="image"
            width={64}
            height={64}
            className="w-auto h-full"
          /></div>

        </div>
      ))}
    </div>
  );
};

export default ReasonsList;
