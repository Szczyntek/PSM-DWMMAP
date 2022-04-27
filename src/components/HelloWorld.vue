<script>
import { ref, reactive } from 'vue';
import firebaseConfig from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebaseui/dist/firebaseui.css'
import { getAuth, signOut } from "firebase/auth";
//import { getFirestore, collection, getDocs } from 'firebase/firestore'

firebase.initializeApp(firebaseConfig);import * as firebaseui from 'firebaseui'
const auth = getAuth()

 
 

export default {
 
  data() {
    return {
    filter_price_min: 0,
    filter_price_max: 100000,
    filter_surface_min: 0,
    filter_surface_max: 100000,
    newFlat_title: '',
    newFlat_price: '',
    newFlat_surface: '',
    newFlat_description: '',
    newFlat_contact_tel: '',
    }
  },

  props: {
    msg: String
  },
  
  setup() {
    const user = ref(null);
    const isSignedIn = ref(false);
    const flats = reactive([{id: 0, title: 'CHATA', price: '5000', surface: '50', contact_tel: '123456789', contact_email: 'elolo@fff.com'},
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
       
      }
    }
 
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);

// WYLOGOWANIE
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

    <h4 v-if="user">Zalogowano jako: {{ user }}</h4>
    <div v-if="!isSignedIn" id="firebaseui-auth-container"></div>
      <div v-if="isSignedIn">
        <button @click="handleSignOut">Wyloguj</button>
      </div>


      <!-- DODAWANIE OFERTY -->
        <div id="addFlat" v-if="isSignedIn">
    <div class="accordion accordion-flush" id="accordionFlushExample">
      <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingOne">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                  DODAJ SWOJĄ OFERTĘ
              </button>
          </h2>
          <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body">
                <form>
                  <h4>Dodaj mieszkanie</h4>
                  <input type="text" placeholder="Tytuł oferty" v-model="newFlat_title"><br>
                  <input type="text" placeholder="Cena za miesiąc" v-model="newFlat_price"><br>
                  <input type="text" placeholder="Powierzchnia" v-model="newFlat_surface"><br>
                  <textarea placeholder="Opis" v-model="newFlat_description"></textarea><br>
                  <input type="text" placeholder="Numer telefonu" v-model="newFlat_contact_tel"><br>
                  <button type="submit" @click.prevent="flats.push({id: flats.length+1, title: newFlat_title, price: newFlat_price, surface: newFlat_surface, description: newFlat_description, contact_tel: newFlat_contact_tel})">DODAJ</button>
              </form>
              </div>
          </div>
      </div>
    
    </div>

<!-- PREFERENCJE  -->
   <div class="accordion accordion-flush" id="accordionFlushExample2">
      <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingOne2">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne2" aria-expanded="false" aria-controls="flush-collapseOne2">
                  PREFERENCJE POSZUKIWANIA
              </button>
          </h2>
          <div id="flush-collapseOne2" class="accordion-collapse collapse" aria-labelledby="flush-headingOne2" data-bs-parent="#accordionFlushExample2">
              <div class="accordion-body">
                <form>
                  <h4>Preferencje wyszukiwania</h4>
                    <input type="text" placeholder="Cena od" v-model="filter_price_min">
                    <input type="text" placeholder="Cena do" v-model="filter_price_max"><br>
                    <input type="text" placeholder="Metraż od" v-model="filter_surface_min">
                    <input type="text" placeholder="Metraż do" v-model="filter_surface_max">


              </form>
              </div>
          </div>
      </div>
    
    </div>
  </div>

  <h4 v-if="user">Znaleziono {{ flats.length }} ofert</h4>

 <!-- LISTA OFERT -->
<div v-for="flat in flats" :key="flat.id">
    <div v-if="isSignedIn" class="accordion accordion-flush" :id="'accordionFlushExample'+flat.id">
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