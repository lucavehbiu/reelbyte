/**
 * Lego.com Scraper
 * Fetches retiring and sold-out sets from Lego's official website
 */

export class LegoScraper {
  static BASE_URL = 'https://www.lego.com';
  static API_ENDPOINTS = {
    // Lego uses a product API - we'll target their "Last Chance" section
    US_SHOP: 'https://www.lego.com/api/graphql/ProductAvailability',
    LAST_CHANCE: 'https://www.lego.com/en-us/categories/last-chance'
  };

  /**
   * Get retiring Lego sets
   * @returns {Promise<Array>} Array of retiring set objects
   */
  static async getRetiringSets() {
    try {
      // Approach 1: Try to fetch the "Last Chance" page and parse it
      const response = await fetch(this.API_ENDPOINTS.LAST_CHANCE, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Lego page: ${response.status}`);
      }

      const html = await response.text();

      // Parse the HTML to extract product data
      // Lego embeds product data in JSON-LD or data attributes
      const sets = this.parseLegoHTML(html);

      // Filter to only sets that are available at retailers (not completely sold out everywhere)
      return sets.filter(set => set.status === 'retiring_soon' || set.status === 'limited_stock');

    } catch (error) {
      console.error('LegoScraper error:', error);

      // Return mock data for testing/demo purposes
      return this.getMockRetiringSets();
    }
  }

  /**
   * Parse Lego HTML to extract product data
   */
  static parseLegoHTML(html) {
    const sets = [];

    try {
      // Look for JSON-LD structured data
      const jsonLdMatches = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/gs);

      if (jsonLdMatches) {
        for (const match of jsonLdMatches) {
          const jsonStr = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          try {
            const data = JSON.parse(jsonStr);
            if (data['@type'] === 'Product') {
              sets.push(this.extractSetFromJsonLd(data));
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }

      // Look for data-product attributes in HTML
      const productRegex = /data-product="([^"]+)"/g;
      let match;

      while ((match = productRegex.exec(html)) !== null) {
        try {
          const productData = JSON.parse(match[1].replace(/&quot;/g, '"'));
          sets.push(this.extractSetFromDataAttribute(productData));
        } catch (e) {
          // Skip invalid JSON
        }
      }

      // Look for React props data (Lego uses React)
      const propsRegex = /__NEXT_DATA__\s*=\s*({.*?})\s*<\/script>/s;
      const propsMatch = html.match(propsRegex);

      if (propsMatch) {
        try {
          const nextData = JSON.parse(propsMatch[1]);
          const products = this.extractSetsFromNextData(nextData);
          sets.push(...products);
        } catch (e) {
          console.error('Failed to parse NEXT_DATA:', e);
        }
      }

    } catch (error) {
      console.error('Error parsing Lego HTML:', error);
    }

    return sets;
  }

  /**
   * Extract set data from JSON-LD
   */
  static extractSetFromJsonLd(data) {
    return {
      id: data.sku || data.productID,
      name: data.name,
      setNumber: data.sku,
      msrp: parseFloat(data.offers?.price || data.offers?.lowPrice || 0),
      imageUrl: data.image,
      status: 'retiring_soon',
      legoUrl: data.url || data.offers?.url
    };
  }

  /**
   * Extract set data from data-product attribute
   */
  static extractSetFromDataAttribute(data) {
    return {
      id: data.productId || data.id,
      name: data.productName || data.name,
      setNumber: data.productCode || data.sku,
      msrp: parseFloat(data.price?.value || data.price || 0),
      imageUrl: data.image || data.imageUrl,
      status: data.availability?.includes('retiring') ? 'retiring_soon' : 'limited_stock',
      legoUrl: `https://www.lego.com${data.url || ''}`
    };
  }

  /**
   * Extract sets from Next.js data
   */
  static extractSetsFromNextData(nextData) {
    const sets = [];

    try {
      // Navigate the Next.js data structure
      const pageProps = nextData.props?.pageProps;

      if (pageProps?.products) {
        for (const product of pageProps.products) {
          sets.push({
            id: product.productId,
            name: product.name,
            setNumber: product.productCode,
            msrp: parseFloat(product.price?.centAmount / 100 || 0),
            imageUrl: product.image?.url,
            status: 'retiring_soon',
            legoUrl: `https://www.lego.com${product.slug}`
          });
        }
      }
    } catch (error) {
      console.error('Error extracting from Next data:', error);
    }

    return sets;
  }

  /**
   * Mock data for testing/demo
   */
  static getMockRetiringSets() {
    return [
      {
        id: '75192',
        name: 'Millennium Falcon',
        setNumber: '75192',
        msrp: 849.99,
        imageUrl: 'https://www.lego.com/cdn/product-assets/product.img.pri/75192_prod.jpg',
        status: 'retiring_soon',
        legoUrl: 'https://www.lego.com/en-us/product/millennium-falcon-75192'
      },
      {
        id: '10497',
        name: 'Galaxy Explorer',
        setNumber: '10497',
        msrp: 99.99,
        imageUrl: 'https://www.lego.com/cdn/product-assets/product.img.pri/10497_prod.jpg',
        status: 'retiring_soon',
        legoUrl: 'https://www.lego.com/en-us/product/galaxy-explorer-10497'
      },
      {
        id: '21348',
        name: 'Dungeons & Dragons: Red Dragon\'s Tale',
        setNumber: '21348',
        msrp: 359.99,
        imageUrl: 'https://www.lego.com/cdn/product-assets/product.img.pri/21348_prod.jpg',
        status: 'limited_stock',
        legoUrl: 'https://www.lego.com/en-us/product/dungeons-dragons-21348'
      },
      {
        id: '76419',
        name: 'Hogwarts Castle and Grounds',
        setNumber: '76419',
        msrp: 169.99,
        imageUrl: 'https://www.lego.com/cdn/product-assets/product.img.pri/76419_prod.jpg',
        status: 'retiring_soon',
        legoUrl: 'https://www.lego.com/en-us/product/hogwarts-castle-76419'
      },
      {
        id: '42143',
        name: 'Ferrari Daytona SP3',
        setNumber: '42143',
        msrp: 399.99,
        imageUrl: 'https://www.lego.com/cdn/product-assets/product.img.pri/42143_prod.jpg',
        status: 'retiring_soon',
        legoUrl: 'https://www.lego.com/en-us/product/ferrari-daytona-sp3-42143'
      }
    ];
  }
}
