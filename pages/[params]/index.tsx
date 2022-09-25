import type {
  GetStaticProps,
  GetStaticPropsContext
} from "next";
import Head from "next/head";
import { useState } from 'react';

interface Product {
  id: number;
  title: string;
  image: {
    url: string;
  };
  price: string;
}

const currencyMap: Record<string, string> = {
  uk: "£",
  us: "$",
};

const hats: Product[] = [
  {
    id: 1,
    title: "Trucker Cap",
    image: {
      url: "/006293196.webp",
    },
    price: "10.95",
  },
  {
    id: 2,
    title: "Bucket Hat",
    image: {
      url: "/240951782.jpeg",
    },
    price: "10.95",
  },
  {
    id: 3,
    title: "Maroon Beanie",
    image: {
      url: "/006293196.webp",
    },
    price: "10.95",
  },
];

const shoes: Product[] = [
  {
    id: 1,
    title: "Green Wellington Boots",
    image: {
      url: "/005614108.webp",
    },
    price: "44.95",
  },
  {
    id: 2,
    title: "Retro Tennis Shoes",
    image: {
      url: "/006125578.webp",
    },
    price: "134.95",
  },
  {
    id: 3,
    title: "Rainbow Crocs",
    image: {
      url: "/006272115.webp",
    },
    price: "1230.95",
  },
];

const products = {
  hats,
  shoes,
};

const Card = ({
  product,
  currency,
}: {
  product: Product;
  currency: string;
}): JSX.Element => {
  return (
    <article className="product">
      <figure>
        <img src={`/images/${product.image.url}`} width="100%" height="100%" />
      </figure>
      <h1>{product.title}</h1>
      <p>
        {currency}
        {product.price}
      </p>
    </article>
  );
};

const ProductSetByPreference = ({
  products,
  currency,
}: {
  products: Product[];
  currency: string;
}): JSX.Element => {
  return (
    <div className="product-grid">
      {products &&
        products.map((product) => (
          <Card key={product.id} product={product} currency={currency} />
        ))}
    </div>
  );
};

export const getStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { params: requestParams } = context;

  const params = (requestParams?.params as string)?.split("?").map((item) => {
    const parts = item.split("=");
    return {
      name: parts[0],
      value: parts[1],
    };
  });

  const preference = params.filter((item) => item.name === "preference")[0];
  const geoBucket = params.filter((item) => item.name === "geoBucket")[0];

  const productSetForByPreference =
    products[preference.value as keyof typeof products];

  return {
    props: {
      productSetForByPreference,
      currency: currencyMap[geoBucket.value],
      serverPreference: preference.value
    },
  };
};

const Home = ({
  productSetForByPreference,
  currency,
  serverPreference
}: {
  productSetForByPreference: Product[];
  currency: string;
  serverPreference: string;
}) => {

  const [preference, setPreference] = useState<string>(serverPreference);
  const [showReload, setShowReload] = useState<boolean>(false);

  const handlePreferenceChange = (evt: React.FormEvent<HTMLSelectElement>) => {
    setPreference(evt.currentTarget.value);
    document.cookie = `hm_pref=${evt.currentTarget.value}; path=/`;
    setShowReload(true);
  };

  return (
    <div>
      <Head>
        <title>Next.js - Static Personalisation Example App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="header">
        <div className="container">
          <h1>Next.js - Static Personalisation</h1>
        </div>
      </header>

      <main>
        <div className="container">
          <ProductSetByPreference
            products={productSetForByPreference}
            currency={currency}
          />
        </div>
      </main>

      <div className="preference">
        <label>Change Preference</label>
        <select value={preference} onChange={handlePreferenceChange}>
          <option value="hats">Hats</option>
          <option value="shoes">Shoes</option>
        </select>
        {showReload && <button className='button' onClick={() => window.location.reload()}>Reload</button>}
      </div>
    </div>
  );
};

export default Home;
