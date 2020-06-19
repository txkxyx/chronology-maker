<template>
    <q-toolbar class="bg-purple text-white shadow-2 ">
        <q-btn to="/" flat label="年表メーカー" />
        <q-space />
        <span v-if="isLogin">
            {{getAuth.name}}さんでログイン
            <q-btn :to="'/' + getAuth.id + '/edit'" stretch flat label="年表を編集"/>
            <q-btn @click="signOut" stretch flat label="ログアウト" />
            <q-btn to="/auth/signup" stretch flat label="ユーザー登録" />
        </span>
        <span v-else>
            <q-btn to="/auth/signin" stretch flat label="ログイン" />
        </span>
    </q-toolbar>
</template>
<script>
import firebase from 'firebase';
import db from '../../firebase/firebaseInit';
import store from '../../store';

export default {
    methods: {
        /**
         * ログイン状態かを判定する
         */
        isAuth(){
            firebase.auth().onAuthStateChanged((user) => {
                // ユーザー情報をストアに保存する
                if(user){
                    store.dispatch('updateStatus', true)
                    this.getUser(user.uid)
                }
            })
        },
        /**
         * ログアウトを行う
         */
        signOut(){
            firebase.auth().signOut().then(() => {
                // ストアの情報をログアウト状態にする
                store.dispatch('updateStatus', false)
                store.commit('setAuth', {})
                // ログイン画面に遷移
                this.$router.push('/auth/signin')
            })
        },
        /**
         * ユーザーIDを基に、USERSテーブルからユーザー情報を取得する
         * @uid ユーザーID
         */
        getUser(uid){
            if(uid){
                // USERSテーブルからユーザー情報を取得する
                const usersRef = db.collection('users')
                usersRef.doc(uid).get().then((doc) => {
                    let user = doc.data()
                    user.id = doc.id
                    // ストアの更新
                    store.commit('setAuth', user)
                })
            }
        }
    },
    mounted(){
        /**
         * マウント時にログイン状態を確認
         */ 
        this.isAuth()
    },
    computed: {
        /**
         * ストアからログイン状態を取得
         */
        isLogin(){
            return this.$store.getters.status
        },
        /**
         * ストアからログインユーザー情報を取得
         */
        getAuth(){
            return this.$store.getters.auth
        }
    }
}
</script>