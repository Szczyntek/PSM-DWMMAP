<script>
import { ref, reactive } from 'vue';
import firebaseConfig from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebaseui/dist/firebaseui.css'
import { getAuth, signOut } from "firebase/auth";
import { doc, setDoc, getFirestore, query, collection, getDocs } from "firebase/firestore"; 
import "leaflet/dist/leaflet.css"
import { LMap, LGeoJson, LTileLayer, LMarker} from "@vue-leaflet/vue-leaflet";

firebase.initializeApp(firebaseConfig);import * as firebaseui from 'firebaseui'
const auth = getAuth()
const db = getFirestore(firebase.initializeApp(firebaseConfig))

export default {
 components: {
    LMap,
    LTileLayer,
    LMarker
  },
  
  data() {
    return {
    filter_price_min: null,
    filter_price_max: null,
    filter_surface_min: null,
    filter_surface_max: null,
    newFlat_id: 0,
    newFlat_title: '',
    newFlat_price: '',
    newFlat_surface: '',
    newFlat_description: '',
    newFlat_contact_tel: '',
    

     geojson: {
        type: "FeatureCollection",
        features: [
          // ...
        ],
      },
 url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15,
      center: [ 52.24900435980021, 21.02134262909435 ],
      markerLatLng: [51.504, -0.159],
      geojsonOptions: {
        // Options that don't rely on Leaflet methods.
      },
    }
    
  },


  props: {
    msg: String
  },
  

  setup() {
    const user = ref(null);
    const isSignedIn = ref(false);
    const flats = reactive([]);



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

const load = (i,a,b,c,d,e) => {
  flats.push({id: i, title: a, price: b, surface: c, description: d, contact_tel: e})
  setDoc(doc(db, "flats", 'flat'+i), {
    id: i,
    title: a,
    price: b,
    surface: c,
    description: d,
    contact: e,
});
navigator.vibrate(500) 
}


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
      flats, load, LMap, LGeoJson, LMarker
      
      
    }
  },
  created() {
    this.getCountry()
  },
  methods: {
    async getCountry() {
      const querySnap = await getDocs(query(collection(db, 'flats')));
      querySnap.forEach((doc) => {
        this.flats.push(doc.data())
      })

    },
     zoomUpdated (zoom) {
     this.zoom = zoom;
     console.log(this.markers)
   },
    
   centerUpdated (center) {
     this.center = center;
   },
   locatorButtonPressed() {
  
        this.center = [ 50.07696742107652,19.927056133747104 ]
        this.markerLatLng = [ 50.07696742107652,19.927056133747104 ]
        this.centerUpdated(this.center);
        this.zoomUpdated(15);
      
}
  },
/*
 locatorButtonPressed() {
   navigator.geolocation.getCurrentPosition(
      position => {
        this.center = [position.coords.latitude, position.coords.longitude]
        this.markerLatLng = [position.coords.latitude, position.coords.longitude]
        this.centerUpdated(this.center);
      },
      error => {
         console.log(error.message);
      },
   )
}
*/
 
}
</script>


<style scoped>

 .map {
 position: absolute;
   margin-top: 50px;
   width: 400px !important;
   height: 400px !important;
   overflow :hidden
 }
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
                  <!-- <button type="submit" @click.prevent="flats.push({id: flats.length+1, title: newFlat_title, price: newFlat_price, surface: newFlat_surface, description: newFlat_description, contact_tel: newFlat_contact_tel})">DODAJ</button> -->
                  <button type="submit" @click.prevent="load(Math.ceil(Math.random()*1000000), newFlat_title, newFlat_price, newFlat_surface, newFlat_description, newFlat_contact_tel)">DODAJ</button>
              
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

  <!-- MAPA -->
  <!-- <div id="map2" v-if="isSignedIn">
    <div class="accordion accordion-flush" id="accordionFlushExample3">
      <div class="accordion-item">
          <h2 class="accordion-header" id="flush-headingOne3">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne3" aria-expanded="false" aria-controls="flush-collapseOne3">
                 SPRAWDŹ LOKALIZACJĘ NA MAPIE
              </button>
          </h2>
          <div id="flush-collapseOne3" class="accordion-collapse collapse" aria-labelledby="flush-headingOne3" data-bs-parent="#accordionFlushExample3">
              <div class="accordion-body" id="map">
              <button @click="locatorButtonPressed()">pokaż lokalizacje</button>
                  <l-map
                      :center="center"
                      :zoom="zoom"
                      class="map"
                      ref="map"
                      @update:zoom="zoomUpdated"
                      @update:center="centerUpdated"
                    >
                      <l-tile-layer
                        :url="url"
                      >
                      </l-tile-layer>
                      </l-map>
                          

              </div>
          </div>
      </div>
    
    </div>
  </div> -->
  
  <h4 v-if="user">Dopasowane oferty dla Ciebie</h4>




 <!-- LISTA OFERT -->
<div v-for="flat in flats" :key="flat.id">
    <div v-if="isSignedIn && parseInt(flat.surface) > filter_surface_min && parseInt(flat.surface) < filter_surface_max && parseInt(flat.price) > filter_price_min && parseInt(flat.price) > filter_surface_max" class="accordion accordion-flush" :id="'accordionFlushExample'+flat.id">
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


<button  v-if="isSignedIn" v-on:click="locatorButtonPressed">pokaż lokalizacje</button>
 <div v-if="isSignedIn" id="map">
              
                  <l-map
                      :center="center"
                      :zoom="zoom"
                      class="map"
                      ref="map"
                      @update:zoom="zoomUpdated"
                      @update:center="centerUpdated"
                    >
                      <l-tile-layer
                        :url="url"
                      >
                      </l-tile-layer>
                      <l-marker :lat-lng="markerLatLng" >Jesteś tutaj</l-marker>
                      </l-map>
                          

              </div>

</div>
</template>