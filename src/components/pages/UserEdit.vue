<template>
    <q-layout>
        <q-page-container>
            <q-page>
            <div class="row justify-center">
                <div class="col-md-auto text-center">
                    <h3 class="text-center">ユーザー情報</h3>
                    <h5 class="text-center">基本情報</h5>
                    <q-toggle v-model="userInfoFlg" label="編集を有効にする" />
                    <q-form @submit="submitUserInfo" class="q-gutter-md">
                        <span class="text-negative" v-if="userInfoErrorMessage != ''">{{userInfoErrorMessage}}</span>
                        <q-input class="q-mb-md" v-model="name" label="名前" type="text" :disable="!userInfoFlg"/>
                        <q-input class="q-mb-md" v-model="aka" label="ニックネーム" type="text" :disable="!userInfoFlg"/>
                        <q-input class="q-mb-md" v-model="startAt" label="キャリアスタート" type="number" :disable="!userInfoFlg"/>
                        <div class="text-center">
                            <q-btn absolute-center type="submit" color="primary" label="基本情報変更" :disable="!userInfoFlg"/>
                        </div>
                    </q-form>
                    <h5 class="text-center">ログイン情報</h5>
                    <q-toggle v-model="userLoginInfoFlg" label="編集を有効にする" />
                    <q-form @submit="submitUserLoginInfo" class="q-gutter-md">
                        <span class="text-negative" v-if="userLoginInfoErrorMessage != ''">{{userLoginInfoErrorMessage}}</span>
                        <q-input class="q-mb-md" v-model="email" label="メールアドレス" type="email" :disable="!userLoginInfoFlg"/>
                        <div class="text-center">
                            <q-btn absolute-center type="submit" color="primary" label="ログイン情報変更" :disable="!userLoginInfoFlg"/>
                        </div>
                    </q-form>
                </div>
            </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>
<script>
import firebase from "firebase"
import db from "../../firebase/firebaseInit"
import store from "../../store"

const usersRef = db.collection("users")

export default {
    name: "UserEdit",
    data(){
        return{
            id: "",
            userInfoErrorMessage: "",
            userInfoFlg: false,
            name: "",
            aka: "",
            startAt: "",
            userLoginInfoErrorMessage: "",
            userLoginInfoFlg: false,
            email: ""
        }
    },
    methods:{
        setupUser(){
            const uid = this.$route.params.id
            this.id = uid
            firebase.auth().onAuthStateChanged(user => {
                if(user && user.uid === uid){
                    this.email = user.email
                    usersRef.doc(uid).get().then(doc => {
                        this.name = doc.data().name
                        this.aka = doc.data().aka
                        this.startAt = doc.data().startAt
                    })
                }else{
                    this.$router.push("/")
                }
            })
        },
        submitUserInfo(){
            this.userInfoErrorMessage = ""
            usersRef.doc(this.id).set({
                name: this.name,
                aka: this.aka,
                startAt: this.startAt
            }).then(() => this.$router.push("/")).catch(err => {
                console.log(err)
                this.userInfoErrorMessage = err
            })
        },
        submitUserLoginInfo(){
            this.userLoginInfoErrorMessage = ""
            firebase.auth().currentUser.updateEmail(this.email).then(() => {
                firebase.auth().signOut().then(() => {
                    // ストアの情報をログアウト状態にする
                    store.dispatch('updateStatus', false)
                    store.commit('setAuth', {})
                    // ログイン画面に遷移
                    this.$router.push('/auth/signin')
                })
            }).catch(err => {
                console.log(err)
                this.userLoginInfoErrorMessage = err
            })
        }
    },
    created(){
        this.setupUser()
    }
}
</script>