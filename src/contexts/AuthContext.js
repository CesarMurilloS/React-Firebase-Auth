import React, { useContext, useState, useEffect } from "react"
import { auth, db } from "../firebase"

const AuthContext = React.createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentUserDetails, setCurrentUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)

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
      console.log("Successfully SignIn the user!");
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
