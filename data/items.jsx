// Sample data with vendor
const hardcodedItems = [{
    id: "101",
    name: 'Premium DSLR Camera',
    category: 'electronics',
    price: 'Rs. 2500/day',
    status: 'available',
    vendor: 'ABC Rentals',
    description: 'Professional-grade camera with 4K video',
    image: 'https://via.placeholder.com/300?text=DSLR+Camera'
}, {
    id: "102",
    name: 'Designer Lehenga',
    category: 'clothing',
    price: 'Rs. 1800/day',
    status: 'available',
    vendor: 'Fashion World',
    description: 'Handcrafted traditional attire',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
}, {
    id: "103",
    name: '4-Person Tent',
    category: 'travelgear',
    price: 'Rs. 1200/day',
    status: 'rented',
    vendor: 'TrekZone',
    description: 'Weatherproof camping tent',
    image: 'https://via.placeholder.com/300?text=Camping+Tent'
}, {
    id: "104",
    name: 'Latest Smartphone',
    category: 'electronics',
    price: 'Rs. 1000/day',
    status: 'available',
    vendor: 'MobileHub',
    description: 'Brand new model with warranty',
    image: 'https://via.placeholder.com/300?text=Smartphone'
}, {
    id: "105",
    name: 'Backpack',
    category: 'travelgear',
    price: 'Rs. 300/day',
    status: 'available',
    vendor: 'TrekZone',
    description: 'Durable 40L backpack',
    image: 'https://via.placeholder.com/300?text=Backpack'
}, {
    id: "106",
    name: 'Bestseller Novel',
    category: 'books',
    price: 'Rs. 200/day',
    status: 'available',
    vendor: 'BookBarn',
    description: 'Current top-rated fiction',
    image: 'https://via.placeholder.com/300?text=Book'
}];

export const items = hardcodedItems;

// Fetch Firestore items
export async function fetchItemsFromFirestore() {
    const waitForFirebase = (timeout = 2000) => new Promise((resolve, reject) => {
        let waited = 0;
        const check = () => {
            if (window.firebase && typeof firebase.firestore === "function") resolve(); else if (waited >= timeout) reject("Firebase not loaded after " + timeout + "ms."); else {
                waited += 50;
                setTimeout(check, 50);
            }
        };
        check();
    });

    try {
        await waitForFirebase();
        const db = firebase.firestore();
        const snapshot = await db.collection('products').get();
        return snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data(), vendor: doc.data().vendor || 'Unknown Vendor'
        }));
    } catch (error) {
        console.error("Error fetching items:", error);
        return [];
    }
}

// Combine hardcoded and Firestore items
export async function getAllItems() {
    const firestoreItems = await fetchItemsFromFirestore();
    return [...hardcodedItems, ...firestoreItems];
}

// Admin users
export const users = [{username: 'admin', password: 'password123'}];