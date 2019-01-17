import f from "firebase"

const config = {
  apiKey: "AIzaSyDDGL2p9NRK2XKro8U_8iz1pzIdm3qEJCE",
  authDomain: "todolist-project99.firebaseapp.com",
  databaseURL: "https://todolist-project99.firebaseio.com",
  projectId: "todolist-project99",
  storageBucket: "todolist-project99.appspot.com",
  messagingSenderId: "997829562670"
};
f.initializeApp(config)

export const auth = f.auth();
export const database = f.database();
export const firebase = f;
