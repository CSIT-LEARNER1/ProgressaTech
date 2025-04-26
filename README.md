## Website Overview

The rental website includes a structured navigation bar with the following main sections:

1. Home
   - Displays all pre-listed goods available for buying and selling.
   - Allows users to browse listed items.

2. About
   - Provides general information about the platform.

3. Profile
   - Offers Sign-Up for new users with role selection.
   - Provides role-based Sign-In functionality.

---

## User Registration and Authentication

- User authentication is managed using Firebase Authentication.
- During registration, users select a role: either renter or vendor.
- User details and roles are securely stored in Firestore.

---

## Role-Based Dashboard Redirection

- Vendors are redirected to the Vendor Dashboard where they can add products.
- Renters are directed to the Renter Dashboard to browse and rent items.

This configuration ensures a smooth and role-specific user experience.
