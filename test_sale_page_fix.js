// Test Sale Page Fix
// Run this in browser console on sale page to verify the fix

console.log('=== TESTING SALE PAGE FIX ===\n')

// Simulate the API call
fetch('http://localhost:8000/api/v1/products/')
  .then(res => res.json())
  .then(response => {
    console.log('✅ Step 1: API Response received')
    console.log('Response format:', Object.keys(response))
    console.log('Total products:', response.total)
    console.log('Products:', response.items?.length || 0)
    
    if (!response.items || response.items.length === 0) {
      console.error('❌ No products found in API response')
      return
    }
    
    console.log('\n✅ Step 2: Check first product')
    const product = response.items[0]
    console.log('Product:', product.name)
    console.log('Price:', product.price)
    console.log('Discounted Price:', product.discounted_price)
    console.log('Status (RAW):', product.status)
    console.log('Stock:', product.stock_quantity)
    
    console.log('\n✅ Step 3: Clean enum strings')
    const cleanStatus = product.status?.replace('ProductStatus.', '').toLowerCase()
    console.log('Status (CLEANED):', cleanStatus)
    
    console.log('\n✅ Step 4: Check sale criteria')
    const hasDiscountPrice = product.discounted_price !== null && product.discounted_price !== undefined
    const discountPrice = parseFloat(product.discounted_price) || 0
    const regularPrice = parseFloat(product.price) || 0
    const isDiscounted = hasDiscountPrice && discountPrice > 0 && discountPrice < regularPrice
    const isActive = cleanStatus === 'active'
    const inStock = product.stock_quantity > 0
    
    console.log('Has Discount Price:', hasDiscountPrice)
    console.log('Discounted:', discountPrice, '<', regularPrice, '=', isDiscounted)
    console.log('Is Active:', isActive)
    console.log('In Stock:', inStock)
    console.log('SHOULD SHOW ON SALE:', isDiscounted && isActive && inStock)
    
    if (isDiscounted && isActive && inStock) {
      console.log('\n✅ SUCCESS! Product should appear on sale page')
      const discount = Math.round((1 - discountPrice / regularPrice) * 100)
      console.log(`Sale: ₹${discountPrice} (${discount}% OFF from ₹${regularPrice})`)
    } else {
      console.log('\n❌ FAILED! Product will not appear on sale page')
      if (!hasDiscountPrice) console.log('   Reason: No discount price set')
      if (!isDiscounted) console.log('   Reason: Discount price not less than regular price')
      if (!isActive) console.log('   Reason: Product not active')
      if (!inStock) console.log('   Reason: Product out of stock')
    }
  })
  .catch(error => {
    console.error('❌ Error:', error)
  })
