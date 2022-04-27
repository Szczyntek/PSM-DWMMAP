<script>
import { ref, reactive } from 'vue';
import firebaseConfig from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebaseui/dist/firebaseui.css'
import { getAuth, signOut } from "firebase/auth";

firebase.initializeApp(firebaseConfig);import * as firebaseui from 'firebaseui'
const auth = getAuth();

export default {
 
  data() {
    return {
    newFlat : [
    {   title: '',
        price: '',
        surface: '',
        description: '',
        contact_tel: '',
        contact_email: ''}
    ]
    }
  },

  props: {
    msg: String
  },
  
  setup() {
    const user = ref(null);
    const isSignedIn = ref(false);
    var flats = reactive([{id: 0, title: 'CHATA', price: '5000', surface: '50', contact_tel: '123456789', contact_email: 'elolo@fff.com'},
                       {id: 1, title: 'CHAWIRSKO', price: '3000', surface: '40', contact_tel: '123789', contact_email: 'eo@fff.com'}]);
    
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
input {
  margin: 2px;
}
</style>

<template>
  <div class="hello">
  <div id="addFlat" v-if="isSignedIn">
    <div class="accordion accordion-flush" id="accordionFlushExample">
      <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingOne">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                  DODAJ OFERTĘ
              </button>
          </h2>
          <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body">
              
                <form>
                  <h4>Dodaj mieszkanie</h4>
                  <input type="text" placeholder="Tytuł oferty" v-model="newFlat.title"><br>
                  <input type="text" placeholder="Cena za miesiąc" v-model="newFlat.price"><br>
                  <input type="text" placeholder="Powierzchnia" v-model="newFlat.surface"><br>
                  <input type="textarea" placeholder="Opis" v-model="newFlat.description"><br>
                  <input type="text" placeholder="Numer telefonu" v-model="newFlat.contact_tel"><br>
                  <button type="submit" @click.prevent="flats.push({id: flats.length+1, title: newFlat.title, price: newFlat.price, surface: newFlat.surface, description: newFlat.description, contact_tel: newFlat.contact_tel, contact_email: newFlat.contact_email})">DODAJ</button>
              </form>
              </div>
          </div>
      </div>
    
    </div>
  </div>
    <h4 v-if="user">Zalogowano jako: {{ user }}</h4>
    <div v-if="!isSignedIn" id="firebaseui-auth-container"></div>
      <div v-if="isSignedIn">
        <button @click="handleSignOut">Wyloguj</button>
      </div>
      
<div v-for="flat in flats" :key="flat.id">
    <div v-if="isSignedIn" class="accordion accordion-flush" :id="'accordionFlushExample'+flat.id" >
        <div class="accordion-item">
            <h2 class="accordion-header" :id="'flush-heading'+flat.id">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#flush-collapse'+flat.id" aria-expanded="false" :aria-controls="'flush-collapse'+flat.id">
                    OFERTA NR {{ flat.id+1 }} - {{ flat.title }} - {{ flat.price }} zł./mies. - {{ flat.surface }} m2
                </button>
            </h2>
            <div :id="'flush-collapse'+flat.id" class="accordion-collapse collapse" :aria-labelledby="'flush-heading'+flat.id" :data-bs-parent="'accordionFlushExample'+flat.id">
                <div class="accordion-body">Szczegóły oferty</div>
            </div>
        </div>
     </div>
</div>


</div>
</template>