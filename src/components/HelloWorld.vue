<script>
import { ref } from 'vue';
import firebaseConfig from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebaseui/dist/firebaseui.css'
import { getAuth, signOut } from "firebase/auth";

firebase.initializeApp(firebaseConfig);import * as firebaseui from 'firebaseui'
const auth = getAuth();

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  
  setup() {
    const user = ref(null);
    const isSignedIn = ref(false);
    const flats = ref([{id: 0, title: 'CHATA'},
                       { id: 1, title: 'CHAWIRSKO'}]);
    const uiConfig = {
      signInFlow: 'popup',
      signinSuccessUrl: '/',
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
      flats
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

<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2 v-if="user">Zalogowano jako: {{ user }}</h2>
    <div v-if="!isSignedIn" id="firebaseui-auth-container"></div>
    
    <br>
      <div v-if="isSignedIn">
        <button @click="handleSignOut">Wyloguj</button>
      
    </div>
<div v-for="flat in flats" :key="flat.id">
    <div v-if="isSignedIn" class="accordion accordion-flush" :id="'accordionFlushExample'+flat.id" >
        <div class="accordion-item">
            <h2 class="accordion-header" :id="'flush-heading'+flat.id">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#flush-collapse'+flat.id" aria-expanded="false" :aria-controls="'flush-collapse'+flat.id">
                    {{ flat.title }}
                </button>
            </h2>
            <div :id="'flush-collapse'+flat.id" class="accordion-collapse collapse" :aria-labelledby="'flush-heading'+flat.id" :data-bs-parent="'accordionFlushExample'+flat.id">
                <div class="accordion-body">dfghdfghdf</div>
            </div>
        </div>
     </div>
</div>
  </div>
</template>