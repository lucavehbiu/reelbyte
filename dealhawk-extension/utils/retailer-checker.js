/**
 * Retailer Price Checker
 * Checks prices for Lego sets across multiple retailers
 */

export class RetailerChecker {
  /**
   * Check prices across all enabled retailers
   * @param {Object} legoSet - The Lego set to check
   * @param {Object} enabledRetailers - Which retailers to check
   * @returns {Promise<Object>} Price data by retailer
   */
  static async checkPrices(legoSet, enabledRetailers = {}) {
    const results = {};

    const checks = [];

    if (enabledRetailers.amazon !== false) {
      checks.push(
        this.checkAmazon(legoSet).then(data => {
          results.amazon = data;
        })
      );
    }

    if (enabledRetailers.walmart !== false) {
      checks.push(
        this.checkWalmart(legoSet).then(data => {
          results.walmart = data;
        })
      );
    }

    if (enabledRetailers.target !== false) {
      checks.push(
        this.checkTarget(legoSet).then(data => {
          results.target = data;
        })
      );
    }

    // Wait for all checks to complete
    await Promise.allSettled(checks);

    return results;
  }

  /**
   * Check Amazon for the set
   */
  static async checkAmazon(legoSet) {
    try {
      // Amazon search URL for the specific Lego set number
      const searchUrl = `https://www.amazon.com/s?k=lego+${encodeURIComponent(legoSet.setNumber)}`;

      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      if (!response.ok) {
        return { available: false, error: 'Failed to fetch' };
      }

      const html = await response.text();

      // Parse Amazon's search results
      // Look for price data in the first result
      const priceMatch = html.match(/\$(\d+\.\d{2})/);
      const asinMatch = html.match(/data-asin="([A-Z0-9]{10})"/);

      if (priceMatch && asinMatch) {
        const price = parseFloat(priceMatch[1]);
        const asin = asinMatch[1];

        return {
          available: true,
          price: price,
          url: `https://www.amazon.com/dp/${asin}`,
          inStock: !html.includes('Currently unavailable')
        };
      }

      return { available: false, reason: 'Not found on Amazon' };

    } catch (error) {
      console.error('Amazon check error:', error);
      return { available: false, error: error.message };
    }
  }

  /**
   * Check Walmart for the set
   */
  static async checkWalmart(legoSet) {
    try {
      // Walmart search URL
      const searchUrl = `https://www.walmart.com/search?q=lego+${encodeURIComponent(legoSet.setNumber)}`;

      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      if (!response.ok) {
        return { available: false, error: 'Failed to fetch' };
      }

      const html = await response.text();

      // Walmart embeds data in __NEXT_DATA__ or JSON-LD
      const nextDataMatch = html.match(/__NEXT_DATA__\s*=\s*({.*?})\s*<\/script>/s);

      if (nextDataMatch) {
        try {
          const data = JSON.parse(nextDataMatch[1]);

          // Navigate Walmart's data structure
          const searchResults = data.props?.pageProps?.initialData?.searchResult?.itemStacks?.[0]?.items;

          if (searchResults && searchResults.length > 0) {
            const firstResult = searchResults[0];

            // Check if set number matches
            const itemName = firstResult.name || '';
            if (itemName.includes(legoSet.setNumber)) {
              return {
                available: true,
                price: parseFloat(firstResult.price),
                url: `https://www.walmart.com${firstResult.canonicalUrl}`,
                inStock: firstResult.availabilityStatus === 'IN_STOCK'
              };
            }
          }
        } catch (e) {
          console.error('Failed to parse Walmart data:', e);
        }
      }

      return { available: false, reason: 'Not found on Walmart' };

    } catch (error) {
      console.error('Walmart check error:', error);
      return { available: false, error: error.message };
    }
  }

  /**
   * Check Target for the set
   */
  static async checkTarget(legoSet) {
    try {
      // Target search URL
      const searchUrl = `https://www.target.com/s?searchTerm=lego+${encodeURIComponent(legoSet.setNumber)}`;

      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      if (!response.ok) {
        return { available: false, error: 'Failed to fetch' };
      }

      const html = await response.text();

      // Target uses React with embedded JSON data
      const dataMatch = html.match(/__TGT_DATA__\s*=\s*({.*?});\s*<\/script>/s);

      if (dataMatch) {
        try {
          const data = JSON.parse(dataMatch[1]);

          // Navigate Target's data structure
          const products = data.products || [];

          for (const product of products) {
            const title = product.title || '';
            if (title.includes(legoSet.setNumber)) {
              return {
                available: true,
                price: parseFloat(product.price?.current || 0),
                url: `https://www.target.com${product.url}`,
                inStock: product.availability !== 'OUT_OF_STOCK'
              };
            }
          }
        } catch (e) {
          console.error('Failed to parse Target data:', e);
        }
      }

      return { available: false, reason: 'Not found on Target' };

    } catch (error) {
      console.error('Target check error:', error);
      return { available: false, error: error.message };
    }
  }

  /**
   * Get mock retailer data for testing
   */
  static getMockPrices(legoSet) {
    // Simulate some being available at discount
    const msrp = legoSet.msrp;
    const hasAmazonDeal = Math.random() > 0.7;
    const hasWalmartDeal = Math.random() > 0.6;
    const hasTargetDeal = Math.random() > 0.8;

    return {
      amazon: hasAmazonDeal
        ? {
            available: true,
            price: msrp * (0.7 + Math.random() * 0.2), // 70-90% of MSRP
            url: `https://www.amazon.com/s?k=lego+${legoSet.setNumber}`,
            inStock: true
          }
        : { available: false, reason: 'Not in stock' },

      walmart: hasWalmartDeal
        ? {
            available: true,
            price: msrp * (0.65 + Math.random() * 0.25), // 65-90% of MSRP
            url: `https://www.walmart.com/search?q=lego+${legoSet.setNumber}`,
            inStock: true
          }
        : { available: false, reason: 'Not found' },

      target: hasTargetDeal
        ? {
            available: true,
            price: msrp * (0.75 + Math.random() * 0.15), // 75-90% of MSRP
            url: `https://www.target.com/s?searchTerm=lego+${legoSet.setNumber}`,
            inStock: true
          }
        : { available: false, reason: 'Out of stock' }
    };
  }
}
