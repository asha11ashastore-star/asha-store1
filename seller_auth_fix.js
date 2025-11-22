
// Seller Dashboard Authentication Fix
console.log('🚀 Fixing Seller Dashboard Authentication...');

// Clear any existing auth data
localStorage.removeItem('authToken');
localStorage.removeItem('currentUser');

// Function to login and store credentials
async function fixSellerAuth() {
    try {
        console.log('🔄 Attempting to authenticate seller...');
        
        const response = await fetch('http://localhost:8000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'asha@ashastore.com',
                password: 'AshaStore2024!'
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.access_token) {
            // Store authentication data
            localStorage.setItem('authToken', data.access_token);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            console.log('✅ Authentication successful!');
            console.log('👤 User:', data.user);
            
            // Test orders API
            const ordersResponse = await fetch('http://localhost:8000/api/v1/orders/seller', {
                headers: {
                    'Authorization': `Bearer ${data.access_token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (ordersResponse.ok) {
                const ordersData = await ordersResponse.json();
                console.log(`📋 Orders API working: ${ordersData.items.length} orders found`);
            }
            
            alert('✅ Authentication fixed! Refreshing page...');
            location.reload();
            
        } else {
            console.error('❌ Authentication failed:', data);
            alert('❌ Authentication failed: ' + (data.detail || 'Unknown error'));
        }
        
    } catch (error) {
        console.error('❌ Error during authentication:', error);
        alert('❌ Error: ' + error.message);
    }
}

// Run the fix
fixSellerAuth();
