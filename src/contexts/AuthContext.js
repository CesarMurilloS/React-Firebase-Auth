import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "../firebase"

const AuthContext = React.createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

// Hook
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue];
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  //const [currentUserDetails, setCurrentUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUserDetails, setCurrentUserDetails] = useLocalStorage(
    'currentUserDetails', null
  );
  

  function signup(email, password, name, lastName, displayName) {
    return auth.createUserWithEmailAndPassword(email, password)
    .then(async (user) => {
      //Add user fields
      user.user.updateProfile({
          displayName: displayName,
          photoURL: "",
      })
      //Add user custom fields
      db.collection('users')
      .doc(user.user.uid)
      .set({
        name: name,
        lastName: lastName,
      })
    })
    .then(() => {
      console.log("Successfully SignUp the user!");
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      db.collection('users')
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setCurrentUserDetails(doc.data())
          console.log("Successfully SignIn the user!");
        } else {
          // doc.data() will be undefined in this case
          //Add user custom fields
          db.collection('users')
          .doc(auth.currentUser.uid)
          .set({
            name: "",
            lastName: "",
          })
          console.log("No such document!");
        }
      }).catch((error) => {
          console.log("Error getting document:", error);
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function logout() {
    return auth.signOut()
    .then(function() {
      // Sign-out successful.
      console.log('User Logged Out!');
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
  }

  function sendEmailVerification() {
    return auth.currentUser.sendEmailVerification()
    .then(function() {
      // Email sent.
      console.log('Email Verification Sent');
    }).catch(function(error) {
      // An error happened.
    });
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
    .then(function() {
      // Email sent.
      console.log('Email Sent');
    }).catch(function(error) {
      // An error happened.
    });
  }

  function loadProfile() {
    return db.collection('users').doc(auth.currentUser.uid)
    .get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        setCurrentUserDetails(doc.data())
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }
  
  function updateProfile(
    displayName, 
    name,
    lastName,
    email, 
    password
  ) {
    return auth.currentUser.updateProfile({
      photoURL: "https://example.com/jane-q-user/profile.jpg",
      displayName: displayName,
      email: email, 
      password: password
    })
  }

  function updateEmail(email) {
    return auth.currentUser.updateEmail(email)
    .then(function() {
      // Update successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  function updatePassword(password) {
    return auth.currentUser.updatePassword(password)
    .then(function() {
      // Update successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    currentUserDetails,
    login,
    signup,
    logout,
    resetPassword,
    loadProfile,
    updateProfile,
    updateEmail,
    updatePassword,
    sendEmailVerification
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
