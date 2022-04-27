<template>
    <div>
        <div id="addFlat">
            <form>
                <h1>Dodaj mieszkanie</h1>
                <input type="text" v-model="flat.title" placeholder="Tytuł oferty">
            </form>
        </div>


    </div>

</template>

<script setup>


export const flat = ref([
    {
        title: String,
        price: String,
        surface: String,
        description: String,
        contact_tel: String,
        contact_email: String
    }
])

</script>