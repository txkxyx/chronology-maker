<template>
    <q-layout>
      <q-page-container>
        <q-page>
          <div class="row justify-center">
            <div class="col-md-auto text-center">
              <h3 class=""><strong>さあ未来を描こう</strong></h3>
              <q-btn v-if="!isLogin" to="/auth/signup" fixed-center type="submit" color="primary" label="ユーザー登録" icon="perm_identity"/>
              <h4>年表一覧</h4>
              <q-list class="q-mt-md" spector v-for="user in users" :key="user.id">
                <q-item @click="onClickLink(user.id)" clickable v-ripple >
                  <q-item-section>エンジニア歴{{getYears(user.startAt)}}年の{{user.aka}}さんの年表</q-item-section>
                </q-item>
                <q-separator spaced inset />
              </q-list>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
</template>

<style>
</style>

<script>
import db from "../../firebase/firebaseInit"
import { sortUsers } from "../../common/chronologyFunctions";

export default {
  name: 'Main',
  data(){
    return{
      users:[],
    }
  },
  methods:{
    onClickLink(id){
      this.$router.push("/" + id + "/view")
    }
  },
  created(){
    const usersRef = db.collection("users");
    usersRef.get().then((docs) => {
      docs.forEach((doc, index) => {
        this.users.push({
          index: index + 1,
          id: doc.id,
          ...doc.data()
        })
      })
      sortUsers(this.users)
    })
  },
  computed:{
    getYears(){
      return function(year){
        return new Date().getFullYear() - year + 1
      }
    },
    /**
     * ストアからログイン状態を取得
     */
    isLogin(){
        return this.$store.getters.status
    }
  },
}
</script>
