<template>
    <q-layout>
      <q-page-container>
        <q-page>
          <div class="row justify-center">
            <div class="col-md-auto text-center">
              <h3 class="">さあ未来を描こう</h3>
              <q-btn to="/auth/signup" fixed-center type="submit" color="primary" label="ユーザー登録" />
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
</template>

<style>
</style>

<script>
import firebase from 'firebase'

export default {
  name: 'Main',
  created(){
    firebase.auth().onAuthStateChanged((user) => {
        if(user){
          this.$router.push("/" + user.uid + "/view")
        }
    })
  }
}
</script>
