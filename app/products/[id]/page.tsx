import Modal from '@/components/Modal';
import PriceInfoCard from '@/components/PriceInfoCard';
import ProductCard from '@/components/ProductCard';
import { getMoreProducts, getProductById } from '@/lib/actions';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: { id: string };
};
const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  if (!product) redirect('/');

  const moreProducts = await getMoreProducts(id);

  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6">
            <div className="text-[28px] text-secondary font-semibold">
              <p>{product.title}</p>
              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visit Product
              </Link>
            </div>
          </div>
          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold">
                {product.currency} {product.currentPrice}
              </p>
              <p className="text-[21px] text-black opacity-50 line-through">
                {product.currency} {product.originalPrice}
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap">
              <PriceInfoCard
                title="Current Price"
                iconSrc="/assets/icons/price-tag.svg"
                value={`${product.currency} ${product.currentPrice}`}
              />
              <PriceInfoCard
                title="Average Price"
                iconSrc="/assets/icons/chart.svg"
                value={`${product.currency} ${product.averagePrice}`}
              />
              <PriceInfoCard
                title="Highest Price"
                iconSrc="/assets/icons/arrow-up.svg"
                value={`${product.currency} ${product.highestPrice}`}
              />
              <PriceInfoCard
                title="Lowest Price"
                iconSrc="/assets/icons/arrow-down.svg"
                value={`${product.currency} ${product.lowestPrice}`}
              />
            </div>
          </div>
          <Modal productId={id} />
        </div>
      </div>
      {moreProducts && moreProducts.length > 0 && (
        <div className="py-14 flex flex-col gap-2 w-full">
          <p className="section-text">More Products</p>
          <div className="flex flex-wrap gap-10 mt-7 ww-full">
            {moreProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
