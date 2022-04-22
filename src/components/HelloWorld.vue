<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2 v-if="user">Signed In User: {{ user }}</h2>
    <div id="firebaseui-auth-container"></div>
    <div id="loader">Loading...</div>
    <br>
    <div v-if="isSignedIn">
      <button @click="handleSignOut">Sign Out</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import firebaseConfig from '../firebaseConfig';

import firebase from 'firebase/compat/app';

firebase.initializeApp(firebaseConfig);import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup() {
    const user = ref(null);
    const isSignedIn = ref(false);

    const uiConfig = {
      signInFlow: 'popup',
      signinSuccessUrl: 'http://localhost:8080/',
      signInOptions: [
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: function (authResult) {
          user.value = authResult.user.displayName;
          console.log(authResult)
          isSignedIn.value = true;
          console.log('Signed in by user ' + user.value);
 
          return false;
        },
        uiShown: function() {
   
          document.getElementById('loader').style.display = 'none';
        }
      }
    }

    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    ui.start('#firebaseui-auth-container', uiConfig);

    const handleSignOut = () => {
      signOut(auth).then(() => {
      
       user.value = null;
       isSignedIn.value = false;
       console.log('Signed out');
       ui.start('#firebaseui-auth-container', uiConfig);
      }).catch((error) => {
     
        console.log(error);
      });
    }

    return {
      user,
      isSignedIn,
      handleSignOut,
    }
  }
}
</script>


<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
