# NoSQL Backend (Express + MongoDB)

## Description

API REST pour un réseau social où les utilisateurs peuvent publier des posts, ajouter des commentaires, et gérer leurs interactions. La base de données est construite avec MongoDB.

---

## Installation

1.  Clonez ce dépôt :

    ```bash
    git clone <repository-url>
    cd nosql-backend
    ```

2.  Installez les dépendances :

    ```bash
    npm install
    ```

3.  Démarrez MongoDB localement. Par exemple :

    ```bash
    mongod --dbpath ./data/db
    ```

4.  Lancez le serveur :
    ```bash
    node server.js
    ```

---

## Endpoints

### Utilisateurs

- **Lister tous les utilisateurs**  
  **GET** `/users`  
  **Réponse :**
  ```json
  [
    {
      "_id": "64a67a12c8f8e23c0f3c1234",
      "name": "Alice Dupont",
      "email": "alice@example.com",
      "profile": {
        "age": 25,
        "bio": "Traveler",
        "interests": ["photography", "hiking"]
      },
      "created_at": "2024-12-01T12:00:00.000Z"
    }
  ]
  ```

### Posts

- **Lister les posts d’un utilisateur**  
  **GET** `/posts/:userId`  
  **Réponse :**

  ```json
  [
    {
      "_id": "64b97a12c8f8e23c0f3c1234",
      "content": "Loving the sunshine today!",
      "comments": [
        {
          "user_id": {
            "_id": "64a67a12c8f8e23c0f3c5678",
            "name": "Jean Martin"
          },
          "text": "Me too!",
          "created_at": "2024-12-05T15:00:00.000Z"
        }
      ],
      "likes": [
        {
          "_id": "64a67a12c8f8e23c0f3c5678",
          "name": "Jean Martin"
        }
      ],
      "created_at": "2024-12-05T12:00:00.000Z"
    }
  ]
  ```

- **Ajouter un commentaire à un post**  
  **POST** `/posts/:postId/comments`  
  **Body :**
  ```json
  {
    "user_id": "64a67a12c8f8e23c0f3c1234",
    "text": "Great post!"
  }
  ```
  **Réponse :**
  ```json
  {
    "_id": "64b97a12c8f8e23c0f3c1234",
    "content": "Loving the sunshine today!",
    "comments": [
      {
        "user_id": "64a67a12c8f8e23c0f3c1234",
        "text": "Great post!",
        "created_at": "2024-12-05T15:30:00.000Z"
      }
    ],
    "likes": [],
    "created_at": "2024-12-05T12:00:00.000Z"
  }
  ```

---

## Base de Données

- Collections :
  - `users`: Contient les informations des utilisateurs
  - `posts`: Contient les publications avec commentaires et likes
