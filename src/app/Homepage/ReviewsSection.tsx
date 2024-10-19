import React from 'react';

import { Reviews } from '@/lib/bin/ReviewsData';

import { ReviewsSectionProps } from '@/lib/interfaces';

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productName }) => {
  const filteredReviews = productName
    ? Reviews.filter(review =>
      review.product &&
      productName &&
      review.product.toLowerCase() === productName.toLowerCase()
    )
    : Reviews;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-lg font-bold mb-4">
        Recent reviews
      </h2>
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4">
              <div className="text-base">{review.rating}</div>
              <h3 className="font-semibold text-base mt-2">{review.title}</h3>
              <p className="text-gray-600 mt-2 text-sm mb-2">{review.description}</p>
              <span className="font-medium text-sm">{review.buyerName}</span>
              <div>
                {review.isVerifiedBuyer && (
                  <span className="text-xs flex items-center">
                    Verified Buyer
                    <span className='text-blue-800'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews available for this product.</p>
      )}
    </div>
  );
};

export default ReviewsSection;