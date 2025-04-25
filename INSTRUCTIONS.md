# Project Setup and Usage Guide

This document provides a comprehensive guide to setting up and using the rental web application, leveraging Firebase services for authentication and data management.

---

## 1. Firebase Configuration

The application utilises Firebase for user authentication and Firestore for data storage. Follow the steps below to configure Firebase:

1. **Create a Firebase Project:**
    - Navigate to the [Firebase Console](https://console.firebase.google.com).
    - Click on "Add project" and follow the prompts to create a new project.

2. **Register a Web App:**
    - In your Firebase project, go to "Project settings" > "General".
    - Under "Your apps", click on the web icon (`</>`) to register a new web app.
    - Provide an app nickname and register the app.
    - You may skip the Firebase Hosting setup for this project.

3. **Configure Firebase SDK:**
    - After registering the app, Firebase provides a configuration object.
    - Copy the configuration and replace the existing Firebase config in your `index.html` file.

4. **Enable Authentication:**
    - In the Firebase Console, navigate to "Build" > "Authentication".
    - Click on the "Sign-in method" tab.
    - Enable the "Email/Password" sign-in provider.

5. **Set Up Firestore Database:**
    - Navigate to "Build" > "Firestore Database".
    - Click on "Create database".
    - Choose "Start in test mode" for initial development purposes.
    - Select a Cloud Firestore location and click "Enable".

**Note:** Test mode allows read and write access to your database for 30 days. For production, configure appropriate security rules.

---

## 2. Application Usage Guide

Follow the steps below to use the application effectively:

1. **Access the Home Page:**
    - Navigate to the application's home page to view available products.

2. **User Registration:**
    - Click on "Sign Up".
    - Choose a role: "Renter" or "Vendor".
    - Provide the required information and register.

3. **Vendor Actions:**
    - Sign in as a vendor.
    - Access the vendor dashboard.
    - Add new products with relevant details.

4. **Renter Actions:**
    - Sign in as a renter.
    - Browse available products on the home page.
    - Select a product to rent.
    - Confirm the rental, which will be reflected in your rented items list.

**Note:** Firebase operations depend on internet connectivity. Performance may vary based on your connection speed.

---

## 3. Firebase Cloud Storage Policy Update

As of October 2024, Firebase has updated its Cloud Storage usage policies:

- **From October 30, 2024:** Projects must be on the Blaze (pay-as-you-go) plan to create new default Cloud Storage buckets.

- **From October 1, 2025:** Projects must be on the Blaze plan to maintain access to existing default buckets and other Cloud Storage resources.

**Implications for This Project:**

Due to these policy changes, file upload functionality has not been integrated into this project. For image storage needs, consider using [Supabase](https://supabase.com), which offers a free tier suitable for small projects.

---

## 4. Project Notes

- This application is intended for learning purposes and is not optimised for production use.
- The `Admin.jsx` and `Admin.css` files are present but not integrated to maintain simplicity.

---

## 5. Recommendations for Future Enhancements

- **Image Uploads:**
    - Integrate Supabase or another storage solution to handle image uploads without additional Firebase costs.

- **Security Rules:**
    - Implement comprehensive Firestore security rules to protect data in a production environment.

- **Admin Panel:**
    - Develop and integrate the admin panel for enhanced management capabilities.

- **Performance Optimisation:**
    - Optimise Firebase queries and data handling for improved performance.

---

For further information on Firebase's pricing and usage policies, refer to the [Firebase Pricing 
Documentation](https://firebase.google.com/pricing).
